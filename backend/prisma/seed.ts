import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const Role = {
  ADMIN: 'ADMIN',
  VENDOR: 'VENDOR',
  CUSTOMER: 'CUSTOMER',
};

const ProductType = {
  GOODS: 'GOODS',
  SERVICE: 'SERVICE',
};

const DisplayType = {
  RADIO: 'RADIO',
  COLOR: 'COLOR',
  SELECT: 'SELECT',
};

const FeeBasis = {
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
};

const PriceType = {
  DISCOUNT: 'DISCOUNT',
  FIXED: 'FIXED',
};

const DiscountType = {
  PERCENT: 'PERCENT',
  FIXED: 'FIXED',
};

async function main() {
  console.log('🌱 Starting TwinSix Rentals seed script...');

  // Clean DB
  await prisma.wishlist.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.pickupReturnLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.quotationTemplate.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.lateFeeRule.deleteMany();
  await prisma.pricelistRule.deleteMany();
  await prisma.pricelist.deleteMany();
  await prisma.rentalPeriod.deleteMany();
  await prisma.productAttributeValue.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Admin User
  const admin = await prisma.user.create({
    data: {
      first_name: 'System',
      last_name: 'Administrator',
      name: 'System Administrator',
      email: 'admin@twinsix.com',
      password_hash: passwordHash,
      role: Role.ADMIN,
      is_active: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Vendor Users & Profiles
  const vendorUser1 = await prisma.user.create({
    data: {
      first_name: 'John',
      last_name: 'ProRentals',
      name: 'John ProRentals',
      email: 'vendor1@twinsix.com',
      password_hash: passwordHash,
      role: Role.VENDOR,
      is_active: true,
      vendor_profile: {
        create: {
          company_name: 'Apex Mobility & Gear Rentals',
          gst_no: '22AAAAA0000A1Z5',
          product_category: 'Electronics & Camera',
          logo_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
        },
      },
    },
    include: { vendor_profile: true },
  });

  const vendorUser2 = await prisma.user.create({
    data: {
      first_name: 'Sarah',
      last_name: 'UrbanDrive',
      name: 'Sarah UrbanDrive',
      email: 'vendor2@twinsix.com',
      password_hash: passwordHash,
      role: Role.VENDOR,
      is_active: true,
      vendor_profile: {
        create: {
          company_name: 'Urban Fleet & EV Rentals',
          gst_no: '29BBBBA1111B2Z9',
          product_category: 'Vehicles & E-Bikes',
          logo_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
        },
      },
    },
    include: { vendor_profile: true },
  });

  console.log('✅ Vendor users created:', vendorUser1.email, vendorUser2.email);

  // 3. Customer Users
  const customer1 = await prisma.user.create({
    data: {
      first_name: 'Alex',
      last_name: 'Morgan',
      name: 'Alex Morgan',
      email: 'customer1@gmail.com',
      password_hash: passwordHash,
      role: Role.CUSTOMER,
      is_active: true,
      addresses: {
        create: {
          line1: '42 Wallaby Way',
          city: 'Tech Hub',
          state: 'California',
          pincode: '90001',
          is_default: true,
        },
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      first_name: 'David',
      last_name: 'Miller',
      name: 'David Miller',
      email: 'customer2@gmail.com',
      password_hash: passwordHash,
      role: Role.CUSTOMER,
      is_active: true,
      addresses: {
        create: {
          line1: '742 Evergreen Terrace',
          city: 'Metro City',
          state: 'New York',
          pincode: '10001',
          is_default: true,
        },
      },
    },
  });
  console.log('✅ Customer users created:', customer1.email, customer2.email);

  // 4. Categories
  const catCamera = await prisma.category.create({ data: { name: 'Cameras & Audio', description: 'DSLRs, Cinema gear, microphones' } });
  const catEV = await prisma.category.create({ data: { name: 'E-Bikes & Scooters', description: 'Urban electric transport' } });
  await prisma.category.create({ data: { name: 'Drones & Aerial Gear', description: '4K Drones, Gimbals, Aerial Rigs' } });
  await prisma.category.create({ data: { name: 'Audio & Sound Systems', description: 'PA Speakers, Microphones, DJ Mixers' } });
  await prisma.category.create({ data: { name: 'Tools & Construction Equipment', description: 'Power tools, Generators, Ladders' } });
  await prisma.category.create({ data: { name: 'Event & Party Supplies', description: 'Tents, Lighting, Staging, Furniture' } });
  const catService = await prisma.category.create({ data: { name: 'Security & Ancillary Services', description: 'Deposits, Warranties, Insurance' } });

  // 5. Global Attributes & Values
  const brandAttr = await prisma.attribute.create({
    data: {
      name: 'Brand',
      display_type: DisplayType.SELECT,
      values: {
        create: [{ value: 'Sony' }, { value: 'Canon' }, { value: 'Super73' }, { value: 'Segway' }],
      },
    },
    include: { values: true },
  });

  const colorAttr = await prisma.attribute.create({
    data: {
      name: 'Color',
      display_type: DisplayType.COLOR,
      values: {
        create: [{ value: '#000000' }, { value: '#FFFFFF' }, { value: '#FF0000' }],
      },
    },
    include: { values: true },
  });

  // 6. Rental Periods
  const periodDaily = await prisma.rentalPeriod.create({ data: { name: 'Daily', unit: FeeBasis.DAILY, min_duration: 1, max_duration: 30 } });
  const periodMonthly = await prisma.rentalPeriod.create({ data: { name: 'Monthly', unit: FeeBasis.MONTHLY, min_duration: 1, max_duration: 12 } });

  // 7. Security Deposit Service Products (Convention: Service Products)
  const depositProduct1 = await prisma.product.create({
    data: {
      vendor_id: vendorUser1.vendor_profile!.id,
      category_id: catService.id,
      name: 'Camera Security Deposit',
      description: 'Refundable security deposit held for camera gear rentals.',
      product_type: ProductType.SERVICE,
      sku: 'DEP-CAM-001',
      stock_qty: 999,
      sales_price: 8000,
      cost_price: 0,
      is_published: true,
      security_deposit_amount: 8000,
      image_urls: JSON.stringify(['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80']),
    },
  });

  const depositProduct2 = await prisma.product.create({
    data: {
      vendor_id: vendorUser2.vendor_profile!.id,
      category_id: catService.id,
      name: 'EV Bike Security Deposit',
      description: 'Refundable security deposit held for E-Bike rentals.',
      product_type: ProductType.SERVICE,
      sku: 'DEP-EV-002',
      stock_qty: 999,
      sales_price: 5000,
      cost_price: 0,
      is_published: true,
      security_deposit_amount: 5000,
      image_urls: JSON.stringify(['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80']),
    },
  });

  // 8. Main Rentable Products (Goods)
  const prod1 = await prisma.product.create({
    data: {
      vendor_id: vendorUser1.vendor_profile!.id,
      category_id: catCamera.id,
      name: 'Sony FX3 Cinema Camera Kit',
      description: 'Full-frame cinema camera with 4K 120fps capability, audio handle, top grip, and 2x 160GB Tough CFexpress cards.',
      product_type: ProductType.GOODS,
      sku: 'CAM-SONY-FX3',
      stock_qty: 5,
      sales_price: 2500,
      cost_price: 1200,
      is_published: true,
      pickup_time: '09:00',
      return_time: '18:00',
      late_fee_per_unit: 500,
      security_deposit_amount: 8000,
      image_urls: JSON.stringify([
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      ]),
      attribute_values: {
        create: [
          { attribute_value_id: brandAttr.values.find((v: any) => v.value === 'Sony')!.id },
          { attribute_value_id: colorAttr.values.find((v: any) => v.value === '#000000')!.id },
        ],
      },
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      vendor_id: vendorUser1.vendor_profile!.id,
      category_id: catCamera.id,
      name: 'Canon EOS R5 Mirrorless',
      description: '45MP 8K video mirrorless body with RF 24-70mm f/2.8 L IS USM lens.',
      product_type: ProductType.GOODS,
      sku: 'CAM-CANON-R5',
      stock_qty: 3,
      sales_price: 2200,
      cost_price: 1000,
      is_published: true,
      pickup_time: '09:00',
      return_time: '18:00',
      late_fee_per_unit: 400,
      security_deposit_amount: 6000,
      image_urls: JSON.stringify([
        'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80',
      ]),
      attribute_values: {
        create: [
          { attribute_value_id: brandAttr.values.find((v: any) => v.value === 'Canon')!.id },
          { attribute_value_id: colorAttr.values.find((v: any) => v.value === '#000000')!.id },
        ],
      },
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      vendor_id: vendorUser2.vendor_profile!.id,
      category_id: catEV.id,
      name: 'Super73-S2 Electric Cruiser Bike',
      description: 'High-performance electric motorbike-styled cruiser with 75+ mile range, 28mph top speed, and rugged all-terrain tires.',
      product_type: ProductType.GOODS,
      sku: 'EV-SUPER73-S2',
      stock_qty: 8,
      sales_price: 1500,
      cost_price: 700,
      is_published: true,
      pickup_time: '08:00',
      return_time: '20:00',
      late_fee_per_unit: 300,
      security_deposit_amount: 5000,
      image_urls: JSON.stringify([
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80',
      ]),
      attribute_values: {
        create: [
          { attribute_value_id: brandAttr.values.find((v: any) => v.value === 'Super73')!.id },
          { attribute_value_id: colorAttr.values.find((v: any) => v.value === '#000000')!.id },
        ],
      },
    },
  });

  console.log('✅ Products seeded successfully.');

  // 9. Pricelists & Rules
  const defaultPricelist1 = await prisma.pricelist.create({
    data: {
      vendor_id: vendorUser1.vendor_profile!.id,
      name: 'Standard Camera Pricelist',
      is_default: true,
      rules: {
        create: [
          {
            product_id: prod1.id,
            price_type: PriceType.DISCOUNT,
            value: 10,
            min_qty: 3,
          },
        ],
      },
    },
  });

  const defaultPricelist2 = await prisma.pricelist.create({
    data: {
      vendor_id: vendorUser2.vendor_profile!.id,
      name: 'Urban EV Standard Rates',
      is_default: true,
      rules: {
        create: [
          {
            product_id: prod3.id,
            price_type: PriceType.FIXED,
            value: 1200,
            min_qty: 5,
          },
        ],
      },
    },
  });

  console.log('✅ Pricelists & rules created.');

  // 10. Late Fee Rules
  await prisma.lateFeeRule.create({
    data: {
      product_id: prod1.id,
      basis: FeeBasis.DAILY,
      rate: 500,
      grace_period: 0,
      max_cap: 5000,
    },
  });

  await prisma.lateFeeRule.create({
    data: {
      product_id: null,
      basis: FeeBasis.DAILY,
      rate: 300,
      grace_period: 0,
      max_cap: 3000,
    },
  });

  // 11. Coupons
  await prisma.coupon.create({
    data: {
      code: 'TWINSIX10',
      discount_type: DiscountType.PERCENT,
      discount_value: 10,
      valid_from: new Date('2026-01-01'),
      valid_to: new Date('2027-12-31'),
      usage_limit: 500,
      times_used: 12,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'FLAT500',
      discount_type: DiscountType.FIXED,
      discount_value: 500,
      valid_from: new Date('2026-01-01'),
      valid_to: new Date('2027-12-31'),
      usage_limit: 100,
      times_used: 5,
    },
  });

  // 12. Quotation Templates
  await prisma.quotationTemplate.create({
    data: {
      vendor_id: vendorUser1.vendor_profile!.id,
      name: 'Standard Cinema Equipment Terms',
      terms_text: 'Equipment must be inspected upon pickup. Any damage or late return will be charged to the security deposit.',
      validity_days: 14,
      payment_terms_pct: 100,
    },
  });

  // 13. Sample Orders & Payments for Realistic Dashboard Reporting
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
  
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const twoDaysAgo = new Date(now); twoDaysAgo.setDate(now.getDate() - 2);
  const threeDaysAgo = new Date(now); threeDaysAgo.setDate(now.getDate() - 3);
  const inTwoDays = new Date(now); inTwoDays.setDate(now.getDate() + 2);
  const inFiveDays = new Date(now); inFiveDays.setDate(now.getDate() + 5);

  // Order 1: Active Sales Order (Upcoming Pickup)
  const order1 = await prisma.order.create({
    data: {
      customer_id: customer1.id,
      vendor_id: vendorUser1.vendor_profile!.id,
      state: 'SALES_ORDER',
      scheduled_pickup_at: inTwoDays,
      scheduled_return_at: inFiveDays,
      total_amount: 7500.00,
      created_at: threeDaysAgo,
      order_items: {
        create: [
          { product_id: prod1.id, quantity: 1, unit_price: 2500.00, line_total: 7500.00 }
        ]
      },
      payments: {
        create: [
          { amount: 7500.00, type: 'RENTAL', status: 'COMPLETED', method: 'CREDIT_CARD', transaction_ref: 'TXN-90123' },
          { amount: 8000.00, type: 'DEPOSIT', status: 'COMPLETED', method: 'CREDIT_CARD', transaction_ref: 'DEP-90123' }
        ]
      }
    }
  });

  // Order 2: Picked Up (Due Today)
  const order2 = await prisma.order.create({
    data: {
      customer_id: customer2.id,
      vendor_id: vendorUser2.vendor_profile!.id,
      state: 'PICKED_UP',
      scheduled_pickup_at: twoDaysAgo,
      scheduled_return_at: todayEnd,
      total_amount: 4500.00,
      created_at: twoDaysAgo,
      order_items: {
        create: [
          { product_id: prod3.id, quantity: 1, unit_price: 1500.00, line_total: 4500.00 }
        ]
      },
      payments: {
        create: [
          { amount: 4500.00, type: 'RENTAL', status: 'COMPLETED', method: 'CREDIT_CARD', transaction_ref: 'TXN-90124' },
          { amount: 5000.00, type: 'DEPOSIT', status: 'COMPLETED', method: 'CREDIT_CARD', transaction_ref: 'DEP-90124' }
        ]
      }
    }
  });

  // Order 3: Picked Up (Overdue Rental)
  const order3 = await prisma.order.create({
    data: {
      customer_id: customer1.id,
      vendor_id: vendorUser1.vendor_profile!.id,
      state: 'PICKED_UP',
      scheduled_pickup_at: threeDaysAgo,
      scheduled_return_at: yesterday,
      is_late: true,
      total_amount: 8800.00,
      created_at: threeDaysAgo,
      order_items: {
        create: [
          { product_id: prod2.id, quantity: 1, unit_price: 2200.00, line_total: 8800.00 }
        ]
      },
      payments: {
        create: [
          { amount: 8800.00, type: 'RENTAL', status: 'COMPLETED', method: 'CREDIT_CARD', transaction_ref: 'TXN-90125' },
          { amount: 6000.00, type: 'DEPOSIT', status: 'COMPLETED', method: 'CREDIT_CARD', transaction_ref: 'DEP-90125' },
          { amount: 400.00, type: 'LATE_FEE', status: 'COMPLETED', method: 'CREDIT_CARD', transaction_ref: 'FEE-90125' }
        ]
      }
    }
  });

  // Order 4: Returned (Completed Rental)
  const order4 = await prisma.order.create({
    data: {
      customer_id: customer2.id,
      vendor_id: vendorUser1.vendor_profile!.id,
      state: 'RETURNED',
      scheduled_pickup_at: threeDaysAgo,
      scheduled_return_at: yesterday,
      actual_return_at: yesterday,
      total_amount: 10000.00,
      created_at: threeDaysAgo,
      order_items: {
        create: [
          { product_id: prod1.id, quantity: 1, unit_price: 2500.00, line_total: 10000.00 }
        ]
      },
      payments: {
        create: [
          { amount: 10000.00, type: 'RENTAL', status: 'COMPLETED', method: 'CREDIT_CARD', transaction_ref: 'TXN-90126' }
        ]
      }
    }
  });

  // Order 5: Quotation (Sent)
  const order5 = await prisma.order.create({
    data: {
      customer_id: customer1.id,
      vendor_id: vendorUser2.vendor_profile!.id,
      state: 'QUOTATION',
      scheduled_pickup_at: inTwoDays,
      scheduled_return_at: inFiveDays,
      total_amount: 6000.00,
      created_at: now,
      order_items: {
        create: [
          { product_id: prod3.id, quantity: 1, unit_price: 1500.00, line_total: 6000.00 }
        ]
      }
    }
  });

  console.log('✅ Sample orders & payments created successfully.');
  console.log('🎉 Seed process finished cleanly!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
