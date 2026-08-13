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
  console.log('🌱 Starting TwinSix Rentals comprehensive seed script (350+ Entities)...');

  // Clean DB safely
  await prisma.contactMessage.deleteMany();
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

  // 2. Vendor Users & Profiles (5 Vendors)
  const vendorUser1 = await prisma.user.create({
    data: {
      first_name: 'John',
      last_name: 'ApexGear',
      name: 'John ApexGear',
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

  const vendorUser3 = await prisma.user.create({
    data: {
      first_name: 'Marcus',
      last_name: 'ProCine',
      name: 'Marcus ProCine',
      email: 'vendor3@twinsix.com',
      password_hash: passwordHash,
      role: Role.VENDOR,
      is_active: true,
      vendor_profile: {
        create: {
          company_name: 'ProCine & Sound Gear',
          gst_no: '27CCCCA2222C3Z8',
          product_category: 'Cameras & Audio',
          logo_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
        },
      },
    },
    include: { vendor_profile: true },
  });

  const vendorUser4 = await prisma.user.create({
    data: {
      first_name: 'Robert',
      last_name: 'HeavyDuty',
      name: 'Robert HeavyDuty',
      email: 'vendor4@twinsix.com',
      password_hash: passwordHash,
      role: Role.VENDOR,
      is_active: true,
      vendor_profile: {
        create: {
          company_name: 'HeavyDuty Tool & Equip Hub',
          gst_no: '33DDDDA3333D4Z7',
          product_category: 'Tools & Construction',
          logo_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
        },
      },
    },
    include: { vendor_profile: true },
  });

  const vendorUser5 = await prisma.user.create({
    data: {
      first_name: 'Elena',
      last_name: 'GalaEvents',
      name: 'Elena GalaEvents',
      email: 'vendor5@twinsix.com',
      password_hash: passwordHash,
      role: Role.VENDOR,
      is_active: true,
      vendor_profile: {
        create: {
          company_name: 'Gala Event & Outdoor Supplies',
          gst_no: '19EEEEE4444E5Z6',
          product_category: 'Event & Outdoor',
          logo_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80',
        },
      },
    },
    include: { vendor_profile: true },
  });

  const vendors = [
    vendorUser1.vendor_profile!.id,
    vendorUser2.vendor_profile!.id,
    vendorUser3.vendor_profile!.id,
    vendorUser4.vendor_profile!.id,
    vendorUser5.vendor_profile!.id,
  ];

  console.log('✅ 5 Vendor users created successfully.');

  // 3. Customer Users (5 Customers)
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
          city: 'Los Angeles',
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
          city: 'New York',
          state: 'New York',
          pincode: '10001',
          is_default: true,
        },
      },
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      first_name: 'Sophia',
      last_name: 'Taylor',
      name: 'Sophia Taylor',
      email: 'customer3@gmail.com',
      password_hash: passwordHash,
      role: Role.CUSTOMER,
      is_active: true,
      addresses: {
        create: {
          line1: '1200 Market Street',
          city: 'Austin',
          state: 'Texas',
          pincode: '73301',
          is_default: true,
        },
      },
    },
  });

  const customer4 = await prisma.user.create({
    data: {
      first_name: 'James',
      last_name: 'Wilson',
      name: 'James Wilson',
      email: 'customer4@gmail.com',
      password_hash: passwordHash,
      role: Role.CUSTOMER,
      is_active: true,
      addresses: {
        create: {
          line1: '500 Ocean Drive',
          city: 'Miami',
          state: 'Florida',
          pincode: '33139',
          is_default: true,
        },
      },
    },
  });

  const customer5 = await prisma.user.create({
    data: {
      first_name: 'Olivia',
      last_name: 'Davis',
      name: 'Olivia Davis',
      email: 'customer5@gmail.com',
      password_hash: passwordHash,
      role: Role.CUSTOMER,
      is_active: true,
      addresses: {
        create: {
          line1: '88 Pike Street',
          city: 'Seattle',
          state: 'Washington',
          pincode: '98101',
          is_default: true,
        },
      },
    },
  });

  const customers = [customer1, customer2, customer3, customer4, customer5];
  console.log('✅ 5 Customer users created.');

  // 4. Categories (9 Categories)
  const catCamera = await prisma.category.create({ data: { name: 'Cameras & Audio', description: 'DSLRs, Cinema gear, lenses, microphones, audio recorders' } });
  const catEV = await prisma.category.create({ data: { name: 'E-Bikes & Scooters', description: 'Urban electric transport, scooters, moped rentals' } });
  const catDrone = await prisma.category.create({ data: { name: 'Drones & Aerial Gear', description: '4K Drones, FPV setups, gimbals, cinema aerial rigs' } });
  const catAudio = await prisma.category.create({ data: { name: 'Audio & Sound Systems', description: 'PA speakers, subwoofers, DJ mixers, stage sound systems' } });
  const catTools = await prisma.category.create({ data: { name: 'Tools & Construction Equipment', description: 'Power tools, generators, lawn care, demolition tools' } });
  const catEvent = await prisma.category.create({ data: { name: 'Event & Party Supplies', description: 'Marquee tents, event lights, staging, party furniture' } });
  const catOutdoor = await prisma.category.create({ data: { name: 'Outdoor & Camping Gear', description: 'Tents, power stations, paddleboards, outdoor gear' } });
  const catGaming = await prisma.category.create({ data: { name: 'Gaming & VR Tech', description: 'VR headsets, gaming rigs, sim racing, party consoles' } });
  const catService = await prisma.category.create({ data: { name: 'Security & Ancillary Services', description: 'Deposits, warranties, insurance' } });

  console.log('✅ 9 Categories created.');

  // 5. Global Attributes & Values
  const brandAttr = await prisma.attribute.create({
    data: {
      name: 'Brand',
      display_type: DisplayType.SELECT,
      values: {
        create: [{ value: 'Sony' }, { value: 'Canon' }, { value: 'Super73' }, { value: 'Segway' }, { value: 'DJI' }, { value: 'DeWalt' }, { value: 'Bose' }, { value: 'Meta' }],
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
  await prisma.rentalPeriod.create({ data: { name: 'Monthly', unit: FeeBasis.MONTHLY, min_duration: 1, max_duration: 12 } });

  // 7. Security Deposit Service Product
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

  // 8. Main Rentable Products (Good items)
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
      name: 'Canon EOS R5 Mirrorless Body',
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

  // 9. Bulk Product Generator (320 Products across 8 Categories - 40 per category)
  console.log('⚡ Generating 320+ realistic catalog products...');

  // 9. Bulk Product Generator (320 Unique Real Products across 8 Categories - 40 per category)
  console.log('⚡ Generating 320 unique realistic catalog products across 8 categories...');

  const categoryTemplates = [
    {
      catId: catCamera.id,
      prefix: 'CAM',
      items: [
        { title: 'Sony FX3 Cinema Camera Kit', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', price: 2500, deposit: 8000 },
        { title: 'Canon EOS R5 Mirrorless Body', img: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80', price: 2200, deposit: 6000 },
        { title: 'RED V-Raptor 8K VV Cinema Camera', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', price: 4500, deposit: 15000 },
        { title: 'ARRI Alexa Mini LF Production Package', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80', price: 6500, deposit: 25000 },
        { title: 'Sony A7 IV Mirrorless Camera Kit', img: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80', price: 1400, deposit: 4000 },
        { title: 'Canon C300 Mark III Cinema Camera', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80', price: 3200, deposit: 9000 },
        { title: 'Blackmagic Pocket Cinema 6K Pro', img: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=80', price: 1200, deposit: 3500 },
        { title: 'Sony FE 24-70mm f/2.8 GM II Lens', img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80', price: 650, deposit: 2000 },
        { title: 'Canon RF 70-200mm f/2.8 L IS USM', img: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80', price: 700, deposit: 2200 },
        { title: 'Sigma 18-35mm f/1.8 DC HSM Art Lens', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', price: 350, deposit: 1000 },
        { title: 'DJI RS 3 Pro Gimbal Stabilizer Combo', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2500 },
        { title: 'Aputure 600d Pro Daylight LED Light', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3000 },
        { title: 'Sony FX6 Full-Frame Cinema Camera', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', price: 3400, deposit: 10000 },
        { title: 'Canon EOS C70 Cinema Camera Body', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80', price: 2800, deposit: 7500 },
        { title: 'RED Komodo 6K Cinema Package', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', price: 3800, deposit: 12000 },
        { title: 'Blackmagic URSA Mini Pro 12K', img: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=80', price: 4200, deposit: 13000 },
        { title: 'Fujifilm GFX 100 II Medium Format', img: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80', price: 3900, deposit: 11000 },
        { title: 'Hasselblad X2D 100C Camera System', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', price: 5200, deposit: 16000 },
        { title: 'Sony FE 70-200mm f/2.8 GM OSS II', img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80', price: 750, deposit: 2400 },
        { title: 'Canon RF 24-70mm f/2.8 L IS USM', img: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80', price: 680, deposit: 2100 },
        { title: 'Sigma 24-70mm f/2.8 DG DN Art Lens', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', price: 420, deposit: 1200 },
        { title: 'DJI Ronin 4D 8K Cinema Camera Combo', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 7200, deposit: 22000 },
        { title: 'Amaran 200d S Daylight LED Monolight', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', price: 320, deposit: 900 },
        { title: 'Nanlite Forza 500 II LED Spotlight', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', price: 950, deposit: 2800 },
        { title: 'Profoto B10X OCF Flash Head Duo', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', price: 1250, deposit: 4000 },
        { title: 'Godox AD600 Pro Witstro Outdoor Flash', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', price: 580, deposit: 1600 },
        { title: 'SmallHD Cine 7 Touchscreen Field Monitor', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80', price: 620, deposit: 1900 },
        { title: 'Teradek Bolt 4K LT 750 Wireless Video', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80', price: 1450, deposit: 4500 },
        { title: 'Atomos Ninja Ultra 5.2" HDR Monitor/Recorder', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80', price: 480, deposit: 1500 },
        { title: 'Sennheiser MKH 416 Shotgun Microphone Kit', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 450, deposit: 1400 },
        { title: 'Sound Devices 833 8-Channel Field Recorder', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6500 },
        { title: 'Rode Wireless PRO Dual Microphone System', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 280, deposit: 800 },
        { title: 'Deity TC-1 Timecode Generator 3-Pack', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 340, deposit: 950 },
        { title: 'Zoom F8n Pro 8-Field Audio Recorder', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 650, deposit: 2000 },
        { title: 'Sachtler Flowtech 75 Carbon Fiber Tripod', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 820, deposit: 2600 },
        { title: 'Easyrig Vario 5 Camera Support System', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 1650, deposit: 5000 },
        { title: 'Matthews C-Stand Grip Kit (4-Pack)', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', price: 260, deposit: 700 },
        { title: 'Dana Dolly Universal Heavy Duty Kit', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 490, deposit: 1400 },
        { title: 'Sony A7S III Full-Frame Camera Kit', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6000 },
        { title: 'Canon RF 15-35mm f/2.8 L IS USM Lens', img: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80', price: 690, deposit: 2100 },
      ]
    },
    {
      catId: catEV.id,
      prefix: 'EV',
      items: [
        { title: 'Super73-S2 Electric Cruiser Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 1500, deposit: 5000 },
        { title: 'Rad Power RadRunner Plus Electric Utility Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 1200, deposit: 4000 },
        { title: 'Segway Ninebot KickScooter Max G30P', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 750, deposit: 2500 },
        { title: 'Onewheel GT All-Terrain Electric Board', img: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: 'Specialized Turbo Vado 4.0 E-Bike', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80', price: 1800, deposit: 6000 },
        { title: 'Apollo City Pro Dual Motor E-Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 900, deposit: 3000 },
        { title: 'Trek Allant+ 7 Lowstep Electric Bike', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', price: 1600, deposit: 5000 },
        { title: 'Super73-RX Moab Special Edition E-Motorbike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 2200, deposit: 7500 },
        { title: 'Dualtron Thunder 2 Extreme Speed E-Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 1500, deposit: 5000 },
        { title: 'Evolve GTR Carbon All-Terrain Skateboard', img: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=800&q=80', price: 950, deposit: 3000 },
        { title: 'Tern GSD S10 Folding Electric Cargo Bike', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80', price: 2400, deposit: 8000 },
        { title: 'Segway SuperScooter GT2 Megatron Edition', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 7000 },
        { title: 'Rad Power RadRover 6 Plus Electric Fat Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 1350, deposit: 4200 },
        { title: 'Specialized Turbo Levo SL Comp E-MTB', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80', price: 2800, deposit: 9000 },
        { title: 'Apollo Phantom V3 Dual-Motor Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 1400, deposit: 4500 },
        { title: 'Trek Rail 9.7 Carbon Electric Mountain Bike', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', price: 3200, deposit: 10000 },
        { title: 'Dualtron Storm Limited 84V E-Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 2900, deposit: 9500 },
        { title: 'Evolve Hadean Bamboo All-Terrain Board', img: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=800&q=80', price: 1250, deposit: 4000 },
        { title: 'Lectric XP 3.0 Long-Range Folding E-Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2800 },
        { title: 'Gazelle Medeo T9 HMB City E-Bike', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', price: 1550, deposit: 5000 },
        { title: 'Aventon Aventure 2 All-Terrain E-Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 1280, deposit: 4000 },
        { title: 'Aventon Pace 500.3 Cruiser E-Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 980, deposit: 3200 },
        { title: 'Riese & Müller Load 75 Vario Cargo Bike', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80', price: 3800, deposit: 12000 },
        { title: 'Sur-Ron Light Bee X Electric Off-Road Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 2600, deposit: 8500 },
        { title: 'Talaria Sting R MX4 Electric Dirt Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 2750, deposit: 8800 },
        { title: 'NIU KQi3 Max Extended-Range E-Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 680, deposit: 2200 },
        { title: 'InMotion V12 HT Electric Unicycle', img: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=800&q=80', price: 1450, deposit: 4500 },
        { title: 'Kaabo Wolf King GTR Extreme Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 2300, deposit: 7500 },
        { title: 'Nami Burn-E 2 Max High Performance Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 2500, deposit: 8000 },
        { title: 'Zero 10X Dual Motor All-Terrain Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 1150, deposit: 3800 },
        { title: 'Razor EcoSmart Metro HD Sit-Down Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 520, deposit: 1600 },
        { title: 'Swagtron EB-6 Fat Tire Off-Road E-Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 780, deposit: 2400 },
        { title: 'GoTrax G4 Adult Commuter E-Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 480, deposit: 1500 },
        { title: 'Hiboy S2 Pro Electric Scooter with Seat', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 510, deposit: 1600 },
        { title: 'Yadea KS5 Pro Smart Electric Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 590, deposit: 1800 },
        { title: 'Okai Neon Pro Light-Up E-Scooter', img: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80', price: 640, deposit: 2000 },
        { title: 'Fiido T1 Utility Cargo E-Bike 750W', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: 'Priority Current E-Bike Mid-Drive Belt', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', price: 1750, deposit: 5500 },
        { title: 'Blix Packa Genie Dual Battery Cargo Bike', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80', price: 1950, deposit: 6000 },
        { title: 'Serial 1 RUSH/CTY Speed Harley E-Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', price: 2450, deposit: 7800 },
      ]
    },
    {
      catId: catDrone.id,
      prefix: 'DRONE',
      items: [
        { title: 'DJI Inspire 3 8K RAW Cinema Drone Package', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 5500, deposit: 20000 },
        { title: 'DJI Mavic 3 Enterprise Thermal Drone (M3T)', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 3800, deposit: 12000 },
        { title: 'DJI Avata 2 FPV Drone Fly More Combo', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 1300, deposit: 4000 },
        { title: 'Autel Robotics EVO II Dual 640T Rugged Bundle', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 2900, deposit: 9000 },
        { title: 'DJI Air 3 Fly More Combo with RC 2', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: 'DJI Goggles 3 FPV Headset System', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 450, deposit: 1500 },
        { title: 'DJI Matrice 300 RTK Industrial Survey Drone', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 7500, deposit: 25000 },
        { title: 'Freefly Alta X Cinema Heavy-Lift Rig', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 9000, deposit: 30000 },
        { title: 'Skydio 2+ Autonomous Cinema Drone Kit', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6000 },
        { title: 'Flyability Elios 3 Indoor Inspection Drone', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 8200, deposit: 28000 },
        { title: 'DJI Mavic 3 Pro Cine Premium Combo', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 2400, deposit: 7500 },
        { title: 'DJI Mini 4 Pro Fly More Combo RC 2', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2600 },
        { title: 'DJI Matrice 350 RTK Enterprise Drone', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 8800, deposit: 28000 },
        { title: 'DJI Matrice 30T Thermal Inspection Rig', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 6800, deposit: 22000 },
        { title: 'Autel EVO Lite+ 6K Premium Bundle', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 1250, deposit: 4000 },
        { title: 'Skydio X2D Recon Thermal Tactical Drone', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 9500, deposit: 30000 },
        { title: 'DJI Zenmuse H20T Thermal Camera Payload', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 3200, deposit: 10000 },
        { title: 'DJI Zenmuse L2 LiDAR Surveying Payload', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 4100, deposit: 13000 },
        { title: 'GEPRC CineLog35 V2 HD O3 FPV Drone', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 620, deposit: 1800 },
        { title: 'iFlight Defender 25 O3 FPV Cinewhoop', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 540, deposit: 1600 },
        { title: 'TBS Tango 2 Pro FPV Radio Controller', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 290, deposit: 800 },
        { title: 'RadioMaster TX16S MKII Radio Transmitter', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 310, deposit: 900 },
        { title: 'DJI Agras T40 Agriculture Spraying Drone', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 12500, deposit: 35000 },
        { title: 'Parrot Anafi USA GOV Thermal Security Drone', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', price: 4800, deposit: 15000 },
        { title: 'Yuneec Typhoon H Plus Hexacopter 4K', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', price: 1850, deposit: 6000 },
        { title: 'PowerVision PowerEgg X Wizard Waterproof Drone', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 920, deposit: 2800 },
        { title: 'SwellPro SplashDrone 4 Waterproof Fishing Rig', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 1400, deposit: 4200 },
        { title: 'BetaFPV Pavo25 V2 Brushless Whoop', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 380, deposit: 1100 },
        { title: 'Lumenier QAV-S 5" JohnnyFPV Special Edition', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 680, deposit: 2000 },
        { title: 'Emax Tinyhawk III Plus FPV RTF Bundle', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 320, deposit: 900 },
        { title: 'Holy Stone HS720G 4K EIS Drone', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 340, deposit: 1000 },
        { title: 'Potensic Atom 4K 3-Axis Gimbal Drone', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 360, deposit: 1100 },
        { title: 'Hubsan Zino Mini Pro 4K HDR Drone', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 490, deposit: 1400 },
        { title: 'DJI RC Pro Enterprise Smart Remote', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3300 },
        { title: 'FlySight 5.8GHz FPV Diversity Monitor', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 210, deposit: 600 },
        { title: 'Foxeer Wildfire 5.8GHz Receiver Module', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 130, deposit: 400 },
        { title: 'Eachine E520S GPS 4K Drone Kit', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 180, deposit: 500 },
        { title: 'Wingsland S6 Pocket 4K Selfie Drone', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 220, deposit: 650 },
        { title: 'Walkera F210 3D Racing Drone Package', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 420, deposit: 1200 },
        { title: 'Snaptain SP7100 4K Foldable Drone', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80', price: 260, deposit: 750 },
      ]
    },
    {
      catId: catAudio.id,
      prefix: 'AUD',
      items: [
        { title: 'QSC K12.2 Active 2000-Watt Powered Loudspeaker', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2500 },
        { title: 'JBL PRX818XLFW 18" 1500W Powered Subwoofer', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: 'Pioneer DJ OPUS-QUAD All-in-One DJ System', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 2800, deposit: 9000 },
        { title: 'Pioneer DJ CDJ-3000 Multi Player Duo', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', price: 3200, deposit: 10000 },
        { title: 'Shure ULXD4D Dual Wireless Receiver System', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 1400, deposit: 4500 },
        { title: 'Behringer X32 40-Input Digital Mixer System', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 1900, deposit: 6000 },
        { title: 'Electro-Voice EVOLVE 50M Column Speaker System', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', price: 1200, deposit: 4000 },
        { title: 'Sennheiser G4 Wireless In-Ear Monitor Rack Kit', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 1600, deposit: 5000 },
        { title: 'Yamaha DXR15mkII 1100W 15" Powered Speaker', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 900, deposit: 2800 },
        { title: 'Soundcraft Vi1000 Digital Live Sound Console', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 4200, deposit: 14000 },
        { title: 'QSC KS118 3600-Watt 18" Subwoofer', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', price: 1350, deposit: 4200 },
        { title: 'JBL SRX835P 15" 3-Way Powered Loudspeaker', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 1450, deposit: 4500 },
        { title: 'Pioneer DJ DJM-A9 4-Channel Professional Mixer', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 2300, deposit: 7500 },
        { title: 'Shure Axient Digital AD4Q Quad Receiver', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 3800, deposit: 12000 },
        { title: 'Allen & Heath SQ-7 48-Channel Digital Console', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 3100, deposit: 9500 },
        { title: 'Bose S1 Pro+ Battery Powered PA System', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 680, deposit: 2200 },
        { title: 'Bose L1 Pro16 Portable Line Array System', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', price: 1750, deposit: 5500 },
        { title: 'Electro-Voice ZLX-15BT 1000W Bluetooth Speaker', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 580, deposit: 1800 },
        { title: 'PreSonus StudioLive 32SC Digital Mixer', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6500 },
        { title: 'Neumann U 87 Ai Large-Diaphragm Condenser Mic', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 1200, deposit: 4000 },
        { title: 'Neumann KM 184 Small-Diaphragm Stereo Pair Mics', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 780, deposit: 2500 },
        { title: 'Royer R-121 Studio Ribbon Microphone', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 690, deposit: 2200 },
        { title: 'AKG C414 XLS Reference Condenser Mic Pair', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: 'Rode Rodecaster Pro II Audio Production Studio', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 650, deposit: 2000 },
        { title: 'Yamaha HS8 8" Active Studio Monitor Pair', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 620, deposit: 1900 },
        { title: 'Genelec 8040B Active Studio Monitor Pair', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 1850, deposit: 6000 },
        { title: 'RCF EVOX J8 Active Column PA System', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', price: 980, deposit: 3000 },
        { title: 'LD Systems Maui 28 G2 Compact Column System', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', price: 1050, deposit: 3300 },
        { title: 'Turbosound iNSPIRE iP2000 Powered Column', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', price: 820, deposit: 2600 },
        { title: 'Mackie Thump215 1400W 15" Powered Speaker', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 420, deposit: 1300 },
        { title: 'Radial J48 Active Direct Box 2-Pack', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 240, deposit: 700 },
        { title: 'Cloud Microphones Cloudlifter CL-2 Mic Activator', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 190, deposit: 550 },
        { title: 'Universal Audio Apollo x8p Thunderbolt Interface', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 2700, deposit: 8500 },
        { title: 'Focusrite Scarlett 18i20 4th Gen USB Audio Interface', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 580, deposit: 1800 },
        { title: 'Midas M32R LIVE 40-Input Digital Console', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 2800, deposit: 8800 },
        { title: 'KV2 Audio EX10 Compact 2-Way Active System', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 2150, deposit: 6800 },
        { title: 'Yorkville Synergy SA152 3000W Powered Top', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 1650, deposit: 5200 },
        { title: 'Chauvet DJ BBOY Wireless Audio System', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 380, deposit: 1100 },
        { title: 'Sennheiser e 935 Handheld Dynamic Mic (4-Pack)', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 340, deposit: 1000 },
        { title: 'Shure SM7B Vocal Dynamic Microphone Trio', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', price: 640, deposit: 2000 },
      ]
    },
    {
      catId: catTools.id,
      prefix: 'TOOL',
      items: [
        { title: 'Honda EU3000is Super Quiet Inverter Generator', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 1200, deposit: 4000 },
        { title: 'Simpson 4400 PSI Commercial Gas Pressure Washer', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 950, deposit: 3000 },
        { title: 'Hilti TE 3000-AVR Heavy Demolition Breaker Hammer', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 1800, deposit: 6000 },
        { title: 'DeWalt 12" Double-Bevel Sliding Compound Miter Saw', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 600, deposit: 2000 },
        { title: 'Husqvarna 450 Rancher 20" Gas Chainsaw', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 500, deposit: 1500 },
        { title: 'Kushlan 6 cu. ft. Portable Cement Mixer', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 800, deposit: 2500 },
        { title: 'Bosch GRL1000-20HV Self-Leveling Rotary Laser Level', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 700, deposit: 2200 },
        { title: 'Bostitch 3-Tool Portable Air Compressor Combo Kit', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 450, deposit: 1400 },
        { title: 'Makita HM1812 70 lb. Advanced AVT Breaker Hammer', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 1600, deposit: 5000 },
        { title: 'Toro TimeMaster 30" Self-Propelled Gas Lawn Mower', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 750, deposit: 2400 },
        { title: 'Honda EU7000is EFI Fuel-Injected Inverter Generator', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 2400, deposit: 7500 },
        { title: 'Hilti DD 150-U Diamond Core Drilling Rig', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6800 },
        { title: 'DeWalt 20V MAX 9-Tool Cordless Combo Kit', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 780, deposit: 2400 },
        { title: 'Husqvarna K 770 14" Concrete Cut-Off Saw', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: 'Multiquip Mikasa 20" Plate Compactor', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 1250, deposit: 4000 },
        { title: 'Wacker Neuson BS60-4AS Trench Rammer', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 1450, deposit: 4500 },
        { title: 'Generac GP17500E 17.5kW Commercial Generator', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 2900, deposit: 9000 },
        { title: 'Cat RP12000E 12kW Heavy Duty Generator', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 2200, deposit: 7000 },
        { title: 'Dri-Eaz Revolution LGR Commercial Dehumidifier', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2600 },
        { title: 'Milwaukee MX FUEL Equipment Demolition Breaker', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 2300, deposit: 7200 },
        { title: 'Milwaukee M18 FUEL 8-1/4" Table Saw Kit', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 680, deposit: 2100 },
        { title: 'Stihl TS 420 14" Gas Cut-Off Saw', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 1150, deposit: 3600 },
        { title: 'Kubota K008-3 Ultra-Compact Excavator', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 4500, deposit: 15000 },
        { title: 'Bobcat S70 Mini Skid-Steer Loader', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 4800, deposit: 16000 },
        { title: 'JLG 1930ES 19 ft. Electric Scissor Lift', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 3200, deposit: 10000 },
        { title: 'Genie TZ-34/20 Towable Boom Lift 34 ft.', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 3900, deposit: 12500 },
        { title: 'Billy Goat Outback 24" Self-Propelled Brush Cutter', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 920, deposit: 2900 },
        { title: 'Bluebird F200 Commercial Sod Cutter', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 880, deposit: 2700 },
        { title: 'Vermeer SC30TX Walk-Behind Stump Grinder', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6500 },
        { title: 'Barreto 1324D 13HP Hydraulic Tiller', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 950, deposit: 3000 },
        { title: 'Ground Hog C-71-5 2-Man Hydraulic Earth Auger', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 780, deposit: 2400 },
        { title: 'Ditch Witch C16X Walk-Behind Trencher', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 2200, deposit: 7000 },
        { title: 'Karcher HDS 3.5/30 Hot Water Pressure Washer', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 1850, deposit: 5800 },
        { title: 'Tennant T300 Walk-Behind Floor Scrubber', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 1650, deposit: 5000 },
        { title: 'Ridge Tool 535 Automatic Pipe Threading Machine', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 1950, deposit: 6000 },
        { title: 'Airman PDS185S 185 CFM Towable Air Compressor', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 3400, deposit: 11000 },
        { title: 'Multiquip DCA70SSJU 70kVA Ultra-Quiet Generator', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', price: 5500, deposit: 18000 },
        { title: 'Little Giant Revolution 24 ft. Multi-Position Ladder', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 310, deposit: 900 },
        { title: 'Sunbelt Commercial Air Mover Blower 4-Pack', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 280, deposit: 800 },
        { title: 'DeWalt 20V MAX Cordless Threaded Rod Cutter', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', price: 340, deposit: 1000 },
      ]
    },
    {
      catId: catEvent.id,
      prefix: 'EVENT',
      items: [
        { title: 'Commercial High-Peak Frame Party Tent (20x40 ft)', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 3500, deposit: 10000 },
        { title: 'Modular Portable Stage System (16x20 ft with Stairs)', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', price: 2800, deposit: 8000 },
        { title: 'Chauvet DJ GigBAR Move 5-in-1 Lighting System', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 950, deposit: 3000 },
        { title: 'Antari Z-1500 II Heavy Duty Fog Machine', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', price: 450, deposit: 1500 },
        { title: 'Epson Pro EX10000 3LCD Full HD Wireless Projector', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: '120-Inch Outdoor Inflatable Movie Screen & Blower', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80', price: 650, deposit: 2000 },
        { title: 'Commercial Stainless Steel Outdoor Patio Heater (Set of 4)', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 1200, deposit: 4000 },
        { title: 'White Resin Folding Wedding Chairs (Set of 50)', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', price: 1500, deposit: 4500 },
        { title: 'Sephra Commercial Chocolate Fountain Rig', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 800, deposit: 2500 },
        { title: 'LED Illuminated Cocktail Bar Counter Setup', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6500 },
        { title: 'Clear Span Wedding Frame Tent (30x60 ft)', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 5800, deposit: 18000 },
        { title: 'Chauvet DJ Intimidator Spot 260 Moving Head', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 780, deposit: 2400 },
        { title: 'Antari ICE-100 Low-Lying Ice Fogger', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', price: 560, deposit: 1700 },
        { title: 'Panasonic PT-MZ880 8000-Lumen WUXGA Laser Projector', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80', price: 3200, deposit: 10000 },
        { title: 'Chiavari Gold Banquet Chairs (Set of 50)', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', price: 1800, deposit: 5500 },
        { title: '60-Inch Round Wood Banquet Tables (Set of 10)', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', price: 1250, deposit: 3800 },
        { title: 'Commercial Concession Cotton Candy Machine & Cart', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 420, deposit: 1200 },
        { title: 'Commercial 8 oz. Popcorn Machine with Cart', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 380, deposit: 1100 },
        { title: 'Crown Verity 60" Commercial Outdoor Gas Grill', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 1950, deposit: 6000 },
        { title: 'Dunk Tank Carnival Event Game Rental', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: 'Inflatable Commercial Bounce House & Slide Combo', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 1450, deposit: 4500 },
        { title: 'Inflatable 40 ft. Twin-Lane Obstacle Course', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 2300, deposit: 7000 },
        { title: 'Silent Disco 100-Headphone & 3-Transmitter Kit', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 1650, deposit: 5000 },
        { title: 'Chauvet DJ Cumulus Heavy Low-Lying Fogger', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', price: 920, deposit: 2800 },
        { title: 'ADJ Focus Spot 4Z 200W LED Moving Head', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2600 },
        { title: 'Astera Titan Tube Wireless LED (8-Tube Charging Case)', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 2400, deposit: 7500 },
        { title: 'Ape Labs LightCan Wireless LED Uplights (12-Pack)', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3400 },
        { title: 'Global Truss F34 Square Truss Arch Kit 10x10', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', price: 1350, deposit: 4000 },
        { title: 'Black Velvet Pipe and Drape Backdrop (10x20 ft)', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 480, deposit: 1400 },
        { title: 'DJ Booth Truss Facade Table System', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', price: 620, deposit: 1800 },
        { title: 'Catering Stainless Steel Chafing Dish Buffet Set (8-Pack)', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 540, deposit: 1600 },
        { title: 'Beverage Fountain Tower 5-Gallon Illuminated', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 320, deposit: 950 },
        { title: 'Commercial Dual Slushie Frozen Drink Machine', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 880, deposit: 2700 },
        { title: 'Dance Floor Wood Grain Snap Lock (16x16 ft)', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', price: 1750, deposit: 5200 },
        { title: 'Red Carpet Stanchions & Velvet Ropes Set', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', price: 340, deposit: 1000 },
        { title: 'Cold Spark Fireworks Machine Pair (Indoor Safe)', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 1250, deposit: 3800 },
        { title: 'Confetti Cannon Dual-Launcher DMX System', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 490, deposit: 1400 },
        { title: 'Bubble Tron XL High Output Bubble Machine', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', price: 290, deposit: 850 },
        { title: 'Outdoor Mobile LED Video Wall (8x5 ft P3.9)', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80', price: 4800, deposit: 15000 },
        { title: 'Photo Booth Kiosk Stand with DSLR & Dye-Sub Printer', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6500 },
      ]
    },
    {
      catId: catOutdoor.id,
      prefix: 'OUTDOOR',
      items: [
        { title: 'Jackery Explorer 2000 Pro Solar Generator Set', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 1400, deposit: 4500 },
        { title: 'iROCKER ALL-AROUND 11\' Inflatable Paddleboard', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', price: 650, deposit: 2000 },
        { title: 'REI Co-op Wonderland 6 Tent', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 550, deposit: 1800 },
        { title: 'YETI Tundra 65 Hard Cooler', img: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80', price: 400, deposit: 1200 },
        { title: 'Celestron NexStar 8SE Computerized Telescope', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80', price: 1200, deposit: 4000 },
        { title: 'Perception Pescador Pro 12 Tandem Kayak', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2800 },
        { title: 'Thule Motion XT XXL Rooftop Cargo Box', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 700, deposit: 2200 },
        { title: 'Tentsile Stingray 3-Person Tree Tent', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 600, deposit: 2000 },
        { title: 'Bluetti AC200MAX Expandable Power Station', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 1550, deposit: 5000 },
        { title: 'Almost Heaven 4-Person Outdoor Wood Sauna', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 3800, deposit: 12000 },
        { title: 'Jackery SolarSaga 200W Folding Solar Panels (4-Pack)', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 820, deposit: 2500 },
        { title: 'Red Paddle Co 12\'6" Sport Inflatable SUP', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', price: 780, deposit: 2400 },
        { title: 'MSR Hubba Hubba LT 2-Person Backpacking Tent', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 480, deposit: 1500 },
        { title: 'YETI V Series Stainless Steel Insulated Cooler', img: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80', price: 680, deposit: 2100 },
        { title: 'Meade LX90-ACF 10" Computerized Telescope', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80', price: 1950, deposit: 6000 },
        { title: 'Hobie Mirage Compass Pedal Drive Kayak', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', price: 1650, deposit: 5000 },
        { title: 'Yakima SkyBox 16 Carbonite Roof Cargo Box', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 620, deposit: 1900 },
        { title: 'Tentsile Universe 5-Person Floating Tree Tent', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3400 },
        { title: 'Bluetti EP500 Pro 5120Wh Home Solar Battery', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 3400, deposit: 10500 },
        { title: 'Barrel Outdoor Red Cedar Sauna 6-Person', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 4500, deposit: 14000 },
        { title: 'Kamp-Rite Double Tent Cot with Rainfly', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 420, deposit: 1300 },
        { title: 'NEMO Stargaze Reclining Luxury Camp Chair Pair', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 360, deposit: 1100 },
        { title: 'BioLite FirePit+ Smokeless Wood & Charcoal Pit', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 320, deposit: 950 },
        { title: 'Solo Stove Yukon 27" Stainless Fire Pit', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 540, deposit: 1600 },
        { title: 'Primus Profile Dual High-Output Camp Stove', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 210, deposit: 600 },
        { title: 'Camp Chef Everest 2X 20,000 BTU Camp Stove', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 240, deposit: 700 },
        { title: 'Garmin inReach Mini 2 Satellite Communicator', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80', price: 410, deposit: 1200 },
        { title: 'FLIR Scout TK Pocket Thermal Vision Monocular', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80', price: 640, deposit: 1900 },
        { title: 'Swarovski EL 10x42 WB FieldPro Binoculars', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80', price: 2200, deposit: 7000 },
        { title: 'Bushnell Pro XE Golf Laser Rangefinder', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80', price: 490, deposit: 1400 },
        { title: 'Sea Eagle 370 Inflatable Kayak 3-Person Set', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', price: 450, deposit: 1300 },
        { title: 'Oru Kayak Beach LT Folding Kayak', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', price: 920, deposit: 2800 },
        { title: 'Aquaglide Cirrus 110 Ultralight Inflatable Kayak', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', price: 840, deposit: 2500 },
        { title: 'Eureka! Copper Canyon LX 8-Person Cabin Tent', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 390, deposit: 1100 },
        { title: 'Exped MegaMat 10 LXW Insulated Pad Pair', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 310, deposit: 900 },
        { title: 'Coleman Quad Pro 800-Lumen LED Panel Lantern', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 140, deposit: 400 },
        { title: 'Dometic CFX3 75DZX Dual-Zone Electric Cooler', img: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80', price: 1150, deposit: 3500 },
        { title: 'Traeger Ranger Portable Wood Pellet Grill', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 480, deposit: 1400 },
        { title: 'Front Runner Slimline II Roof Rack Kit', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 890, deposit: 2600 },
        { title: 'Napier Backroadz SUV Truck Tent Package', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', price: 280, deposit: 800 },
      ]
    },
    {
      catId: catGaming.id,
      prefix: 'GAME',
      items: [
        { title: 'Meta Quest 3 512GB VR Headset Package', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2500 },
        { title: 'PlayStation VR2 Headset & Horizon Bundle', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', price: 750, deposit: 2200 },
        { title: 'Logitech G PRO Racing Wheel & Pedal Rig System', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 1600, deposit: 5000 },
        { title: 'Alienware m18 R2 RTX 4090 Gaming Laptop', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 2500, deposit: 8000 },
        { title: 'Arcade1Up Street Fighter II 3/4 Scale Cabinet', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', price: 900, deposit: 3000 },
        { title: 'Nintendo Switch OLED 4-Player Party Bundle', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80', price: 600, deposit: 1800 },
        { title: 'Thrustmaster HOTAS Warthog Flight Simulator Rig', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 1200, deposit: 4000 },
        { title: 'Steam Deck OLED 1TB Handheld Gaming Rig', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 700, deposit: 2000 },
        { title: 'Asus ROG Ally Z1 Extreme Handheld Console', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 750, deposit: 2200 },
        { title: 'Logitech G Flight Yoke & Rudder Pedals System', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3500 },
        { title: 'Meta Quest Pro Enterprise VR Headset', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 1350, deposit: 4200 },
        { title: 'HTC VIVE XR Elite Convertible VR System', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 1250, deposit: 3800 },
        { title: 'Varjo XR-3 Mixed Reality Professional Headset', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 5800, deposit: 18000 },
        { title: 'Fanatec GT DD Pro Direct Drive Wheel Rig', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 2100, deposit: 6500 },
        { title: 'Next Level Racing GTTrack Simulator Cockpit', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 1450, deposit: 4500 },
        { title: 'ASUS ROG Strix SCAR 18 i9 RTX 4090 Laptop', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 2800, deposit: 9000 },
        { title: 'Arcade1Up NBA Jam 4-Player Cabinet with Stool', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', price: 980, deposit: 3100 },
        { title: 'Nintendo Switch Sports Family Deluxe Pack', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80', price: 640, deposit: 1900 },
        { title: 'HoneyComb Alpha Flight Controls Yoke & Switch Panel', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 580, deposit: 1700 },
        { title: 'Lenovo Legion Go 8.8" QHD Gaming Handheld', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 780, deposit: 2300 },
        { title: 'MSI Titan GT77 HX Gaming Laptop Monster', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 3400, deposit: 11000 },
        { title: 'Razer Blade 18 i9 RTX 4090 Gaming Workstation', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 3200, deposit: 10000 },
        { title: 'Sony PlayStation 5 Slim 4-Controller Party Station', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', price: 850, deposit: 2600 },
        { title: 'Xbox Series X Console + Game Pass Ultimate Station', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', price: 820, deposit: 2500 },
        { title: 'Stern Godzilla Pro Arcade Pinball Machine', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', price: 6500, deposit: 20000 },
        { title: 'Stern Star Wars Home Edition Pinball Machine', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', price: 4200, deposit: 13000 },
        { title: 'Turtle Beach VelocityOne Flightstick System', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 290, deposit: 850 },
        { title: 'Playseat Challenge Folding Cockpit Chair', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 350, deposit: 1000 },
        { title: 'ASTRO Gaming A50 Wireless + Base Station Gen 4', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', price: 320, deposit: 950 },
        { title: 'SteelSeries Arctis Nova Pro Wireless Headset', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', price: 370, deposit: 1100 },
        { title: 'LG UltraGear 45" Curved OLED 240Hz Gaming Monitor', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 1400, deposit: 4200 },
        { title: 'Samsung Odyssey Ark 55" 4K Curved Gaming Screen', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 2400, deposit: 7500 },
        { title: 'BenQ ZOWIE XL2566K 360Hz Esports Gaming Monitor', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 680, deposit: 2000 },
        { title: 'Elgato Stream Deck XL 32-Key Studio Controller', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', price: 260, deposit: 750 },
        { title: 'Razer BlackWidow V4 Pro RGB Mechanical Keyboard', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 230, deposit: 650 },
        { title: 'Logitech G PRO X SUPERLIGHT 2 Wireless Mouse', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', price: 160, deposit: 450 },
        { title: 'HTC VIVE Tracker 3.0 Full Body Motion 3-Pack', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 420, deposit: 1200 },
        { title: 'KAT Walk C 2 VR Omni-Directional Treadmill', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 1950, deposit: 6000 },
        { title: 'FeelVR 2DOF Motion Simulator Cockpit Platform', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', price: 3200, deposit: 9500 },
        { title: 'Valve Index VR Full Hardware Kit + Base Stations', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80', price: 1100, deposit: 3300 },
      ]
    }
  ];

  const productsToCreate = [];
  let productCounter = 10;

  for (const cat of categoryTemplates) {
    for (let i = 0; i < cat.items.length; i++) {
      const baseItem = cat.items[i];
      const vendorId = vendors[productCounter % vendors.length];
      const skuStr = `${cat.prefix}-${(productCounter).toString().padStart(4, '0')}`;
      
      productsToCreate.push({
        vendor_id: vendorId,
        category_id: cat.catId,
        name: baseItem.title,
        description: `High-quality commercial rental gear: ${baseItem.title}. Inspected, sanitized, and fully maintained for events, production, or personal use.`,
        product_type: ProductType.GOODS,
        sku: skuStr,
        stock_qty: 3 + (productCounter % 8),
        sales_price: baseItem.price,
        cost_price: Math.round(baseItem.price * 0.4),
        is_published: true,
        pickup_time: '09:00',
        return_time: '18:00',
        late_fee_per_unit: Math.round(baseItem.price * 0.2),
        security_deposit_amount: baseItem.deposit,
        image_urls: JSON.stringify([baseItem.img]),
      });

      productCounter++;
    }
  }

  // Insert in batches of 50 to maximize speed
  const BATCH_SIZE = 50;
  for (let i = 0; i < productsToCreate.length; i += BATCH_SIZE) {
    const batch = productsToCreate.slice(i, i + BATCH_SIZE);
    await prisma.product.createMany({
      data: batch,
    });
  }

  const totalProductCount = await prisma.product.count();
  console.log(`✅ Seeded catalog. Total products in database: ${totalProductCount}`);

  // 10. Pricelists & Rules
  await prisma.pricelist.create({
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

  await prisma.pricelist.create({
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

  // 11. Late Fee Rules
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

  // 12. Coupons (5 Active Promo Codes)
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

  await prisma.coupon.create({
    data: {
      code: 'WELCOME20',
      discount_type: DiscountType.PERCENT,
      discount_value: 20,
      valid_from: new Date('2026-01-01'),
      valid_to: new Date('2027-12-31'),
      usage_limit: 1000,
      times_used: 45,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'FREEDELIVERY',
      discount_type: DiscountType.FIXED,
      discount_value: 300,
      valid_from: new Date('2026-01-01'),
      valid_to: new Date('2027-12-31'),
      usage_limit: 250,
      times_used: 18,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'SUMMER50',
      discount_type: DiscountType.PERCENT,
      discount_value: 15,
      valid_from: new Date('2026-01-01'),
      valid_to: new Date('2027-12-31'),
      usage_limit: 300,
      times_used: 8,
    },
  });

  // 13. Quotation Templates
  await prisma.quotationTemplate.create({
    data: {
      vendor_id: vendorUser1.vendor_profile!.id,
      name: 'Standard Cinema Equipment Terms',
      terms_text: 'Equipment must be inspected upon pickup. Any damage or late return will be charged to the security deposit.',
      validity_days: 14,
      payment_terms_pct: 100,
    },
  });

  // 14. Sample Orders & Payments (30 Realistic Orders Across All States)
  console.log('⚡ Generating 30 sample orders, payments, and invoices...');

  const now = new Date();

  for (let i = 1; i <= 30; i++) {
    const cust = customers[i % customers.length];
    const vendId = vendors[i % vendors.length];
    const daysOffset = (i % 7) - 3; // spread dates past and future
    
    const pickupDate = new Date(now);
    pickupDate.setDate(now.getDate() + daysOffset);

    const returnDate = new Date(pickupDate);
    returnDate.setDate(pickupDate.getDate() + 3 + (i % 4));

    let state = 'SALES_ORDER';
    let isLate = false;
    let actualReturn = null;

    if (daysOffset < -2) {
      state = 'RETURNED';
      actualReturn = returnDate;
    } else if (daysOffset < 0) {
      state = 'PICKED_UP';
      if (i % 3 === 0) {
        isLate = true;
      }
    } else if (i % 5 === 0) {
      state = 'QUOTATION';
    }

    const itemPrice = 1200 + (i * 150);
    const orderTotal = itemPrice * 3;

    const createdOrder = await prisma.order.create({
      data: {
        customer_id: cust.id,
        vendor_id: vendId,
        state: state,
        scheduled_pickup_at: pickupDate,
        scheduled_return_at: returnDate,
        actual_return_at: actualReturn,
        is_late: isLate,
        total_amount: orderTotal,
        created_at: new Date(now.getTime() - (i * 86400000)),
        order_items: {
          create: [
            {
              product_id: i % 2 === 0 ? prod1.id : prod2.id,
              quantity: 1 + (i % 2),
              unit_price: itemPrice,
              line_total: orderTotal,
            },
          ],
        },
        payments: {
          create: [
            {
              amount: orderTotal,
              type: 'RENTAL',
              status: 'COMPLETED',
              method: i % 2 === 0 ? 'CREDIT_CARD' : 'UPI',
              transaction_ref: `TXN-${90000 + i}`,
            },
            {
              amount: 5000,
              type: 'DEPOSIT',
              status: 'COMPLETED',
              method: 'CREDIT_CARD',
              transaction_ref: `DEP-${90000 + i}`,
            },
          ],
        },
        invoices: {
          create: [
            {
              invoice_number: `INV-2026-${i.toString().padStart(3, '0')}`,
              status: state === 'RETURNED' ? 'PAID' : 'POSTED',
            },
          ],
        },
      },
    });

    // Seed Wishlist & Notifications for test customer
    if (i <= 5) {
      await prisma.wishlist.create({
        data: {
          customer_id: cust.id,
          product_id: i % 2 === 0 ? prod1.id : prod3.id,
        },
      }).catch(() => {});

      await prisma.notification.create({
        data: {
          user_id: cust.id,
          type: 'ORDER_STATUS_CHANGED',
          channel: 'IN_APP',
          payload: JSON.stringify({ orderId: createdOrder.id, state: state }),
          status: 'UNREAD',
        },
      });
    }
  }

  // 15. Contact Messages
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Sarah Connor',
        email: 'sarah@skynet-test.com',
        topic: 'Corporate Equipment Rental Inquiry',
        message: 'Hi, we would like to rent 10 RED cinema camera rigs for an upcoming 3-month feature film shoot in California.',
        status: 'UNREAD',
      },
      {
        name: 'Michael Scott',
        email: 'mscott@dundermifflin.com',
        topic: 'Event Staging & Lighting',
        message: 'Looking for marquee tents and sound systems for our annual Dundies award ceremony.',
        status: 'UNREAD',
      },
    ],
  });

  const totalUserCount = await prisma.user.count();
  const totalOrderCount = await prisma.order.count();
  const totalInvoiceCount = await prisma.invoice.count();

  console.log(`✅ Users count: ${totalUserCount}`);
  console.log(`✅ Orders count: ${totalOrderCount}`);
  console.log(`✅ Invoices count: ${totalInvoiceCount}`);
  console.log(`🎉 Finished seeding! Total products in database: ${totalProductCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
