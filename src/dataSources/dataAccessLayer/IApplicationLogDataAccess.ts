import { ApplicationLog } from '@ngscaffolding/models';

export interface IApplicationLogDataAccess {
  saveApplicationLog(applicationLog: ApplicationLog): Promise<ApplicationLog>;
}
