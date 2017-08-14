import React from 'react';
import data from '../data/data';
import Card from '../components/Card';
import Page from '../components/Page';

function Home() {
  return (
    <Page>
      {Object.entries(data).map(renderCard)}
    </Page>
  );
}

function renderCard([id, { image, title }]) {
  return <Card key={id} {...{ id, image, title }} />;
}

export default Home;
