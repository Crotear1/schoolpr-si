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

  const saltRounds = 10;

  const persons = await readBody(event);

  const anyUserExists = await User.findOne();
  if (anyUserExists) {
    return 'Es existieren bereits Einträge. Keine weiteren Aktionen werden durchgeführt.';
  } else {
    persons.persons.forEach(async (person: Persons) => {
      if(!person.name || !person.email || !person.id || !person.supabaseId) {
        return 'Es fehlen erforderliche Daten.';
      }
      const hashedSupabaseId = await bcrypt.hash(person.supabaseId, saltRounds);
      const newUser = new User({
        name: person.name,
        email: person.email,
        id: person.id,
        supabaseId: hashedSupabaseId,
      });
      await newUser.save();
      return 'Ein neuer Eintrag wurde erstellt.';
    })
  }
});
