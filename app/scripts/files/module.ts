module ngApp.files {
  "use strict";

  import IFilesService = ngApp.files.services.IFilesService;
  import IFile = ngApp.files.models.IFile;

  /* @ngInject */
  function filesConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("file", {
      url: "/files/:fileId",
      controller: "FileController as fc",
      templateUrl: "files/templates/file.html",
      resolve: {
        file: ($stateParams: ng.ui.IStateParamsService, FilesService: IFilesService): ng.IPromise<IFile> => {
          if (! $stateParams.fileId) {
            throw Error('Missing route parameter: fileId. Redirecting to 404 page.');
          }
          return FilesService.getFile($stateParams["fileId"], {
            expand: [
            "metadata_files"
            ],
            fields: [
              "state",
              "md5sum",
              "access",
              "data_format",
              "data_type",
              "data_category",
              "file_name",
              "file_size",
              "file_id",
              "platform",
              "experimental_strategy",
              "center.short_name",
              "cases.case_id",
              "cases.project.project_id",
              "cases.samples.sample_type",
              "cases.samples.portions.portion_id",
              "cases.samples.portions.analytes.analyte_id",
              "cases.samples.portions.analytes.aliquots.aliquot_id",
              "annotations.annotation_id",
              "annotations.entity_id",
              "tags",
              "submitter_id",
              "archive.archive_id",
              "archive.submitter_id",
              "archive.revision",
              "associated_entities.entity_id",
              "associated_entities.entity_type",
              "associated_entities.case_id",
              "analysis.analysis_id",
              "analysis.workflow_type",
              "analysis.updated_datetime",
              "analysis.input_files.file_id",
              "analysis.metadata.read_groups.read_group_id",
              "analysis.metadata.read_groups.is_paired_end",
              "analysis.metadata.read_groups.read_length",
              "analysis.metadata.read_groups.library_name",
              "analysis.metadata.read_groups.sequencing_center",
              "analysis.metadata.read_groups.sequencing_date",
              "downstream_analyses.output_files.access",
              "downstream_analyses.output_files.file_id",
              "downstream_analyses.output_files.file_name",
              "downstream_analyses.output_files.data_category",
              "downstream_analyses.output_files.data_type",
              "downstream_analyses.output_files.data_format",
              "downstream_analyses.workflow_type",
              "downstream_analyses.output_files.file_size",
              "index_files.file_id"
            ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.files", [
        "files.controller",
        "files.directives",
        "ui.router.state"
      ])
      .config(filesConfig);
}
