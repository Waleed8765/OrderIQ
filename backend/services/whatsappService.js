const {
    useMultiFileAuthState,
    makeWASocket,
    DisconnectReason,
    downloadMediaMessage
} = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const prisma = require('../config/db');

// In-memory session state:
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

// Initialize WhatsApp client with Baileys
const initializeClient = async () => {
    if (globalClient) {
        return globalClient;
    }

    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const client = makeWASocket({
        auth: state,
        printQRInTerminal: false // We'll handle QR ourselves
    });

    globalClient = client;

    // Handle connection updates
    client.ev.on('connection.update', async (update) => {
        const { connection, qr } = update;

        if (qr) {
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
        }

        if (connection === 'open') {
            console.log('✅ WhatsApp Bot is ready and logged in!');
            await updateWhatsAppStatus('CONNECTED');
            if (globalIo) {
                globalIo.emit('whatsapp_ready');
            }
        }

        if (connection === 'close') {
            const reason = new DisconnectReason(update?.lastDisconnect?.error?.output?.statusCode);
            console.log('❌ WhatsApp Bot disconnected:', reason);
            await updateWhatsAppStatus('DISCONNECTED');
            if (globalIo) {
                globalIo.emit('whatsapp_disconnected', { reason });
            }
            globalClient = null;
        }
    });

    // Save credentials when updated
    client.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    client.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && m.type === 'notify') {
            console.log(`[WhatsApp] Incoming message from ${msg.key.remoteJid}`);

            // SAFETY FILTERS
            if (msg.key.fromMe) return;
            if (msg.key.remoteJid === 'status@broadcast') return;

            // Only reply to individual chats
            const isIndividualChat = msg.key.remoteJid.endsWith('@c.us') || msg.key.remoteJid.endsWith('@lid');
            if (!isIndividualChat) return;

            const chatId = msg.key.remoteJid;
            let text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            text = text.trim();

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
                    await sendWhatsAppMessage(chatId, 'Your session has been reset. Say "Hi" to start again.');
                    return;
                }

                // Checkout command
                if (text.toLowerCase() === 'checkout' && session.cart.length > 0) {
                    return await handleCheckout(chatId, session, globalIo, client);
                } else if (text.toLowerCase() === 'checkout') {
                    return await sendWhatsAppMessage(chatId, 'Your cart is empty. Please add items to your cart first.');
                }

                // State Machine
                const triggerWords = ['hi', 'hello', 'menu', 'start', 'order', 'hey'];

                switch (session.stage) {
                    case STAGES.IDLE:
                        if (triggerWords.includes(text.toLowerCase())) {
                            return await showRestaurants(chatId, session, client);
                        }
                        return;

                    case STAGES.VIEWING_RESTAURANTS:
                        return await handleRestaurantSelection(chatId, session, text, client);

                    case STAGES.VIEWING_MENU:
                        return await handleMenuSelection(chatId, session, text, client);

                    default:
                        return await sendWhatsAppMessage(chatId, 'I didn\'t understand that. You can type "reset" to start over.');
                }

            } catch (error) {
                console.error('WhatsApp Bot Error:', error);
                await sendWhatsAppMessage(chatId, 'Sorry, an error occurred. Please type "reset" and try again.');
            }
        }
    });

    return client;
};

