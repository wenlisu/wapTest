import { createAction, ActionFunctionAny, Action } from 'redux-actions';
import { call, put, take } from 'redux-saga/effects';
import xFetch from './xFetch';
import { message } from 'antd';
import * as querystring from 'querystring';

/**
 * 本模块用于创建异步请求的action和saga
 */

interface Redirect {
  componentName: string;
  message?: string;
}

/**
 * 异步请求配置项
 */
export interface ApiConfig {
  /**
   * 接口地址
   */
  path: string;
  /**
   * http操作（默认是POST）
   */
  method?: string;
  /**
   * 请求成功后是否有提示
   */
  message?: boolean | string;
  /**
   * 请求成功后是否进行跳转
   */
  redirect?: Redirect;
  /**
   * action的名字
   */
  actionName: string;
  /**
   * 是否自定义异步请求的的saga（默认的saga可查看makeEffect方法）
   */
  customSaga?: boolean;
  /**
   * 指定model名称
   */
  modelName?: string;
}

export interface ApiActionNames {
  request: string;
  success: string;
  error: string;
}

export interface Api<T> {
  apiActionNames: {[key in keyof T]: ApiActionNames};
  apiActions: {[key in keyof T]: ActionFunctionAny<Action<{}>>};
  sagas: any[];
}

export function initApi<T>(basePath, configs: ApiConfig[], modelName: string): Api<T> {
  let apiActionNames = {} as any;
  let apiActions = {} as any;
  let sagas = [];

  // 后端接口在前端全部用jqm标示
  basePath = '/jqm';

  configs.forEach(config => {
    let finalModelName = config.modelName || modelName;
    let truePath = config.actionName;
    let actionNames = makeActionNames(finalModelName, config);
    apiActionNames[truePath] = actionNames;
    apiActions[truePath] = createAction(actionNames.request);
    let request = makeRequest(basePath, config);
    let effect = makeEffect(config, request, actionNames);
    if (config.customSaga) {
      return;
    }
    if (config.message) {
      return sagas.push(showMessage(apiActionNames[truePath], effect, config.message));
    }
    if (config.redirect) {
      return sagas.push(redirect(apiActionNames[truePath], effect, config.redirect));
    }
    sagas.push(simple(apiActionNames[truePath], effect));
  });

  return {
    apiActionNames,
    apiActions,
    sagas,
  };
}

/**
 * 创建featch请求
 * @param basePath 基础路径
 * @param api 接口地址
 */
function makeRequest(basePath: string, api: ApiConfig) {
  return async (data) => {
    let opts = {};
    let uri = basePath + api.path;
    let method = 'POST';
    if (api.method) {
      method = api.method;
    }
    let upperCaseMethod = method.toUpperCase();
    if (upperCaseMethod === 'GET') {
      let query = querystring.stringify(data);
      if (query) {
        uri += '?' + query;
      }
      opts = {
        method: 'GET',
      };
    } else {
      opts = {
        method: method,
        body: JSON.stringify(data) || null,
      };
    }
    return await xFetch(uri, opts);
  };
}

/**
 * 创建异步请求actionName集合，包活开始请求，请求成功和请求失败
 * @param modelName model名称
 * @param api ApiConfig
 */
function makeActionNames(modelName: string, api: ApiConfig): ApiActionNames {
  const baseActionName = `${modelName}／${api.method}_${api.path}`;
  return {
    request: `${baseActionName}_request`,
    success: `${baseActionName}_success`,
    error: `${baseActionName}_error`,
  };
}

/**
 * 默认的异步请求处理流程
 * @param api ApiConfig
 * @param request makeRequest方法返回的fetch请求
 * @param actionNames makeActionNames方法返回的actionName集合
 */
function makeEffect(api: ApiConfig, request: any, actionNames: ApiActionNames) {
  return function* (req) {
    const { except, ...others } = req.payload;
    try {
      const response = yield call(request, others);
      yield put(createAction<any>(actionNames.success)({
        req: req.payload,
        res: response,
      }));
      return response;
    } catch (error) {
      console.error(`request /${api.path} 错误`);
      console.error(`request params`, req.payload);
      console.error(`message`, error);
      if (error.status === -103) {
        yield put(createAction<any>('loginTimeout')({}));
      }
      yield put(createAction<any>(actionNames.error)({
        req: req.payload,
        error: error,
        except: Object.assign({}, except),
      }));
    }
  };
}

/**
 * 默认的saga
 * @param actionNames makeActionNames方法返回的actionName集合
 * @param apiSaga makeEffect返回的saga
 */
function simple(actionNames: ApiActionNames, apiSaga: any) {
  return function* () {
    while (true) {
      const req = yield take(actionNames.request);
      yield call(apiSaga, req);
    }
  };
}

/**
 * 请求成功后有提示的saga
 * @param actionNames makeActionNames方法返回的actionName集合
 * @param apiSaga makeEffect返回的saga
 * @param successText ApiConfig的message
 */
function showMessage(actionNames: ApiActionNames, apiSaga: any, successText: string | boolean) {
  return function* () {
    while (true) {
      const req = yield take(actionNames.request);
      const res = yield call(apiSaga, req);
      if (res) {
        let text = '操作成功';
        if (typeof successText === 'string') {
          text = successText;
        }
        message.success(text);
      }
    }
  };
}

/**
 * 请求成功后跳转的saga
 * @param actionNames makeActionNames方法返回的actionName集合
 * @param apiSaga makeEffect返回的saga
 * @param redirectObj ApiConfig的redirect
 */
function redirect(actionNames: ApiActionNames, apiSaga: any, redirectObj: Redirect) {
  return function* () {
    while (true) {
      const req = yield take(actionNames.request);
      const res = yield call(apiSaga, req);
      if (res) {
        message.success(redirectObj.message || '操作成功');
        yield put(createAction<any>('sidebar/updatePane')({
          componentName: redirectObj.componentName,
        }));
      }
    }
  };
}
