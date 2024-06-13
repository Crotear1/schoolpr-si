import { AP } from '~/server/models/apModel';

export default defineEventHandler(async (event) => {
  const getAP = await AP.find();

  getAP.forEach((ap) => {
    if (ap.level === 1) {
      getAP.splice(getAP.indexOf(ap), 1);
    }
  });

  const sortedAP = getAP.map((ap) => {
    return {
      label: ap.label,
      code: ap.key,
    }
  });

  return sortedAP;

});
