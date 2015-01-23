module ngApp.components.tables.directives.tableicious {

    function tableiciousCell(){
        return {
            restrict:"AE",
            controller:function($scope, $element,$compile,$filter){

                $scope.$filter = $filter;
                _.defer(function(){

                    if ($scope.heading.compile) {
                        //debugger;
                        var htm;
                        try {
                            htm = $scope.heading.compile($scope);
                        } catch (e) {
                            htm = '<span>?</span>'
                        }
                        var compiled = $compile(htm)($scope);
                        $element.append(compiled);
                    }

                })

            }
        }
    }

    angular.module("tableicious.directive.cell",[])
        .directive("tableiciousCell",tableiciousCell);
}