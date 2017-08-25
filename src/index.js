import { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import isClassComponent from './isClassComponent';
import { set, request, clearTransitionWithDelay } from './transitions';

class ConnectedTransition extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    getTransitionData: PropTypes.func,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    exit: PropTypes.bool,
  };

  static defaultProps = {
    getTransitionData: noop,
    onEnter: noop,
    onLeave: noop,
    exit: false,
  };

  componentDidMount() {
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
      ...(this._component &&
        this._component.getTransitionData &&
        this._component.getTransitionData()),
      ...this.props.getTransitionData(),
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
    this.props.onEnter(data, this._data);
  };

  _callLeave = data => {
    if (this._component && this._component.componentWillLeave) {
      this._component.componentWillLeave(this._data, data);
    }
    this.props.onLeave(this._data, data);
  };

  _setRef = ref => {
    this._component = ref;
  };

  render() {
    const { children } = this.props;
    return cloneElement(
      Children.only(children),
      isClassComponent(children.type) && {
        ref: this._setRef,
      }
    );
  }
}

function noop() {}

export default ConnectedTransition;
