import { Schema, model, Document } from "mongoose";

interface workingDays extends Document {
  name: string;
  code: number;
  description: string;
  isComplete: boolean;
  dates: { repeat: { weekdays: number } };
  color: string,
}

const workingDaysSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: Number, required: true },
  description: { type: String, required: true },
  isComplete: { type: Boolean, required: true },
  dates: { repeat: { weekdays: { type: Number, required: true } } },
  color: { type: String, required: true },
});

const WorkingDays = model<workingDays>('WorkingDays', workingDaysSchema);

export { WorkingDays, workingDays };
