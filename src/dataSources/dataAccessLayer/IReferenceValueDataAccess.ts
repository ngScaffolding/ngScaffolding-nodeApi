import { ReferenceValue } from '@ngscaffolding/models';

export interface IReferenceValueDataAccess {
  getReferenceValues(name: string, seed: string, group: string): Promise<ReferenceValue[]>;
  saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue>;
}
