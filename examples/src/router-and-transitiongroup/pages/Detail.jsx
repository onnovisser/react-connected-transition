import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import { Redirect } from 'react-router-dom';
import ConnectedTransition from 'react-connected-transition';
import { css } from 'emotion/react';
import { TweenMax, Power3 } from 'gsap';
import data from '../data/data';
import Text from '../components/Text';
import Page from '../components/Page';
import Image from '../components/Image';
import TransitionPosition from '../components/TransitionPosition';
import TransitionPositionAndScale from '../components/TransitionPositionAndScale';
import withTransition from '../containers/withTransition';
import ArrowButton from '../components/ArrowButton';
import BackButton from '../components/BackButton';

class Detail extends Component {
  static propTypes = {
    transitionState: string.isRequired, // Supplied by withTransition HOC
    // Supplied by Router
    match: shape({
      id: string,
    }).isRequired,
  };

  // componentDidUpdate() {
  //   if (this.props.transitionState === 'entering') {

  //   TweenMax.fromTo(
  //     this.text,
  //     0.6,
  //     { opacity: 0, y: 80 },
  //     { opacity: 1, y: 0, ease: Power3.easeOut},
  //     1
  //   );
  //   }
  // }

  onTitleEnter = (from, to) => {
    TweenMax.from(this.text, 0.4, {
      opacity: 0,
      y: from.bounds.top - to.bounds.top,
      ease: Power3.easeInOut,
    });
  };

  render() {
    const { transitionState, match } = this.props;
    const { id } = match.params;
    const item = data[id];
    const dataKeys = Object.keys(data);
    const itemIndex = dataKeys.indexOf(id);
    const prevIndex = dataKeys[itemIndex - 1];
    const nextIndex = dataKeys[itemIndex + 1];
    const exit = transitionState === 'exiting' || transitionState === 'exited';

    if (!item) {
      return <Redirect to="/" />;
    }

    return (
      <Page>
        <div className={imageClass}>
          <BackButton to="/">Back to countries</BackButton>
          {prevIndex && <ArrowButton to={`/detail/${prevIndex}`} />}
          {nextIndex && <ArrowButton to={`/detail/${nextIndex}`} flipped />}
          <ConnectedTransition name={`image${id}`} exit={exit}>
            <TransitionPositionAndScale>
              <Image src={item.image} />
            </TransitionPositionAndScale>
          </ConnectedTransition>
        </div>

        <ConnectedTransition
          onEnter={this.onTitleEnter}
          name={`title${id}`}
          exit={exit}
        >
          <TransitionPosition>
            <Text heading>
              {item.title}
            </Text>
          </TransitionPosition>
        </ConnectedTransition>
        <div ref={c => (this.text = c)}>
          <Text>
            {item.description}
          </Text>
        </div>
      </Page>
    );
  }
}

const imageClass = css`
  height: 50vw;
  position: relative;

  @media (min-width: 600px) {
    width: 100%;
    height: 25vw;
  }
`;

export default withTransition(Detail);
