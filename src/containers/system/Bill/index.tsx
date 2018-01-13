import * as React from 'react';
import { List, Avatar } from 'antd';
import CardEx from '../../common/CardEx';
import { injectApi } from '../../../util/inject';
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 5',
  },
  {
    title: 'Ant Design Title 6',
  },
];

class Bill extends React.Component<any, any> {
  render() {
    return (
      <div>
        <CardEx>
        账单
        </CardEx>
        <div style={{ width: '100%', padding: '0 15px' }}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications"
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}

export default injectApi(Bill, {
  data: 'bill',
});
