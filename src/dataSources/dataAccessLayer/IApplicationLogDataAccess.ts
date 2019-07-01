import { ApplicationLog } from '../../models/src/index';

export interface IApplicationLogDataAccess {
  saveApplicationLog(applicationLog: ApplicationLog): Promise<ApplicationLog>;
}
