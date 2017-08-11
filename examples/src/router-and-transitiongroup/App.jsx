import React, { Component } from 'react';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import styled, { injectGlobal } from 'emotion/react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import TransitionRouter from './containers/TransitionRouter';

import Home from './pages/Home';
import Detail from './pages/Detail';

class App extends Component {
  render() {
    return (
      <TransitionGroup>
        <TransitionRouter key={this.props.location.pathname.split('/')[1]}>
          <Switch location={this.props.location}>
            <Route path="/detail/:id" component={Detail} />
            <Route component={Home} />
          </Switch>
        </TransitionRouter>
      </TransitionGroup>
    );
  }
}

injectGlobal`
  html {
    height: 100%;
    // background-image: linear-gradient(135deg, #c4deca, #698f93);
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
