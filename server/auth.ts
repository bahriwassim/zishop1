import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'default-secret-change-this';

export interface AuthUser {
  id: number;
  username: string;
  role: 'admin' | 'hotel' | 'merchant' | 'client';
  entityId?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  try {
    // BYPASS AUTHENTICATION FOR TESTING - Accept any username/password
    console.log(`[TEST MODE] Bypassing authentication for user: ${username}`);
    
    // Determine role based on username
    let role: 'admin' | 'hotel' | 'merchant' | 'client' = 'client';
    let entityId: number | undefined = undefined;
    
    if (username.startsWith('admin') || username === 'admin') {
      role = 'admin';
    } else if (username.startsWith('hotel') || username.includes('hotel')) {
      role = 'hotel';
      entityId = 1; // Default hotel ID
    } else if (username.startsWith('merchant') || username.includes('merchant')) {
      role = 'merchant';
      entityId = 1; // Default merchant ID
    } else {
      role = 'client';
    }
    
    return {
      id: 1, // Default ID
      username: username,
      role: role,
      entityId: entityId
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // BYPASS AUTHENTICATION FOR TESTING - Create a fake user based on path
  console.log(`[TEST MODE] Bypassing auth middleware for: ${req.method} ${req.path}`);
  
  let role: 'admin' | 'hotel' | 'merchant' | 'client' = 'admin';
  let entityId: number | undefined = undefined;
  
  if (req.path.includes('/hotel')) {
    role = 'hotel';
    entityId = 1;
  } else if (req.path.includes('/merchant')) {
    role = 'merchant';
    entityId = 1;
  } else if (req.path.includes('/admin')) {
    role = 'admin';
  } else {
    role = 'client';
  }
  
  req.user = {
    id: 1,
    username: `test-${role}`,
    role: role,
    entityId: entityId
  };
  
  next();
}

export function requireRole(role: 'admin' | 'hotel' | 'merchant' | 'client') {
  return (req: Request, res: Response, next: NextFunction) => {
    // BYPASS ROLE CHECK FOR TESTING - Always allow access
    console.log(`[TEST MODE] Bypassing role check for: ${role} on ${req.method} ${req.path}`);
    
    // Ensure user exists with correct role
    if (!req.user) {
      req.user = {
        id: 1,
        username: `test-${role}`,
        role: role,
        entityId: role === 'hotel' || role === 'merchant' ? 1 : undefined
      };
    }
    
    next();
  };
}

export function requireEntityAccess(req: Request, res: Response, next: NextFunction) {
  // BYPASS ENTITY ACCESS CHECK FOR TESTING - Always allow access
  console.log(`[TEST MODE] Bypassing entity access check for: ${req.method} ${req.path}`);
  
  // Ensure user exists
  if (!req.user) {
    req.user = {
      id: 1,
      username: 'test-admin',
      role: 'admin',
      entityId: 1
    };
  }
  
  next();
} 