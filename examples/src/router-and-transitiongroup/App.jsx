import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { injectGlobal } from 'emotion/react';
import { shape, string } from 'prop-types';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from './containers/Transition';

import Home from './pages/Home';
import Detail from './pages/Detail';

App.propTypes = {
  location: shape({
    pathname: string.isRequired,
  }).isRequired,
};

function App({ location }) {
  return (
    <TransitionGroup>
      <Transition key={location.pathname.split('/')[1]}>
        <Switch location={location}>
          <Route path="/detail/:id" component={Detail} />
          <Route component={Home} />
        </Switch>
      </Transition>
    </TransitionGroup>
  );
}

injectGlobal`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 
      "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", 
      "Fira Sans", "Droid Sans", "Helvetica Neue", 
      sans-serif;
    color: #888;
  }

  a {
    text-decoration: none;
    color: unset;
  }
`;

export default withRouter(App);
