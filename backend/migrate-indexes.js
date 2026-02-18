const mongoose = require('mongoose');
require('dotenv').config();

async function dropOldIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(' Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get existing indexes
    const indexes = await usersCollection.indexes();
    console.log('\n Existing indexes:');
    indexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key), index.unique ? '(unique)' : '');
    });

    // Drop the old email unique index if it exists
    try {
      await usersCollection.dropIndex('email_1');
      console.log('\n Dropped old email_1 index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('\n Old email_1 index does not exist (already dropped)');
      } else {
        console.log('\n  Could not drop email_1 index:', error.message);
      }
    }

    // Verify the compound index exists
    const newIndexes = await usersCollection.indexes();
    const compoundIndex = newIndexes.find(idx => 
      idx.key.email === 1 && idx.key.company === 1
    );

    if (compoundIndex) {
      console.log('\n Compound index (email + company) exists:', compoundIndex.unique ? 'unique' : 'not unique');
    } else {
      console.log('\n Creating compound index (email + company)...');
      await usersCollection.createIndex(
        { email: 1, company: 1 },
        { unique: true }
      );  
      console.log(' Compound index created');
    }

    console.log('\n Final indexes:');
    const finalIndexes = await usersCollection.indexes();
    finalIndexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key), index.unique ? '(unique)' : '');
    });

    console.log('\n Index migration completed successfully!');
    console.log('\n Summary:');
    console.log('  - Email is now unique per company (not globally)');
    console.log('  - Same email can exist in different companies');
    console.log('  - Company owner emails remain globally unique (checked in code)');
    
    process.exit(0);
  } catch (error) {
    console.error('\n Migration failed:', error);
    process.exit(1);
  }
}

dropOldIndexes();
