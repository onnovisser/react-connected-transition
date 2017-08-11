import React, { Component } from 'react';
import { object, shape } from 'prop-types';
import Transition from 'react-transition-group/Transition';

class TransitionState {
  listeners = [];
  state = null;

  setState(state) {
    this.state = state;
    this.listeners.forEach(f => f());
  }

  subscribe(f) {
    this.listeners.push(f);
  }

  unsubscribe(f) {
    this.listeners.splice(this.listeners.indexOf(f) >>> 0, 1);
  }
}

class TransitionRouter extends Component {
  static childContextTypes = {
    transition: object,
  };

  constructor(props) {
    super();
  }

  transition = new TransitionState();

  getChildContext() {
    return {
      transition: this.transition,
    };
  }

  registerState = state => {
    this.transition.setState(state);
    return this.props.children;
  };

  render() {
    const { children, ...transitionProps } = this.props;
    return (
      <Transition timeout={500} {...transitionProps}>
        {this.registerState}
      </Transition>
    );
  }
}

export default TransitionRouter;
