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
}
