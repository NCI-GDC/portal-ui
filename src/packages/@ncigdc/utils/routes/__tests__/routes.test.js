/* @flow */

import { prepareNodeParams } from "..";

describe("prepareNodeParams", () => {
  it("should create a base64 id", () => {
    const obj = {
      id: btoa("File:hello"),
      filters: null,
    };
    expect(
      prepareNodeParams("File")({
        match: { params: { id: "hello" } },
        location: { query: {} },
      }),
    ).toEqual(obj);
  });
});
