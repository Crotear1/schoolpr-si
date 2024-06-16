// Importing required modules and types
import mongoose, { Document } from 'mongoose';
import { IPSP, PSP } from '~/server/models/pspModel';
import checkAuth from '~/server/api/auth/checkAuth.post';
import { Diary } from '~/server/models/diaryModel';
import { User } from '~/server/models/userModel';
import { IAP, AP } from '~/server/models/apModel';

// Creating a mongoose model for PSP using the IPSP interface and PSP schema
const PSPModel = mongoose.model<IPSP>('PSP', PSP.schema);

// Exporting an event handler function

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if(!await checkAuth(event)) {
      return new Error('Unauthorized');
  } else {
      delete body.token;
  }

  // @todo: Implement the logic to delete everything, but no the workdays

  try {
    // Fetch the PSP from the database
    const psp = await PSPModel.find();
    // If the PSP exists, send it in the response
    if (psp) {
        await PSPModel.deleteMany({});
        await Diary.deleteMany({});
        await User.deleteMany({});
        await AP.deleteMany({});
        return new Response('PSP wurde gelöscht!', { status: 200 });
    } else {
        console.error("Kein PSP vorhanden!");
        return new Response('Kein PSP vorhanden!', { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response('Ein Fehler ist aufgetreten, bitte kontaktieren Sie einen Administrator', { status: 500 });
  }
});

