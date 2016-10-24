/* @flow */

import type {InstanceConfig, Config} from './types';

export const DEFAULT_INSTANCE_CONFIG: InstanceConfig = {
	host: 'localhost',
	maildomain: 'liferay.com',
	password: 'test',
	port: 8080,
	secure: false,
	username: 'test@liferay.com'
}

export const DEFAULT_CONFIG: Config = {
	currentInstance: 'default',
	instances: {
		default: DEFAULT_INSTANCE_CONFIG
	}
};
