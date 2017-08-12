import React from 'react';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'emotion/react';
import ConnectedTransition from 'react-connected-transition';
import withTransition from '../containers/withTransition';
import Text from './Text';
import Image from './Image';
import TransitionPosition from '../components/TransitionPosition';
import TransitionPositionAndScale from '../components/TransitionPositionAndScale';

Card.propTypes = {
  id: string.isRequired,
  title: string.isRequired,
  image: string.isRequired,
  transitionState: string.isRequired, // Supplied by withTransition HOC
};

function Card({ id, title, image, transitionState }) {
  const exit = transitionState === 'exiting' || transitionState === 'exited';

  return (
    <CardLink to={`/detail/${id}`} exit={exit}>
      <div className={imageClassName}>
        <ConnectedTransition name={`image${id}`} exit={exit}>
          <TransitionPositionAndScale>
            <Image src={image} />
          </TransitionPositionAndScale>
        </ConnectedTransition>
      </div>

      <div className={textClassName}>
        <ConnectedTransition name={`title${id}`} exit={exit}>
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

const exitingClassName = css`
  opacity: 0;
  transition: opacity 400ms ease;
`

const CardLink = styled(Link)`
  display: flex;
  height: 25vw;
  width: 100%;
  background-color: white;
  box-shadow: 5px 5px 40px -1px rgba(0,0,0,.2);
  ${p => p.exit && exitingClassName};

  &:nth-child(2n) {
    flex-direction: row-reverse;
  }
`;

const imageClassName = css`
  width: 40%;
`;

const textClassName = css`
  padding: 4vw;
  width: 60%;
`;

export default withTransition(Card);
