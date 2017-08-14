import React, { Component } from 'react';
import { object, node } from 'prop-types';
import TransitionComp from 'react-transition-group/Transition';

class Transition extends Component {
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
      <TransitionComp timeout={500} {...transitionProps}>
        {this.registerState}
      </TransitionComp>
    );
  }
}

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

export default Transition;
