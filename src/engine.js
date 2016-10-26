/* @flow */

import http from 'http';
import https from 'https';
import path from 'path';
import querystring from 'querystring';

import validateNumber from './validate-number';

import type {IncomingMessage as HttpIncomingMessage} from 'http';
import type {IncomingMessage as HttpsIncomingMessage} from 'https';
import type {InstanceConfig} from './types';

export default class Engine {
	instanceConfig: InstanceConfig;

	constructor(instanceConfig: InstanceConfig) {
		this.instanceConfig = instanceConfig;
	}

	invoke(apiPath: string, payload: Object): Promise<any> {
		const payloadString: string = querystring.stringify(payload);
		const port: number = this.instanceConfig.port;

		const requestOptions = {
			auth: `${this.instanceConfig.username}:${this.instanceConfig.password}`,
			host: this.instanceConfig.host,
			method: 'POST',
			path: path.join('/api/jsonws', apiPath),
			port: this.instanceConfig.secure ? 443 : 80,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(payloadString)
			}
		};

		if (validateNumber(port) && port != 443 && port != 80) {
			requestOptions['port'] = Number(this.instanceConfig.port);
		}

		return new Promise((resolve, reject) => {
			function handleResponse(response: HttpsIncomingMessage | HttpIncomingMessage): void {
				let body = '';

				const handleResponseEnd = () => {
					if (response.statusCode != 200) {
						return reject(body);
					}

					return resolve(body);

				}

				response.on('data', (d: string) => body += d);
				response.on('end', handleResponseEnd);
			}

			const request = this.instanceConfig.secure
				? https.request(requestOptions, handleResponse)
				: http.request(requestOptions, handleResponse);

			request.on('error', (err: Error) => reject(err));

			request.write(payloadString);
			request.end();
		});
	}
}
