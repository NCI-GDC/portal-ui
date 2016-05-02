describe('Facets:', function () {

  var FacetService;
  beforeEach(module('components.facets'));

  beforeEach(module(function ($provide) {
     $provide.value('AuthRestangular', {});
     $provide.value('notify', {});
     $provide.value('config', {});
  }));

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
