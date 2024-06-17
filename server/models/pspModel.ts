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
  // Schritt 1: Erstelle ein Array von Promises für jede findById Operation
  const promises = children.map(child => AP.findById(child._id).exec());

  // Schritt 2: Warte auf alle Promises mit Promise.all
  const results = await Promise.all(promises);

  // Schritt 3: Iteriere über die Ergebnisse
  await Promise.all(children.map(async (child, index) => {
    const obj = results[index] as IAP;
    if (obj) {
      Object.assign(child, obj);
      if (child.children) {
        // Schritt 4: Rekursive Aufrufe mit Promise.all für Kinder
        child.children = await fillPSP(child.children);
      }
    }
  }));

  return children;
};

const PSP = model('PSP', PSPSchema); // define PSP Model with PSPSchema

export { IPSP, PSP };
