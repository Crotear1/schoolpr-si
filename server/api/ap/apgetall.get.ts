import { IAP} from '~/server/models/apModel';
import { PSP, fillPSP } from '~/server/models/pspModel';
// Import the Mongoose model for PSPs

// Define an event handler for the update operation
export default defineEventHandler(async (event) => {
    try {
        // Fetching all PSP documents from the database
        const psp = await PSP.find();

        // Checking if the PSP exists in the database
        if (!psp[0]) {
            return new Response('PSP not found', { status: 500 }); // If PSP doesn't exist, return a 404 response
        }
        let childs = psp[0].children as [IAP]; // Get the children of the first PSP document

        // Fill the children of the PSP
        await fillPSP(childs);

        return psp[0].children

    } catch (error) {
        // If an error occurs, return a response with a status of 500 and the error message
        return new Response(JSON.stringify( { status: 500 }));
    }
});
