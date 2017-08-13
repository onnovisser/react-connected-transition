import React, { Component } from 'react';
import { node } from 'prop-types';
import { TweenMax, Power3 } from 'gsap';

class TransitionPosition extends Component {
  static propTypes = {
    children: node.isRequired,
  };

  componentWillEnter(from, to) {
    TweenMax.from(this.node, 0.4, {
      x: from.bounds.left - to.bounds.left,
      y: from.bounds.top - to.bounds.top,
      ease: Power3.easeInOut,
      onComplete: () => TweenMax.set(this.node, { clearProps: 'all' }),
    });
  }

  componentWillLeave() {
    TweenMax.set(this.node, { opacity: 0 });
  }

  render() {
    return (
      <div ref={c => (this.node = c)}>
        {this.props.children}
      </div>
    );
  }
}

export default TransitionPosition;
