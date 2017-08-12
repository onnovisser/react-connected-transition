import React, { Component } from 'react';

class TransitionPosition extends Component {

  componentWillEnter(from, to) {
    const animateFrom = {
      x: from.bounds.left - to.bounds.left,
      y: from.bounds.top - to.bounds.top,
      ease: Power3.easeInOut,
    };
    TweenMax.set(this.node, { zIndex: 10 });
    TweenMax.from(this.node, 0.4, animateFrom);
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
