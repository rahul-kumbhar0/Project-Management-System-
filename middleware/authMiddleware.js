const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
exports.authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: 'Invalid or expired token. Please log in again.',
                    success: false,
                });
            }
            req.user = user; // Attach user info to request object
            next();
        });
    } else {
        res.status(401).json({
            message: 'Unauthorized: No token provided.',
            success: false,
        });
    }
};

// Middleware to authorize user roles
exports.authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized: No user data found in request.',
                success: false,
            });
        }

        if (req.user.role === 'admin') {
            return next();
        }

        if (roles.includes(req.user.role)) {
            return next();
        }

        return res.status(403).json({
            message: `Forbidden: User ${req.user.name} does not have the necessary role.`,
            success: false,
        });
    };
};

// Middleware to check specific permissions
exports.checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized: No user data found in request.',
                success: false,
            });
        }

        if (req.user.role === 'admin') {
            return next();
        }

        if (req.user.permissions && req.user.permissions.includes(requiredPermission)) {
            return next();
        }

        return res.status(403).json({
            message: `Forbidden: User ${req.user.name} does not have the required permission.`,
            success: false,
        });
    };
};
