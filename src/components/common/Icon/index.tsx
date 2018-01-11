import * as React from 'react';
import cx from 'classnames';
import './style.less';
export interface IconProps {
  src: string;
  style?: any;
}

/**
 * 加载失败组件（常用于请求失败后的显示）
 */
export default class Icon extends React.Component<IconProps, any> {
  render() {
    const { src, style } = this.props;
    return (
        <i className={cx(`icon-${src}`)} style={{ ...style }} />
    );
  }
}
