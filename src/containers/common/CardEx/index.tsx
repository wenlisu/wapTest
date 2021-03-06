import * as React from 'react';
import { AppState } from '../../../models/common/app';
import './style.less';
import { injectNormal, NormalComponentProps } from '../../../util/inject';

interface CardExOwnProps {
  /** 默认高度需减去的值 */
  offsetHeight?: number;
  /** 元素的id */
  id?: string;
  /** style */
  style?: React.CSSProperties;
  className?: string;
  loading?: boolean;
}

interface CardExProps extends CardExOwnProps, NormalComponentProps {
  app: AppState;
}

/**
 * 卡片组件（适用于表单页面）
 */
class CardEx extends React.Component<CardExProps, any> {
  static defaultProps = {
    offsetHeight: 150,
    className: '',
    loading: false,
  };

  constructor(props) {
    super(props);
  }

  render() {
    let CardProps: any = {
      className: 'cardEx ' + this.props.className,
    };
    if (this.props.id) {
      CardProps.id = this.props.id;
    }

    return (
      <div
        {...CardProps}
        style={{ ...this.props.style }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default injectNormal(CardEx, {
  app: 'app',
});
