import * as React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';
import { TokenState } from '../models/common/token';
import { connect } from 'react-redux';

// containers
import App from '../containers/common/App';
import NotFound from '../components/common/NotFound';

// routes
import Login from '../containers/page/Login';

import HomeIndex from '../containers/page/HomeIndex';
import Bill from '../containers/page/Bill';
import Mine from '../containers/page/Mine';

interface RoutesProps {
  token: TokenState;
  history: any;
}

class Routes extends React.Component<RoutesProps, any> {
  checkLogin = (nextState, replace, callback) => {
    const { token } = this.props;
    if (!token.token) {
      replace({
        pathname: '/login',
      });
    }
    callback();
  }

  checkLogined = (nextState, replace, callback) => {
    const { token } = this.props;
    if (token.token) {
      replace({
        pathname: '/',
      });
    }
    callback();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const { history } = this.props;

    return (
      <Router history={history} >
        <Route path="/login" component={Login} onEnter={this.checkLogined} />
        <Route path="/" component={App} onEnter={this.checkLogin}>
          <IndexRedirect to="homeIndex" />
          <Route path="/homeIndex" component={HomeIndex} />
          <Route path="/bill" component={Bill} />
          <Route path="/mine" component={Mine} />
        </Route>
        <Route path="*" component={NotFound} />
      </Router>
    );
  }
}

const mapState2Props = state => {
  const { token } = state;
  return {
    token,
  };
};

export default connect(mapState2Props)(Routes);
