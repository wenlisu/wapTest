import { initAction } from '../../util/action';
import { initApi, ApiConfig } from '../../util/api';
import { handleActions } from 'redux-actions';
import { take } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

let modelName = 'login';

// simple actions

let keys = {

};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// apis

let apis = {
  login: 'login',
  logout: 'logout',
};

let apiConfigs: ApiConfig[] = [{
  path: '/system/login',
  actionName: 'login',
}, {
  path: '/system/logout',
  actionName: 'logout',
}];

const api = initApi<typeof apis>('', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;

function* loginSuccess() {
  while (true) {
    yield take(apiActionNames[apis.login].success);
    yield browserHistory.replace({
      pathname: '/',
    });
  }
}

function* logoutSuccess() {
  while (true) {
    yield take(apiActionNames[apis.logout].success);
    yield browserHistory.replace({
      pathname: '/login',
    });
  }
}

function* loginTimeout() {
  while (true) {
    yield take('loginTimeout');
    yield browserHistory.replace({
      pathname: '/login',
    });
  }
}

export const sagas = [
  loginSuccess,
  logoutSuccess,
  loginTimeout,
  ...api.sagas,
];

// reducers

export interface LoginState {
  logoutLoading: boolean;
  loading: boolean;
  name: string;
  username: string;
  getOperatorInfoError: boolean;
}

const initialState = {
  name: '',
  username: '',
};

export const reducer = handleActions<LoginState, any>({
  [apiActionNames.login.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.login.success](state, action) {
    // tslint:disable-next-line:no-unused-variable
    let { ...data } = action.payload.res.operatorInfo;
    return {
      ...state,
      loading: false,
      ...data,
    };
  },
  [apiActionNames.login.error](state, action) {
    return {
      ...state,
      loading: false,
      ...initialState,
    };
  },
  [apiActionNames[apis.logout].request](state, action) {
    return {
      ...state,
      logoutLoading: true,
    };
  },
  [apiActionNames.logout.success](state, action) {
    return {
      ...state,
      logoutLoading: false,
      ...initialState,
    };
  },
  [apiActionNames.logout.error](state, action) {
    return {
      ...state,
      logoutLoading: false,
    };
  },
  ['loginTimeout'](state, action) {
    return {
      ...state,
      ...initialState,
    };
  },
}, {
    loading: false,
    logoutLoading: false,
    ...initialState,
    getOperatorInfoError: false,
  });
