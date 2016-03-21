module ngApp.components.downloader.directive {

  /* @ngInject */
  function Downloader($window, $timeout, $cookies): ng.IDirective {
    const formId = '___GdcDataPortalDownloader___';
    const cookieKey = 'downloadToken';
    const waitTime = 2000; // 2 seconds

    const progressChecker = (downloadToken, inProgess, done) => {
      var attempts = 15;
      inProgess();

      const checker = () => {
        if (downloadToken === $cookies.get(cookieKey)) {
          if (--attempts > 0) {
            $timeout(checker, waitTime);
          } else {
            done();
            throw new Error('Download timed out!');
          }
        } else {
          done();
        }
      };

      $timeout(checker, waitTime);
    };

    const toHtml = (key, value) =>
      '<input type="hidden" name="' + key + '" value="' +
      (_.isPlainObject(value) ? JSON.stringify(value).replace(/"/g, '&quot;') : value) +
      '" />';

    return {
      restrict: 'A',
      link: (scope, element) => {
        scope.download = (params, apiEndpoint, target = () => element, method = 'GET') => {
          const domTarget = target(element);
          // a cookie value that the server will remove as a download-ready indicator
          const downloadToken = _.uniqueId('' + (+ new Date()) + '-');

          const fields = _.reduce (params, (result, value, key) => {
            return result + [].concat(value).reduce((acc, v) => acc + toHtml(key, v), '');
          }, '');
          const $_ = $window.jQuery;

          $cookies.put(cookieKey, downloadToken);
          $_('<form method="' + method.toUpperCase() + '" id="' + formId + '" action="' + apiEndpoint +
            '" style="display: none">' + fields + '</form>')
            .appendTo(domTarget);

          const form = $_('#' + formId);
          form.submit();
          form.remove();

          return _.partial(progressChecker, downloadToken);
        };
      }
    };
  }

  angular.module('downloader.directive', [])
    .directive('downloader', Downloader);
}
