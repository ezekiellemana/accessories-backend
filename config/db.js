const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  const connect = async (retries = 5) => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    } catch (err) {
      console.error(`❌ DB Connection Error: ${err.message}`);
      if (retries > 0) {
        console.log(`🔄 Retrying in 5 seconds... (${retries} retries left)`);
        setTimeout(() => connect(retries - 1), 5000);
      } else {
        process.exit(1);
      }
    }
  };

  connect();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed due to app termination');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed due to server shutdown');
    process.exit(0);
  });
};

module.exports = connectDB;
