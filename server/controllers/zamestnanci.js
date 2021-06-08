import Employees from '../models/zamestnanci.js';
import sql, { pool } from '../utils/mssql.js';

export const fetchEmployees = async (req, res) => {
  try {
    const result = await Employees.find();
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
    const MongoEmployees = await Employees.find();
    const newEmployees = compareLists(MongoEmployees, MSSQLemployees);
    const dismissedEmployees = compareLists(MSSQLemployees, MongoEmployees);
    if (newEmployees) await Employees.insertMany(newEmployees);
    if (dismissedEmployees) {
      for (let i = 0; i < dismissedEmployees.length; i++) {
        await Employees.deleteOne({ RC: dismissedEmployees[i].RC });
      }
    }
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
    const employees = await Employees.find();
    const presence = await request.query(
      'SELECT RC, Pritomnost, DatumCasOperace FROM PuvDochProMonitorovani'
    );
    const updatedEmployees = employees.map((employee) => {
      const { Pritomnost, DatumCasOperace } = presence.recordsets[0].find(
        (el) => el.RC == employee.RC
      );
      console.log(employee);
      Employees.updateOne({ RC: employee.RC }, { Pritomnost, DatumCasOperace });
      //return { Pritomnost, DatumCasOperace, ...employee };
    });
    res.send(updatedEmployees);
  } catch (err) {
    res.send({ message: err.message });
  }
};
