import Proces from '../models/proces.js';

export const najdiSoubezneProcesy = () =>
  Proces.find({
    zaznamy: {
      $elemMatch: {
        $or: [
          { stop: { $gte: datumOd, $lte: datumDo } },
          { start: { $gte: datumOd, $lte: datumDo } },
          {
            $and: [{ start: { $lte: datumOd } }, { stop: { $gte: datumDo } }],
          },
          {
            $and: [{ stop: { $exists: false } }, { start: { $lte: datumDo } }],
          },
        ],
      },
    },
  });
