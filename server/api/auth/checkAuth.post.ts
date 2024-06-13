import mongoose from 'mongoose';
import { User } from '~/server/models/userModel';
import bcrypt from 'bcrypt';

type Persons = {
  name: string;
  email: string;
  id: string;
  supabaseId: string;
}

export default defineEventHandler(async (event) => {
  const user = await readBody(event);

  const foundUser = <Persons>await User.findOne({ email: user.token.email });

  if (foundUser) {
    const storedHash = foundUser.supabaseId;

    const isValid = await bcrypt.compare(user.token.id, storedHash);

    if (isValid) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});
