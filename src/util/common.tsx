import * as React from 'react';

import { BASE_PREFIX } from './constants';
/**
 * 创建样式前缀
 * @param name key
 */
export function createPrefixCls(name) {
  return `${BASE_PREFIX}-${name}`;
}
/**
 * 分离对象
 * @param obj 需要分享的对象
 * @param parts 指定的属性
 * @return 得到一个包含两个对象的数组，第一个是包含指定属性的对象，另一个是包含剩下属性的对象
 */
export function splitObject(obj: Object, parts: string[]): any[] {
  let left = {};
  let right = {};
  Object.keys(obj).forEach((k) => {
    if (parts.indexOf(k) !== -1) {
      left[k] = obj[k];
    } else {
      right[k] = obj[k];
    }
  });
  return [left, right];
}
