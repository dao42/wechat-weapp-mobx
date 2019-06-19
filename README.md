
微信小程序 mobx 绑定( wechat weapp mobx )
==============

页面间通信的利器

为你的小程序添加mobx数据层驱动

当前版本: 0.1.9

依赖 mobx 版本: 4.9.2

## 安装

### 方式一: npm 包( 推荐 )

小程序已经支持使用 npm 安装第三方包，详见 [npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?search-key=npm)

```shell
npm install wechat-weapp-mobx -S --production
```

### 方式二: 手动安装

1. clone或者下载代码库到本地:

   ```shell
    git clone https://github.com/80percent/wechat-weapp-mbox
   ```
2. 将 `dist/mobx.js`, `dist/diff.js` 和 `dist/observer.js` 文件直接拷贝到小程序的工程中,例如 (下面假设我们把第三方包都安装在libs目录下):

   ```shell
    cd wechat-weapp-mobx
    cp mobx.js <小程序根目录>/libs
    cp diff.js <小程序根目录>/libs
    cp observer.js <小程序根目录>/libs
   ```

    上面的命令将包拷贝到小程序的`<小程序根目录>/libs`目录下

3. 创建一个 `<小程序根目录>/stores` 目录, 存放数据层.

## 使用( 使用 ES5 语法 )
1. 创建 mobx 的 stores

    ```js
    // <小程序根目录>/stores/todoStore.js
    // 手动安装时引入的路径
    // var extendObservable = require('../../libs/mobx').extendObservable;
    // npm 包安装引入的路径
    var extendObservable = require('wechat-weapp-mobx/mobx').extendObservable;
    var TodoStore = function() {
      extendObservable(this, {
        // observable data
        todos: [],
        todoText: 'aaa',
        // computed data
        get count() {
          return this.todos.length;
        }
      });

      // action
      this.addTodo = function(title) {
        this.todos.push( {title: title} );
      }

      this.removeTodo = function() {
        this.todos.pop();
      }
    }

    module.exports = {
      default: new TodoStore,
    }
    ```

2. 绑定页面联动事件

    ```js
    // <小程序根目录>/pages/index/index.js
    // 手动安装时引入的路径
    // var observer = require('../libs/observer').observer;
    // npm 包安装引入的路径
    var observer = require('wechat-weapp-mobx/observer').observer;
    // 关键, 监控页面事件, 让 mobx 有机会更新页面数据
    Page(observer({
      props: {
        todoStore: require('../stores/todoStore').default,
      },
      // your other code below
      onLoad: function(){
      }
    }))
    ```

3. 说明

    完成上述两步之后,你就可以在 wxml 中用 `props.todoStore` 这种方式来访问了, 并且数据联动已经自动工作.

    ```js
    // <小程序根目录>/pages/index/index.wxml
    <view>{{props.todoStore.todoText}}</view>
    ```

4. 数据自动联动

stores 中的数据可以跨页面同时访问，并且数据更新后，页面也会自动更新。从而节省大量逻辑代码。

## ES6 语法示例

请直接查看示例: [wechat-weapp-mobx-todos-npm](https://github.com/80percent/wechat-weapp-mobx-todos-npm)

## 版本更新记录

### 0.1.9

* （稳定性）经一段时间验证，项目稳定支持 mobx 4.9.2 版本。
* 优化：修复一个可能引发联动问题的 observer 问题。
* 优化：调整 Unload callback 执行顺序。
* 推荐 0.1.8 的用户升级至 0.1.9。

### 0.1.8

* （重大）正式升级 mobx 至 4.9.2 版本，支持最新的 mobx 装饰器语法。
* 尝试性支持 ES6 语法，如有bug，请及时反馈。

感谢 [Danney](https://github.com/dannnney) 的贡献。

### 0.1.7 (勿用)

* 尝试性升级 mobx 至 4.9.2 版本，增加新的装饰器语法。
* 但发现 mobx 4.9.2 版本下，props 数据对象会被小程序框架错误清空。

### 0.1.6

* 同步更新 npm 包至 0.1.6

### 0.1.5

* 优化 toJSWithGetter 接口, 性能再次提升2倍.
* 调整目录, 发布 npm 包.

### 0.1.4

* 增加 diff 流程, 大幅提高触发性能

### 0.1.3

* 重构 autorun 机制, 提高触发性能.

### 0.1.2

* 重构 toJS 逻辑, 支持嵌套的 computed value 显示.
* 支持 props 已有的属性值观测, 修改可以触发更新视图.

### 0.1.1

* 优化性能, 避免重复的 mobx toJS 对象.
* 添加版本号支持.

### 0.1.0

* 实现 mobx 核心支持.

## 示例( npm 整合，ES6 语法演示 )

详细的使用例子可以参照: [wechat-weapp-mobx-todos-npm](https://github.com/80percent/wechat-weapp-mobx-todos-npm)

真机实测版请clone下面这个repo，用小程序开发工具开启预览:

```
git clone https://github.com/80percent/wechat-weapp-mobx-todos-npm.git
```

## 示例( 手动安装 )

详细的使用例子可以参照: [wechat-weapp-mobx-todos](https://github.com/80percent/wechat-weapp-mobx-todos)

真机实测版请clone下面这个repo，用小程序开发工具开启预览:

```
git clone https://github.com/80percent/wechat-weapp-mobx-todos.git
```

## 实际案例

**Ballu -- 一个实时的篮球计分工具**

> 点评: 此项目是一个非常 "复杂" 的小程序, 项目多处页面需要使用 websocket 与服务端进行同步的数据更新, 深度使用 `wechat-weapp-mobx` 作为数据驱动层后, 数据状态同步的问题轻松化解. 最终项目成功上线.

![ballu](img/ballu.png)

## 开发( 发布 npm 版本 )

```bash
$ npm login --registry https://registry.npmjs.org/
$ npm publish
```

## 协议( LICENSE )

MIT
