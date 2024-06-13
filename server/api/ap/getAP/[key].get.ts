import { AP } from '~/server/models/apModel';

export default defineEventHandler(async (event) => {
    const body = getRouterParam(event, 'key');

    const findAP = await AP.findOne({ key: body }).exec();

    return findAP;
});
