const { admin, isInitialized } = require('../config/firebase');
const prisma = require('../config/db');

/**
 * Protect middleware
 * Verifies the Firebase ID token in the Authorization header.
 * If valid, fetches the user from PostgreSQL and attaches `req.user`.
 */
exports.protect = async (req, res, next) => {
    try {
        if (!isInitialized) {
            return res.status(500).json({ success: false, message: 'Firebase Admin not configured on server' });
        }

        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        }

        // Verify token using Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Determine role from Firebase custom claims (set by createAdmin script or admin SDK)
        const claimsRole = decodedToken.role || (decodedToken.admin === true ? 'ADMIN' : null);

        // Find the user in our PostgreSQL database using the Firebase UID
        let user = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }
        });

        if (!user) {
            // Don't auto-create users anymore - require explicit registration
            console.log(`[Auth] User not found in DB (UID: ${decodedToken.uid}, email: ${decodedToken.email}) - not auto-creating`);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            });
        }
        // Self-heal: keep DB role in sync with Firebase Custom claims if they differ
        if (claimsRole && claimsRole !== user.role && claimsRole !== 'CUSTOMER') {
            console.log(`[Auth] Role mismatch for ${user.email}: DB=${user.role}, Claims=${claimsRole}. Syncing DB role.`);
            user = await prisma.user.update({
                where: { id: user.id },
                data: { role: claimsRole }
            });
        }

        // Attach user to request object
        req.user = user;

        // Also attach the raw firebase token payload if needed
        req.firebaseUser = decodedToken;

        next();
    } catch (error) {
        console.error('Auth protect error details:', {
            message: error.message,
            code: error.code,
            isInitialized,
            hasToken: !!req.headers.authorization
        });
        return res.status(401).json({ success: false, message: 'Not authorized, token failed', detail: error.message });
    }
};

/**
 * Optional auth: attaches req.user when a valid Bearer token is present; otherwise req.user stays null.
 * Does not return 401 (for public routes that personalize when possible).
 */
exports.optionalProtect = async (req, res, next) => {
    req.user = null;
    try {
        if (!isInitialized) {
            return next();
        }
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return next();
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next();
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const claimsRole = decodedToken.role || (decodedToken.admin === true ? 'ADMIN' : null);

        let user = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }
        });

        // Don't auto-create users in optionalProtect either
        if (!user) {
            return next();
        }

        if (claimsRole && claimsRole !== user.role && claimsRole !== 'CUSTOMER') {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { role: claimsRole }
            });
        }

        req.user = user;
        req.firebaseUser = decodedToken;
    } catch {
        req.user = null;
    }
    next();
};

/**
 * Authorize middleware
 * Grants access to specific roles only.
 * Must be used AFTER protect middleware.
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
