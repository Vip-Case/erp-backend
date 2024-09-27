import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testMongoDBAtlasConnection() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("MONGODB_URI environment variable is not set");
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Atlas bağlantısı başarılı!");
    await mongoose.connection.close();
  } catch (error) {
    console.error("MongoDB Atlas bağlantı hatası:", error);
  }
}

testMongoDBAtlasConnection();
