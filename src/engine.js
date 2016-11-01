/* @flow */

import {get, post} from './http-util.js';

import type {InstanceConfig, RequestOptions} from './types';

export default class Engine {
	instanceConfig: InstanceConfig;

	constructor(instanceConfig: InstanceConfig) {
		this.instanceConfig = instanceConfig;
	}

	invoke(apiPath: string, payload: Object): Promise<any> {
		return post(apiPath, payload, this.instanceConfig);
	}

	getHTML(address: string): Promise<string> {
		return get(address, this.instanceConfig);
	}

	getRootHTML(): Promise<string> {
		return this.getHTML('/api/jsonws');
	}
}
