module ngApp.components.ui.file {

  class FileSize {
    private static BYTES_PB = 1000000000000000;
    private static BYTES_TB_LIMIT = 999999500000000;
    private static BYTES_TB = 1000000000000;
    private static BYTES_GB_LIMIT = 999999500000;
    private static BYTES_GB = 1000000000;
    private static BYTES_MB_LIMIT = 999500000;
    private static BYTES_MB = 1000000;
    private static BYTES_KB_LIMIT = 999500;
    private static BYTES_KB = 1000;

    constructor() {
      return function (val: number) {
        var formattedVal: string = "0 B";

        if (val >= FileSize.BYTES_TB_LIMIT) {
          formattedVal = (val / FileSize.BYTES_PB).toFixed(2) + " PB";
        } else if (val >= FileSize.BYTES_GB_LIMIT) {
          formattedVal = (val / FileSize.BYTES_TB).toFixed(2) + " TB";
        } else if (val >= FileSize.BYTES_MB_LIMIT) {
          formattedVal = (val / FileSize.BYTES_GB).toFixed(2) + " GB";
        } else if (val >= FileSize.BYTES_KB_LIMIT) {
          formattedVal = (val / FileSize.BYTES_MB).toFixed(2) + " MB";
        } else if (val >= FileSize.BYTES_KB) {
          formattedVal = (val / FileSize.BYTES_KB).toFixed(0) + " KB";
        } else if (val) {
          formattedVal = val + " B";
        }

        return formattedVal;
      };
    }
  }

  angular.module("file.filters", [])
      .filter("size", FileSize);
}
