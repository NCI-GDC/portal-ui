module ngApp.cases.directives {
  const ExportCasesButton = (config: IGDCConfig): ng.IDirective => ({
    restrict: 'E',
    replace: true,
    scope: {
      filterKeyValues: '=',
      fields: '=',
      expands: '=',
      size: '=',
      filename: '=',
      fileType: '@',
      textNormal: '@',
      textInProgress: '@',
      styleClass: '@',
      icon: '@'
    },
    template: '<a ng-class="[styleClass || \'btn btn-primary\']" data-downloader> \
              <i class="fa {{icon || \'fa-download\'}}" ng-class="{\'fa-spinner\': active, \'fa-pulse\': active}" /> \
              <span ng-if="textNormal"><span ng-if="! active">&nbsp;{{ ::textNormal }}</span> \
              <span ng-if="active">&nbsp;{{ ::textInProgress }}</span></span></a>',
    link: ($scope, $element, $attrs) => {
      const scope = $scope;
      const inProgress = () => {
        scope.active = true;
        $attrs.$set('disabled', 'disabled');
      };
      const done = () => {
        scope.active = false;
        $element.removeAttr('disabled');
      };
      const url = config.api + '/cases';
      const filters = {
        op: 'and',
        content: _.values(_.mapValues(scope.filterKeyValues, (value, key) => ({
          op: 'in',
          content: {
            field: key,
            value: [].concat(value)
          }
        })))
      };

      const params = _.merge({
        attachment: true,
        filters: filters,
        fields: ['case_id'].concat(scope.fields || []).join(),
        expand: [].concat(scope.expands || []).join(),
        format: scope.fileType || 'JSON',
        pretty: true,
        size: scope.size || 10000
      }, scope.filename ? {filename: scope.filename} : {});

      $element.on('click', () => {
        const checkProgress = scope.download(params, url, () => $element, 'POST');

        checkProgress(inProgress, done);
      });
      scope.active = false;
    }
  });

  angular.module('cases.directives', [])
    .directive('exportCasesButton', ExportCasesButton);
}
