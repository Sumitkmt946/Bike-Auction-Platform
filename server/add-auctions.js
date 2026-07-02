const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const User = require('./models/User');
const Bike = require('./models/Bike');
const Auction = require('./models/Auction');

const addMoreAuctions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for adding more auctions...');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@bikeauction.com' });
    if (!admin) {
      console.error('Admin user not found. Please run seed.js first.');
      process.exit(1);
    }

    // ─── Create More Bikes ────────────────────────────────────────
    const bike3 = await Bike.create({
      name: 'Kawasaki Ninja ZX-10R 2023',
      brand: 'Kawasaki',
      model: 'Ninja ZX-10R',
      year: 2023,
      description: 'The Kawasaki Ninja ZX-10R has carried Kawasaki to multiple World Superbike championships. Powered by a 998cc inline-four engine producing 203 HP, it features aerodynamic winglets, Showa Balance Free suspension, and advanced electronics.',
      startingPrice: 17399,
      images: [
        'https://picsum.photos/seed/kawi-zx10-1/800/600',
        'https://picsum.photos/seed/kawi-zx10-2/800/600',
      ],
      createdBy: admin._id,
    });

    const bike4 = await Bike.create({
      name: 'BMW S1000RR 2024',
      brand: 'BMW',
      model: 'S1000RR',
      year: 2024,
      description: 'The BMW S1000RR is an engineering marvel from Motorrad. Its 999cc ShiftCam inline-four delivers 210 HP. Packed with M components, dynamic damping control, and an unmistakable asymmetric design, it defines the modern superbike.',
      startingPrice: 20500,
      images: [
        'https://picsum.photos/seed/bmw-s1000-1/800/600',
        'https://picsum.photos/seed/bmw-s1000-2/800/600',
      ],
      createdBy: admin._id,
    });

    const bike5 = await Bike.create({
      name: 'Honda CBR1000RR-R Fireblade SP 2023',
      brand: 'Honda',
      model: 'CBR1000RR-R Fireblade SP',
      year: 2023,
      description: 'Built with HRC MotoGP technology, the Fireblade SP is a street-legal race bike. It produces 214 HP from its inline-four engine and comes standard with Öhlins Smart EC suspension and Brembo Stylema calipers.',
      startingPrice: 28900,
      images: [
        'https://picsum.photos/seed/honda-cbr-1/800/600',
        'https://picsum.photos/seed/honda-cbr-2/800/600',
      ],
      createdBy: admin._id,
    });

    // ─── Create More Auctions ─────────────────────────────────────
    const now = new Date();

    // Auction 3: Active — started 1 hour ago, ends in 2 hours
    const auction3 = await Auction.create({
      bike: bike3._id,
      startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
      status: 'active',
      highestBid: bike3.startingPrice,
      createdBy: admin._id,
    });

    // Auction 4: Active — started 10 minutes ago, ends in 1 day
    const auction4 = await Auction.create({
      bike: bike4._id,
      startTime: new Date(now.getTime() - 10 * 60 * 1000),
      endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      status: 'active',
      highestBid: bike4.startingPrice,
      createdBy: admin._id,
    });

    // Auction 5: Upcoming — starts in 1 day, ends in 3 days
    const auction5 = await Auction.create({
      bike: bike5._id,
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 72 * 60 * 60 * 1000),
      status: 'upcoming',
      highestBid: bike5.startingPrice,
      createdBy: admin._id,
    });

    console.log('Successfully added 3 more bikes and auctions:');
    console.log(`- ${bike3.name} (Active, ends in 2 hours)`);
    console.log(`- ${bike4.name} (Active, ends in 24 hours)`);
    console.log(`- ${bike5.name} (Upcoming, starts in 1 day)`);

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

addMoreAuctions();
