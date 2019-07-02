import { ReferenceValue } from '../../models/src/index';

export interface IReferenceValueDataAccess {
  getReferenceValue(name: string): Promise<ReferenceValue>;
  saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue>;
}
