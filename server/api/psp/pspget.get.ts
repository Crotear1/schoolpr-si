import { PSP, fillPSP } from '~/server/models/pspModel';
import { IAP } from '~/server/models/apModel';

export default defineEventHandler(async (event) => {

    const psp = await PSP.find(); // Fetching the only PSP document from the database

    // Checking if the PSP exists in the database
    if (!psp[0]) {
      return new Response('PSP not found', { status: 404 });
    }
    let childs = psp[0].children as [IAP]; // Get the children of the first PSP document

    // Fill the children of the PSP
    await fillPSP(childs);

    // If the first PSP exists
    if (psp[0]) {
      // Return a 200 status response with the first PSP as the body
      return psp
    } else {
      // Return a 404 status response with an error message as the body
      return new Response('PSP not found', { status: 404 });
    }
  }
);

