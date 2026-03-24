const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dropIndex = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    const collection = mongoose.connection.db.collection('galleries');
    
    console.log('🔍 Checking indexes...');
    const indexes = await collection.indexes();
    console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

    const idIndex = indexes.find(idx => idx.name === 'id_1' || idx.key.id !== undefined);
    if (idIndex) {
      console.log(`🧨 Legacy index detected: ${idIndex.name}. Dropping now...`);
      await collection.dropIndex(idIndex.name);
      console.log(`✅ Index "${idIndex.name}" dropped successfully.`);
    } else {
      console.log('ℹ️ Targeted index not found. Checking if multiple nulls exist...');
    }

    console.log('🚀 DB Cleanup Complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during index drop:', error);
    process.exit(1);
  }
};

dropIndex();
