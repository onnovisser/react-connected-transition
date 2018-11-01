function createDeferredPromise() {
  const obj = {};
  obj.promise = new Promise((resolve, reject) => {
    obj.reject = reject;
    obj.resolve = resolve;
  });

  return obj;
}

export default createDeferredPromise;
