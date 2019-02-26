import { ReferenceValue } from '@ngscaffolding/models';

export interface IReferenceValueDataAccess {
  getReferenceValue(name: string): Promise<ReferenceValue>;
  saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue>;
}
