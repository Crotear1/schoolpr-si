import mongoose from 'mongoose';
import { IPSP, PSP } from '~/server/models/pspModel';
import { IAP, AP } from '~/server/models/apModel';
import checkAuth from '~/server/api/auth/checkAuth.post';

const PSPModel = mongoose.model<IPSP>('PSP', PSP.schema);
const APModel = mongoose.model<IAP>('AP', AP.schema);

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if(!await checkAuth(event)) {
        return new Error('Unauthorized');
    } else {
        delete body.token;
    }

    const req = await readBody(event);
    const children = req.children;
    try {
        const saveAPs = async (children: [IAP]): Promise<[IAP]> => {
            for (let i = 0; i < children.length; i++) {
                if (children[i].children) {
                    children[i].children = await saveAPs(children[i].children);
                }
                const ap = new APModel(children[i]);
                const obj = {_id : ap._id, children : ap.children};
                const objid = new APModel(obj);
                children[i] = objid;
                // console.log(ap);
                try{
                    await ap.save();
                }catch{
                    APModel.findOneAndUpdate(ap._id);
                }
            }
            return children;
        }
        await APModel.deleteMany({});
        await saveAPs(children);

        await PSPModel.deleteMany({});

        const psp = await PSPModel.findOneAndUpdate({}, req, {
            new: true,
            upsert: true,
        });

        if (psp) {
            return new Response(JSON.stringify({ saved: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ saved: false }), { status: 500 });
        }
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ saved: false }), { status: 500 });
    }
});
