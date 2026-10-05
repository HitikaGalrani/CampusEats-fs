const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://2024hitikagalrani_db_user:BhpUkM46OzFmq9Jj@ac-7ye9t3h-shard-00-00.8mtyyax.mongodb.net:27017,ac-7ye9t3h-shard-00-01.8mtyyax.mongodb.net:27017,ac-7ye9t3h-shard-00-02.8mtyyax.mongodb.net:27017/?ssl=true&replicaSet=atlas-hunjrv-shard-0&authSource=admin&appName=CampusEatsCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error]: ${error.message}`);
    // If running in dev mode without MongoDB running, don't crash hard immediately
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
