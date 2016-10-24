/* @flow */

import 'babel-polyfill';

import Engine from './engine';
import ConfigUtil from './config-util';

const testEngine = new Engine(ConfigUtil.getCurrentInstance());

testEngine.invoke('/company/get-company-by-virtual-host', {virtualHost: 'localhost'})
	.then((company: Object) => console.log('TEST: /company/get-company-by-virtual-host: ', company))
	.catch((err: Error) => console.error(err));

testEngine.invoke('/company/get-company-by-web-id', {webId: 'liferay.com'})
	.then((company: Object) => console.log('TEST: /company/get-company-by-web-id: ', company))
	.catch((err: Error) => console.error(err));
