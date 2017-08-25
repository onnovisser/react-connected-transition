import Deferred from './Deferred';

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
      enter: new Deferred(),
      exit: new Deferred(),
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
