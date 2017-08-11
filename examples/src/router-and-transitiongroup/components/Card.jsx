import React from 'react';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'emotion/react';
import ConnectedTransition from 'react-connected-transition';
import withTransition from '../containers/withTransition';
import CardTitle from './CardTitle';
import CardImage from './CardImage';
import CardText from './CardText';

Card.propTypes = {
  id: string.isRequired,
  title: string.isRequired,
  image: string.isRequired,
  transitionState: string.isRequired, // Supplied by withTransition HOC
}

function Card({ id, title, image, transitionState }) {
  const exit = transitionState === 'exiting' || transitionState === 'exited';

  return (
    <CardLink to={`/detail/${id}`}>
      <ConnectedTransition name={`image${id}`} exit={exit}>
        <CardImage src={image} />
      </ConnectedTransition>

      <CardText>
        <ConnectedTransition name={`title${id}`} exit={exit}>
          <CardTitle>
            {title}
          </CardTitle>
        </ConnectedTransition>
      </CardText>
    </CardLink>
  );
}

const CardLink = styled(Link)`
  display: flex;
  height: 25vw;
  width: 100%;
  background-color: white;
  box-shadow: 5px 5px 40px -1px rgba(0,0,0,.2);

  &:nth-child(2n) {
    flex-direction: row-reverse;
  }
`;

export default withTransition(Card);
