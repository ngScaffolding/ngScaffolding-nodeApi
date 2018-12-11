import { Observable } from 'rxjs';
import { ErrorModel } from '@ngscaffolding/models'

export interface IErrorDataAccess {
    saveError(error: ErrorModel): void;
}
