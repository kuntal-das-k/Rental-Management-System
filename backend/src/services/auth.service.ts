import { UserRepository } from '../repositories/user.repository';
import { validatePasswordStrength, hashPassword, comparePassword } from '../utils/password';
import { generateTokens } from '../utils/jwt';

const userRepo = new UserRepository();

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
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

    const existingUser = await userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email address is already registered');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await userRepo.createCustomer({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
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

    const existingUser = await userRepo.findByEmail(data.email);
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
      email: data.email,
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

  async toggleUserActive(userId: string, isActive: boolean) {
    return userRepo.toggleUserActiveStatus(userId, isActive);
  }
}
