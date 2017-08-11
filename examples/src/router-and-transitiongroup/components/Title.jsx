import React, { Component } from 'react';
import { css } from 'emotion/react';

class Title extends Component {
  state = {};

  componentWillEnter(from, to) {
    const animateFrom = {
      height: from.bounds.height,
      width: from.bounds.width,
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
      <h1 className={className} ref={c => (this.node = c)}>
        {this.props.children}
      </h1>
    );
  }
}

const className = css`
  font-weight: 300;
  font-size: calc(20px + 2vw);
`

export default Title;
