import { Schema, model, Document } from "mongoose";

interface users extends Document {
  name: string;
  email: string;
  id: string;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  id: { type: String, required: true },
  supabaseId: { type: String, required: true },
});

const User = model<users>('User', userSchema);

export { User, users };
