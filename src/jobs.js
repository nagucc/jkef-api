/*
eslint-disable no-console, no-new
 */

import { CronJob } from 'cron';
import { acceptorManager, statCron, error } from './config';

export const startJobs = () => {
  try {
    new CronJob(statCron, async () => {
      await acceptorManager.computeStatByProject();
      await acceptorManager.computeStatByYear();
      console.log('CRON JOB DONE');
    }, null, true);
  } catch (e) {
    error('[STAT CRON JOB ERROR]', e);
  }
};

