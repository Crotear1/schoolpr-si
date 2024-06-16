import { IAP, AP } from '~/server/models/apModel';
import checkAuth from '~/server/api/auth/checkAuth.post';

export default defineEventHandler(async (event) => {
    const key = await getRouterParam(event, 'key');
    const body = await readBody(event);

    if(!await checkAuth(event)) {
        return new Error('Unauthorized');
    } else {
        delete body.token;
        const ap = await AP.findOneAndUpdate({ key: key }, body, { new: true });

        if (!ap) {
            return new Error('AP not found');
        } else {
            return true;
        }
    }
});
