module ngApp.components.ui.file {

  class FileSize {
    constructor() {
      return function (val: number) {
        function bytesToSize(bytes) {
          if (bytes === 0) {
            return "0 B";
          }
          var k = 1000;
          var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
          var i = Math.floor(Math.log(bytes) / Math.log(k));
          var ret = (bytes / Math.pow(k, i)).toFixed(2);
          var split = ret.split(".");

          if (split.length > 1 && split[1] === "00") {
            ret = split[0];

          }

          return ret + " " + sizes[i];
        }

        return bytesToSize(val);
      };
    }
  }

  angular.module("file.filters", [])
      .filter("size", FileSize);
}
