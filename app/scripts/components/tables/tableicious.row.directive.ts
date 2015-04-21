module ngApp.components.tables.directives.tableicious {

    function tableiciousRow($log: ng.ILogService){
        return {
            restrict:"AE",
            link: function($scope) {
                if ($scope.$last) {
                    $scope.$emit("tableicious-loaded");
                }
            }
        }
    }

    angular.module("tableicious.directive.row",[])
        .directive("tableiciousRow",tableiciousRow);
}