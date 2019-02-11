# state-container
dva state-container 
使用dva实现的状态容器, 包含了`dva-loading插件` 和 `react-router-redux`

默认导出
```
/**
 * history {Object} - react-router histroy 
 * NODE_ENV {string} - @default development, 运行环境
 * onError - 错误处理函数, defaultOnError = err => console.error(err);
 *
function createStateContainer({ history, NODE_ENV, onError = defaultOnError })
```

createStateContainer 返回 stateContainer

stateContainer 提供一个 function `injectModel`, 用于注入动态注入model 
```
  /**
   * dynamic inject dva model to stateContainer
   * @param {Object} model dva model
   * @param {boolean} [replace=false] if true, same namespace model will be replaced
   */
  stateContainer.injectModel = (model, replace = false) => {...}
```
### build dist
yarn build
