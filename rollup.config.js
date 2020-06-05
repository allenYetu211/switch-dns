import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import json from 'rollup-plugin-json';
import pkg from './package.json';

let defaults = { 
  compilerOptions: { 
    "target": "es5",
    "lib": [
      "es2015"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
  } 
};

export default {
  input: './electron/index.ts',
  output: [
		{
			format: 'cjs',
			file: pkg.main,
		}
	],
	plugins: [
		// 解析node环境，配置axios使用browswer环境
		clear({
			targets: [ 'lib' ]
		}),
		typescript({
			exclude: 'node_modules/**',
			tsconfigDefaults: defaults
		}),
		commonjs(),
		json({
			compact: true
		}),
	],
	
};
