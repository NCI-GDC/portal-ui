describe('Biospecimen Directive', function () {
  var scope, $compile;

  beforeEach(module('biospecimen.directives'));

  beforeEach(module(function ($provide) {
    $provide.value('$stateParams', {});
  }));

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    var $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();
  }));

  afterEach(function () {
    scope.$destroy();
  });

  it('should exist', function () {
    var el = $compile('<biospecimen></biospecimen>')(scope);
    expect(el).to.exist;
  });
});
