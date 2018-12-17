import { IApplicationLogDataAccess } from './IApplicationLogDataAccess';
import { IDataSourceDataAccess } from './IDataSourceDataAccess';
import { IErrorDataAccess } from './IErrorDataAccess';
import { IMenuItemsDataAccess } from './IMenuItemsDataAccess';
import { IReferenceValueDataAccess } from './IReferenceValueDataAccess';
import { IUserPreferenceDefinitionDataAccess } from './IUserPreferenceDefinitionDataAccess';
import { IUserPreferenceValueDataAccess } from './IUserPreferenceValueDataAccess';
import { IWidgetDataAccess } from './IWidgetDataAccess';
import { IAppSettingsDataAccess } from './IAppSettingsDataAccess';

export interface IDataAccessLayer
  extends IApplicationLogDataAccess,
    IAppSettingsDataAccess,
    IDataSourceDataAccess,
    IErrorDataAccess,
    IMenuItemsDataAccess,
    IReferenceValueDataAccess,
    IUserPreferenceDefinitionDataAccess,
    IUserPreferenceValueDataAccess,
    IWidgetDataAccess {}
