
微信小程序mobx绑定( wechat weapp mobx )
==============
为你的小程序添加mobx数据层驱动

当前版本: 0.1.0

依赖 mobx 版本: 3.1.7

## 安装
1. clone或者下载代码库到本地:

   ```shell
    git clone https://github.com/80percent/wechat-weapp-mbox
   ```
2. 将 `mobx.js` 和 `observer.js` 文件直接拷贝到小程序的工程中,例如 (下面假设我们把第三方包都安装在libs目录下):

   ```shell
    cd wechat-weapp-mobx
    cp mobx.js <小程序根目录>/libs
    cp observer.js <小程序根目录>/libs
   ```

    上面的命令将包拷贝到小程序的`libs`目录下

3. 创建一个 `stores` 目录, 存放数据层.

## 使用
1. 创建 mobx 的 stores

    ```js
      var mobx = require('../libs/mobx');
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
          this.todos.push( new TodoItem(title) );
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

## Example

详细的使用例子可以参照: [wechat-weapp-mobx-todos](https://github.com/80percent/wechat-weapp-mobx-todos)

真机实测版请clone下面这个repo，用小程序开发工具开启预览:

```
git clone -b release https://github.com/80percent/wechat-weapp-mobx-todos.git
```

## 类似框架

[wechat-weapp-redux-todos](https://github.com/charleyw/wechat-weapp-redux)

## 感谢

此框架关键代码受 [Labrador](https://github.com/maichong/labrador) 启发完成, 特此感谢.

## 协议( LICENSE )
MIT
