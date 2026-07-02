const mongoose = require('mongoose');
require('dotenv').config();

const Bike = require('./models/Bike');

const updateBMW = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    // Find the BMW S1000RR bike
    const bike = await Bike.findOne({ name: { $regex: /BMW S1000RR 2024/i } });
    
    if (!bike) {
      console.log('BMW S1000RR 2024 not found in the database!');
      process.exit(1);
    }

    console.log('Found bike:', bike.name);
    console.log('Current images:', bike.images);

    // Keep the first image (which might be the one working in the user's screenshot)
    // Add 2 new high-quality unsplash motorcycle images
    const currentMainImage = bike.images.length > 0 ? bike.images[0] : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop';
    
    bike.images = [
      currentMainImage,
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop', // beautiful black motorcycle
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2070&auto=format&fit=crop'  // another cool angle
    ];

    await bike.save();
    console.log('Successfully added 2 new working images to BMW S1000RR 2024!');
    console.log('New images array:', bike.images);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateBMW();
