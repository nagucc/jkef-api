/*
eslint-disable no-console, no-new
 */

import { acceptorManager, statCron, error } from './config';
import { CronJob } from 'cron';

try {
  new CronJob(statCron, async () => {
    await acceptorManager.computeStatByProject();
    await acceptorManager.computeStatByYear();
    console.log('CRON JOB DONE');
  }, null, true);
} catch (e) {
  error('[STAT CRON JOB ERROR]', e);
}
