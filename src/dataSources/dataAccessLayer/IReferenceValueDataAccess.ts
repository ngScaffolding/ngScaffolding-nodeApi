import { ReferenceValue } from '../../models/index';

export interface IReferenceValueDataAccess {
  getReferenceValue(name: string): Promise<ReferenceValue>;
  saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue>;
}
