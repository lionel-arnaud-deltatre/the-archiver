import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import { FlatCompat } from '@eslint/eslintrc';

import path from 'path';
import { fileURLToPath } from 'url';

// Mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
{ files: ['src/**/*.js'], languageOptions: { sourceType: 'commonjs' } },
{ languageOptions: { globals: globals.browser } },
{ plugins: { '@stylistic/js': stylisticJs }, rules: { indent: ['error', 'tab'], '@stylistic/js/indent': ['error', 'tab'] } },
];
