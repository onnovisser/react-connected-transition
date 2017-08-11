import React, { Component } from 'react';
import styled from 'emotion/react';

class Hero extends Component {
  state = {};

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
      <Wrapper>
        <Image
          style={{ backgroundImage: `url(${this.props.src})` }}
          innerRef={c => (this.node = c)}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: 200px;
  position: relative;
`;

const Image = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: no-repeat center/cover;
`;

export default Hero;
