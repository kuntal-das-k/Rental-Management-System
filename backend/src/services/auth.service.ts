import { UserRepository } from '../repositories/user.repository';
import { validatePasswordStrength, hashPassword, comparePassword } from '../utils/password';
import { generateTokens } from '../utils/jwt';
import { prisma } from '../config';

const userRepo = new UserRepository();

function validateEmail(email: string): { valid: boolean; message: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email address is required' };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length === 0) {
    return { valid: false, message: 'Email address cannot be empty' };
  }

  if (trimmed.length > 254) {
    return { valid: false, message: 'Email address is too long (max 254 characters)' };
  }

  // RFC 5322 compliant regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email address (e.g. user@example.com)' };
  }

  // Must have at least one dot in the domain part
  const [, domain] = trimmed.split('@');
  if (!domain || !domain.includes('.')) {
    return { valid: false, message: 'Email domain must include a valid TLD (e.g. .com, .in, .org)' };
  }

  // Domain TLD must be at least 2 characters
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return { valid: false, message: 'Email domain has an invalid TLD' };
  }

  return { valid: true, message: '' };
}

export class AuthService {
  async login(email: string, password: string) {
    // Validate email format before querying database
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      throw new Error(emailCheck.message);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepo.findByEmail(normalizedEmail);
    if (!user || !user.is_active) {
      throw new Error('Invalid User ID or Password');
    }

    const match = await comparePassword(password, user.password_hash);
    if (!match) {
      throw new Error('Invalid User ID or Password');
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      vendorId: user.vendor_profile?.id,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        vendorId: user.vendor_profile?.id,
        companyName: user.vendor_profile?.company_name,
      },
      ...tokens,
    };
  }

  async signupCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    if (data.password !== data.confirmPassword) {
      throw new Error('Password and Confirm Password do not match');
    }

    const validation = validatePasswordStrength(data.password);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Validate email format
    const emailCheck = validateEmail(data.email);
    if (!emailCheck.valid) {
      throw new Error(emailCheck.message);
    }

    const normalizedEmail = data.email.trim().toLowerCase();
    const existingUser = await userRepo.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('Email address is already registered');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await userRepo.createCustomer({
      firstName: data.firstName,
      lastName: data.lastName,
      email: normalizedEmail,
      passwordHash,
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as any,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  async signupVendor(data: {
    firstName: string;
    lastName: string;
    companyName: string;
    productCategory: string;
    gstNo: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    if (data.password !== data.confirmPassword) {
      throw new Error('Password and Confirm Password do not match');
    }

    const validation = validatePasswordStrength(data.password);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    if (!data.companyName || !data.productCategory || !data.gstNo) {
      throw new Error('Company Name, Product Category, and GST No are required');
    }

    // Validate email format
    const emailCheck = validateEmail(data.email);
    if (!emailCheck.valid) {
      throw new Error(emailCheck.message);
    }

    const normalizedEmail = data.email.trim().toLowerCase();
    const existingUser = await userRepo.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('Email address is already registered');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await userRepo.createVendor({
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      productCategory: data.productCategory,
      gstNo: data.gstNo,
      email: normalizedEmail,
      passwordHash,
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      vendorId: user.vendor_profile?.id,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorId: user.vendor_profile?.id,
        companyName: user.vendor_profile?.company_name,
      },
      ...tokens,
    };
  }

  async resetPassword(email: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error('User email not found');
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    console.log(`[RESET PASSWORD LINK LOG]: Reset link for ${email}: http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`);

    return {
      message: 'The password reset link has been sent to your email',
    };
  }

  async getAllUsers() {
    return userRepo.getAllUsers();
  }

  async toggleUserActive(userId: string, isActive: boolean, reason?: string, statusAction?: string) {
    const updated = await userRepo.toggleUserActiveStatus(userId, isActive);

    if (reason && reason.trim().length > 0) {
      try {
        const actionLabel = statusAction || (isActive ? 'ACTIVATED' : 'DEACTIVATED');
        await prisma.notification.create({
          data: {
            user_id: userId,
            type: 'ACCOUNT_STATUS_CHANGE',
            channel: 'IN_APP',
            payload: JSON.stringify({
              action: actionLabel,
              reason: reason.trim(),
              message: `Account status updated to ${actionLabel} by Admin. Reason: "${reason.trim()}"`,
            }),
            status: 'UNREAD',
          },
        });
      } catch (err) {
        console.error('Failed to log notification:', err);
      }
    }

    return updated;
  }

  async getProfile(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId: string, data: any) {
    return userRepo.updateProfile(userId, data);
  }
}
