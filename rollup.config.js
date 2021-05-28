import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const globals = {
  axios: 'axios',
  history: 'History',
  redux: 'Redux',
  'dva-core': 'DvaCore',
  'react-router-redux': 'ReactRouterRedux',
  'connected-react-router': 'ConnectedReactRouter',
  '@gmsoft/event-bus': 'EventBus',
};

export default [
  // UMD Development
  {
    input: 'src/index.ts',
    output: {
      file: `dist/state-container.js`,
      format: 'umd',
      name: 'StateContainer',
      indent: false,
      sourcemap: true,
      globals,
    },
    external: Object.getOwnPropertyNames(globals),
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      filesize(),
    ],
  },

  // UMD Production
  {
    input: 'src/index.ts',
    output: {
      file: `dist/state-container.min.js`,
      format: 'umd',
      name: 'StateContainer',
      indent: false,
      sourcemap: true,
      globals,
    },
    external: Object.getOwnPropertyNames(globals),
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
      filesize(),
    ],
  },
];
