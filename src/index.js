/*eslint-disable*/
import { create } from "dva-core";
import { applyMiddleware } from "redux";
import { routerMiddleware, routerReducer as routing } from "react-router-redux";
import createLoading from "dva-loading";

// model namespace cache
const cached = {};
let stateContainer = null;

const defaultOnError = err => console.error(err);

function createStateContainer({ history, NODE_ENV, onError = defaultOnError }) {
  if (stateContainer) return stateContainer;

  /**
   * initialReducer, redux-middleware, dva-plugin etc. in this configuration
   * @see https://github.com/dvajs/dva/blob/master/packages/dva-core/src/index.js
   */
  const createOpts = {
    initialReducer: {
      routing
    },
    setupMiddlewares(middlewares) {
      return [routerMiddleware(history), ...middlewares];
    },
    setupApp(app) {
      app._history = history;
    }
  };

  stateContainer = create({ onError, ...createLoading() }, createOpts);

  /**
   * dynamic inject dva model to stateContainer
   * @param {Object} model dva model
   * @param {boolean} [replace=false] if true, same namespace model will be replaced
   */
  stateContainer.injectModel = (model, replace = false) => {
    const m = model.default || model;
    if (replace || NODE_ENV === "development") {
      // Replace a model if it exsits, if not, add it to app
      stateContainer.replaceModel(m);
    } else if (!cached[m.namespace]) {
      stateContainer.model(m);
    }
    cached[m.namespace] = 1;
    return m;
  };

  stateContainer.start();

  return stateContainer;
}

export { createStateContainer as create };
