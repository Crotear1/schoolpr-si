import { IAP, AP } from '~/server/models/apModel';

export default defineEventHandler(async (event) => {
    const key = await getRouterParam(event, 'key');
    const body = await readBody(event);

    const ap = await AP.findOneAndUpdate({ key: key }, body, { new: true });

    if (!ap) {
        return new Error('AP not found');
    } else {
        return true;
    }
});
