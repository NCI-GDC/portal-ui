import { CLINICAL_FIELD_BLACKLIST, VALID_CLINICAL_TYPES } from '@ncigdc/utils/constants';

interface IField {
  description: string;
  name: string;
  type: {
    name: string;
  }
}

type TTestValidClinicalTypes = (fields: IField[]) => IField[]

const clinicalTypeRegex = new RegExp(
  VALID_CLINICAL_TYPES.map(item => `(${item})`).join('|')
);

const blacklistRegex = new RegExp(
  CLINICAL_FIELD_BLACKLIST.map(item => `(${item})`).join('|')
);

const testValidClinicalTypes: TTestValidClinicalTypes = fields => fields
  .filter(field => clinicalTypeRegex.test(field.name))
  .filter(field => !blacklistRegex.test(field.name));

export default testValidClinicalTypes;
