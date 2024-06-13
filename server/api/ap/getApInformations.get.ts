import mongoose, { Document } from 'mongoose';
import { IPSP, PSP } from '~/server/models/pspModel';
import { IAP, AP } from '~/server/models/apModel';
import { User, users } from '~/server/models/userModel';

export default defineEventHandler(async (event) => {
  const APPackages = await AP.find().exec();
  const items = await PSP.find().exec();
  const findUsers = await User.find().exec();

  // filter and get all with level 2 in the ApPackages
  const filteredItems = APPackages.filter((item) => item.level === 2);

  const information = {...items, apPackages: filteredItems, users: findUsers};

  return information;
});
