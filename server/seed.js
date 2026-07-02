/**
 * Seed Script for Bike Auction Platform
 *
 * Creates:
 * - 1 admin user
 * - 2 sample bikes with realistic motorcycle data
 * - 2 sample auctions (one upcoming, one active)
 *
 * Usage: node seed.js
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const User = require('./models/User');
const Bike = require('./models/Bike');
const Auction = require('./models/Auction');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Bike.deleteMany({});
    await Auction.deleteMany({});
    console.log('Existing data cleared.');

    // ─── Create Admin User ──────────────────────────────────────────
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@bikeauction.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin user created: ${admin.email} (password: admin123)`);

    // ─── Create Sample Bikes ────────────────────────────────────────
    const bike1 = await Bike.create({
      name: 'Yamaha YZF-R1 2023',
      brand: 'Yamaha',
      model: 'YZF-R1',
      year: 2023,
      description:
        'The Yamaha YZF-R1 is a legendary superbike featuring a 998cc crossplane inline-four engine, ' +
        'producing 200 HP. Equipped with a 6-axis IMU, traction control, slide control, and lift control. ' +
        'This race-bred machine delivers unmatched performance on both track and street.',
      startingPrice: 17999,
      images: [
        'https://picsum.photos/seed/yamaha-r1-1/800/600',
        'https://picsum.photos/seed/yamaha-r1-2/800/600',
        'https://picsum.photos/seed/yamaha-r1-3/800/600',
      ],
      createdBy: admin._id,
    });

    const bike2 = await Bike.create({
      name: 'Ducati Panigale V4 S 2024',
      brand: 'Ducati',
      model: 'Panigale V4 S',
      year: 2024,
      description:
        'The Ducati Panigale V4 S is the pinnacle of Italian superbike engineering. Powered by a 1,103cc ' +
        'Desmosedici Stradale V4 engine producing 215.5 HP, featuring Öhlins Smart EC 2.0 semi-active ' +
        'suspension, forged Marchesini wheels, and a full suite of Ducati electronic rider aids.',
      startingPrice: 28995,
      images: [
        'https://picsum.photos/seed/ducati-v4-1/800/600',
        'https://picsum.photos/seed/ducati-v4-2/800/600',
        'https://picsum.photos/seed/ducati-v4-3/800/600',
      ],
      createdBy: admin._id,
    });

    console.log(`Bike 1 created: ${bike1.name}`);
    console.log(`Bike 2 created: ${bike2.name}`);

    // ─── Create Sample Auctions ─────────────────────────────────────
    const now = new Date();

    // Auction 1: Upcoming — starts in 1 hour, ends in 25 hours
    const auction1StartTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const auction1EndTime = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const auction1 = await Auction.create({
      bike: bike1._id,
      startTime: auction1StartTime,
      endTime: auction1EndTime,
      status: 'upcoming',
      highestBid: bike1.startingPrice,
      createdBy: admin._id,
    });

    // Auction 2: Active — started 30 minutes ago, ends in 23.5 hours
    const auction2StartTime = new Date(now.getTime() - 30 * 60 * 1000);
    const auction2EndTime = new Date(now.getTime() + 23.5 * 60 * 60 * 1000);

    const auction2 = await Auction.create({
      bike: bike2._id,
      startTime: auction2StartTime,
      endTime: auction2EndTime,
      status: 'active',
      highestBid: bike2.startingPrice,
      createdBy: admin._id,
    });

    console.log(`Auction 1 created: ${bike1.name} — status: upcoming`);
    console.log(`Auction 2 created: ${bike2.name} — status: active`);

    // ─── Summary ────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════');
    console.log('  SEED COMPLETE — Summary');
    console.log('════════════════════════════════════════════');
    console.log(`  Admin:    ${admin.email} / admin123`);
    console.log(`  Bikes:    ${bike1.name}, ${bike2.name}`);
    console.log(`  Auctions: ${auction1._id} (upcoming), ${auction2._id} (active)`);
    console.log('════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
