import * as React from 'react';
import cx from 'classnames';

import { actions, AppState } from '../../../models/common/app';
import { apiActions as lApiActions, LoginState } from '../../../models/common/login';
import { injectNormal, NormalComponentProps } from '../../../util/inject';
import Link from '../../../components/common/Link'
import Icon from '../../../components/common/Icon'
import { BASE_PREFIX } from '../../../util/constants';
import './style.less';
const prefixCls = `${BASE_PREFIX}-app`;

class App extends React.Component {

  render() {
    return (
      <div>
          {this.props.children}
          <div className={`${prefixCls}-tableView`}>
              <Link to="/homeIndex">
                <Icon src={'bank'} />
                <span>首页</span>
              </Link>
              <Link to="/bill">
                <Icon src={'phone-info'} />
                <span>账单</span>
              </Link>
              <Link to="/mine">
                <Icon src={'person'} />            
                <span>我的</span>
              </Link>
          </div>
      </div>
    );
  }
}
export default injectNormal(App, {
  login: 'login',
  token: 'token',
  app: 'app',
});
