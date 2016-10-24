/* @flow */

import ConfigError from './config-error';

import type {InstanceConfig} from './types';

export default function validateInstanceConfig(instanceConfig: InstanceConfig): boolean {
	if (typeof instanceConfig !== 'object') {
		throw new ConfigError(`An instance configuration must be an Object. You passed: ${typeof instanceConfig}.`);
	}

	const type: string = Object.prototype.toString.call(instanceConfig);

	if (!type.includes('Object')) {
		throw new ConfigError(`An instance configuration must be an Object. You passed: ${type}.`);
	}

	const actualKeys: string[] = Object.keys(instanceConfig);

	const diffKeys: string[] = ['host', 'maildomain', 'password', 'port', 'secure', 'username']
		.filter((key: string) => !actualKeys.includes(key));

	if (diffKeys.length > 0) {
		throw new ConfigError(`The instance configuration is missing the following keys: ${diffKeys.join(', ')}`);
	}

	return true;
};
