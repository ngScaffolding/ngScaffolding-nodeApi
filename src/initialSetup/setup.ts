import { setupDataSource } from './dataSource.setup';
import { setupUserPrefs } from './userPrefs.setup';
import { setupReferenceValues } from './referenceValues.setup';

export function initialSetup() {
  setupDataSource();
  setupReferenceValues();
  setupUserPrefs();
}
