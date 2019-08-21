import { IDataSourceSwitch } from '../dataSourceSwitch';
import {
  InputDetailDropdown,
  InputTypes,
  InputBuilderDefinition
} from '../models/index';

var DataSourceSwitch = require('../dataSourceSwitch');

export function setupUserPrefs() {
  const ds: IDataSourceSwitch = DataSourceSwitch.default;

  ds.dataSource.saveUserPreferenceDefinition({
    name: 'Theme',
    inputDetails: <InputDetailDropdown>{
      name: 'Theme',
      selectFilter: false,
      referenceValueName: 'UserPrefs_Themes',
      type: 'dropdown',
      label: 'Theme',
      help: 'Select the Theme'
    }
  });
  ds.dataSource.saveUserPreferenceDefinition({
    name: 'DarkMenu',
    inputDetails: {
      name: 'DarkMenu',
      type: InputTypes.switch,
      label: 'Dark/Light Menu',
      help: 'Dark or Light Menu'
    }
  });
  ds.dataSource.saveUserPreferenceDefinition({
    name: 'CompactMode',
    inputDetails: {
      name: 'CompactMode',
      type: InputTypes.switch,
      label: 'Compact Mode',
      help: 'Select the Compact/Expand Mode'
    }
  });
  ds.dataSource.saveUserPreferenceDefinition({
    name: 'ProfileMode',
    inputDetails: <InputDetailDropdown>{
      referenceValueName: 'UserPrefs_ProfileMode',
      name: 'ProfileMode',
      type: 'dropdown',
      label: 'Profile Mode',
      help: 'Select the position of the Profile Icon'
    }
  });
  ds.dataSource.saveUserPreferenceDefinition({
    name: 'MenuOrientation',
    inputDetails: <InputDetailDropdown>{
      referenceValueName: 'UserPrefs_MenuOrientation',
      name: 'MenuOrientation',
      type: 'dropdown',
      label: 'Menu Type',
      help: 'Select the type of menu for the application'
    }
  });
  ds.dataSource.saveUserPreferenceDefinition({
    name: 'UserPrefs_Profile',
    inputDetails: <InputBuilderDefinition>{
      title: 'User Profile Details',
      okButtonText: 'Save Profile',
      cancelButtonText: 'Cancel',
      inputDetails: [
        {
          name: 'FirstName',
          type: 'textbox',
          label: 'First Name'
        },
        { name: 'MiddleInitial', type: 'textbox', label: 'Middle Initial' },
        { name: 'LastName', type: 'textbox', label: 'Last Name' }
      ]
    }
  });
}
