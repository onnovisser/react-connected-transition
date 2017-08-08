import { Component, Children, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Deferred from './Deferred';
import transitions from './transitions';

class ConnectedTransition extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    exit: PropTypes.bool,
  };

  static defaultProps = {
    exit: false,
  };

  componentDidMount() {
    this._node = findDOMNode(this);
    if (!this.props.exit) this._onEnter();
  }

  componentDidUpdate(prevProps) {
    const { exit } = this.props;

    if (prevProps.exit !== exit) {
      if (exit) {
        this._onLeave();
      } else {
        this._onEnter();
      }
    }
  }

  componentWillUnmount() {
    if (!this.props.exit) this._onLeave();
  }

  _getData() {
    return {
      bounds: this._node && this._node.getBoundingClientRect(),
      style: { ...window.getComputedStyle(this._node) },
      data:
        this._component.getTransitionData &&
        this._component.getTransitionData(),
    };
  }

  _onEnter() {
    const { name } = this.props;

    set(name, 'enter', (this._data = this._getData()));
    request(name, 'exit').then(this._callEnter);
    clearTransitionWithDelay(name);
  }

  _onLeave() {
    const { name } = this.props;

    set(name, 'exit', (this._data = this._getData()));
    request(name, 'enter').then(this._callLeave);
    clearTransitionWithDelay(name);
  }

  _callEnter = data => {
    // It's possible for the component to be unmounted before this is called, so double-check here
    if (this._component && this._component.componentWillEnter) {
      this._component.componentWillEnter(data, this._data);
    }
  };

  _callLeave = data => {
    if (this._component && this._component.componentWillLeave) {
      this._component.componentWillLeave(this._data, data);
    }
  };

  _setRef = ref => {
    this._component = ref;
  };

  render() {
    return cloneElement(Children.only(this.props.children), {
      ref: this._setRef,
    });
  }
}

function request(name, prop) {
  return getTransition(name)[prop].promise;
}

function set(name, prop, value) {
  getTransition(name)[prop].resolve(value);
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

export default ConnectedTransition;
