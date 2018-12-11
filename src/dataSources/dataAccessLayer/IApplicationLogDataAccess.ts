import { ApplicationLog } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

export interface IApplicationLogDataAccess {
  saveApplicationLog(applicationLog: ApplicationLog): Observable<ApplicationLog>;
}
