import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.uid || 'guest';

    const [cartItems, setCartItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [orderType, setOrderType] = useState('DELIVERY');
    const [tableLabel, setTableLabel] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Effect to load cart whenever user changes
    useEffect(() => {
        const cartKey = `orderiq_cart_${userId}`;
        const resKey = `orderiq_cart_restaurant_${userId}`;
        const typeKey = `orderiq_order_type_${userId}`;
        const tableKey = `orderiq_table_label_${userId}`;

        const savedCart = localStorage.getItem(cartKey);
        const savedRes = localStorage.getItem(resKey);
        const savedType = localStorage.getItem(typeKey);
        const savedTable = localStorage.getItem(tableKey);

        setCartItems(savedCart ? JSON.parse(savedCart) : []);
        setRestaurant(savedRes ? JSON.parse(savedRes) : null);
        setOrderType(savedType || 'DELIVERY');
        setTableLabel(savedTable || '');
        setIsLoaded(true);
        
        console.log(`[CartContext] Loaded cart for: ${userId}`);
    }, [userId]);

    // Effect to save cart whenever it changes
    useEffect(() => {
        if (!isLoaded) return;

        const cartKey = `orderiq_cart_${userId}`;
        const resKey = `orderiq_cart_restaurant_${userId}`;
        const typeKey = `orderiq_order_type_${userId}`;
        const tableKey = `orderiq_table_label_${userId}`;

        localStorage.setItem(cartKey, JSON.stringify(cartItems));
        localStorage.setItem(resKey, JSON.stringify(restaurant));
        localStorage.setItem(typeKey, orderType);
        localStorage.setItem(tableKey, tableLabel);
    }, [cartItems, restaurant, orderType, tableLabel, userId, isLoaded]);

    const addToCart = (item, currentRestaurant) => {
        // Check if adding explicitly from a different restaurant
        if (restaurant && restaurant.id !== currentRestaurant.id && cartItems.length > 0) {
            if (!window.confirm(`Start a new basket? Your previous textCart from ${restaurant.name} will be cleared.`)) {
                return;
            }
            clearCart();
        }

        setRestaurant(currentRestaurant);

        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        
        toast.success(`Added ${item.name} to cart`);
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item.id === itemId) {
                    const newQty = item.quantity + delta;
                    if (newQty <= 0) return null;
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(Boolean);
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setRestaurant(null);
        setOrderType('DELIVERY');
        setTableLabel('');
    };

    // Set dine-in mode (called from QR scan page)
    const setDineIn = (table, restaurantId) => {
        setOrderType('DINEIN');
        setTableLabel(table);
    };

    const cartTotal = cartItems.reduce((acc, item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        return acc + (price * item.quantity);
    }, 0);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            restaurant,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            orderType,
            setOrderType,
            tableLabel,
            setTableLabel,
            setDineIn
        }}>
            {children}
        </CartContext.Provider>
    );
};

