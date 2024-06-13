import { Diary } from '~/server/models/diaryModel';
import { AP, IAP } from '~/server/models/apModel';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    async function calcAndUpdateCompletion(apEntry: IAP) {
      const percent = 1 / Number(apEntry.duration) * 100;
      const addPercent = percent + Number(apEntry.percentComplete);
      console.log(addPercent)
      if(addPercent < 100 || addPercent === 100) {
        if (Math.abs(100 - addPercent) < 0.00001) {
          await AP.findOneAndUpdate({key: body.workPackage.code}, {percentComplete: 100});
        } else {
          await AP.findOneAndUpdate({key: body.workPackage.code}, {percentComplete: addPercent});
        }
      } else {
        return 'AP already completed'
      }
    }

    const apEntry: IAP | null = await AP.findOne({key: body.workPackage.code });

    if (apEntry) {
      await calcAndUpdateCompletion(apEntry);
    } else {
      return new Error('AP not found');
    }

    const addToDiaryContent = async () => {
      return Diary.create({
        email: body.email,
        startTime: body.startTime,
        endTime: body.endTime,
        durationHours: body.durationHours,
        workPackage: body.workPackage.label,
        location: body.location,
        activities: body.activities,
        problems: body.problems,
        sources: body.sources,
        date: body.date
      });
    }

    await addToDiaryContent();

    return true;
})
