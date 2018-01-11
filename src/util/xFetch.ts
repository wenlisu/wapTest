/**
 * 本模块用于创建fetch请求
 */

const fetch = require('isomorphic-fetch');
require('es6-promise').polyfill();
import { message } from 'antd';

/**
 * check network
 */
function checkNetwork(res) {
  if (res.status / 200 !== 1) {
    message.error(`网络错误 ${res.status}`);
    return Promise.reject({
      des: `http status ${res.status}, network error`,
    });
  }
  return res;
}

/**
 * handle response result
 */
function jsonParse(res) {
  if (res.status / 200 !== 1) {
    return {
      status: -999,
      des: '网络错误，请稍后再试！',
    };
  } else {
    let contentType = res.headers.get('content-type');
    if (contentType && (contentType.indexOf('application/zip') >= 0 || contentType.indexOf('excel') >= 0)) {
      res.blob().then(blob => {
        let a: any = document.createElement('a');
        let url = window.URL.createObjectURL(blob);
        let filename = '导出数据.zip';
        if (contentType.indexOf('excel') >= 0) {
          filename = '导出数据.xls';
        }
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
      return {
        status: 0,
      };
    } else {
      return res.json().then(jsonResult => jsonResult);
    }
  }
}

/**
 * handle error
 */
function errorMessageParse(jsonResult) {
  if (jsonResult) {
    const { status, des } = jsonResult;
    if (status !== 0) {
      if (status !== -999) {
        message.error(des);
      }
      return Promise.reject(jsonResult);
    }
    return jsonResult;
  }
}

function xFetch(url, options) {
  const opts = options;
  opts.headers = {
    ...opts.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return fetch(url, opts)
    .then(checkNetwork)
    .then(jsonParse)
    .then(errorMessageParse);
}

export default xFetch;
