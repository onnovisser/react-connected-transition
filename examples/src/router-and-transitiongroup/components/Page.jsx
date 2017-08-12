import React, { Component } from 'react';
import { css } from 'emotion/react';
import withTransition from '../containers/withTransition';

class Page extends Component {
  componentDidUpdate(prevProps) {
    const { transitionState } = this.props;
    if (prevProps.transitionState !== transitionState)
      if (transitionState === 'exiting') {
        // TweenMax.to(this.node, 0.5, { opacity: 0 });
      } else if (transitionState === 'entering') {
        // TweenMax.from(this.node, 0.5, { opacity: 0 });
      }
  }

  render() {
    return (
      <div className={wrapperClassName} ref={c => (this.node = c)}>
        <div className={innerClassName}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const wrapperClassName = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const innerClassName = css`
  padding: 25px;

  & > * + * {
    margin-top: 30px;
  }
`;

export default withTransition(Page);
