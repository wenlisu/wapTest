# qqmadmin-stream

## 概念说明

- 开发服务使用[dora](https://github.com/dora-js/dora)，dora是一个完整的开发服务，带有mock服务，方便本地调试
- 使用tslint保证所有人的代码风格一致
- 统一处理异步请求
- 将action、saga和reducer集合在一起
- 支持多页面

### 目录结构

```
.
├── /dist/               # 构建输出的文件会在这里
├── /node_modules/       # 第三方类库和工具
├── /src/                # 应用源码
│ ├── /components/       # 展示组件
│ ├── /containers/       # 容器组件
│ ├── /entries/          # 应用入口
│ ├── /models/           # model
│ ├── /routes/           # 路由信息
│ ├── /stores/           # redux的store
│ ├── /styles/           # 全局样式
│ └── /util/             # 工具集合
├── proxy.config.js      # 配置 dora-plugin-proxy，用于 mock 和在线调试
├── webpack.config.js    # 扩展 webpack 配置
├── tsconfig.json        # typescript编译配置
├── tslint.json          # tslint配置
└── package.json         # 配置入口文件、依赖和 scripts
```

### 统一处理异步请求

统一异步请求操作，通过配置生存异步请求对应的action和saga。配置项如下：

```typescript
interface Redirect {
  componentName: string;
  message?: string;
}

/**
 * 异步请求配置项
 */
interface ApiConfig {
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
```

### model

以往用redux的时候，action、saga和reducer都在不同的文件，编辑成本高，需要在几个文件之间切换，因此把这几个东西合在一起，这个东西就叫model。

一个model的例子：

```typescript
import { initAction } from '../../util/action';
import { initApi, ApiConfig } from '../../util/api';
import { handleActions } from 'redux-actions';

let modelName = 'test';

/**
 * 定义普通action（不是发起接口请求的）
 */

export let keys = {
  changeName: 'changeName',
};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

/**
 * 定义发起请求的action
 */

export let apis = {
  getName: 'getName',
};

let apiConfigs: ApiConfig[] = [{
  path: '/system/getName',
  actionName: apis.getName,
}];

const api = initApi<typeof apis>('', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;

/**
 * 定义saga（一般情况下，只有发起请求的action需要用到redux-saga）
 */

export const sagas = api.sagas;

/**
 * 定义reducer
 */

export interface TestState {
  loading: boolean;
  name: string;
}

export const reducer = handleActions<TestState, any>({
  [apiActionNames[apis.getName].request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames[apis.getName].success](state, action) {
    return {
      ...state,
      loading: false,
      name: action.payload.res.name,
    };
  },
  [apiActionNames[apis.getName].error](state, action) {
    return {
      ...state,
      loading: false,
      name: '',
    };
  },
  [actionNames[keys.changeName]](state, action) {
    return {
      ...state,
      name: action.payload.name,
    };
  },
}, {
  loading: false,
  name: '',
});
```

> Note: 有工具快速创建model

### 多页面

每个页面对应一个容器组件，并与菜单栏和url一一对应，通过改变url来切换页面，每个页面的配置项如下：

```typescript
// 返回配置
interface BackComponentDecorator {
  // 需要返回的组件名称
  componentName: string;
  // 组件需要用到的属性
  options?: any;
}

// 页面配置
interface PaneConfig {
  // 对应的组件名词
  componentName: string;
  // tab的名称
  tab: string;
  // 页面的key，用url来表示（例：/system/roleList）
  key: string;
  // 通常用于一级页面传递属性到二级页面
  options?: any;
  // 定义是否有返回
  backComponent: BackComponentDecorator;
}
```

## 基本使用

### 创建页面流程

以创建一个列表页面为例说明，具体可以看代码，流程如下：

- 创建model（使用`tools`创建`node --harmony tools model example/test`），对应reducer的名称就是model文件的名称
- 创建页面的根容器页面（放到containers文件夹）
- 在`routes`文件夹下的`example.tsx`文件添加路由

### 快速创建列表用的reducer

因为列表接口返回的数据结构是一致的，所以把列表的reducer抽象出来，使用`util/listReducers`模块快速创建，创建出来的reducer需配合`UniTable`使用

```typescript
import { makeListHandleActions, ListState } from '../../util/listReducers';
/**
 * 定义发起请求的action
 */

export let apis = {
  getTestList: 'getTestList',
};

let apiConfigs: ApiConfig[] = [{
  path: '/example/getTestList',
  actionName: apis.getTestList,
}];

const api = initApi<typeof apis>('', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;

/**
 * 定义saga（一般情况下，只有发起请求的action需要用到redux-saga）
 */

export const sagas = api.sagas;

/**
 * 定义reducer
 */

export interface TestState extends ListState<any> {

}

const listHandle = makeListHandleActions(apiActionNames.getTestList);

export const reducer = handleActions<TestState, any>({
  ...listHandle.handleActions,
}, {
  ...listHandle.initializeState,
});
```

### 打开子页面

使用`/models/common/sidebar`的`updatePane`方法进行跳转

```typescript
interface BackComponentDecorator {
  componentName: string;
  options?: any;
}
interface UpdatePanePayload {
  componentName: string;
  // 决定子页面是否有返回按钮
  backComponent?: BackComponentDecorator;
}
/**
 * 页面跳转
 * @param dispatch dispatch
 * @param payload UpdatePanePayload
 * @param options 需要传递给目标组件的参数
 */
export function updatePane(dispatch, payload: UpdatePanePayload, options = {}) {
  dispatch(actions[keys.updatePane]({
    ...payload,
    options,
  }));
}
```

一个例子，在test页面打开`EditRole`子页面:

```typescript
updatePane(dispatch, {
  componentName: 'EditRole',
  backComponent: {
    componentName: 'Test',
  },
}, {
  id: record.id,
  roleName: record.roleName,
});
```

## 模板工具

> support nodejs v7.0.0 and higher, if use `8.0.0` and higher, `--harmony` is unnecessary.

### 创建model

```bash
node --harmony tools model <name>
```

#### options

* `--no-api` -- create model without api

#### usage

```bash
node --harmony tools model /common/base
```

### 创建Form

```bash
node --harmony tools form <fileName> --folder=<folderName>
```

#### options

* `--folder` -- foler path

#### usage


```bash
node --harmony tools form index --folder=/system/EditRole
```

### 创建Table

```bash
node --harmony tools table <fileName> --folder=<folderName>
```

#### options

* `--folder` -- folder path

#### usage

```bash
node --harmony tools table index --folder=/system/EditRole
```
