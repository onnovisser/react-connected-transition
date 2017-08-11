import React, { Component } from 'react';
import data from '../data/data';
import Card from '../components/Card';
import Page from '../components/Page';

class Home extends Component {
  renderCard = ([id, { image, title }]) =>
    <Card key={id} {...{ id, image, title }} />;

  render() {
    return (
      <Page>
        {Object.entries(data).map(this.renderCard)}
      </Page>
    );
  }
}

export default Home;
