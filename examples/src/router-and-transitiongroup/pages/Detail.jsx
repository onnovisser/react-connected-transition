import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import { Redirect } from 'react-router-dom';
import ConnectedTransition from 'react-connected-transition';
import Transition from 'react-transition-group/Transition';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import styled, { css } from 'react-emotion';
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

  onTitleEnter = (from, to) => {
    TweenMax.from(this.text, 0.4, {
      opacity: 0,
      y: from.bounds.top - to.bounds.top,
      ease: Power3.easeInOut,
    });
  };

  onTitleLeave = (from, to) => {
    TweenMax.to(this.text, 0.4, {
      opacity: 0,
      y: to.bounds.top - from.bounds.top,
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
        <TransitionGroup>
          <Transition key={id} timeout={400}>
            {state =>
              <DetailView state={state}>
                <div className={imageClass}>
                  <BackButton to="/">Back to overview</BackButton>
                  {prevIndex && <ArrowButton to={`/detail/${prevIndex}`} />}
                  {nextIndex &&
                    <ArrowButton to={`/detail/${nextIndex}`} flipped />}
                  <ConnectedTransition name={`image${id}`} exit={exit}>
                    <TransitionPositionAndScale>
                      <Image src={item.image} />
                    </TransitionPositionAndScale>
                  </ConnectedTransition>
                </div>

                <ConnectedTransition
                  onEnter={this.onTitleEnter}
                  onLeave={this.onTitleLeave}
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
              </DetailView>}
          </Transition>
        </TransitionGroup>
      </Page>
    );
  }
}

const transitionStyles = {
  entering: css`opacity: 1`,
  entered: css`opacity: 1`,
};

const DetailView = styled.div`
  position: absolute;
  width: calc(100vw - 50px);
  opacity: 0;
  transition: opacity 400ms ease-in-out;
  ${p => transitionStyles[p.state]};

  & > * + * {
    margin-top: 30px;
  }
`;

const imageClass = css`
  height: 50vw;
  position: relative;

  @media (min-width: 600px) {
    width: 100%;
    height: 25vw;
  }
`;

export default withTransition(Detail);
