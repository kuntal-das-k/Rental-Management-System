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

  const categoryTemplates = [
    {
      catId: catCamera.id,
      prefix: 'CAM',
      items: [
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
      ]
    },
    {
      catId: catEV.id,
      prefix: 'EV',
      items: [
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
      ]
    }
  ];

  const productsToCreate = [];
  let productCounter = 10;

  for (const cat of categoryTemplates) {
    for (let variant = 1; variant <= 4; variant++) {
      for (let i = 0; i < cat.items.length; i++) {
        const baseItem = cat.items[i];
        const vendorId = vendors[productCounter % vendors.length];
        const variantTag = variant === 1 ? '' : ` (Edition ${variant})`;
        const skuStr = `${cat.prefix}-${(productCounter).toString().padStart(4, '0')}`;
        
        productsToCreate.push({
          vendor_id: vendorId,
          category_id: cat.catId,
          name: `${baseItem.title}${variantTag}`,
          description: `High-quality commercial rental gear: ${baseItem.title}. Inspected, sanitized, and fully maintained for events, production, or personal use.`,
          product_type: ProductType.GOODS,
          sku: skuStr,
          stock_qty: 3 + (productCounter % 8),
          sales_price: baseItem.price + (variant * 50),
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
