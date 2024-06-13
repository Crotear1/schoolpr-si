import { Schema, model, Document} from "mongoose";
import { Numberish } from "primevue/ts-helpers";
import { users, User } from '~/server/models/userModel';

interface IAP extends Document {
  label: { type: String, required: false, default: null },
  level: { type: Numberish, required: false, default: null },
  startdate: { type: Date, required: false, default: null },
  enddate: { type: Date, required: false, default: null },
  duration: { type: Number, required: false, default: 0 },
  percentComplete: { type: Number, required: false, default: 0 },
  dependencies: { type: String, required: false, default: null },
  workPackageContent: { type: String, required: false, default: null},
  workPackageNotContent: { type: String, required: false, default: null },
  workPackageResult: { type: String, required: false, default: null },
  workPackagePerformance: { type: String, required: false, default: null },
  selectPersons: users[],
  key: string;
  children: [IAP];
}

export const APSchema: Schema = new Schema({
  label: { type: String, required: false, default: null},
  level: { type: Number, required: false, default: null },
  startdate: { type: Date, required: false, default: null},
  enddate: { type: Date, required: false, default: null},
  duration: { type: Number, required: false, default: 0 },
  percentComplete: { type: Number, required: false, default: 0 },
  dependencies: { type: String, required: false, default: null },
  workPackageContent: { type: String, required: false, default: null},
  workPackageNotContent: { type: String, required: false, default: null },
  workPackageResult: { type: String, required: false, default: null },
  workPackagePerformance: { type: String, required: false, default: null },
  selectedPersons: {
    type: [User.schema],
    required: false,
    default: []
  },
  key: { type: String, required: false },
},{collection: 'aps'});

const APSchema1 = APSchema.add({ children: [APSchema] }); // add children Array with nested APSchema

const AP = model("AP", APSchema1)

export { IAP, AP};
