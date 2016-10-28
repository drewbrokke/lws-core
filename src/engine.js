/* @flow */

import http from 'http';
import https from 'https';
import path from 'path';
import querystring from 'querystring';

import validateNumber from './validate-number';

import type {IncomingMessage as HttpIncomingMessage} from 'http';
import type {IncomingMessage as HttpsIncomingMessage} from 'https';
import type {InstanceConfig, RequestOptions} from './types';

export default class Engine {
	instanceConfig: InstanceConfig;

	constructor(instanceConfig: InstanceConfig) {
		this.instanceConfig = instanceConfig;
	}

	invoke(apiPath: string, payload: Object): Promise<any> {
		const requestOptions: RequestOptions = Engine.constructRequestOptions(apiPath, payload, this.instanceConfig);

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
			request.write(querystring.stringify(payload));
			request.end();
		});
	}

	static constructRequestOptions(
		apiPath: string, payload: Object, instanceConfig: InstanceConfig): RequestOptions {
		const payloadString: string = querystring.stringify(payload);
		const port: number | void = instanceConfig.port;

		const requestOptions: RequestOptions = {
			auth: `${instanceConfig.username}:${instanceConfig.password}`,
			host: instanceConfig.host,
			method: 'POST',
			path: path.join('/api/jsonws', apiPath),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(payloadString)
			}
		};

		if (validateNumber(port) && port != 443 && port != 80) {
			requestOptions['port'] = Number(instanceConfig.port);
		}

		return requestOptions;
	}
}
