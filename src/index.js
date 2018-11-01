import { Children, cloneElement, useRef } from 'react';
import useLayoutEffect from './useLayoutEffect';
import canHaveRef from './canHaveRef';
import { set, request, clearTransitionWithDelay } from './transitions';

ConnectedTransition.defaultProps = {
  getTransitionData: noop,
  onEnter: noop,
  onLeave: noop,
  exit: false,
  passive: false,
};

function ConnectedTransition({
  exit,
  children,
  onEnter,
  onLeave,
  name,
  passive,
  getTransitionData,
}) {
  const childRef = useRef();
  const data = useRef();

  function handleEnter() {
    if (passive) {
      Promise.all([request(name, 'exit'), request(name, 'enter')]).then(
        ([from, to]) => {
          data.current = to;
          callEnter(from);
        }
      );
    } else {
      set(name, 'enter', (data.current = getData()));
      request(name, 'exit').then(callEnter);
    }
    clearTransitionWithDelay(name);
  }
  function handleLeave() {
    if (passive) {
      Promise.all([request(name, 'exit'), request(name, 'enter')]).then(
        ([from, to]) => {
          data.current = from;
          callLeave(to);
        }
      );
    } else {
      set(name, 'exit', (data.current = getData()));
      request(name, 'enter').then(callLeave);
    }
    clearTransitionWithDelay(name);
  }

  function getData() {
    return {
      ...(childRef.current &&
        childRef.current.getTransitionData &&
        childRef.current.getTransitionData()),
      ...getTransitionData(),
    };
  }

  function callEnter(transferedData) {
    // It's possible for the component to be unmounted before this is called, so double-check here
    if (childRef.current && childRef.current.componentWillEnter) {
      childRef.current.componentWillEnter(transferedData, data.current);
    }
    onEnter(transferedData, data.current);
  }

  function callLeave(transferedData) {
    if (childRef.current && childRef.current.componentWillLeave) {
      childRef.current.componentWillLeave(data.current, transferedData);
    }
    onLeave(data.current, transferedData);
  }

  useLayoutEffect(
    didUpdate => {
      if (!didUpdate && !exit) handleEnter();
      if (didUpdate) {
        if (exit) {
          handleLeave();
        } else {
          handleEnter();
        }
      }

      return () => {
        if (!exit) handleLeave();
      };
    },
    [exit]
  );

  return cloneElement(
    Children.only(children),
    canHaveRef(children.type) && {
      ref: childRef,
    }
  );
}

function noop() {}

export default ConnectedTransition;
