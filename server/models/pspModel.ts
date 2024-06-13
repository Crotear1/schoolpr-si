import { Schema, model, Document } from "mongoose";
import {  IAP, AP} from '~/server/models/apModel';

interface IPSP extends Document {
  persons: [];
  workingDays: [];
  label: String;
  level: Number;
  children: IAP[];
  key: String;
}

const childSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'AP'},
});

const childSchema1 = childSchema.add({ children: [childSchema] });

const workingDaySchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: Number, required: true },
  description : { type: String, required: true },
  isComplete : { type: Boolean, required: true },
  dates: { type: Schema.Types.Mixed, required: true},
  color: { type: String, required: true},
});

const PSPSchema: Schema = new Schema({
  workingDays: { type: [workingDaySchema], default: [] },
  label: { type: String, required: false },
  level: { type: Number, required: false },
  children: { type: [childSchema1], required: true },
  key: { type: String, required: false },
});

// fills a psp document with children items
export const fillPSP = async (children: [IAP]): Promise<[IAP]> => {

  for (let i = 0; i < children.length; i++) {
    // Find the AP model in the database with the same ID as the current child
    const obj = await AP.findById(children[i]._id) as IAP;
    // If the AP model was found in the database
    if(obj){
      // Merge the properties of the found AP model into the current child
      Object.assign(children[i], obj);

      // If the current child has its own children
      if(children[i].children){
        // Recursively fill the children of the current child
        children[i].children = await fillPSP(children[i].children);
      }
    }
  }
  return children;
}

const PSP = model('PSP', PSPSchema); // define PSP Model with PSPSchema

export { IPSP, PSP };
