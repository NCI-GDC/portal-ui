module ngApp.components.tables.directives {

  interface ITableDirectiveScope extends ng.IScope {
     filtersRevealed:boolean;
  }

  /* @ngInject */
  function ArrangeColumns(): ng.IDirective {

    return {
      restrict: "EA",
      scope: {
        list:"=",
        order:"=",
        config:"="
      },
      replace: true,
      templateUrl: "components/tables/templates/arrange-columns.html",
      link:function(scope:any){

        function init() {
          scope.listMap = scope.list.map(function (elem) {
            var composite = _.pick(elem, "id", "displayName", "hidden", "sortable", "canReorder");
            if (composite.canReorder !== false) {
              composite.canReorder = true;
            }
            return composite;
          });
        }

        init();

        scope.onMoved = function($index){
          scope.listMap.splice($index,1);
          scope.list = scope.listMap.map(function(elem){
            return _.find(scope.list,function(li){
              return li.id === elem.id;
            });
          });

          scope.list.pristine = false;
        };

        scope.$watch('listMap',function(newval){
          if (newval) {

            scope.listMap.forEach(function (listElem) {
              var matchingHeader = _.find(scope.list, function (li) {
                return li.id === listElem.id;
              });
              matchingHeader.hidden = listElem.hidden;

              if (matchingHeader.children) {
                matchingHeader.children.forEach(function(childHeader) {
                  childHeader.hidden = listElem.hidden;
                });
              }
            });
          }
        },true);


        scope.$watch(function(){
          return scope.list && scope.list.pristine;
        },function(pristine){
          if (pristine) {
            init();
          }
        });
      }
    };
  }

  function ExportTable(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        endpoint:"@",
        size: "@",
        fields: "="
      },
      replace: true,
      templateUrl: "components/tables/templates/export-table.html",
      controller: "ExportTableController as etc"
    };
  }

  function SortTable(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        paging: "=",
        page: "@",
        config: '='
      },
      replace: true,
      templateUrl: "components/tables/templates/sort-table.html",
      controller: "TableSortController as tsc"
    }
  }

  function GDCTable(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        heading: "@",
        data: "=",
        config: "=",
        paging: "=",
        page: "@",
        sortColumns: "=",
        id: "@",
        endpoint: "@"
      },
      replace: true,
      templateUrl: "components/tables/templates/gdc-table.html",
      controller: "GDCTableController as gtc"
    }
  }

  function ResetTable($log: ng.ILogService): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        target:"=",
        config:'='
      },
      replace:true,
      templateUrl: "components/tables/templates/reset-table.html",
      controller: function($scope,$element){
        var config = $scope.config;
        var originalOrder = _.pluck(config.headings,'id');
        $log.log("Reset table init...");
        $scope.reset = function(){
          $log.log("Reset...",config);

          config.headings = originalOrder.map(function(id){
            var heading = _.find(config.headings,function(head){return head.id === id});
            if (heading) {
              heading.hidden = false;
              return heading;
            }
          });

          config.headings.pristine = true;
        };
      }
    }
  }

  function EntityPageCountsTable(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        type: "@",
        parentFieldName: "@",
        parentId: "@",
        data: "=",
        showParticipants: '='
      },
      replace: true,
      templateUrl: "components/tables/templates/entity-page-counts-table.html",
      controller: function($scope,$element){
                    $scope.keyName = "data_type";
                    $scope.tableId = "available-data-table";
                    if($scope.type === "experimental-strategy") {
                      $scope.keyName= "experimental_strategy";
                      $scope.tableId = "experimental-strategy-table";
                    }
                    $scope.names = ['Clinical',
                            'Raw microarray data',
                            'Raw sequencing data',
                            'Simple nucleotide variation',
                            'Copy number variation',
                            'Structural rearrangement',
                            'Gene expression',
                            'Protein expression',
                            'DNA methylation',
                            'Other'];

                    if($scope.type === "experimental-strategy") {
                    $scope.names = [ 'Genotyping array',
                                'Gene expression array',
                                'Exon array',
                                'miRNA expression array',
                                'Methylation array',
                                'CGH array',
                                'MSI-Mono-Dinucleotide assay',
                                'WGS',
                                'WGA',
                                'WXS',
                                'RNA-seq',
                                'miRNA-seq',
                                'ncRNA-seq',
                                'WCS',
                                'CLONE',
                                'POOLCLONE',
                                'AMPLICON',
                                'CLONEEND',
                                'FINISHING',
                                'ChIP-seq',
                                'MNase-seq',
                                'DNase-Hypersensitivity',
                                'Bisulfite-Seq',
                                'EST',
                                'FL-cDNA',
                                'CTS',
                                'MRE-seq',
                                'MeDIP-seq',
                                'MBD-seq',
                                'Tn-seq',
                                'FAIRE-seq',
                                'SELEX',
                                'RIP-seq',
                                'ChIA-PET',
                                'DNA-Seq',
                                'Total RNA-Seq',
                                'VALIDATION',
                                'OTHER'
                              ];
                              }

        $scope.dataTransformed = _.reduce($scope.data, function(result, dataType) {
        result[dataType[$scope.keyName]] = {"file_count": dataType['file_count'],
                                                     "participant_count": dataType['participant_count']
                                                    };
        return result;
      }, {});
        

      }
    }
  }

  angular.module("tables.directives", ["tables.controllers"])
      .directive("exportTable", ExportTable)
      .directive("sortTable", SortTable)
      .directive("resetTable", ResetTable)
      .directive("gdcTable", GDCTable)
      .directive("arrangeColumns", ArrangeColumns)
      .directive("entityPageCountsTable", EntityPageCountsTable);
}

