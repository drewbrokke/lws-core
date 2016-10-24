/* @flow */

import path from 'path';
import {post} from 'request';

import {constructBasePath, prependProtocol} from './path-util';

import type {InstanceConfig} from './types';

export default class Engine {
	username: string;
	password: string;
	secure: boolean;
	basePath: string;

	constructor(instanceConfig: InstanceConfig) {
		this.username = instanceConfig.username;
		this.password = instanceConfig.password;
		this.secure = instanceConfig.secure;

		this.basePath = constructBasePath(instanceConfig.host, instanceConfig.port);
	}

	invoke(apiPath: string, payload: Object): Promise<any> {
		const fullPath: string = prependProtocol(
			path.join(this.basePath, apiPath), this.secure);

		const form: {form: Object} = {form: payload};

		return new Promise((resolve, reject) => {
			function handleResponse(err: Error, response: Object, body: string): void {
				if (err) {
					return reject(err);
				}

				if (response.statusCode !== 200) {
					return reject(new Error(body));
				}

				return resolve(JSON.parse(body));
			}

			return post(fullPath, form, handleResponse).auth(this.username, this.password);
		});
	}
}
