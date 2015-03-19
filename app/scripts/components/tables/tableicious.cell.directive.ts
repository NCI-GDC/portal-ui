module ngApp.components.tables.directives.tableicious {

    function tableiciousCell($log: ng.ILogService){
        return {
            restrict:"AE",
            controller:function($scope, $element,$compile,$filter, TableService,UserService){
                function doCompile() {
                    if ($scope.heading.compile) {
                        $element.empty();
                        $scope.row = $scope.$parent.datum;

                        var files = _.find($scope.row, (item) => {
                            return item.id === "files";
                        });

                        var htm;
                        if (!files && $scope.$parent.heading.id === "add_to_cart_filtered") {
                            htm = "<span>--</span>";
                        } else {
                            try {
                                htm = $scope.heading.compile($scope);
                            } catch (e) {
                                htm = '<span>?</span>';
                                $log.error(e);
                            }
                        }

                        var compiled = $compile(htm)($scope);
                        $element.append(compiled);
                    }
                  
                  $scope.UserService = UserService;
                  
//                  $scope.template = TableService.getTemplate($scope.heading, $scope.field,$scope.row,$scope,$filter);
//                  $scope.sref = TableService.getSref($scope.heading, $scope.field,$scope.row,$scope,$filter);
//                  $scope.icon = TableService.getIcon($scope.heading, $scope.field,$scope.row,$scope,$filter);
                }
              

                _.defer(function(){
                    doCompile();

                    $scope.$watch((scope)=> {
                        return scope.$parent.datum;
                    }, () => {
                        doCompile();
                    }, true);
                    

                })

            }
        }
    }

    angular.module("tableicious.directive.cell",[])
        .directive("tableiciousCell",tableiciousCell);
}