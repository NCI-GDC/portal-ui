/* @flow */
/* eslint fp/no-mutation: 0 fp/no-let: 0, fp/no-mutating-methods: 0 */
import _ from 'lodash';
import {
  initialCaseAggregationsVariables,
} from '@ncigdc/utils/generated-relay-query-parts';

jest.mock('@ncigdc/uikit/Tooltip', () => {});

const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key: string): any {
      return store[key] || null;
    },
    setItem(key: string, value: any): void {
      store[key] = value.toString();
    },
    clear(): void {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const { CaseAggregationsQuery } = require('../CaseAggregations');

const [fieldNameA, fieldNameB] = Object.keys(initialCaseAggregationsVariables);

describe('prepareVariables', () => {
  it('should return all fields as true if shouldRequestAllAggregations is true', () => {
    const testVarsA = {
      [fieldNameA]: false,
      [fieldNameB]: false,
      shouldRequestAllAggregations: true,
    };
    expect(
      _.every(_.values(CaseAggregationsQuery.prepareVariables(testVarsA))),
    ).toBe(true);

    const testVarsB = {
      [fieldNameA]: true,
      [fieldNameB]: true,
      shouldRequestAllAggregations: true,
    };
    expect(
      _.every(_.values(CaseAggregationsQuery.prepareVariables(testVarsB))),
    ).toBe(true);
  });

  it('should return all fields as false if all fields were already false', () => {
    const testVars = {
      [fieldNameA]: false,
      [fieldNameB]: false,
      shouldRequestAllAggregations: false,
    };
    expect(
      _.every(_.values(CaseAggregationsQuery.prepareVariables(testVars))),
    ).toBe(false);
  });

  it(`when shouldRequestAllAggregations is false,
    it should return false fields as false and true fields as true`, () => {
    const testVars = {
      [fieldNameA]: true,
      [fieldNameB]: false,
      shouldRequestAllAggregations: false,
    };
    const preparedVariables = CaseAggregationsQuery.prepareVariables(testVars);
    expect(preparedVariables[fieldNameA]).toBe(true);
    expect(preparedVariables[fieldNameB]).toBe(false);
  });
});
