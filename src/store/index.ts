import { createStore, applyMiddleware, compose } from 'redux';
import { appReducer } from '../models';
import createSagaMiddleware from 'redux-saga';
import { autoRehydrate } from 'redux-persist';
//可以让你的数据从state分离出来，保存到浏览器缓存中，以便实现数据的持久化缓存
export const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}) {
  const enhancer = compose(
    autoRehydrate(), //用 storage 中的数据去恢复(rehydrate) store 中的数据
    applyMiddleware(sagaMiddleware),//中间件
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  const store = createStore(appReducer, initialState, enhancer); //创建stroe

  if (module.hot) {  //webpack热更新,实现无刷新部署
    module.hot.accept('../models', () => {
      console.log('hmr reducers');
      const reducers = require('../models').appReducer;
      store.replaceReducer(reducers);//更新当前store里的reducer
    });
  }

  return store;
}
