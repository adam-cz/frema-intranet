import User from '../models/user.js';
import sql, { pool } from '../utils/dochazka.js';

//fetch only necessary attendance data
export const fetchEmployees = async (req, res) => {
  try {
    const result = await User.find(
      {},
      'name surname lastOperation isPresent email'
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//Check if employee is still employed
const isExpired = (SQLdate) => {
  //in case the release date is missing, employee is expired
  if (SQLdate === null) return true;
  const date = new Date(SQLdate);
  return date > new Date();
};

/*
 *
 * Necceseray attendance data are in 3 SQL tables
 * 1. table includes employees data - ID, name, mail...
 * 2. table includes only their ID and date of release
 * 3. table includes only their ID and realtime presence
 * ... so there's little more code to connect it all together
 *
 */

//Load every employee from MSSQL attendance database (1. table)
const loadEmployees = async () => {
  const poolConnection = await pool;
  const request = new sql.Request(poolConnection);
  //fetch all employees list with details
  const { recordset: all } = await request.query(
    'SELECT RC, Jmeno, Prijmeni FROM Osoba'
  );
  //fetch expiration info (2. table)
  const { recordset: filter } = await request.query(
    'SELECT RC FROM PracovniPomer WHERE DatumUkonceni IS NULL'
  );

  //filter all dismissed employees from 1.table
  const filteredEmployees = filter.map((empl) =>
    all.find((find) => find.RC === empl.RC)
  );
  //prepare Object with correct keys for saving to app db
  const convertedEmployees = filteredEmployees.map(
    ({ Jmeno, Prijmeni, RC }) => ({
      name: Jmeno,
      surname: Prijmeni,
      _id: RC,
    })
  );
  return convertedEmployees;
};

//Get back difference of two lists - used for filter employees who are still employed
const compareLists = (list1, list2) => {
  const newEmployees = list2.filter((e) => {
    return !list1.map((el) => el._id).includes(e.RC);
  });
  console.log(newEmployees);
  return newEmployees;
};

//Update internal employee database. Add new one, delete old one
export const updateEmployees = async (req, res) => {
  try {
    const MSSQLemployees = await loadEmployees();
    const MongoEmployees = await User.find();
    const newEmployees = compareLists(MongoEmployees, MSSQLemployees);
    //  const dismissedEmployees = compareLists(MSSQLemployees, MongoEmployees);
    //insert new
    if (newEmployees) await User.insertMany(newEmployees);
    //delete expired
    /*
    if (dismissedEmployees) {
      for (let i = 0; i < dismissedEmployees.length; i++) {
        await User.deleteOne({ _id: dismissedEmployees[i]._id });
      }
    }
    */
    //create default attendance data
    await User.updateMany({}, { isPresent: 0, lastOperation: '' });

    res.status(200).send({
      message: 'Update Completed',
      added: newEmployees.length,
      // deleted: dismissedEmployees.length,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

//Update presence of Employees (3. table) - used by cron job
export const present = async () => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    //fetch realtime attendance data
    const presence = await request.query(
      'SELECT RC, Pritomnost, DatumCasOperace FROM PuvDochProMonitorovani'
    );
    //update employees presence in app db with realtime data
    await User.find()
      .cursor()
      .eachAsync(async (doc, i) => {
        const { Pritomnost, DatumCasOperace } = presence.recordsets[0].find(
          (el) => el.RC == doc._id
        );
        doc.isPresent = Pritomnost;
        doc.lastOperation = new Date(DatumCasOperace);
        await doc.save();
      });
  } catch (err) {
    console.log(err.message);
  }
};
