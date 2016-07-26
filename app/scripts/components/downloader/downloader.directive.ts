module ngApp.components.downloader.directive {

  /* @ngInject */
  function Downloader(
    $window: ng.IWindowService,
    $timeout: ng.ITimeoutService,
    $cookies: ng.cookies.ICookiesService,
    $uibModal: any,
    notify: INotifyService,
    $rootScope: IRootScope,
    $log: ng.ILogService
  ): ng.IDirective {

    const cookiePath = document.querySelector('base').getAttribute('href');
    const _$ = $window.jQuery;
    const iFrameIdPrefix = '__downloader_iframe__';
    const formIdPrefix = '__downloader_form__';
    const getIframeResponse = (iFrame: ng.IAugmentedJQuery): Object => JSON.parse(iFrame.contents().find('body pre').text());
    const showErrorModal = (error: Object): void => {
      const warning = error.warning || error.message;

      $uibModal.open({
        templateUrl: 'core/templates/' + (warning ? 'generic-warning' : 'internal-server-error') + '.html',
        controller: 'WarningController',
        controllerAs: 'wc',
        backdrop: 'static',
        keyboard: false,
        backdropClass: 'warning-backdrop',
        animation: false,
        size: 'lg',
        resolve: {
          warning: () => warning
        }
      });
    };
    notify.config({ duration: 20000 });

    const progressChecker = (
      iFrame: ng.IAugmentedJQuery,
      cookieKey: string,
      downloadToken: string,
      inProgress: () => {},
      done: () => {},
      altMessage: boolean
    ): void => {

      inProgress();
      const waitTime = 1000; // 1 second
      const timeoutInterval = 10;
      var attempts = 0;
      var timeoutPromise = null;

      const cookieStillThere = (): boolean => downloadToken === $cookies.get(cookieKey);
      const handleError = (): Object => {
        const error = _.flow(_.attempt,
          (e) => _.isError(e) ? {message: 'GDC download service is currently experiencing issues.'} : e)(_.partial(getIframeResponse, iFrame));
        $log.error('Download failed: ', error);
        return error;
      };
      const notifyScope = $rootScope.$new();
      const finished = (): void => {
        $log.info('Download check count & wait interval (in milliseconds):', attempts, waitTime);
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

      const simpleMessage = '<span>Download preparation in progress. Please wait…</span><br /><br /> \
        <a data-ng-click="cancelDownload()"><i class="fa fa-times-circle-o"></i> Cancel Download</a>';

      const detailedMessage = '<span>The download preparation can take time due to different factors (total file size, number of files, or number of concurrent users). \
        We recommend that you use the <a href="https://gdc.nci.nih.gov/access-data/gdc-data-transfer-tool" target="_blank">GDC Data Transfer Tool</a> or cancel the download and try again later.</span><br /><br /> \
        <a data-ng-click="cancelDownload()"><i class="fa fa-times-circle-o"></i> Cancel Download</a>';

      const checker = (): void => {
        if (iFrame[0].__frame__loaded) {
          // The downloadToken cookie is removed before the server sends the response
          if (cookieStillThere()) {
            const error = handleError();
            $cookies.remove(cookieKey);
            finished();
            showErrorModal(error);
          } else {
            // A download should be now initiated.
            finished();
          }
        } else if (cookieStillThere()) {
          if (++attempts % timeoutInterval === 0) {
            notify.closeAll();
            notify({
              message: null,
              messageTemplate: (altMessage && attempts > timeoutInterval * 2) ? detailedMessage : simpleMessage,
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

    const cookielessChecker = (
      iFrame: ng.IAugmentedJQuery,
      inProgress: any, // not used but obligated to the interface
      done: () => {}
    ): void => {

      const waitTime = 5000; // 5 seconds
      const finished = (): void => {
        iFrame.remove();
        done();
      };
      var attempts = 30;
      const checker = (): void => {
        // Here we simply try to read the error message if the iFrame DOM is reloaded; for a successful download,
        // the error message is not in the DOM therefore #getIframeResponse will return a JS error.
        const error = _.attempt(_.partial(getIframeResponse, iFrame));
        if (_.isError(error)) {
          // Keep waiting until we exhaust `attempts` then we do the cleanup.
          if (--attempts < 0) {
            finished();
          } else {
            $timeout(checker, waitTime);
          }
        } else {
          finished();
          showErrorModal(error);
        }
      };

      $timeout(checker, waitTime);
    };

    const hashString = (s: string): number => s.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0);
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
          const downloadToken = _.uniqueId('' + (+ new Date()) + '-');
          const iFrameId = iFrameIdPrefix + downloadToken;
          const formId = formIdPrefix + downloadToken;
          // a cookie value that the server will remove as a download-ready indicator
          const cookieKey = navigator.cookieEnabled ?
            Math.abs(hashString(JSON.stringify(params) + downloadToken)).toString(16) : null;
          if (cookieKey) {
            $cookies.put(cookieKey, downloadToken);
            _.assign(params, {
              downloadCookieKey: cookieKey,
              downloadCookiePath: cookiePath
            });
          }

          const fields = _.reduce(params, (result, value, key) => {
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

          return cookieKey ? _.partial(progressChecker, iFrame, cookieKey, downloadToken) :
            _.partial(cookielessChecker, iFrame);
        };
      }
    };
  }

  angular.module('downloader.directive', ["cgNotify"])
    .directive('downloader', Downloader);
}
