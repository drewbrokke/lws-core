import test from 'ava';

import ConfigUtil from '../build/config-util';

test('setCurrentInstance does not set a non-existent instance', t => {
	t.plan(2);

	t.throws(
		() => ConfigUtil.setCurrentInstance('phonyinstance'),
		'Cannot set current instance "phonyinstance": instance does not exist');

	t.not('phonyinstance', ConfigUtil.getCurrentInstanceName());
});

test('addInstance will not add malformed configurations', t => {
	t.throws(
		() => ConfigUtil.addInstance('newinstance', 'hello world'),
		'An instance configuration must be an Object. You passed: string.');

	t.throws(
		() => ConfigUtil.addInstance('newinstance', 100),
		'An instance configuration must be an Object. You passed: number.');

	t.throws(
		() => ConfigUtil.addInstance('newinstance', []),
		'An instance configuration must be an Object. You passed: [object Array].');

	t.throws(
		() => ConfigUtil.addInstance('newinstance', {}),
		'The instance configuration is missing the following keys: host, maildomain, password, port, secure, username');
});
