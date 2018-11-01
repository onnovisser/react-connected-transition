import createDeferredPromise from './createDeferredPromise';

const transitions = {};

function set(name, prop, value) {
  getTransition(name)[prop].resolve(value);
}

function request(name, prop) {
  return getTransition(name)[prop].promise;
}

function getTransition(name) {
  return (
    transitions[name] ||
    (transitions[name] = {
      enter: createDeferredPromise(),
      exit: createDeferredPromise(),
    })
  );
}

// To prevent transitioning later on, when we're not doing so right away
function clearTransitionWithDelay(name) {
  setTimeout(() => {
    delete transitions[name];
  }, 100);
}

export { set, request, clearTransitionWithDelay, transitions };
