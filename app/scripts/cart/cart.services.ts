module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;

  export interface ICartService {
    getFiles(): IFiles;
  }

  class CartService implements ICartService {
    /* @ngInject */
    constructor () {}

    getFiles(): IFiles {
        var files: IFiles = {
          pagination: {"count": 20, "total": 20, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
          hits: []
        };

        for(var i = 0; i <= 10; i++) {
          var code = 'TCGA-59-2352-10A-01W-' + Math.round(Math.random() * 8000) + '-08';
          var file: IFile = {
                    id: "1",
                    uuid: "1",
                    code: code,
                    filename: 'C239.' + code,
                    files: [],
                    metadata: {},
                    metadataXML: "",
                    filetype: "XML",
                    access: Math.round(Math.random()) ? true : false,
                    participant:  "participantID",
                    project: "TCGA",
                    category: "Clinical",
                    state: "Live",
                    size: Math.random() * 100,
                    revision: "10.1.1",
                    updateDate: new Date()
                    };
          files.hits.push(file);
        }
      return files;
    }

  }

  angular
    .module("cart.services", ["restangular"])
    .service("CartService", CartService);
}

