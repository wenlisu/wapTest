import * as React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';
import { TokenState } from '../models/common/token';
import { connect } from 'react-redux';

// containers
import App from '../containers/common/App';
import NotFound from '../components/common/NotFound';

// routes
import HomeIndex from '../containers/system/HomeIndex';
import Bill from '../containers/system/Bill';
import Mine from '../containers/system/Mine';

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
        <Route path="/" component={App} >
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
