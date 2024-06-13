import mongoose, { Document } from 'mongoose';
import { WorkingDays } from '~/server/models/workingDaysModel';

export default defineEventHandler(async (event) => {
  const getAllWorkdays = async () => {
    return WorkingDays.find();
  }
  return getAllWorkdays();
})
