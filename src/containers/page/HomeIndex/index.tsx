import * as React from 'react';
import { Form, Timeline } from 'antd';
import CardEx from '../../common/CardEx';
import { injectApi } from '../../../util/inject';

class HomeIndex extends React.Component<any, any> {

  render() {
    return (
      <div>
        <CardEx>
        首页
        </CardEx>
        <div style={{ width: '100%', padding: '20px 15px 0' }}>
        <Timeline pending="Recording...">
          <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
          <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
          <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
          <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
        </Timeline>
        </div>
      </div>
    );
  }
}

export default injectApi<any>(
  Form.create()(HomeIndex)
);
