module ngApp.components.tables.directives.tableicious {

    function tableiciousCell(){
        return {
            restrict:"AE",
            controller:function($scope, $element,$compile,$filter){
                
                $scope.$watch('$parent.datum',function(){console.log("datum changed."); draw()},true);

                $scope.$filter = $filter;
                
                function draw(){
                    if ($scope.heading.compile) {
                        $element.html('');
                    }
                    _.defer(function(){

                        if ($scope.heading.compile) {
                            $scope.row = $scope.$parent.datum;
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
    }

    angular.module("tableicious.directive.cell",[])
        .directive("tableiciousCell",tableiciousCell);
}