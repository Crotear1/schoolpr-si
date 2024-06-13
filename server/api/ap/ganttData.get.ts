import mongoose from 'mongoose';
import { IPSP, PSP, fillPSP } from '~/server/models/pspModel';
import { IAP, AP } from '~/server/models/apModel';



export default defineEventHandler(async (event) => {

    try {

        function formatDate(dateString: string): string {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const headings = [
            { type: 'string', label: 'Task ID' },
            { type: 'string', label: 'Task Name' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'End Date' },
            { type: 'number', label: 'Duration' },
            { type: 'number', label: 'Percent Complete' },
            { type: 'string', label: 'Dependencies' }
        ];

        const aps = await AP.find({"level": 2}).sort({startdate: +1}).lean().exec();

        const responseArray: any = [headings];
        aps.forEach(ap => {
            if(ap.startdate === null || ap.enddate === null) {
                return;
            }

            const taskArray = [
                ap._id,
                ap.label,
                formatDate(ap.startdate),
                formatDate(ap.enddate),
                ap.duration,
                ap.percentComplete,
                ap.dependencies,
            ];
            responseArray.push(taskArray);
        });
        //const apss = JSON.stringify(aps);

        return responseArray

    } catch (error) {
        // If an error occurs, return a response with a status of 500 and the error message
        return new Response(JSON.stringify( { status: 500 }));
    }
});

