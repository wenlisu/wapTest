import * as React from 'react';
import { Form } from 'antd';
import CardEx from '../../common/CardEx';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { EditUserState, apiActions } from '../../../models/system/editUser';
import { injectApi, ApiComponentProps } from '../../../util/inject';

export interface EditUserOwnProps {

}

export interface EditUserProps extends EditUserOwnProps, ApiComponentProps<EditUserState> {
  form: WrappedFormUtils;
}

class EditUser extends React.Component<EditUserProps, any> {

  componentWillMount() {
    const { dispatch } = this.props;

  }

  render() {
    return (
      <CardEx>
       首页
      </CardEx>
    );
  }
}

export default injectApi<EditUserOwnProps>(
  Form.create()(EditUser),
  {
    data: 'editUser',
  }
);
