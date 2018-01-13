import * as React from 'react';
import {Button} from 'antd';
import CardEx from '../../common/CardEx';
import { actions, AppState } from '../../../models/common/app';
import { apiActions, LoginState } from '../../../models/common/login';
import { injectNormal, NormalComponentProps } from '../../../util/inject';
import { BASE_PREFIX } from '../../../util/constants';
import './style.less';
const prefixCls = `${BASE_PREFIX}-mine`;

class Mine extends React.Component {
  logout = () => {
    const { dispatch, token, data } = this.props;
    console.log('apiActions',apiActions);
    dispatch(apiActions.logout(token));
  }
  render() {
    const { data } = this.props;
    return (
        <div>
          <CardEx>
            我的
          </CardEx>
          <div className={`${prefixCls}-logout`}>
            <Button
            type="danger"
            className={`${prefixCls}-logoutBtn`}
            onClick={this.logout}
            loading={data.logoutLoading}
            >
              退出
            </Button>
          </div>
        </div>
    );
  }
}
export default injectNormal(Mine, {
  token: 'token',
  data: 'login'
});
