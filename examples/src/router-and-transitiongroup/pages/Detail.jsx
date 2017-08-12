import React, { Component } from 'react';
import ConnectedTransition from 'react-connected-transition';
import { css } from 'emotion/react';
import data from '../data/data';
import Text from '../components/Text';
import Page from '../components/Page';
import Image from '../components/Image';
import TransitionPosition from '../components/TransitionPosition';
import TransitionPositionAndScale from '../components/TransitionPositionAndScale';
import withTransition from '../containers/withTransition';

class Detail extends Component {
  render() {
    const { transitionState } = this.props;
    const { id } = this.props.match.params;
    const item = data[id];
    const exit = transitionState === 'exiting' || transitionState === 'exited';

    return (
      <Page>
        <div className={imageClassName}>
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
}

const imageClassName = css`
  height: 400px;
`;

export default withTransition(Detail);
