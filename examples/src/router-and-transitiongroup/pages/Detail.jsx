import React from 'react';
import { string, shape } from 'prop-types';
import ConnectedTransition from 'react-connected-transition';
import { css } from 'emotion/react';
import data from '../data/data';
import Text from '../components/Text';
import Page from '../components/Page';
import Image from '../components/Image';
import TransitionPosition from '../components/TransitionPosition';
import TransitionPositionAndScale from '../components/TransitionPositionAndScale';
import withTransition from '../containers/withTransition';

Detail.propTypes = {
  transitionState: string.isRequired, // Supplied by withTransition HOC
  // Supplied by Router
  match: shape({
    id: string,
  }).isRequired
}

function Detail(props) {
  const { transitionState, match } = props;
  const { id } = match.params;
  const item = data[id];
  const exit = transitionState === 'exiting' || transitionState === 'exited';

  return (
    <Page>
      <div className={imageClass}>
        <ConnectedTransition name={`image${id}`} exit={exit}>
          <TransitionPositionAndScale>
            <Image src={item.image} />
          </TransitionPositionAndScale>
        </ConnectedTransition>
      </div>

      <ConnectedTransition name={`title${id}`} exit={exit}>
        <TransitionPosition>
          <Text heading>
            {item.title}
          </Text>
        </TransitionPosition>
      </ConnectedTransition>
      <Text>
        {item.description}
      </Text>
    </Page>
  );
}

const imageClass = css`
  height: 50vw;

  @media (min-width: 600px) {
    width: 100%;
    height: 25vw;
  }
`;

export default withTransition(Detail);
