const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const prisma = require('../config/db');

// In-memory memory state:
// { "1234567890": { stage: 'IDLE', restaurantId: null, cart: [], menuCache: {} } }
const sessions = new Map();

// Global variables to hold client and socket.io instance
let globalClient = null;
let globalIo = null;

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

// Helper function to get or create app settings
const getOrCreateSettings = async () => {
    try {
        let settings = await prisma.appSettings.findFirst();
        if (!settings) {
            settings = await prisma.appSettings.create({
                data: {}
            });
        }
        return settings;
    } catch (error) {
        console.error('Error in getOrCreateSettings:', error);
        // Fallback to temporary settings object if DB fails
        return {
            id: 'temp',
            whatsappEnabled: true,
            whatsappPhoneNumber: null,
            whatsappStatus: 'DISCONNECTED'
        };
    }
};

// Update WhatsApp status in database
const updateWhatsAppStatus = async (status) => {
    try {
        const settings = await getOrCreateSettings();
        if (settings.id !== 'temp') {
            return prisma.appSettings.update({
                where: { id: settings.id },
                data: { whatsappStatus: status }
            });
        }
    } catch (error) {
        console.error('Error updating WhatsApp status:', error);
    }
};

// Initialize WhatsApp client
const initializeClient = async () => {
    if (globalClient) {
        return globalClient;
    }

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    globalClient = client;

    // Check if client is already initialized/connected
    client.on('loading_screen', (percent, message) => {
        console.log('WhatsApp Bot loading:', percent, message);
    });

    client.on('qr', async (qr) => {
        console.log('----------------------------------------------------');
        console.log(' SCAN THIS QR CODE WITH WHATSAPP TO LOGIN THE BOT ');
        console.log('----------------------------------------------------');
        await updateWhatsAppStatus('QR_REQUIRED');
        
        try {
            const qrDataUrl = await QRCode.toDataURL(qr);
            if (globalIo) {
                globalIo.emit('whatsapp_qr', { qr, qrDataUrl });
            }
        } catch (error) {
            console.error('Error generating QR code data URL:', error);
            if (globalIo) {
                globalIo.emit('whatsapp_qr', { qr });
            }
        }
    });

    client.on('ready', async () => {
        console.log('✅ WhatsApp Bot is ready and logged in!');
        await updateWhatsAppStatus('CONNECTED');
        if (globalIo) {
            globalIo.emit('whatsapp_ready');
        }
    });

    client.on('authenticated', async (session) => {
        console.log('✅ WhatsApp Bot authenticated!');
    });

    client.on('auth_failure', async (msg) => {
        console.error('❌ WhatsApp Bot authentication failed:', msg);
        await updateWhatsAppStatus('ERROR');
        if (globalIo) {
            globalIo.emit('whatsapp_error', { message: msg });
        }
    });

    client.on('disconnected', async (reason) => {
        console.log('❌ WhatsApp Bot disconnected:', reason);
        await updateWhatsAppStatus('DISCONNECTED');
        if (globalIo) {
            globalIo.emit('whatsapp_disconnected', { reason });
        }
        globalClient = null;
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
                return await handleCheckout(chatId, session, msg, globalIo, client);
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

    await client.initialize().catch(err => {
        console.error("Failed to initialize WhatsApp Client:", err);
    });

    return client;
};

// Get current WhatsApp status (including checking client connection)
const getCurrentWhatsAppStatus = async () => {
    const settings = await getOrCreateSettings();
    
    // If we have a global client, check its actual state
    if (globalClient) {
        try {
            // Check if client is ready/connected
            if (globalClient.info && globalClient.info.wid) {
                // If we have a wid, we're connected!
                if (settings.whatsappStatus !== 'CONNECTED') {
                    await updateWhatsAppStatus('CONNECTED');
                }
                return {
                    ...settings,
                    whatsappStatus: 'CONNECTED'
                };
            }
        } catch (e) {
            console.error('Error checking client state:', e);
        }
    }
    
    return settings;
};

// Start WhatsApp bot
const startWhatsApp = async () => {
    let settings = await getOrCreateSettings();
    
    // Auto-enable the bot if admin is trying to start it
    if (!settings.whatsappEnabled) {
        settings = await prisma.appSettings.update({
            where: { id: settings.id },
            data: { whatsappEnabled: true }
        });
    }
    
    // Only set to CONNECTING if we're not already connected
    const currentStatus = await getCurrentWhatsAppStatus();
    if (currentStatus.whatsappStatus !== 'CONNECTED') {
        await updateWhatsAppStatus('CONNECTING');
    }
    
    return initializeClient();
};

// Stop WhatsApp bot
const stopWhatsApp = async () => {
    try {
        if (globalClient) {
            // Try graceful logout first, then destroy
            try {
                await globalClient.logout();
            } catch (logoutErr) {
                console.log('Logout failed, proceeding to destroy:', logoutErr.message);
            }
            await globalClient.destroy();
            globalClient = null;
        }
    } catch (err) {
        console.error('Error stopping client:', err);
        // Even if there's an error, set to null to force reset
        globalClient = null;
    }
    await updateWhatsAppStatus('DISCONNECTED');
};

// Reset WhatsApp session to link new number
const resetWhatsAppSession = async () => {
    // First stop the current bot
    await stopWhatsApp();
    
    // Delete the .wwebjs_auth directory to clear the saved session
    const authDir = path.join(__dirname, '..', '.wwebjs_auth');
    if (fs.existsSync(authDir)) {
        console.log('Deleting WhatsApp auth directory to reset session...');
        fs.rmSync(authDir, { recursive: true, force: true });
    }
    
    // Update status
    await updateWhatsAppStatus('DISCONNECTED');
    
    return { success: true, message: 'Session reset successfully. Ready to link new number.' };
};

// Initialize function (called at server start, stores io instance)
const initialize = (io) => {
    globalIo = io;
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
    initialize,
    getOrCreateSettings,
    getCurrentWhatsAppStatus,
    startWhatsApp,
    stopWhatsApp,
    resetWhatsAppSession
};
