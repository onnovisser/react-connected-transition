import React, { Component } from 'react';
import { object, node } from 'prop-types';
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
  static propTypes = {
    children: node.isRequired,
  };

  static childContextTypes = {
    transition: object,
  };

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
    const { ...transitionProps } = this.props;
    delete transitionProps.children;

    return (
      <Transition timeout={500} {...transitionProps}>
        {this.registerState}
      </Transition>
    );
  }
}

export default TransitionRouter;
