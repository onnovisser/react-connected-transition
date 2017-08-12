import React, { Component } from 'react';
import { css } from 'emotion/react';

class TransformPostionAndScale extends Component {
  componentWillEnter(from, to) {
    const animateFrom = {
      height: from.bounds.height,
      width: from.bounds.width,
      left: from.bounds.left - to.bounds.left,
      top: from.bounds.top - to.bounds.top,
      ease: Power3.easeInOut,
      transform: from.style.transform,
    };
    TweenMax.set(this.node, { zIndex: 10 });
    TweenMax.from(this.node, 0.4, animateFrom);
  }

  componentWillLeave() {
    TweenMax.set(this.node, { opacity: 0 });
  }

  render() {
    return (
      <div className={wrapperClassName}>
        <div
          className={imageClassName}
          ref={c => (this.node = c)}
        >
        {this.props.children}
        </div>
      </div>
    );
  }
}

const wrapperClassName = css`
  width: 100%;
  height: 100%;
  position: relative;
`;

const imageClassName = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export default TransformPostionAndScale;
