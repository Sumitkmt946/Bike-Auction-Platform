const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Bike = require('./models/Bike');

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB. Updating images...');

    const updates = [
      {
        brand: 'Yamaha',
        images: ['https://upload.wikimedia.org/wikipedia/commons/2/23/Yamaha_YZF-R1_2015.jpg']
      },
      {
        brand: 'Ducati',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ducati_Panigale_V4_S_%282018%29.jpg/1200px-Ducati_Panigale_V4_S_%282018%29.jpg']
      },
      {
        brand: 'Kawasaki',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kawasaki_Ninja_ZX-10R_2016.jpg/1200px-Kawasaki_Ninja_ZX-10R_2016.jpg']
      },
      {
        brand: 'BMW',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/BMW_S1000RR_Tricolor.jpg/1200px-BMW_S1000RR_Tricolor.jpg']
      },
      {
        brand: 'Honda',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Honda_CBR1000RR-R_Fireblade_SP.jpg/1200px-Honda_CBR1000RR-R_Fireblade_SP.jpg']
      }
    ];

    for (const update of updates) {
      const result = await Bike.findOneAndUpdate(
        { brand: update.brand },
        { $set: { images: update.images } },
        { new: true }
      );
      if (result) {
        console.log(`Updated images for ${result.name}`);
      }
    }

    console.log('All images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  }
};

updateImages();
