describe('Cart:', function () {

  var CartService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.cart'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Controller:', function () {
    it('should have files', inject(function ($controller) {
      // Which HTTP requests do we expect to occur, and how do we response?
      var files = {
        hits: [
          {
            id: "AAA",
            size: 0
          },
          {
            id: "BBB",
            size: 0
          }
        ]
      };

      // Starting the controller
      var wc = $controller('CartController', {files: files});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('files').to.have.property('hits').with.length(2);
      //expect(wc).to.have.property('files').with.length(1);

    }));
  });

  describe('Service:', function () {
    var file = { id: 'AAA', url: '/files/AAA' };
    var fileB = { id: 'BBB', url: '/files/BBB' };

    it('should add a file to the cart', inject(function (CartService) {
      var addCallback = sinon.spy(CartService, 'add');
      CartService.add(file);
      expect(addCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.have.property('hits').with.length(1);
    }));

    it('should get all files in the cart', inject(function (CartService) {
      CartService.add(file);
      var getFilesCallback = sinon.spy(CartService, 'getFiles');
      var returned = CartService.getFiles();
      expect(getFilesCallback).to.have.been.calledOnce;
      expect(returned).to.have.property('hits').with.length(1);
      expect(returned).to.have.deep.property('.hits[0].id', 'AAA');
    }));

    it('should remove all files', inject(function (CartService) {
      CartService.add(file);
      var removeCallback = sinon.spy(CartService, 'removeAll');
      CartService.removeAll();
      expect(removeCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.have.property('hits').to.be.empty;
    }));

    it('should remove files by ids', inject(function (CartService) {
      CartService.add(file);
      CartService.add(fileB);
      var removeByIdCallback = sinon.spy(CartService, 'remove');
      CartService.remove(['AAA']);
      expect(removeByIdCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.have.property('hits').to.not.include(file);
      expect(CartService).to.have.property('files').to.have.property('hits').to.include(fileB);
    }));

    it('should return a list of all file urls', inject(function (CartService) {
      CartService.add(file);
      var callback = sinon.spy(CartService, 'getAllFileUrls');
      var returned = CartService.getAllFileUrls();
      expect(returned).to.include('/files/AAA');
      CartService.add(fileB);
      returned = CartService.getAllFileUrls();
      expect(returned).to.include('/files/AAA');
      expect(returned).to.include('/files/BBB');
    }));

    it('should return a list of file urls by ids', inject(function (CartService) {
      CartService.add(file);
      CartService.add(fileB);
      var callback = sinon.spy(CartService, 'getFileUrls');
      var returned = CartService.getFileUrls(['AAA']);
      expect(returned).to.include('/files/AAA');
      expect(returned).to.not.include('/files/BBB');
    }));

    it('should return a list of file ids', inject(function (CartService) {
      CartService.add(file);
      CartService.add(fileB);
      var returnValue = CartService.getAllFileIds();
      expect(returnValue).to.have.length(2);
      expect(returnValue).to.contain(file.id);
      expect(returnValue).to.contain(fileB.id);
    }));

  });
});
