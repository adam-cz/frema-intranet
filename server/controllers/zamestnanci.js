//_items models import
import Employees from '../models/zamestnanci.js';
import sql, { pool } from '../utils/mssql.js';

export const fetchEmployees = async (req, res) => {
  try {
    const _result = await Employees.find();
    res.status(200).json(_result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const isExpiredParse = (SQLdate) => {
  if (SQLdate === null) return true;
  const date = new Date(SQLdate);
  return date > new Date();
};

export const loadEmployees = async (req, res) => {
  try {
    const poolConnection = await pool;
    const request = new sql.Request(poolConnection);
    const employees = await request.query(
      'SELECT RC, Jmeno, Prijmeni FROM Osoba'
    );
    const filter = await request.query(
      'SELECT RC, DatumUkonceni FROM PracovniPomer'
    );

    const filteredEmployees = employees.recordset.filter((element) => {
      return isExpiredParse(
        filter.recordset.find((el) => {
          return el.RC === element.RC;
        }).DatumUkonceni
      );
    });
    Employees.insertMany(filteredEmployees);
    res.status(200).json(filteredEmployees);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
