import makeFilter from './makeFilter';

const baseFields = [
  {
    "field": "participants.bcr_patient_uuid",
    "value":"b64bfca1-033c-4501-a900-103ac105c084"
  },
  {
    "field":"files.data_type",
    "value":"DNA methylation"
  }
];

const expectedBase = {
  "op": "and",
  "content":[
    {
      "op": "in",
      "content": {
        "field": "participants.bcr_patient_uuid",
        "value":["b64bfca1-033c-4501-a900-103ac105c084"]
      }
    },
    {
      "op": "in",
      "content": {
        "field": "files.data_type",
        "value":["DNA methylation"]
      }
    }
  ]
};

describe('makeFilter', () => {
  it('should construct a query as a JSON string given an array of fields to values', () => {
    expect(makeFilter(baseFields)).toBe(JSON.stringify(expectedBase));
  });
});
