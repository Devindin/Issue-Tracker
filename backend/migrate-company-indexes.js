const mongoose = require('mongoose');
require('dotenv').config();

async function fixCompanyIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const companiesCollection = db.collection('companies');

    // Get existing indexes
    const indexes = await companiesCollection.indexes();
    console.log('\n📊 Existing indexes on companies collection:');
    indexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key), index.unique ? '(unique)' : '');
    });

    // Drop the old email_1 index if it exists
    try {
      await companiesCollection.dropIndex('email_1');
      console.log('\n✅ Dropped old email_1 index from companies collection');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('\n📝 Old email_1 index does not exist (already dropped or never created)');
      } else {
        console.log('\n⚠️  Could not drop email_1 index:', error.message);
      }
    }

    // Verify final indexes
    const finalIndexes = await companiesCollection.indexes();
    console.log('\n📊 Final indexes on companies collection:');
    finalIndexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key), index.unique ? '(unique)' : '');
    });

    console.log('\n✅ Company indexes migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  - Removed obsolete email index from companies collection');
    console.log('  - Company registration should now work properly');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

fixCompanyIndexes();
