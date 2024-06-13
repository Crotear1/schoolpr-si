import { User, users } from '~/server/models/userModel';

export default defineEventHandler(async (event) => {

  const { persons } = await readBody(event);

  if(!persons) {
    return false;
  }

  for (const person of persons) {
    // find and update
    await User.findOneAndUpdate(
      { _id: person._id },
      { name: person.name },
      { new: true }
    );
  }


  return true
});
