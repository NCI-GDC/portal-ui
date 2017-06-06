// @flow

import { saveAs } from "filesaver.js";

export default function download(
  body: string,
  format: string,
  filename: string,
): void {
  const type = {
    JSON: "application/json",
    TSV: "text/tab-separated-values",
    CSV: "text/csv",
    XML: "text/xml",
    BLOB: "octet/stream",
  }[format.toUpperCase()];

  saveAs(new Blob([body], { type }), filename);
}
