// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose from 'mongoose';

// let mongo: MongoMemoryServer;

// beforeAll(async () => {
//   mongo = new MongoMemoryServer();
//   const mongoUri = await mongo.getUri();
//   await mongoose.connect(mongoUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   });
// });

// beforeEach(async () => {
//   const collections = await mongoose.connection.db.collections();
//   for (const collection of collections) {
//     await collection.deleteMany({});
//   }
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongo.stop();
// });
