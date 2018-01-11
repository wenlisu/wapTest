import * as React from 'react';

/**
 * 获取组件名称（将首字母大写）
 * @param componentName 组件名称（首字母没有大写）
 * @return 组件名称
 */
export function getComponentName(componentName: string): string {
  return componentName.replace(/(\w)/, v => v.toUpperCase());
}

export function renderColumnHeader(text) {
  return <span className="text-bold">{text}</span>;
}

import moment from 'moment';
export function formatDate(date) {
  return date ? moment(date) : undefined;
}

/**
 * 格式化返回类型为number的值，用于InputNumber组件
 * @param value 返回类型为number的值
 * @result 格式化后的值
 */
export function formatNumber(value: any): any {
  if (typeof value === 'undefined' || value === null) {
    return undefined;
  } else {
    return value;
  }
}

export function formatMoney(money: number, showUnit = true) {
  if (money !== null) {
    return `${money}${showUnit ? '元' : ''}`;
  }
  return '';
}

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
/**
 * 创建html文档字符串
 * @content body里面的内容
 * @return html字符串
 */
export function createHtml(content: string, title: string = ''): string {
  return `<!DOCTYPE html><html><head><title>${title}</title>` +
  `<meta name="viewport" content="width=device-width,`
  + ` initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">`
  + `<meta charset="UTF-8"></head><body>${content}</body></html>`;
}
