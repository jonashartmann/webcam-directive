import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/webcam.js',
  output: [
    {
      file: 'dist/webcam.js',
      format: 'umd',
      name: 'webcamDirective',
      sourcemap: true
    },
    {
      file: 'dist/webcam.min.js',
      format: 'umd',
      name: 'webcamDirective',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { browsers: 'ie 11' } }]
      ]
    })
  ]
};
