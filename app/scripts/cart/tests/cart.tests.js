describe('Cart:', function () {

  var CartService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngProgressLite', 'ngApp.cart', 'core.filters', 'ngApp.participants'));

  beforeEach(module(function ($provide) {
      $provide.value('RestFullResponse', {});
  }));

  beforeEach(module(function ($provide) {
      $provide.value('AuthRestangular', {});
      $provide.value('config', {});
  }));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Controller:', function () {
    beforeEach(inject(function ($window) {
      // Clear localStorage system to prevent oddities from tests.
      $window.localStorage.setItem("gdc-cart-items", []);
    }));

    it('should have files', inject(function ($rootScope, $controller, CartService) {
      var scope = $rootScope.$new();
      // Which HTTP requests do we expect to occur, and how do we response?
      var files = [
        {
          file_id: "AAA",
          file_name: "aaa.bam",
          file_size: 20,
          file_url: "urlA",
          participantId: []
        },
        {
          file_id: "BBB",
          file_name: "bbb.bam",
          file_size: 10,
          file_url: "urlB",
          participantId: []
        }
      ];

      CartService.addFiles(files);

      // Starting the controller
      var wc = $controller('CartController', {$scope: scope, files: files});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('files').to.have.length(2);

    }));
  });

  describe('Service:', function () {
    var fileA = {
      file_id: "AAA",
      file_size: 20,
      file_url: "urlA",
      participantId: []
    };
    var fileB = {
      file_id: "BBB",
      file_size: 10,
      file_url: "urlB",
      participantId: []
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
      expect(files[0]).to.have.property('file_id', 'AAA');
    }));

    it('should remove all files', inject(function (CartService) {
      CartService.add(fileA);
      var removeCallback = sinon.spy(CartService, 'removeAll');
      CartService.removeAll();
      expect(removeCallback).to.have.been.calledOnce;
      expect(CartService).to.have.property('files').to.be.empty;
    }));

    it('should remove files', inject(function (CartService) {
      CartService.add(fileA);
      CartService.add(fileB);
      var removeByIdCallback = sinon.spy(CartService, 'remove');
      CartService.remove([fileA]);
      expect(removeByIdCallback).to.have.been.calledOnce;
      var files = CartService.getFiles();
      expect(files).to.have.length(1);
      expect(files[0]).to.have.property('file_id', 'BBB');
    }));

    it('should return a list of fileA ids', inject(function (CartService) {
      CartService.add(fileA);
      CartService.add(fileB);
      var returnValue = CartService.getFileIds();
      expect(returnValue).to.have.length(2);
      expect(returnValue).to.contain(fileA.file_id);
      expect(returnValue).to.contain(fileB.file_id);
    }));

    it('should correctly report space left in cart', inject(function (CartService) {
      expect(CartService.getCartVacancySize()).to.eq(CartService.getMaxSize());
      CartService.addFiles([fileA, fileB]);
      expect(CartService.getCartVacancySize()).to.eq(CartService.getMaxSize() - 2);
      var files = [];
      for (var i = 0; i < CartService.getCartVacancySize(); i++) {
        files.push({file_id : Math.random()});
      }
      CartService.addFiles(files);
      expect(CartService.getCartVacancySize()).to.eq(0);

    }));

    it('should correctly determine fullness', inject(function (CartService) {
      expect(CartService.isFull()).to.eq(false);
      var files = [];
      for (var i = 0; i < CartService.getMaxSize(); i++) {
        files.push({file_id : Math.random()});
      }
      CartService.addFiles(files);
      expect(CartService.isFull()).to.eq(true);
    }));

  });
});
