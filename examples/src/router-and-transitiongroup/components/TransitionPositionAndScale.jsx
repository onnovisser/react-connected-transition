import React, { Component } from 'react';
import { css } from 'emotion/react';
import { node } from 'prop-types';
import { TweenMax, Power3 } from 'gsap';

class TransformPostionAndScale extends Component {
  static propTypes = {
    children: node.isRequired,
  };

  componentWillEnter(from, to) {
    TweenMax.from(this.node, 0.4, {
      height: from.bounds.height,
      width: from.bounds.width,
      left: from.bounds.left - to.bounds.left,
      top: from.bounds.top - to.bounds.top,
      ease: Power3.easeInOut,
      transform: from.style.transform,
      onComplete: () => TweenMax.set(this.node, { clearProps: 'all' }),
    });
  }

  componentWillLeave() {
    TweenMax.set(this.node, { opacity: 0 });
  }

  render() {
    return (
      <div className={wrapperClass}>
        <div className={imageClass} ref={c => (this.node = c)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const wrapperClass = css`
  width: 100%;
  height: 100%;
  position: relative;
`;

const imageClass = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export default TransformPostionAndScale;
