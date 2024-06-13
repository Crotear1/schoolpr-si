import { Schema, model, Document } from "mongoose";

interface IDiary extends Document {
  content: [string];
  email: string;
}

const diarySchema = new Schema({
  email: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true  },
  endTime: { type: String, required: true  },
  durationHours: { type: Number, required: true },
  workPackage: { type: String, required: true  },
  location: { type: String, required: true  },
  activities: { type: String, required: true  },
  problems: { type: String, required: true  },
  sources: { type: String,  },
});

const Diary = model<IDiary>('Diary', diarySchema);

export { Diary, IDiary };
