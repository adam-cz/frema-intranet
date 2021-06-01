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

export const loadEmployees = async (req, res) => {
  console.log('trying obtain results...');
  try {
    const request = new sql.Request(pool);
    const result = await request.query(
      'SELECT * FROM PuvodniDochazka WHERE OsobniCislo = 303000 ORDER BY DatumCasOperace DESC'
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
