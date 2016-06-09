describe('Facets:', function () {

  var FacetService;
  beforeEach(module('components.facets'));

  beforeEach(module(function ($provide) {
     $provide.value('AuthRestangular', {});
     $provide.value('notify', {});
     $provide.value('config', {});
  }));

  describe('FacetService#facetOpValueMap:', function () {
    it('should return a map of one value', inject(function(FacetService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {
        content: [{
          op: 'in',
          content: {
            field: facet,
            value: ['female']
          }
        }]
      };
      $location.search({ filters: JSON.stringify(filters) });

      const expected = {
        in: ['female']
      };

      assert.deepEqual(expected, FacetService.facetOpValueMap(facet));
    }));

    it('should return a map of two values', inject(function(FacetService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {
        content: [{
          op: 'or',
          content: [{
            op: 'in',
            content: {
              field: facet,
              value: ['female']
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing'
            }
          }]
        }]
      };
      $location.search({ filters: JSON.stringify(filters) });

      const expected = {
        in: ['female'],
        is: ['missing']
      };

      assert.deepEqual(expected, FacetService.facetOpValueMap(facet));
    }));

    it('should return a map of two values', inject(function(FacetService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {
        content: [{
          op: 'or',
          content: [{
            op: 'in',
            content: {
              field: facet,
              value: ['female', 'male']
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing'
            }
          }]
        }]
      };
      $location.search({ filters: JSON.stringify(filters) });

      const expected = {
        in: ['female', 'male'],
        is: ['missing']
      };

      assert.deepEqual(expected, FacetService.facetOpValueMap(facet));
    }));

    it('getActives', inject(function(FacetService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {
        content: [{
          op: 'or',
          content: [{
            op: 'in',
            content: {
              field: facet,
              value: ['female', 'male']
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'MISSING'
            }
          }]
        }]
      };
      $location.search({ filters: JSON.stringify(filters) });

      const terms = [{
        key: 'male'
      }, {
        key: '_missing'
      }, {
        key: 'foo'
      }];

      const expected = [{
        key: 'male'
      }, {
        key: '_missing'
      }];

      assert.deepEqual(expected, FacetService.getActives(facet, terms));
    }));

    it('removeOp', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {
        content: [{
          op: 'or',
          content: [{
            op: 'in',
            content: {
              field: facet,
              value: ['female', 'male']
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing'
            }
          }]
        }]
      };
      $location.search({ filters: JSON.stringify(filters) });
      FacetService.removeOp(facet, 'in');

      const expected = {
        op: 'and',
        content: [{
          op: 'is',
          content: {
            field: facet,
            value: 'missing'
          }
        }]
      };

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeOp', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {
        content: [{
          op: 'or',
          content: [{
            op: 'in',
            content: {
              field: facet,
              value: ['female', 'male']
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing'
            }
          }]
        }]
      };
      $location.search({ filters: JSON.stringify(filters) });
      FacetService.removeOp(facet, 'is');

      const expected = {
        op: 'and',
        content: [{
          op: 'in',
          content: {
            field: facet,
            value: ['female', 'male']
          }
        }]
      };

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeOp', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {
        content: [{
          op: 'or',
          content: [{
            op: 'in',
            content: {
              field: facet,
              value: ['female', 'male']
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing'
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing2'
            }
          }]
        }]
      };
      $location.search({ filters: JSON.stringify(filters) });
      FacetService.removeOp(facet, 'in');

      const expected = {
        op: 'and',
        content: [{
          op: 'or',
          content: [{
            op: 'is',
            content: {
              field: facet,
              value: 'missing'
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing2'
            }
          }]
        }]
      };

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeFacet', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {
        content: [{
          op: 'or',
          content: [{
            op: 'in',
            content: {
              field: facet,
              value: ['female', 'male']
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing'
            }
          }, {
            op: 'is',
            content: {
              field: facet,
              value: 'missing2'
            }
          }]
        }, {
          op: 'in',
          content: {
            field: 'foo.facet',
            value: ['abc', 'xyz']
          }
        }]
      };
      $location.search({ filters: JSON.stringify(filters) });
      FacetService.removeFacet(facet);

      const expected = {
        op: 'and',
        content: [{
          op: 'in',
          content: {
            field: 'foo.facet',
            value: ['abc', 'xyz']
          }
        }]
      };

      assert.deepEqual(expected, LocationService.filters());
    }));


    const addTermTestFilter = {
      op: 'and',
      content: [
        {
          "op": "or",
          "content": [
            {
              "op": "in",
              "content": {
                "field": "cases.demographic.gender",
                "value": [
                  "female",
                  "male"
                ]
              }
            },
            {
              "op": "is",
              "content": {
                "field": "cases.demographic.gender",
                "value": "MISSING"
              }
            }
          ]
        },
        {
          "op": "in",
          "content": {
            "field": "cases.project.primary_site",
            "value": [
              "Kidney"
            ]
          }
        },
        {
          "op": "or",
          "content": [
            {
              "op": "is",
              "content": {
                "field": "cases.demographic.blah",
                "value": "MISSING"
              }
            },
            {
              "op": "is",
              "content": {
                "field": "cases.demographic.blah",
                "value": "MISSING2"
              }
            }
          ]
        }
      ]
    };

    it('addTerm - new facet, "in" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender2';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value');
      const expected = _.cloneDeep(addTermTestFilter);
      expected.content.push({
        op: 'in',
        content: {
          field: facet,
          value: ['value']
        }
      });
      assert.deepEqual(expected, LocationService.filters());
    }));

    it('addTerm - new facet, "is" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender2';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value', 'is');
      const expected = _.cloneDeep(addTermTestFilter);
      expected.content.push({
        op: 'is',
        content: {
          field: facet,
          value: 'value'
        }
      });
      assert.deepEqual(expected, LocationService.filters());
    }));

    it('addTerm - existing facet, "in" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.project.primary_site';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value');
      const expected = JSON.parse('{"op":"and","content":[{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney","value"]}},{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('addTerm - existing facet, ">=" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.project.primary_site';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value', '>=');
      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":">=","content":{"field":"cases.project.primary_site","value":"value"}}]},{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('addTerm - existing facet, "in" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value');
      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}},{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male","value"]}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('addTerm - existing facet, "is" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value', 'is');
      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.gender","value":"value"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('addTerm - existing facet, "in" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.blah';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value');
      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}},{"op":"in","content":{"field":"cases.demographic.blah","value":["value"]}}]},{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('addTerm - existing facet, ">=" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.blah';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value', '>=');
      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}},{"op":">=","content":{"field":"cases.demographic.blah","value":"value"}}]},{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));


    // console.log('\n location: ', JSON.stringify(LocationService.filters()));
    // console.log('\n expected: ', JSON.stringify(expected));

    it('removeTerm - new facet, "in" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender2';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value');
      FacetService.removeTerm(facet, 'value');
      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeTerm - new facet, "is" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender2';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value', 'is');
      FacetService.removeTerm(facet, 'value', 'is');

      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]}]}');
      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeTerm - existing facet, "in" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.project.primary_site';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value');
      FacetService.removeTerm(facet, 'value');

      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeTerm - existing facet, ">=" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.project.primary_site';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value', '>=');
      FacetService.removeTerm(facet, 'value', '>=');

      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeTerm - existing facet, "in" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value');
      FacetService.removeTerm(facet, 'value');

      const expected = JSON.parse('{"op":"and","content":[{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}},{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeTerm - existing facet, "is" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.gender';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value', 'is');
      FacetService.removeTerm(facet, 'value', 'is');

      const expected = JSON.parse('{"op":"and","content":[{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]},{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeTerm - existing facet, "in" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.blah';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value');
      FacetService.removeTerm(facet, 'value');

      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));

    it('removeTerm - existing facet, ">=" op', inject(function(FacetService, LocationService, $location) {
      const facet = 'cases.demographic.blah';
      $location.search({ filters: JSON.stringify(addTermTestFilter) });
      FacetService.addTerm(facet, 'value', '>=');
      FacetService.removeTerm(facet, 'value', '>=');

      const expected = JSON.parse('{"op":"and","content":[{"op":"or","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female","male"]}},{"op":"is","content":{"field":"cases.demographic.gender","value":"MISSING"}}]},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}},{"op":"or","content":[{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING"}},{"op":"is","content":{"field":"cases.demographic.blah","value":"MISSING2"}}]}]}');

      assert.deepEqual(expected, LocationService.filters());
    }));


    // console.log('\n location: ', JSON.stringify(LocationService.filters()));
    // console.log('\n expected: ', JSON.stringify(expected));


    it('should return an empty map', inject(function(FacetService, $location) {
      const facet = 'cases.demographic.gender';
      const filters = {};
      $location.search({ filters: JSON.stringify(filters) });

      const expected = {};

      assert.deepEqual(expected, FacetService.facetOpValueMap(facet));
    }));

  });

  describe('FacetService#filterFacets:', function () {
    it('should return empty array when facets array contains no elements of "terms" or "range" facetType', inject(function(FacetService) {
      var facets = [{
        name: 'foo',
        facetType: 'free-text'
      }, {
        name: 'baz',
        facetType: 'free-text'
      }];

      assert.equal(FacetService.filterFacets(facets).length, 0);
    }));

    it('should return 1 element when facets array contains one element of "terms" or "range" facetType', inject(function(FacetService) {
      var facets = [{
        name: 'foo',
        facetType: 'terms'
      }, {
        name: 'baz',
        facetType: 'free-text'
      }];

      assert.equal(FacetService.filterFacets(facets).length, 1);
    }));

    it('should return 2 elements when facets array contains 2 elements of "terms" or "range" facetType', inject(function(FacetService) {
      var facets = [{
        name: 'foo',
        facetType: 'terms'
      }, {
        name: 'baz',
        facetType: 'range'
      }];

      assert.equal(FacetService.filterFacets(facets).length, 2);
    }));
  });
});
