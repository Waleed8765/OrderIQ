import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import PasswordChangedModal from './PasswordChangedModal';
import { useLocation } from 'react-router-dom';

const GlobalAuthModals = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [isPasswordChangedOpen, setIsPasswordChangedOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleOpenLogin = () => {
            setIsForgotOpen(false);
            setIsPasswordChangedOpen(false);
            setIsLoginOpen(true);
        };
        const handleOpenForgot = () => {
            setIsLoginOpen(false);
            setIsPasswordChangedOpen(false);
            setIsForgotOpen(true);
        };
        const handleOpenPasswordChanged = () => {
            setIsLoginOpen(false);
            setIsForgotOpen(false);
            setIsPasswordChangedOpen(true);
        };

        window.addEventListener('open-login', handleOpenLogin);
        window.addEventListener('open-forgot', handleOpenForgot);
        window.addEventListener('open-password-changed', handleOpenPasswordChanged);

        return () => {
            window.removeEventListener('open-login', handleOpenLogin);
            window.removeEventListener('open-forgot', handleOpenForgot);
            window.removeEventListener('open-password-changed', handleOpenPasswordChanged);
        };
    }, []);

    // If we're on the landing page, the Navbar already renders its own modal instances.
    // To avoid rendering two overlays (which might stack), we don't render GlobalAuthModals there.
    if (location.pathname === '/') {
        return null;
    }

    return (
        <>
            <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
                onForgotPassword={() => {
                    setIsLoginOpen(false);
                    setIsForgotOpen(true);
                }} 
            />
            <ForgotPasswordModal 
                isOpen={isForgotOpen} 
                onClose={() => setIsForgotOpen(false)} 
                onSwitchToLogin={() => {
                    setIsForgotOpen(false);
                    setIsLoginOpen(true);
                }} 
            />
            <PasswordChangedModal 
                isOpen={isPasswordChangedOpen} 
                onClose={() => setIsPasswordChangedOpen(false)} 
                onLogin={() => {
                    setIsPasswordChangedOpen(false);
                    setIsLoginOpen(true);
                }} 
            />
        </>
    );
};

export default GlobalAuthModals;
