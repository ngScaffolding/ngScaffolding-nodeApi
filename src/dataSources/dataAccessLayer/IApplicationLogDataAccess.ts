import { ApplicationLog } from '../../models/index';

export interface IApplicationLogDataAccess {
  saveApplicationLog(applicationLog: ApplicationLog): Promise<ApplicationLog>;
}
