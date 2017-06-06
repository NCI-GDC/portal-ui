/* @flow */

import { capitalize } from "../string";

describe("capitalize", () => {
  it("should captalize a string", () => {
    expect(capitalize("danish marzipan biscuit")).toEqual(
      "Danish Marzipan Biscuit",
    );
  });

  it("should capitalize mirna as miRNA", () => {
    expect(capitalize("mirna")).toEqual("miRNA");
    expect(capitalize("danish marzipan mirna biscuit")).toEqual(
      "Danish Marzipan miRNA Biscuit",
    );
  });

  it("should capitalize dbsnp as dbSNP", () => {
    expect(capitalize("dbsnp")).toEqual("dbSNP");
    expect(capitalize("danish marzipan dbsnp biscuit")).toEqual(
      "Danish Marzipan dbSNP Biscuit",
    );
  });

  it("should capitalize cosmic as COSMIC", () => {
    expect(capitalize("cosmic")).toEqual("COSMIC");
    expect(capitalize("danish marzipan cosmic biscuit")).toEqual(
      "Danish Marzipan COSMIC Biscuit",
    );
  });
});
