
微信小程序 mobx 绑定( wechat weapp mobx )
==============

页面间通信的利器

为你的小程序添加mobx数据层驱动

当前版本: 0.1.4

依赖 mobx 版本: 3.1.7

## 安装
1. clone或者下载代码库到本地:

   ```shell
    git clone https://github.com/80percent/wechat-weapp-mbox
   ```
2. 将 `mobx.js`, `diff.js` 和 `observer.js` 文件直接拷贝到小程序的工程中,例如 (下面假设我们把第三方包都安装在libs目录下):

   ```shell
    cd wechat-weapp-mobx
    cp mobx.js <小程序根目录>/libs
    cp diff.js <小程序根目录>/libs
    cp observer.js <小程序根目录>/libs
   ```

    上面的命令将包拷贝到小程序的`libs`目录下

3. 创建一个 `stores` 目录, 存放数据层.

## 使用
1. 创建 mobx 的 stores

    ```js
      var extendObservable = require('../libs/mobx').extendObservable;
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
    var observer = require('../libs/observer').observer;
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

## 版本更新记录

### 0.1.4

* 增加 diff 流程, 大幅提高触发性能.

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

## 示例

详细的使用例子可以参照: [wechat-weapp-mobx-todos](https://github.com/80percent/wechat-weapp-mobx-todos)

真机实测版请clone下面这个repo，用小程序开发工具开启预览:

```
git clone https://github.com/80percent/wechat-weapp-mobx-todos.git
```

## 实际案例

**Ballu -- 一个实时的篮球计分工具**

> 点评: 此项目是一个 "复杂" 的小程序, 深度使用 wechat-weapp-mobx 作为数据驱动层后, 数据状态同步的问题轻松化解. 最终项目成功上线.

![ballu](img/ballu.png)

## 协议( LICENSE )
MIT
