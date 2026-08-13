import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token required',
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;

    // Import prisma client dynamically to verify user active status and vendor_profile
    const { prisma } = require('../config');
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        is_active: true,
        vendor_profile: { select: { id: true } },
      },
    });

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        error: 'User account not found',
      });
    }

    if (!dbUser.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Your account has been deactivated by an administrator. Please contact support.',
      });
    }

    if (dbUser.vendor_profile) {
      req.user.vendorId = dbUser.vendor_profile.id;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token',
    });
  }
}

export function requireRole(allowedRoles: ('CUSTOMER' | 'VENDOR' | 'ADMIN')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}
