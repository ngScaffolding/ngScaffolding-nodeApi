import { ErrorModel } from '../../models/src/index';

export interface IErrorDataAccess {
    saveError(error: ErrorModel): void;
}
