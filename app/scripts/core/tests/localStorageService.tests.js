describe('LocalStorage:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('core.services'));

  describe('Service:', function () {
    it('should exist', inject(function (LocalStorageService) {
      expect(LocalStorageService).to.exist;
    }));

    it('should add an item to localstorage', inject(function (LocalStorageService) {
      LocalStorageService.setItem('foo', 'bar');
      expect(LocalStorageService.getItem('foo')).to.equal('bar');
    }));

    it('should stringify / parse by default', inject(function (LocalStorageService) {
      LocalStorageService.setItem('foo', { bar: 'baz' });
      expect(LocalStorageService.getItem('foo')).to.deep.equal({ bar: 'baz' });
    }));

    it('should remove an item from localstorage and return {}, the default response',
      inject(function (LocalStorageService) {
        LocalStorageService.setItem('foo', 'bar');
        LocalStorageService.removeItem('foo');
        expect(LocalStorageService.getItem('foo')).to.deep.equal({});
      })
    );
  });
});
