module ngApp.components.tables.directives.tableicious {

    function tableiciousCell($log: ng.ILogService){
        return {
            restrict:"AE",
            controller:function($scope, $element,$compile,$filter){
                function doCompile() {
                    if ($scope.heading.compile) {
                        $element.empty();
                        $scope.row = $scope.$parent.datum;

                        var files = _.find($scope.row, (item) => {
                            return item.id === "files";
                        });

                        var htm;
                        if (!files) {
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
                }

                $scope.$filter = $filter;
                _.defer(function(){

                    if ($scope.heading.compile) {
                        doCompile();

                        $scope.$watch((scope)=> {
                            return scope.$parent.datum;
                        }, () => {
                            doCompile();
                        }, true);
                    }

                })

            }
        }
    }

    angular.module("tableicious.directive.cell",[])
        .directive("tableiciousCell",tableiciousCell);
}