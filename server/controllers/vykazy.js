import Proces from '../models/proces.js';

export const fetchVykazy = async (req, res) => {
  // req.body.datumOd
  // req.body.datumDo
  // req.body.uzivatelId
  try {
    const operace = await Proces.find({
      zaznamy: {
        $elemMatch: { cas: { $gte: req.body.datumOd, $lte: req.body.datumDo } },
      },
    });
    console.log(operace);
    res.status(200).json(operace);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

/*

[
  {
    jmneno, 
    id, 
    mzda, 
    vykazy:
      [
        {
          start,
          stop,
          stroj,
          opv,
          proces,
          nazev
        }
      ]
    }
]


*/
