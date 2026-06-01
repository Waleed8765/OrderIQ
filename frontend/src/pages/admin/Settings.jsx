import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/admin.service';
import { io } from 'socket.io-client';

// Initialize Socket.IO client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
const SOCKET_URL = API_BASE_URL.replace('/api', '');
const socket = io(SOCKET_URL, {
  path: '/socket.io/'
});

const SettingsPage = () => {
    const [general, setGeneral] = useState({
        platformName: 'OrderIQ',
        supportEmail: 'support@orderiq.com',
        timezone: 'UTC',
        currency: 'USD',
    });
    const [security, setSecurity] = useState({
        twoFactorRequired: true,
        sessionTimeout: '30',
        passwordMinLength: '8',
    });
    const [billing, setBilling] = useState({
        payoutSchedule: 'Weekly',
        commissionRate: '12',
        taxMode: 'Exclusive',
    });
    const [notifications, setNotifications] = useState({
        systemAlerts: true,
        campaignUpdates: true,
        weeklyDigest: false,
    });
    const [whatsapp, setWhatsapp] = useState({
        whatsappEnabled: false,
        whatsappPhoneNumber: '',
        whatsappStatus: 'DISCONNECTED'
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState(null);

    const fetchWhatsAppSettings = async () => {
        try {
            const response = await adminService.getWhatsAppSettings();
            if (response.success) {
                setWhatsapp({
                    ...response.data,
                    whatsappPhoneNumber: response.data.whatsappPhoneNumber || ''
                });
            }
        } catch (error) {
            console.error('Error fetching WhatsApp settings:', error);
        }
    };

    useEffect(() => {
        fetchWhatsAppSettings();

        // Socket.IO event listeners
        const handleWhatsAppQr = (data) => {
            if (data.qrDataUrl) {
                setQrDataUrl(data.qrDataUrl);
            }
            setWhatsapp(prev => ({ ...prev, whatsappStatus: 'QR_REQUIRED' }));
        };

        const handleWhatsAppReady = () => {
            setQrDataUrl(null);
            setWhatsapp(prev => ({ ...prev, whatsappStatus: 'CONNECTED' }));
        };

        const handleWhatsAppError = (data) => {
            setQrDataUrl(null);
            setWhatsapp(prev => ({ ...prev, whatsappStatus: 'ERROR' }));
        };

        const handleWhatsAppDisconnected = () => {
            setQrDataUrl(null);
            setWhatsapp(prev => ({ ...prev, whatsappStatus: 'DISCONNECTED' }));
        };

        const handleSocketConnect = () => {
            fetchWhatsAppSettings();
        };

        socket.on('connect', handleSocketConnect);
        socket.on('whatsapp_qr', handleWhatsAppQr);
        socket.on('whatsapp_ready', handleWhatsAppReady);
        socket.on('whatsapp_error', handleWhatsAppError);
        socket.on('whatsapp_disconnected', handleWhatsAppDisconnected);

        // Cleanup
        return () => {
            socket.off('connect', handleSocketConnect);
            socket.off('whatsapp_qr', handleWhatsAppQr);
            socket.off('whatsapp_ready', handleWhatsAppReady);
            socket.off('whatsapp_error', handleWhatsAppError);
            socket.off('whatsapp_disconnected', handleWhatsAppDisconnected);
        };
    }, []);

    const handleSave = (section) => {
        setStatusMessage(`${section} settings saved`);
        window.setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleSaveWhatsApp = async () => {
        try {
            setLoading(true);
            const response = await adminService.updateWhatsAppSettings(whatsapp);
            if (response.success) {
                setWhatsapp({
                    ...response.data,
                    whatsappPhoneNumber: response.data.whatsappPhoneNumber || ''
                });
                setStatusMessage('WhatsApp settings saved');
                window.setTimeout(() => setStatusMessage(''), 2000);
            }
        } catch (error) {
            console.error('Error saving WhatsApp settings:', error);
            setStatusMessage('Error saving WhatsApp settings');
            window.setTimeout(() => setStatusMessage(''), 2000);
        } finally {
            setLoading(false);
        }
    };

    const handleStartWhatsApp = async () => {
        try {
            setLoading(true);
            // Immediately update state to show connecting
            setWhatsapp(prev => ({ ...prev, whatsappStatus: 'CONNECTING' }));
            await adminService.startWhatsAppBot();
            setStatusMessage('WhatsApp bot starting');
            await fetchWhatsAppSettings();
            window.setTimeout(() => setStatusMessage(''), 2000);
        } catch (error) {
            console.error('Error starting WhatsApp bot:', error);
            setStatusMessage('Error starting WhatsApp bot');
            await fetchWhatsAppSettings();
            window.setTimeout(() => setStatusMessage(''), 2000);
        } finally {
            setLoading(false);
        }
    };

    const handleStopWhatsApp = async () => {
        try {
            setLoading(true);
            // Immediately update state to show disconnected
            setWhatsapp(prev => ({ ...prev, whatsappStatus: 'DISCONNECTED' }));
            setQrDataUrl(null);
            await adminService.stopWhatsAppBot();
            setStatusMessage('WhatsApp bot stopped');
            await fetchWhatsAppSettings();
            window.setTimeout(() => setStatusMessage(''), 2000);
        } catch (error) {
            console.error('Error stopping WhatsApp bot:', error);
            setStatusMessage('Error stopping WhatsApp bot');
            await fetchWhatsAppSettings();
            window.setTimeout(() => setStatusMessage(''), 2000);
        } finally {
            setLoading(false);
        }
    };

    const handleResetWhatsAppSession = async () => {
        try {
            setLoading(true);
            await adminService.resetWhatsAppSession();
            setStatusMessage('WhatsApp session reset successfully');
            await fetchWhatsAppSettings();
            window.setTimeout(() => setStatusMessage(''), 2000);
        } catch (error) {
            console.error('Error resetting WhatsApp session:', error);
            setStatusMessage('Error resetting WhatsApp session');
            await fetchWhatsAppSettings();
            window.setTimeout(() => setStatusMessage(''), 2000);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            DISCONNECTED: 'bg-gray-100 text-gray-800',
            CONNECTING: 'bg-yellow-100 text-yellow-800',
            QR_REQUIRED: 'bg-blue-100 text-blue-800',
            CONNECTED: 'bg-green-100 text-green-800',
            ERROR: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.DISCONNECTED}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
                {statusMessage ? (
                    <span className="text-sm text-green-600 font-medium">{statusMessage}</span>
                ) : null}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">General</h2>
                        <Button size="sm" onClick={() => handleSave('General')}>Save</Button>
                    </div>
                    <div className="grid gap-4">
                        <label className="text-sm text-gray-600">
                            Platform Name
                            <input
                                type="text"
                                value={general.platformName}
                                onChange={(event) => setGeneral(prev => ({ ...prev, platformName: event.target.value }))}
                                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                        </label>
                        <label className="text-sm text-gray-600">
                            Support Email
                            <input
                                type="email"
                                value={general.supportEmail}
                                onChange={(event) => setGeneral(prev => ({ ...prev, supportEmail: event.target.value }))}
                                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="text-sm text-gray-600">
                                Timezone
                                <select
                                    value={general.timezone}
                                    onChange={(event) => setGeneral(prev => ({ ...prev, timezone: event.target.value }))}
                                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">America/New_York</option>
                                    <option value="Europe/London">Europe/London</option>
                                    <option value="Asia/Karachi">Asia/Karachi</option>
                                </select>
                            </label>
                            <label className="text-sm text-gray-600">
                                Currency
                                <select
                                    value={general.currency}
                                    onChange={(event) => setGeneral(prev => ({ ...prev, currency: event.target.value }))}
                                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="PKR">PKR</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Security</h2>
                        <Button size="sm" onClick={() => handleSave('Security')}>Save</Button>
                    </div>
                    <div className="grid gap-4">
                        <label className="flex items-center justify-between text-sm text-gray-600">
                            Require 2FA for admins
                            <input
                                type="checkbox"
                                checked={security.twoFactorRequired}
                                onChange={(event) => setSecurity(prev => ({ ...prev, twoFactorRequired: event.target.checked }))}
                                className="h-4 w-4"
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="text-sm text-gray-600">
                                Session timeout (mins)
                                <input
                                    type="number"
                                    min="5"
                                    value={security.sessionTimeout}
                                    onChange={(event) => setSecurity(prev => ({ ...prev, sessionTimeout: event.target.value }))}
                                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </label>
                            <label className="text-sm text-gray-600">
                                Password min length
                                <input
                                    type="number"
                                    min="6"
                                    value={security.passwordMinLength}
                                    onChange={(event) => setSecurity(prev => ({ ...prev, passwordMinLength: event.target.value }))}
                                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </label>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Billing</h2>
                        <Button size="sm" onClick={() => handleSave('Billing')}>Save</Button>
                    </div>
                    <div className="grid gap-4">
                        <label className="text-sm text-gray-600">
                            Payout Schedule
                            <select
                                value={billing.payoutSchedule}
                                onChange={(event) => setBilling(prev => ({ ...prev, payoutSchedule: event.target.value }))}
                                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            >
                                <option>Weekly</option>
                                <option>Bi-weekly</option>
                                <option>Monthly</option>
                            </select>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="text-sm text-gray-600">
                                Commission Rate (%)
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={billing.commissionRate}
                                    onChange={(event) => setBilling(prev => ({ ...prev, commissionRate: event.target.value }))}
                                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </label>
                            <label className="text-sm text-gray-600">
                                Tax Mode
                                <select
                                    value={billing.taxMode}
                                    onChange={(event) => setBilling(prev => ({ ...prev, taxMode: event.target.value }))}
                                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                >
                                    <option>Exclusive</option>
                                    <option>Inclusive</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                        <Button size="sm" onClick={() => handleSave('Notifications')}>Save</Button>
                    </div>
                    <div className="grid gap-4">
                        <label className="flex items-center justify-between text-sm text-gray-600">
                            System alerts
                            <input
                                type="checkbox"
                                checked={notifications.systemAlerts}
                                onChange={(event) => setNotifications(prev => ({ ...prev, systemAlerts: event.target.checked }))}
                                className="h-4 w-4"
                            />
                        </label>
                        <label className="flex items-center justify-between text-sm text-gray-600">
                            Campaign updates
                            <input
                                type="checkbox"
                                checked={notifications.campaignUpdates}
                                onChange={(event) => setNotifications(prev => ({ ...prev, campaignUpdates: event.target.checked }))}
                                className="h-4 w-4"
                            />
                        </label>
                        <label className="flex items-center justify-between text-sm text-gray-600">
                            Weekly digest
                            <input
                                type="checkbox"
                                checked={notifications.weeklyDigest}
                                onChange={(event) => setNotifications(prev => ({ ...prev, weeklyDigest: event.target.checked }))}
                                className="h-4 w-4"
                            />
                        </label>
                    </div>
                </Card>

                <Card className="p-6 space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-gray-900">WhatsApp Bot</h2>
                            {getStatusBadge(whatsapp.whatsappStatus)}
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleSaveWhatsApp}
                                disabled={loading}
                            >
                                Save
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleResetWhatsAppSession}
                                disabled={loading}
                            >
                                Change Number
                            </Button>
                            {whatsapp.whatsappStatus === 'CONNECTED' ? (
                                <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    onClick={handleStopWhatsApp}
                                    disabled={loading}
                                >
                                    Stop Bot
                                </Button>
                            ) : (
                                <Button 
                                    size="sm" 
                                    onClick={handleStartWhatsApp}
                                    disabled={loading || !whatsapp.whatsappEnabled}
                                >
                                    Start Bot
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className="text-sm text-gray-600">
                            Enable WhatsApp Bot
                            <div className="mt-1">
                                <input
                                    type="checkbox"
                                    checked={whatsapp.whatsappEnabled}
                                    onChange={(event) => setWhatsapp(prev => ({ ...prev, whatsappEnabled: event.target.checked }))}
                                    className="h-4 w-4"
                                />
                            </div>
                        </label>
                        <label className="text-sm text-gray-600">
                            Phone Number (e.g., 923XXXXXXXXX)
                            <input
                                type="text"
                                value={whatsapp.whatsappPhoneNumber || ''}
                                onChange={(event) => setWhatsapp(prev => ({ ...prev, whatsappPhoneNumber: event.target.value }))}
                                placeholder="923XXXXXXXXX"
                                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                        </label>
                    </div>
                    
                    {qrDataUrl && (
                        <div className="mt-4 flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Scan QR Code with WhatsApp</h3>
                            <img 
                                src={qrDataUrl} 
                                alt="WhatsApp QR Code" 
                                className="w-64 h-64 border-4 border-white shadow-lg"
                            />
                            <p className="mt-4 text-sm text-gray-600">Open WhatsApp → Tap More options → Linked Devices → Link a device</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;