// Helper to send WhatsApp messages with Baileys
const sendWhatsAppMessage = async (to, text) => {
    try {
        await globalClient.sendMessage(to, { text: text });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
};

// Get current WhatsApp status
const getCurrentWhatsAppStatus = async () => {
    const settings = await getOrCreateSettings();

    if (globalClient && globalClient.user) {
        if (settings.whatsappStatus !== 'CONNECTED') {
            await updateWhatsAppStatus('CONNECTED');
        }
        return {
            ...settings,
            whatsappStatus: 'CONNECTED'
        };
    }

    return settings;
};

// Start WhatsApp bot
const startWhatsApp = async () => {
    let settings = await getOrCreateSettings();

    if (!settings.whatsappEnabled) {
        settings = await prisma.appSettings.update({
            where: { id: settings.id },
            data: { whatsappEnabled: true }
        });
    }

    const currentStatus = await getCurrentWhatsAppStatus();
    if (currentStatus.whatsappStatus !== 'CONNECTED') {
        await updateWhatsAppStatus('CONNECTING');
    }

    return initializeClient();
};

// Stop WhatsApp bot
const stopWhatsApp = async () => {
    try {
        if (globalClient && globalClient.end) {
            await globalClient.end(new Error('Manual stop'));
            globalClient = null;
        }
    } catch (err) {
        console.error('Error stopping client:', err);
        globalClient = null;
    }
    await updateWhatsAppStatus('DISCONNECTED');
};

// Reset WhatsApp session
const resetWhatsAppSession = async () => {
    await stopWhatsApp();

    // Delete Baileys auth directory
    const authDir = path.join(__dirname, '..', 'auth_info');
    if (fs.existsSync(authDir)) {
        console.log('Deleting WhatsApp auth directory to reset session...');
        fs.rmSync(authDir, { recursive: true, force: true });
    }

    await updateWhatsAppStatus('DISCONNECTED');

    return { success: true, message: 'Session reset successfully. Ready to link new number.' };
};

// Initialize function
const initialize = (io) => {
    globalIo = io;
};

const showRestaurants = async (chatId, session, client) => {
    const restaurants = await prisma.restaurant.findMany({
        where: { status: 'OPEN' },
        select: { id: true, name: true, description: true }
    });

    if (restaurants.length === 0) {
        return sendWhatsAppMessage(chatId, 'Sorry, no restaurants are currently open. Please try again later.');
    }

    let responseList = 'Welcome to OrderIQ! 🍔 Here are our available restaurants:\n\n';
    session.menuCache = {};

    restaurants.forEach((rest, index) => {
        const optionNum = index + 1;
        session.menuCache[optionNum] = rest.id;
        responseList += `*${optionNum}*. ${rest.name}\n_${rest.description || 'Great food'}_\n\n`;
    });

    responseList += 'Please reply with the *number* of the restaurant you want to order from.';

    session.stage = STAGES.VIEWING_RESTAURANTS;
    sessions.set(chatId, session);

    sendWhatsAppMessage(chatId, responseList);
};

const handleRestaurantSelection = async (chatId, session, text, client) => {
    const option = parseInt(text);

    if (isNaN(option) || !session.menuCache[option]) {
        return sendWhatsAppMessage(chatId, 'Please reply with a valid restaurant number from the list.');
    }

    const restaurantId = session.menuCache[option];
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });

    if (!restaurant) {
        return sendWhatsAppMessage(chatId, 'Restaurant not found. Please type "reset".');
    }

    session.restaurantId = restaurantId;
    session.menuCache = {};

    const menuItems = await prisma.menuItem.findMany({
        where: { restaurantId: restaurantId, inStock: true }
    });

    if (menuItems.length === 0) {
        session.stage = STAGES.IDLE;
        return sendWhatsAppMessage(chatId, 'This restaurant doesn\'t have any menu items available right now. Type "reset" to go back.');
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

    sendWhatsAppMessage(chatId, responseList);
};

const handleMenuSelection = async (chatId, session, text, client) => {
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
        return sendWhatsAppMessage(chatId, 'Please reply with a valid item number, or type *checkout* if you are done. Type *reset* to clear cart and start over.');
    }

    const selectedItem = session.menuCache[option];

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

    sendWhatsAppMessage(chatId, `✅ Added *${quantity}x ${selectedItem.name}* to your cart. Cart Subtotal: $${subtotal.toFixed(2)}\n\nReply with another item number to add more, or type *checkout* to place your order.`);
};

const handleCheckout = async (chatId, session, io, client) => {
    const phoneNumber = chatId.split('@')[0];

    try {
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

        const order = await prisma.order.create({
            data: {
                orderNumber: orderNumber,
                restaurantId: session.restaurantId,
                customerId: user.id,
                type: 'DELIVERY',
                subtotal: subtotal,
                total: subtotal,
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

        if (io) {
            io.to(`restaurant_${session.restaurantId}`).emit('newOrder', order);
        }

        sendWhatsAppMessage(chatId, `🎉 Your order has been placed successfully!\n\n*Order #*: ${order.orderNumber}\n*Total*: $${subtotal.toFixed(2)}\n*Payment*: Cash on Delivery\n\nThank you for choosing OrderIQ! Your cart is now reset.`);

        sessions.set(chatId, {
            stage: STAGES.IDLE,
            restaurantId: null,
            cart: [],
            menuCache: {}
        });

    } catch (err) {
        console.error('WhatsApp Checkout Error:', err);
        sendWhatsAppMessage(chatId, 'There was an error processing your checkout. Please try again.');
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
