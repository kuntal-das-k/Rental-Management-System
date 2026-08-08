import { prisma } from '../config';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { vendor_profile: true },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { vendor_profile: true, addresses: true },
    });
  }

  async createCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email.toLowerCase(),
        password_hash: data.passwordHash,
        role: 'CUSTOMER',
      },
      include: { vendor_profile: true },
    });
  }

  async createVendor(data: {
    firstName: string;
    lastName: string;
    companyName: string;
    productCategory: string;
    gstNo: string;
    email: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email.toLowerCase(),
        password_hash: data.passwordHash,
        role: 'VENDOR',
        vendor_profile: {
          create: {
            company_name: data.companyName,
            product_category: data.productCategory,
            gst_no: data.gstNo,
          },
        },
      },
      include: { vendor_profile: true },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password_hash: passwordHash },
    });
  }

  async toggleUserActiveStatus(userId: string, isActive: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { is_active: isActive },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        vendor_profile: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImageUrl?: string;
    companyName?: string;
    gstNo?: string;
    productCategory?: string;
    logoUrl?: string;
    phone?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor_profile: true, addresses: true },
    });

    if (!user) throw new Error('User not found');

    const firstName = data.firstName !== undefined ? data.firstName.trim() : user.first_name;
    const lastName = data.lastName !== undefined ? data.lastName.trim() : user.last_name;
    const fullName = `${firstName} ${lastName}`.trim();
    const email = data.email !== undefined ? data.email.trim().toLowerCase() : user.email;

    await prisma.user.update({
      where: { id: userId },
      data: {
        first_name: firstName,
        last_name: lastName,
        name: fullName,
        email: email,
        profile_image_url: data.profileImageUrl !== undefined ? data.profileImageUrl : user.profile_image_url,
      },
    });

    if (user.role === 'VENDOR' && user.vendor_profile) {
      await prisma.vendor.update({
        where: { id: user.vendor_profile.id },
        data: {
          company_name: data.companyName !== undefined ? data.companyName.trim() : user.vendor_profile.company_name,
          gst_no: data.gstNo !== undefined ? data.gstNo.trim() : user.vendor_profile.gst_no,
          product_category: data.productCategory !== undefined ? data.productCategory.trim() : user.vendor_profile.product_category,
          logo_url: data.logoUrl !== undefined ? data.logoUrl : user.vendor_profile.logo_url,
        },
      });
    }

    if (data.addressLine1 || data.city || data.state || data.pincode) {
      const defaultAddr = user.addresses[0];
      if (defaultAddr) {
        await prisma.address.update({
          where: { id: defaultAddr.id },
          data: {
            line1: data.addressLine1 || defaultAddr.line1,
            city: data.city || defaultAddr.city,
            state: data.state || defaultAddr.state,
            pincode: data.pincode || defaultAddr.pincode,
          },
        });
      } else {
        await prisma.address.create({
          data: {
            user_id: userId,
            line1: data.addressLine1 || 'Main Street',
            city: data.city || 'Mumbai',
            state: data.state || 'Maharashtra',
            pincode: data.pincode || '400001',
            is_default: true,
          },
        });
      }
    }

    return this.findById(userId);
  }
}
