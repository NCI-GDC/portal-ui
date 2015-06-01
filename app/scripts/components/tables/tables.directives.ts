module ngApp.components.tables.directives {

  import IGDCWindowService = ngApp.models.IGDCWindowService;

  interface ITableDirectiveScope extends ng.IScope {
     filtersRevealed:boolean;
  }

  /* @ngInject */
  function ArrangeColumns($window, UserService): ng.IDirective {

    return {
      restrict: "EA",
      scope: {
        title: "@",
        headings:"="
      },
      replace: true,
      templateUrl: "components/tables/templates/arrange-columns.html",
      link:function($scope) {
        $scope.UserService = UserService;
        function saveSettings() {
          var save = _.map($scope.headings, h => _.pick(h, 'id', 'hidden'));
          $window.localStorage.setItem($scope.title + '-col', angular.toJson(save));
        }
        
        var defaults = _.cloneDeep($scope.headings);
        var decompressed = $window.localStorage.getItem($scope.title + '-col');
        var saved = decompressed ? JSON.parse(decompressed) : [];
        
        $scope.headings = saved.length ? 
          _.map(saved, s => _.merge(_.find($scope.headings, {id: s.id}), s)) :
          $scope.headings;
        
        $scope.restoreDefaults = function() {
          $scope.headings = _.cloneDeep(defaults); 
        } 
        $scope.toggleVisibility = function (item) { 
          item.hidden = !item.hidden;
          saveSettings(); 
        };
        $scope.sortOptions = { 
          orderChanged: saveSettings 
        };
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
        config: '=',
        update: "=",
        data: "="
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
        endpoint: "@",
        clientSide: "="
      },
      replace: true,
      templateUrl: "components/tables/templates/gdc-table.html",
      controller: "GDCTableController as gtc"
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
        showParticipants: "="
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
                      $scope.names = _.uniq($scope.data.map(function(d){return d.experimental_strategy}));
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
      .directive("gdcTable", GDCTable)
      .directive("arrangeColumns", ArrangeColumns)
      .directive("entityPageCountsTable", EntityPageCountsTable);
}

