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
export const fillPSP = async (children: IAP[]): Promise<IAP[]> => {
  const promises = children.map(async (child) => {
    const obj = await AP.findById(child._id) as IAP;
    if (obj) {
      Object.assign(child, obj);
      if (child.children) {
        child.children = await fillPSP(child.children);
      }
    }
    return child;
  });
  return Promise.all(promises);
};

const PSP = model('PSP', PSPSchema); // define PSP Model with PSPSchema

export { IPSP, PSP };
