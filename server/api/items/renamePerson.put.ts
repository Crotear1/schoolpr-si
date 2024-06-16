import { User, users } from '~/server/models/userModel';
import checkAuth from '~/server/api/auth/checkAuth.post';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body)

  if(!await checkAuth(event)) {
    return new Error('Unauthorized');
  } else {
    delete body.token;
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
  }

});
