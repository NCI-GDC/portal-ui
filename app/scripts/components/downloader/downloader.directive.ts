module ngApp.components.downloader.directive {

  /* @ngInject */
  function Downloader(
    $window: ng.IWindowService,
    $timeout: ng.ITimeoutService,
    $cookies: ng.cookies.ICookiesService,
    $uibModal: any,
    notify: INotifyService,
    $rootScope: IRootScope,
    $log: ng.ILogService): ng.IDirective {

    const _$ = $window.jQuery;
    const iFrameIdPrefix = '__downloader_iframe__';
    const formIdPrefix = '__downloader_form__';
    const waitTime = 2000; // 2 seconds
    notify.config({ duration: 20000 });

    const progressChecker = (
      iFrame: ng.IAugmentedJQuery,
      cookieKey: string,
      downloadToken: string,
      inProgress: () => {},
      done: () => {}): void => {

      inProgress();
      const timeoutInterval = 6;
      var attempts = 0;
      var timeoutPromise = null;

      const cookieStillThere = (): boolean => downloadToken === $cookies.get(cookieKey);
      const handleError = (): string => {
        const getMessage = (): string => JSON.parse(iFrame.contents().find('body pre').text()).message;
        const errorMessage = _.flow(
          _.attempt,
          (e) => _.isError(e) ? 'GDC download service is currently experiencing issues.' : e)(getMessage);
        $log.error('Download failed: ', errorMessage);
        return errorMessage;
      };
      const notifyScope = $rootScope.$new();
      const finished = (): void => {
        timeoutPromise = null;
        iFrame.remove();
        notify.closeAll();
        notifyScope.$destroy();
        done();
      };
      notifyScope.cancelDownload = (): void => {
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }
        finished();
      };
      const checker = (): void => {
        if (iFrame[0].__frame__loaded) {
          // The downloadToken cookie is removed before the server sends the response
          if (cookieStillThere()) {
            handleError();
            $cookies.remove(cookieKey);
            finished();

            $uibModal.open({
              templateUrl: 'core/templates/internal-server-error.html',
              controller: 'WarningController',
              controllerAs: 'wc',
              backdrop: 'static',
              keyboard: false,
              backdropClass: 'warning-backdrop',
              animation: false,
              size: 'lg'
            });
          } else {
            // A download should be now initiated.
            finished();
          }
        } else if (cookieStillThere()) {
          if (++attempts % timeoutInterval === 0) {
            $log.warn('Download checker timed out.');
            notify.closeAll();
            notify({
              message: null,
              messageTemplate: '<span>Hang in, download generation in progress...</span><br /><br /> \
                <a data-ng-click="cancelDownload()"><i class="fa fa-times-circle-o"></i> Cancel Download</a>',
              container: '#notification',
              classes: 'alert-warning',
              scope: notifyScope
            });
          }

          timeoutPromise = $timeout(checker, waitTime);
        } else {
          // In case the download is initiated without triggering the iFrame to reload
          finished();
        }
      };

      timeoutPromise = $timeout(checker, waitTime);
    };

    const hashString = (s) => s.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0);
    const toHtml = (key, value): string =>
      '<input type="hidden" name="' + key + '" value="' +
      (_.isPlainObject(value) ? JSON.stringify(value).replace(/"/g, '&quot;') : value) +
      '" />';
    // TODO: this should probably be factored out.
    const arrayToStringFields = ['expand', 'fields', 'facets'];
    const arrayToStringOnFields = (key, value, fields) => _.includes(fields, key) ? [].concat(value).join() : value;

    return {
      restrict: 'A',
      link: (scope, element) => {
        scope.download = (params, apiEndpoint, target = () => element, method = 'GET') => {
          // a cookie value that the server will remove as a download-ready indicator
          const downloadToken = _.uniqueId('' + (+ new Date()) + '-');
          const cookieKey = hashString(JSON.stringify(params)) + '-' + downloadToken;
          const iFrameId = iFrameIdPrefix + downloadToken;
          const formId = formIdPrefix + downloadToken;
          $cookies.put(cookieKey, downloadToken);

          const fields = _.reduce(_.assign(params, {downloadCookieKey: cookieKey}), (result, value, key) => {
            const paramValue = arrayToStringOnFields(key, value, arrayToStringFields);
            return result + [].concat(paramValue).reduce((acc, v) => acc + toHtml(key, v), '');
          }, '');
          const formHtml = '<form method="' + method.toUpperCase() + '" id="' + formId +
            '" action="' + apiEndpoint + '" style="display: none">' + fields + '</form>';

          _$('<iframe id="' + iFrameId +
            '" style="display: none" src="about:blank" onload="this.__frame__loaded = true;"></iframe>')
            // Appending to document body to allow navigation away from the current page and downloads in the background
            .appendTo('body');

          const iFrame = _$('#' + iFrameId);
          iFrame[0].__frame__loaded = false;
          iFrame.ready(() => {
            const iFrameBody = iFrame.contents().find('body');
            iFrameBody.append(formHtml);

            const form = iFrameBody.find('#' + formId);
            form.submit();
          });

          return _.partial(progressChecker, iFrame, cookieKey, downloadToken);
        };
      }
    };
  }

  angular.module('downloader.directive', ["cgNotify"])
    .directive('downloader', Downloader);
}
