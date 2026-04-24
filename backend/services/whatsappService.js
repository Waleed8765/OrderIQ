const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const prisma = require('../config/db');

// In-memory memory state:
// { "1234567890": { stage: 'IDLE', restaurantId: null, cart: [], menuCache: {} } }
const sessions = new Map();

// Helper to calculate total price
const calculateSubtotal = (cart) => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

// State constants
const STAGES = {
    IDLE: 'IDLE',
    VIEWING_RESTAURANTS: 'VIEWING_RESTAURANTS',
    VIEWING_MENU: 'VIEWING_MENU',
    CHECKING_OUT: 'CHECKING_OUT'
};

const initialize = (io) => {
    const client = new Client({
        authStrategy: new LocalAuth()
    });

    client.on('qr', (qr) => {
        console.log('----------------------------------------------------');
        console.log(' SCAN THIS QR CODE WITH WHATSAPP TO LOGIN THE BOT ');
        console.log('----------------------------------------------------');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp Bot is ready and logged in!');
    });

    client.on('message', async (msg) => {
        console.log(`[WhatsApp] Incoming message from ${msg.from}: "${msg.body}"`);
        
        // SAFETY FILTERS
        if (msg.fromMe) return; // Don't reply to self
        if (msg.from === 'status@broadcast') return; // Don't reply to status updates
        
        // Only reply to individual chats (ignore groups which end in @g.us)
        const isIndividualChat = msg.from.endsWith('@c.us') || msg.from.endsWith('@lid');
        if (!isIndividualChat) return; 

        const chatId = msg.from;
        let text = msg.body.trim();

        // Initialize session if not exists
        if (!sessions.has(chatId)) {
            sessions.set(chatId, {
                stage: STAGES.IDLE,
                restaurantId: null,
                cart: [],
                menuCache: {} 
            });
        }

        const session = sessions.get(chatId);

        try {
            // Cancel / Reset command
            if (text.toLowerCase() === 'cancel' || text.toLowerCase() === 'reset') {
                sessions.set(chatId, {
                    stage: STAGES.IDLE,
                    restaurantId: null,
                    cart: [],
                    menuCache: {}
                });
                return msg.reply('Your session has been reset. Say "Hi" to start again.');
            }

            // Checkout command
            if (text.toLowerCase() === 'checkout' && session.cart.length > 0) {
                return await handleCheckout(chatId, session, msg, io, client);
            } else if (text.toLowerCase() === 'checkout') {
                return msg.reply('Your cart is empty. Please add items to your cart first.');
            }

            // State Machine
            const triggerWords = ['hi', 'hello', 'menu', 'start', 'order', 'hey'];
            
            switch (session.stage) {
                case STAGES.IDLE:
                    if (triggerWords.includes(text.toLowerCase())) {
                        return await showRestaurants(chatId, session, msg);
                    }
                    return; // Ignore general conversation in IDLE state
                
                case STAGES.VIEWING_RESTAURANTS:
                    return await handleRestaurantSelection(chatId, session, msg, text);
                    
                case STAGES.VIEWING_MENU:
                    return await handleMenuSelection(chatId, session, msg, text);
                    
                default:
                    return msg.reply('I didn\'t understand that. You can type "reset" to start over.');
            }

        } catch (error) {
            console.error('WhatsApp Bot Error:', error);
            msg.reply('Sorry, an error occurred. Please type "reset" and try again.');
        }
    });

    client.initialize().catch(err => {
        console.error("Failed to initialize WhatsApp Client:", err);
    });
};

const showRestaurants = async (chatId, session, msg) => {
    const restaurants = await prisma.restaurant.findMany({
        where: { status: 'OPEN' },
        select: { id: true, name: true, description: true }
    });

    if (restaurants.length === 0) {
        return msg.reply('Sorry, no restaurants are currently open. Please try again later.');
    }

    let responseList = 'Welcome to OrderIQ! 🍔 Here are our available restaurants:\n\n';
    session.menuCache = {}; // clear old mapping

    restaurants.forEach((rest, index) => {
        const optionNum = index + 1;
        session.menuCache[optionNum] = rest.id;
        responseList += `*${optionNum}*. ${rest.name}\n_${rest.description || 'Great food'}_\n\n`;
    });

    responseList += 'Please reply with the *number* of the restaurant you want to order from.';
    
    session.stage = STAGES.VIEWING_RESTAURANTS;
    sessions.set(chatId, session);

    msg.reply(responseList);
};

