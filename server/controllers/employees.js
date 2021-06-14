import User from '../models/user.js';
import sql, { pool } from '../utils/mssql.js';

export const fetchEmployees = async (req, res) => {
  try {
    const result = await User.find(
      {},
      'Jmeno Prijmeni DatumCasOperace Pritomen'
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//Check if employee is still employed
const isExpired = (SQLdate) => {
  if (SQLdate === null) return true;
  const date = new Date(SQLdate);
  return date > new Date();
};

//Load actual employees from MSSQL attendance
const loadEmployees = async () => {
  const poolConnection = await pool;
  const request = new sql.Request(poolConnection);
  const employees = await request.query(
    'SELECT RC, Jmeno, Prijmeni FROM Osoba'
  );
  const filter = await request.query(
    'SELECT RC, DatumUkonceni FROM PracovniPomer'
  );

  const filteredEmployees = employees.recordset.filter((element) => {
    return isExpired(
      filter.recordset.find((el) => {
        return el.RC === element.RC;
      }).DatumUkonceni
    );
  });
  return filteredEmployees;
};

//Get back differential of two lists
const compareLists = (list1, list2) => {
  const newEmployees = list2.filter((e) => {
    return !list1.map((el) => parseInt(el.RC)).includes(parseInt(e.RC));
  });
  return newEmployees;
};

//Update internal employee database. Add new one, delete old one
export const updateEmployees = async (req, res) => {
  try {
    const MSSQLemployees = await loadEmployees();
    const MongoEmployees = await User.find();
    const newEmployees = compareLists(MongoEmployees, MSSQLemployees);
    const dismissedEmployees = compareLists(MSSQLemployees, MongoEmployees);
    if (newEmployees) await User.insertMany(newEmployees);
    if (dismissedEmployees) {
      for (let i = 0; i < dismissedEmployees.length; i++) {
        await User.deleteOne({ RC: dismissedEmployees[i].RC });
      }
    }
    await User.updateMany({}, { Pritomnost: 0, DatumCasOperace: '' });
    res.status(200).send({
      message: 'Update Completed',
      added: newEmployees.length,
      deleted: dismissedEmployees.length,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

//Update presence of Employees
export const present = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const presence = await request.query(
      'SELECT RC, Pritomnost, DatumCasOperace FROM PuvDochProMonitorovani'
    );

    await User.find()
      .cursor()
      .eachAsync(async (doc, i) => {
        const { Pritomnost, DatumCasOperace } = presence.recordsets[0].find(
          (el) => el.RC == doc.RC
        );
        doc.Pritomen = Pritomnost;
        doc.DatumCasOperace = new Date(DatumCasOperace);
        await doc.save();
      });
    res.status(200).send({ Message: 'Docházka aktualizována' });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};