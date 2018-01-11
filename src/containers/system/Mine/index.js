import * as React from 'react';
import CardEx from '../../common/CardEx';
import { actions, AppState } from '../../../models/common/app';
import { apiActions as lApiActions, LoginState } from '../../../models/common/login';
import { injectNormal, NormalComponentProps } from '../../../util/inject';

class Mine extends React.Component {

  render() {
    return (
        <CardEx>
            我的
       </CardEx>
    );
  }
}
export default injectNormal(Mine, {
  login: 'login',
  token: 'token',
  app: 'app',
});
