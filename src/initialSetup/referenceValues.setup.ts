import { IDataSourceSwitch } from '../dataSourceSwitch';

var DataSourceSwitch = require('../dataSourceSwitch');

export function setupReferenceValues() {
  const ds: IDataSourceSwitch = DataSourceSwitch.default;

  //////////////////////////////////
  // User Prefs
  ds.dataSource.saveReferenceValue({
    name: 'UserPrefs_MenuOrientation',
    referenceValueItems: [
      { display: 'Side Static', value: '0' },
      { display: 'Horizontal', value: '3' },
      { display: 'Side Slim', value: '2' },
      { display: 'Side Overlay', value: '1' }
    ]
  });

  ds.dataSource.saveReferenceValue({
    name: 'UserPrefs_Themes',
    referenceValueItems: [
      { display: 'Grey - Deep', value: 'grey' },
      { display: 'Cyan - Amber', value: 'cyan' },
      { display: 'Teal - Lime', value: 'teal' },
      { display: 'Purple - Amber', value: 'purple-amber' },
      { display: 'Purple - Cyan', value: 'purple-cyan' },
      { display: 'Green - Yellow', value: 'green' },
      { display: 'Dark - Green', value: 'dark-green' },
      { display: 'Dark - Blue', value: 'dark-blue' },
      { display: 'Blue - Grey', value: 'blue-grey' },
      { display: 'Blue - Amber', value: 'blue' },
      { display: 'Brown - Green', value: 'brown' },
      { display: 'Indigo - Pink', value: 'indigo' }
    ]
  });
    
  ds.dataSource.saveReferenceValue({
    name: 'UserPrefs_ProfileMode',
    referenceValueItems: [
      { display: 'Top', value: 'top' },
      { display: 'Inline (Menu)', value: 'inline' }
    ]
  });
}
