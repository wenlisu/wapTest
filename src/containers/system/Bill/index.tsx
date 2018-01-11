import * as React from 'react';
import CardEx from '../../common/CardEx';
import { EditPasswordState } from '../../../models/system/editPassword';
import { injectApi, ApiComponentProps } from '../../../util/inject';

export interface EditPasswordProps extends ApiComponentProps<EditPasswordState> {
}

class EditPassword extends React.Component<EditPasswordProps, any> {
  render() {
    return (
      <CardEx>
        账单
      </CardEx>
    );
  }
}

export default injectApi(EditPassword, {
  data: 'editPassword',
});
