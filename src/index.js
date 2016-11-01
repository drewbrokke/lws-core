/* @flow */

import 'babel-polyfill';

import Engine from './engine';
import {DEFAULT_INSTANCE_CONFIG} from './default-config';

import main from './scratch';

const testEngine = new Engine(DEFAULT_INSTANCE_CONFIG);

main(testEngine);