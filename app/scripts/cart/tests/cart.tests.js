describe('Cart:', function () {

  var CartService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngToast', 'ngProgressLite', 'ngApp.cart'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Controller:', function () {
    it('should have files', inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      // Which HTTP requests do we expect to occur, and how do we response?
      var files = [
        {
          file_uuid: "AAA",
          file_size: 20,
          file_url: "urlA"
        },
        {
          file_uuid: "BBB",
          file_size: 10,
          file_url: "urlB"
        }
      ];

      // Starting the controller
      var wc = $controller('CartController', {$scope: scope, files: files});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('files').to.have.length(2);

    }));
  });

  describe('Service:', function () {
    var fileA = {
      file_uuid: "AAA",
      file_size: 20,
      file_url: "urlA"
    };
    var fileB = {
      file_uuid: "BBB",
      file_size: 10,
      file_url: "urlB"
    };

    beforeEach(inject(function ($window) {
      // Clear localStorage system to prevent oddities from tests.
      $window.localStorage.setItem("gdc-cart-items", []);
    }));

    it('should return files', inject(function (CartService) {
      var addCallback = sinon.spy(CartService, 'getFiles');
      var fs = [fileA, fileB];
      CartService.addFiles(fs);
      var ret = CartService.getFiles();
      expect(addCallback).to.have.been.calledOnce;
      expect(ret.length).to.eq(2);
    }));

    it('should return selected files', inject(function (CartService) {
      var addCallback = sinon.spy(CartService, 'getSelectedFiles');
      var fs = [fileA, fileB];
      CartService.addFiles(fs);
      CartService.getFiles()[0].selected = false;
      var ret = CartService.getSelectedFiles();
      expect(addCallback).to.have.been.calledOnce;
      expect(ret.length).to.eq(1);
    }));

    it('should check if file in cart', inject(function (CartService) {
      var addCallback = sinon.spy(CartService, 'add');
      CartService.add(fileA);
      expect(addCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.have.length(1);
    }));

    it('should list of files in cart', inject(function (CartService) {
      var addCallback = sinon.spy(CartService, 'add');
      CartService.add(fileA);
      expect(addCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.have.length(1);
    }));

    it('should add a file to the cart', inject(function (CartService) {
      var addCallback = sinon.spy(CartService, 'add');
      CartService.add(fileA);
      expect(addCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.have.length(1);
    }));

    it('should add many files to the cart', inject(function (CartService) {
      var addCallback = sinon.spy(CartService, 'addFiles');
      CartService.addFiles([fileA, fileB]);
      expect(addCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.have.length(2);
    }));

    it('should get all files in the cart', inject(function (CartService) {
      CartService.add(fileA);
      var getFilesCallback = sinon.spy(CartService, 'getFiles');
      var files = CartService.getFiles();
      expect(getFilesCallback).to.have.been.calledOnce;
      expect(files).to.have.length(1);
      expect(files[0]).to.have.property('file_uuid', 'AAA');
    }));

    it('should remove all files', inject(function (CartService) {
      CartService.add(fileA);
      var removeCallback = sinon.spy(CartService, 'removeAll');
      CartService.removeAll();
      expect(removeCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.be.empty;
    }));

    it('should remove files by ids', inject(function (CartService) {
      CartService.add(fileA);
      CartService.add(fileB);
      var removeByIdCallback = sinon.spy(CartService, 'remove');
      CartService.remove(['AAA']);
      expect(removeByIdCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.not.include(fileA);
      expect(CartService).to.have.property('files').to.include(fileB);
    }));


    it('should remove files', inject(function (CartService) {
      CartService.add(fileA);
      CartService.add(fileB);
      var removeByIdCallback = sinon.spy(CartService, 'removeFiles');
      CartService.removeFiles([fileA]);
      expect(removeByIdCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.not.include(fileA);
      expect(CartService).to.have.property('files').to.include(fileB);
    }));

    it('should return a list of all fileA urls', inject(function (CartService) {
      CartService.add(fileA);
      var callback = sinon.spy(CartService, 'getFileUrls');
      var returned = CartService.getFileUrls();
      expect(returned).to.include('urlA');
      CartService.add(fileB);
      returned = CartService.getFileUrls();
      expect(returned).to.include('urlA');
      expect(returned).to.include('urlB');
    }));

    it('should return a list of fileA ids', inject(function (CartService) {
      CartService.add(fileA);
      CartService.add(fileB);
      var returnValue = CartService.getFileIds();
      expect(returnValue).to.have.length(2);
      expect(returnValue).to.contain(fileA.file_uuid);
      expect(returnValue).to.contain(fileB.file_uuid);
    }));

  });
});
