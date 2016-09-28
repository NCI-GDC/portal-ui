module ngApp.files.controllers {
  import IFile = ngApp.files.models.IFile;
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;
  import ICartService = ngApp.cart.services.ICartService;
  import IFilesService = ngApp.files.services.IFilesService;
  import IGqlService = ngApp.components.gql.IGqlService;
  import IBiospecimenService = ngApp.components.ui.biospecimen.services.IBiospecimenService;

  interface ITableFilters {
    assocEntity: string;
    readGroup: string;
  }

  export interface IFileController {
    file: IFile;
    isInCart(): boolean;
    handleCartButton(): void;
    archiveCount: number;
    annotationIds: string[];
    tablesToDisplay: string[];
    makeSearchPageLink(files: IFile[]): string;
  }

  class FileController implements IFileController {
    archiveCount: number = 0;
    annotationIds: string[] = [];
    tablesToDisplay: string[];
    tableFilters: ITableFilters = {
      assocEntity: '',
      readGroup: ''
    };

    /* @ngInject */
    constructor(
      public file: IFile,
      public $scope: ng.IScope,
      private CoreService: ICoreService,
      private CartService: ICartService,
      private FilesService: IFilesService,
      private $filter: ng.IFilterService,
      private BiospecimenService: IBiospecimenService
    ) {

      setTimeout(() => {
        // long-scrollable-table should become its own directive
        // --
        // this function moves the "sticky" header columns which do not scroll
        // naturally with the table
        $('.long-scrollable-table-container').scroll(function () {
          let el = $(this);
          let div = el.find('.sticky div');
          div.css({ transform: `translateX(-${el.scrollLeft()}px)` });
        });
      });

      CoreService.setPageTitle("File", file.file_name);

      var toDisplayLogic = {
        'Raw Sequencing Data': ['analysis', 'referenceGenome', 'readGroup', 'downstreamAnalysis'],
        'Transcriptome Profiling': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
        'Simple Nucleotide Variation': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
        'Copy Number Variation': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
        'Structural Rearrangement': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
        'DNA Methylation': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
        'Clinical': [],
        'Biospecimen': []
      }
      this.tablesToDisplay = (toDisplayLogic[file.data_category] || []).reduce((acc, t) => {
        acc[t] = true;
        return acc;
      }, {});

      if (this.file.archive) {
        this.FilesService.getFiles({
          fields: [
            "archive.archive_id"
          ],
          filters: {"op": "=", "content": {"field": "files.archive.archive_id", "value": [file.archive.archive_id]}}
        }).then((data) => this.archiveCount = data.pagination.total);
      } else {
        this.archiveCount = 0;
      }

      _.forEach(file.associated_entities, (entity) => {
        let found = BiospecimenService.search(entity.entity_id,
        _.find(file.cases, {"case_id": entity.case_id}),
       ['submitter_id', 'sample_id', 'portion_id',
          'analyte_id', 'slide_id', 'aliquot_id']
        )
        entity.sample_type = (_.first(found) || {sample_type : '--'}).sample_type;

        entity.annotations = _.filter(file.annotations, (annotation) => {
          return annotation.entity_id === entity.entity_id;
        });

        if (entity.annotations) {
          entity.annotations = _.pluck(entity.annotations, "annotation_id");
        }
      });

      //insert project into top level because it's in the properties table
      file.projects = _.reject(_.unique(file.cases.map(c => (c.project || {}).project_id)),
                                  p => _.isUndefined(p) || _.isNull(p));

      //insert cases into related_files for checking isUserProject when downloading
      _.forEach(file.related_files, (related_file) => {
        related_file['cases'] = file.cases;
      });

      if (file.downstream_analyses) {
        file.downstream_analyses = file.downstream_analyses.reduce(
          (prev, curr) =>
            prev.concat((curr.output_files || []).map(x =>
              _.extend({}, x, {
                workflow_type: curr.workflow_type,
                cases: file.cases.slice()
              }))
            ),
          []
        );
      }
    }

    isInCart(): boolean {
      return this.CartService.isInCart(this.file.file_id);
    }

    handleCartButton(): void {
      if (this.CartService.isInCart(this.file.file_id)) {
        this.CartService.remove([this.file.file_id]);
      } else {
        this.CartService.addFiles([this.file], true);
      }
    }

    canBAMSlice(): boolean {
      return (this.file.data_type || '').toLowerCase() === 'aligned reads' &&
             (this.file.index_files || []).length != 0 &&
             (this.file.data_format || '').toLowerCase() === 'bam';
    }

    makeSearchPageLink(files: IFile[] = []): any {
      if (files.length) {
        var filterString = this.$filter("makeFilter")([{
          field: 'files.file_id',
          value: files.map(f => f.file_id)
        }], true);
        var href = 'search/f?filters=' + filterString;
        return files.length ? "<a href='" + href + "'>" + files.length + '</a>' : '0';
      }
    }

  }

  class BAMSlicingController {

    exampleShowing: boolean = false;
    /* @ngInject */
    constructor (private $uibModalInstance,
                 private $scope: ng.IScope,
                 private FilesService: IFilesService,
                 public file: any,
                 private GqlService: IGqlService,
                 public completeCallback: any,
                 private inProgress: any,
                 private downloader: any
    ) {
      this.$scope.bedModel = "";
    }

    submit(): void {
      this.FilesService.sliceBAM(
        this.file.file_id,
        this.$scope.bedModel,
        this.completeCallback,
        this.inProgress,
        this.downloader);
      this.$uibModalInstance.close('slicing');
    }

    allowTab($event: any): void {
      if (event.keyCode === 9) {
        event.preventDefault();

        // current caret pos
        var start = $event.target.selectionStart;
        var end = $event.target.selectionEnd;

        var oldValue = this.$scope.bedModel;
        this.$scope.bedModel = oldValue.substring(0, start) + '\t' + oldValue.substring(end);
        // put caret in correct place
        this.GqlService.setPos($event.target, start+1);
      }
    }

    toggleExample() {
      this.exampleShowing = !this.exampleShowing;
    }

    closeModal(): void {
      this.$uibModalInstance.dismiss('cancelled');
    }
  }

  class BAMFailedModalController {
    errorBlobString: string;
    msg400: string = "Invalid BED Format. Please refer to the examples described in the BAM Slicing pop-up.";
    /* @ngInject */
    constructor(private $uibModalInstance,
                public errorStatus: string,
                public errorStatusText: string,
                private errorBlob: Blob) {
      this.errorBlobString = "";
      var reader = new FileReader();
      reader.addEventListener("loadend", () => {
        this.errorBlobString = _.get(JSON.parse(reader.result), "error", "Error slicing");
      });
      reader.readAsText(errorBlob);
    }
  }

  angular
      .module("files.controller", [
        "files.services"
      ])
      .controller("BAMSlicingController", BAMSlicingController)
      .controller("BAMFailedModalController", BAMFailedModalController)
      .controller("FileController", FileController);
}
