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
  description: { type: String, required: true },
  isComplete: { type: Boolean, required: true },
  dates: { type: Schema.Types.Mixed, required: true },
  color: { type: String, required: true },
});

const PSPSchema: Schema = new Schema({
  workingDays: { type: [workingDaySchema], default: [] },
  label: { type: String, required: false },
  level: { type: Number, required: false },
  children: { type: [Schema.Types.ObjectId], ref: 'Child', required: true }, // Angenommen, childSchema1 ist ein Verweis auf ein anderes Schema
  key: { type: String, required: false },
});

// Optimiertes fillPSP
export const fillPSP = async (children: IAP[]): Promise<IAP[]> => {
  const updatedChildren = await Promise.all(children.map(async (child) => {
    const obj = await AP.findById(child._id) as IAP;
    if (obj) {
      const updatedChild = { ...child, ...obj };
      if (updatedChild.children) {
        updatedChild.children = await fillPSP(updatedChild.children);
      }
      return updatedChild;
    }
    return child;
  }));
  return updatedChildren;
};

const PSP = model('PSP', PSPSchema);

export { IPSP, PSP };
