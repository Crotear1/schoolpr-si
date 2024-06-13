import { Diary } from '~/server/models/diaryModel';

export default defineEventHandler(async (event) => {
  const getDiary = async () => {
    return Diary.find();
  }

  const sortedByDate = async () => {
    return Diary.find().sort({ date: +1 });
  }

  return sortedByDate();
})
