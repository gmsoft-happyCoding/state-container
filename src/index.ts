import { create } from 'dva-core';
import type { Model } from 'dva';
import type { Store } from 'redux';
import type { History } from 'history';
import createLoading from 'dva-loading';
import { routerMiddleware, routerReducer as routing } from 'react-router-redux';
import createThemePlugin from '@gmsoft/dva-theme-plugin';
import createGlobalContextPlugin, { OptsI } from '@gmsoft/dva-global-context-plugin';

// model namespace cache
const cached = {};

export interface StateContainer {
  _store: Store<any>;
  _history: History;
  injectModel: (model: Model, replace?: boolean) => Model;
}

let stateContainer: any = null;

// eslint-disable-next-line no-console
const defaultOnError = (err: any) => console.error(err);

interface ArgsI {
  history?: History;
  NODE_ENV?: string;
  onError?: (err: any) => void;
  useThemePlugin?: boolean;
  useGlobalContextPlugin?: boolean;
  globalContextOpts?: OptsI;
}

function createStateContainer(
  {
    history,
    NODE_ENV,
    onError,
    useThemePlugin,
    useGlobalContextPlugin,
    globalContextOpts,
  }: ArgsI = {
    onError: defaultOnError,
    NODE_ENV: 'production',
    useThemePlugin: true,
    useGlobalContextPlugin: false,
  }
) {
  if (stateContainer) return stateContainer as StateContainer;

  /**
   * initialReducer, redux-middleware, dva-plugin etc. in this configuration
   * @see https://github.com/dvajs/dva/blob/master/packages/dva-core/src/index.js
   */
  const createOpts = history
    ? {
        initialReducer: {
          routing,
        },
        setupMiddlewares(middlewares: any) {
          return [routerMiddleware(history), ...middlewares];
        },
        setupApp(app: any) {
          // eslint-disable-next-line no-param-reassign
          app._history = history;
        },
      }
    : {};

  stateContainer = create({ onError }, createOpts);

  stateContainer.use(createLoading());
  if (useThemePlugin) stateContainer.use(createThemePlugin());
  if (useGlobalContextPlugin) stateContainer.use(createGlobalContextPlugin(globalContextOpts));

  /**
   * dynamic inject dva model to stateContainer
   * if replace=true, same namespace model will be replaced
   */
  stateContainer.injectModel = (model: Model, replace = false) => {
    // @ts-ignore
    const m = model.default || model;
    if (replace || NODE_ENV === 'development') {
      // Replace a model if it exsits, if not, add it to app
      stateContainer.replaceModel(m);
    } else if (!cached[m.namespace]) {
      stateContainer.model(m);
    }
    cached[m.namespace] = 1;
    return m;
  };

  stateContainer.start();

  return stateContainer as StateContainer;
}

export { createStateContainer as create };
