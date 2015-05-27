module ngApp.components.tables.directives.tableicious {

    function tableiciousCell($log: ng.ILogService){
        return {
            restrict:"AE",
            controller:function($scope, $element,$compile,$filter, TableService,UserService){
                function doCompile() {
                    if ($scope.heading.compile) {
                        $element.empty();
                        $scope.row = $scope.$parent.datum;

                        var htm;
                        try {
                            htm = $scope.heading.compile($scope);
                        } catch (e) {
                            htm = '<span>?</span>';
                            $log.error(e);
                        }

                        var compiled = $compile(htm)($scope);
                        $element.append(compiled);
                    }
                  
                  $scope.UserService = UserService;
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