import React, { Component } from 'react';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'emotion/react';
import ConnectedTransition from 'react-connected-transition';
import withTransition from '../containers/withTransition';
import Text from './Text';
import Image from './Image';
import TransitionPosition from '../components/TransitionPosition';
import TransitionPositionAndScale from '../components/TransitionPositionAndScale';

class Card extends Component {
  static propTypes = {
    id: string.isRequired,
    title: string.isRequired,
    image: string.isRequired,
    transitionState: string.isRequired, // Supplied by withTransition HOC
  };

  state = {
    transitionEnter: false,
  };

  onTransitionEnter = (from, to) => {
    if (this.props.id === to.data.id) {
      this.setState({ transitionEnter: true });
    }
  };

  getID = () => ({
    id: this.props.id,
  });

  render() {
    const { id, title, image, transitionState } = this.props;
    const pageExit =
      transitionState === 'exiting' || transitionState === 'exited';

    return (
      <CardLink
        to={`/detail/${id}`}
        transitionState={transitionState}
        transitionEnter={this.state.transitionEnter}
      >
        <div className={imageClass}>
          <ConnectedTransition
            name={`image${id}`}
            exit={pageExit}
            onEnter={this.onTransitionEnter}
            getTransitionData={this.getID}
          >
            <TransitionPositionAndScale>
              <Image src={image} />
            </TransitionPositionAndScale>
          </ConnectedTransition>
        </div>

        <div className={textClass}>
          <ConnectedTransition name={`title${id}`} exit={pageExit}>
            <TransitionPosition>
              <Text heading>
                {title}
              </Text>
            </TransitionPosition>
          </ConnectedTransition>
        </div>
      </CardLink>
    );
  }
}

const transitionStyles = {
  entering: css`opacity: 1`,
  entered: css`opacity: 1`,
};

const CardLink = styled(Link)`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 5px 5px 40px -1px rgba(0,0,0,.2);
  opacity: 0;
  transition: opacity 400ms ease;

  &:nth-child(2n) {
    flex-direction: row-reverse;
  }

  ${p => transitionStyles[p.transitionState]};

  ${p => p.transitionEnter && css`transition: none`};

  @media (min-width: 600px) {
    height: 25vw;
  }
`;

const imageClass = css`
  width: 100%;
  height: 50vw;

  @media (min-width: 600px) {
    height: auto;
    width: 40%;
  }
`;

const textClass = css`
  width: 100%;
  min-height: 25vw;
  padding: 4vw;

  @media (min-width: 600px) {
    width: 60%;
  }
`;

export default withTransition(Card);
