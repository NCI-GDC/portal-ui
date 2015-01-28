module ngApp.components.tables.directives.tableicious {

    function tableiciousHeader() {
        return {
            restrict:"AE",
            scope:{
                heading:'=',
                data:'=',
                paging: "="
            },
            controller:function($scope, $element,$compile){

                if ($scope.heading.compileHead) {
                    _.defer(function(){
                        var htm = $scope.heading.compileHead($scope);
                        var compiled = $compile(htm)($scope);
                        $element.append(compiled);
                    })
                }

            }
        }
    }

    angular.module("tableicious.directive.head",[])
        .directive("tableiciousHeader",tableiciousHeader);
}