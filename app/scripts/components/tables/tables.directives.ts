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
        size: "@"
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

  function ResetTable(): ng.IDirective {
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
        console.log("Reset table init...");
        $scope.reset = function(){
          console.log("Reset...",config);

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

  angular.module("tables.directives", ["tables.controllers"])
      .directive("exportTable", ExportTable)
      .directive("sortTable", SortTable)
      .directive("resetTable", ResetTable)
      .directive("gdcTable", GDCTable)
      .directive("arrangeColumns", ArrangeColumns);
}