const handleRestaurantSelection = async (chatId, session, msg, text) => {
    const option = parseInt(text);
    
    if (isNaN(option) || !session.menuCache[option]) {
        return msg.reply('Please reply with a valid restaurant number from the list.');
    }

    const restaurantId = session.menuCache[option];
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });

    if (!restaurant) {
         return msg.reply('Restaurant not found. Please type "reset".');
    }

    session.restaurantId = restaurantId;
    session.menuCache = {}; // reset mapping for menu items

    const menuItems = await prisma.menuItem.findMany({
        where: { restaurantId: restaurantId, inStock: true }
    });

    if (menuItems.length === 0) {
        session.stage = STAGES.IDLE;
        return msg.reply('This restaurant doesn\'t have any menu items available right now. Type "reset" to go back.');
    }

    let responseList = `Great choice! Here is the menu for *${restaurant.name}*:\n\n`;
    
    menuItems.forEach((item, index) => {
         const optionNum = index + 1;
         session.menuCache[optionNum] = item;
         responseList += `*${optionNum}*. ${item.name} - $${item.price.toFixed(2)}\n`;
    });

    responseList += '\n👉 Reply with the *item number* to add it to your cart.\n🛒 Type *checkout* when you are ready to order.\n🔄 Type *reset* to start over.';

    session.stage = STAGES.VIEWING_MENU;
    sessions.set(chatId, session);

    msg.reply(responseList);
};

const handleMenuSelection = async (chatId, session, msg, text) => {
    // If user enters e.g. "1 2" meaning 2 of item 1
    const parts = text.split(' ');
    const option = parseInt(parts[0]);
    let quantity = 1;

    if (parts.length > 1) {
        const parsedQty = parseInt(parts[1]);
        if (!isNaN(parsedQty) && parsedQty > 0) {
            quantity = parsedQty;
        }
    }

    if (isNaN(option) || !session.menuCache[option]) {
        return msg.reply('Please reply with a valid item number, or type *checkout* if you are done. Type *reset* to clear cart and start over.');
    }

    const selectedItem = session.menuCache[option];
    
    // Check if item already in cart to increment qty
    const existingIndex = session.cart.findIndex(i => i.menuItemId === selectedItem.id);
    if (existingIndex > -1) {
        session.cart[existingIndex].quantity += quantity;
    } else {
        session.cart.push({
            menuItemId: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price,
            quantity: quantity
        });
    }

    sessions.set(chatId, session);

    const subtotal = calculateSubtotal(session.cart);

    msg.reply(`✅ Added *${quantity}x ${selectedItem.name}* to your cart. Cart Subtotal: $${subtotal.toFixed(2)}\n\nReply with another item number to add more, or type *checkout* to place your order.`);
};

const handleCheckout = async (chatId, session, msg, io, client) => {
    // chatId is typically like "1234567890@c.us" or "...@lid"
    const phoneNumber = chatId.split('@')[0];

    try {
        // 1. Find or create dummy user
        let user = await prisma.user.findFirst({
            where: { phone: phoneNumber }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    firebaseUid: `whatsapp_${phoneNumber}`,
                    fullName: `WhatsApp User ${phoneNumber}`,
                    email: `whatsapp_${phoneNumber}@orderiq.app`,
                    phone: phoneNumber,
                    role: 'CUSTOMER'
                }
            });
        }

        const subtotal = calculateSubtotal(session.cart);
        
        const dateStr = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `#ORD-${dateStr}-${randomSuffix}`;

        // 2. Create Order (Default: DELIVERY, CASH)
        const order = await prisma.order.create({
            data: {
                orderNumber: orderNumber,
                restaurantId: session.restaurantId,
                customerId: user.id,
                type: 'DELIVERY', 
                subtotal: subtotal,
                total: subtotal, // Assuming no delivery fee or tax for simplicity here
                paymentMethod: 'CASH',
                items: {
                    create: session.cart.map(item => ({
                        menuItemId: item.menuItemId,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true,
                restaurant: { select: { name: true, logo: true } },
                customer: { select: { fullName: true, phone: true } }
            }
        });

        // 3. Emit via socket
        if (io) {
            io.to(`restaurant_${session.restaurantId}`).emit('newOrder', order);
        }

        // 4. Notify User
        msg.reply(`🎉 Your order has been placed successfully!\n\n*Order #*: ${order.orderNumber}\n*Total*: $${subtotal.toFixed(2)}\n*Payment*: Cash on Delivery\n\nThank you for choosing OrderIQ! Your cart is now reset.`);

        // 5. Reset session
        sessions.set(chatId, {
            stage: STAGES.IDLE,
            restaurantId: null,
            cart: [],
            menuCache: {}
        });

    } catch (err) {
        console.error('WhatsApp Checkout Error:', err);
        msg.reply('There was an error processing your checkout. Please try again.');
    }
};

module.exports = {
    initialize
};
