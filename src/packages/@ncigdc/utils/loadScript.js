import loadScript from 'load-script';

export default function (src) {
  return new Promise(((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      resolve();
    } else {
      loadScript(src, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  }));
}
