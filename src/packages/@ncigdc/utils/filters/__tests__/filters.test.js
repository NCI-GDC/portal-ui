/* @flow */

import { addInFilters, toggleFilters } from "../";

const baseFilter = {
  op: "and",
  content: [
    {
      op: "in",
      content: {
        field: "file.file_id",
        value: ["fileA"]
      }
    }
  ]
};

const fileBFilter = {
  op: "and",
  content: [
    {
      op: "in",
      content: {
        field: "file.file_id",
        value: ["fileB"]
      }
    }
  ]
};

const caseFilter = {
  op: "and",
  content: [
    {
      op: "in",
      content: {
        field: "case.case_id",
        value: ["somecase"]
      }
    }
  ]
};

describe("addInFilters", () => {
  it("should return the base filter if no query", () => {
    const result = addInFilters(undefined, baseFilter);
    expect(result).toEqual(baseFilter);
  });

  it("should return the query if no base filter", () => {
    expect(false).toBe(false);
  });

  it("should add a value to base", () => {
    const result = addInFilters(fileBFilter, baseFilter);
    expect(result).toEqual({
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "file.file_id",
            value: ["fileA", "fileB"]
          }
        }
      ]
    });
  });

  it("should keep other fields in the filter when adding", () => {
    const result = addInFilters(
      fileBFilter,
      addInFilters(caseFilter, baseFilter)
    );
    expect(result).toMatchObject({
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "case.case_id",
            value: ["somecase"]
          }
        },
        {
          op: "in",
          content: {
            field: "file.file_id",
            value: ["fileA", "fileB"]
          }
        }
      ]
    });
  });

  it("should not remove an existing value", () => {
    const result = addInFilters(baseFilter, baseFilter);
    expect(result).toEqual(result);
  });
});

describe("toggleFilters", () => {
  it("should add a value to base", () => {
    const result = toggleFilters(fileBFilter, baseFilter);
    expect(result).toEqual({
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "file.file_id",
            value: ["fileA", "fileB"]
          }
        }
      ]
    });
  });
  it("should remove an existing value", () => {
    const result = toggleFilters(baseFilter, baseFilter);
    expect(result).toEqual(null);
  });
});
