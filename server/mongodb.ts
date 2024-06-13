import { Nitro } from 'nitropack'
import mongoose from 'mongoose';

export default async (_nitro: Nitro) => {

  try {
    const db = await mongoose.connect('mongodb://rootuser:password@localhost:27017/');
    console.log('Connected to MongoDB');
    // 'mongodb://rootuser:password@localhost:27017/'
    // 'mongodb+srv://Crotear:DbPezdSynlsvATQw@cluster0.sm3hovx.mongodb.net/'
  } catch (error) {
    console.log(error);
  }
}
