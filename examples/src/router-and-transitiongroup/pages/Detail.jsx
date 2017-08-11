import React, { Component } from 'react';
import ConnectedTransition from 'react-connected-transition';
import { css } from 'emotion/react';
import data from '../data/data';
import Hero from '../components/Hero';
import Title from '../components/Title';
import Page from '../components/Page';
import withTransition from '../containers/withTransition';

class Detail extends Component {
  render() {
    const { transitionState } = this.props;
    const { id } = this.props.match.params;
    const item = data[id];
    const exit = transitionState === 'exiting' || transitionState === 'exited';

    return (
      <Page>
        <ConnectedTransition name={`image${id}`} exit={exit}>
          <Hero src={item.image} />
        </ConnectedTransition>

        <ConnectedTransition name={`title${id}`} exit={exit}>
          <Title>
            {item.title}
          </Title>
        </ConnectedTransition>
        <p>
          {item.description}
        </p>
      </Page>
    );
  }
}

export default withTransition(Detail);
