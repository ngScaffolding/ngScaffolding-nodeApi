import { ErrorModel } from '../../models/index';

export interface IErrorDataAccess {
    saveError(error: ErrorModel): void;
}
