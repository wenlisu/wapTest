## 概念说明

- 开发服务使用[dora](https://github.com/dora-js/dora)，dora是一个完整的开发服务，带有mock服务，方便本地调试
- 使用tslint保证所有人的代码风格一致s
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

### model

以往用redux的时候，action、saga和reducer都在不同的文件，编辑成本高，需要在几个文件之间切换，因此把这几个东西合在一起，这个东西就叫model。


元素渲染
即便我们每秒都创建了一个描述整个UI树的新元素，React DOM 也只会更新渲染文本节点中发生变化的内容。

组件 & Props
函数定义/类定义组件
定义一个组件最简单的方式是使用JavaScript函数：
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
该函数是一个有效的React组件，它接收一个单一的“props”对象并返回了一个React元素。我们之所以称这种类型的组件为函数定义组件，是因为从字面上来看，它就是一个JavaScript函数。

你也可以使用 ES6 class 来定义一个组件:
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

组件渲染
在前面，我们遇到的React元素都只是DOM标签：
const element = <div />;
然而，React元素也可以是用户自定义的组件：
const element = <Welcome name="Sara" />;
当React遇到的元素是用户自定义的组件，它会将JSX属性作为单个对象传递给该组件,这个对象称之为“props”。
function a() {
 Const element = (
	<div>
		<h1>time: {new Date()}</h1>
	</div>
   );
	ReactDOM.render(
	element,
	document.getElementById(‘app’);
	);
}
setInterval(a,1000);
组合组件

Props的只读性
function sum(a, b) {
  return a + b;
}
类似于上面的这种函数称为“纯函数”，它没有改变它自己的输入值，当传入的值相同时，总是会返回相同的结果。
与之相对的是非纯函数，它会改变它自身的输入值：
function withdraw(account, amount) {
  account.total -= amount;
}
所有的React组件必须像纯函数那样使用它们的props。


State & 生命周期
理想情况下，我们写一次 Clock 然后它能更新自身：
为了实现这个需求，我们需要为Clock组件添加状态
为一个类添加局部状态
1. 在 render() 方法中使用 this.state.date 替代 this.props.date;
2. 添加一个类构造函数来初始化状态 this.state
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
class Clock extends  React.Compent {
	constructor(props) {
	super(props);
	this.state = {
	data: new Date()
	}
	}
componentDidMount() {
	this.timerId = setInterval(() => {
	this.setSate({
	data: new Date();
});
}, 1000);
}
componentWillUnmount() {
clearInterval(this.timerId);
}
	render(){
Const { data } = this.state;
	return(
	<div>
		<h1>time: {data}</h1>
	</div>
	);
	}
}
将生命周期方法添加到类中
每当Clock组件第一次加载到DOM中的时候，我们都想生成定时器，这在React中被称为挂载

事件处理
* React事件绑定属性的命名采用驼峰式写法，而不是小写。
* 如果采用 JSX 的语法你需要传入一个函数作为事件处理函数，而不是一个字符串(DOM元素的写法)
传统的 HTML：
<button onclick="activateLasers()">
  Activate Lasers
</button>
React 中稍稍有点不同：
<button onClick={activateLasers}>
  Activate Lasers
</button>

列表 & Keys
渲染多个组件
Keys
一个元素的key最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用来自数据的id作为元素的key:
当元素没有确定的id时，你可以使用他的序列号索引index作为key