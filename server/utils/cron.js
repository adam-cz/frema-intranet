import { CronJob } from 'cron';

import { present } from '../controllers/employees.js';

const attendanceRefresh = new CronJob('* * * * *', () => present());

attendanceRefresh.start();
