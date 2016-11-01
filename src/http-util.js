/* @flow */

import http from 'http';
import https from 'https';
import path from 'path';
import querystring from 'querystring';
import url from 'url';

import validateNumber from './validate-number';
import type {IncomingMessage as HttpIncomingMessage, ClientRequest as HttpClientRequest} from 'http';
import type {IncomingMessage as HttpsIncomingMessage, ClientRequest as HttpsClientRequest} from 'https';

import type {InstanceConfig, RequestOptions} from './types';

interface Protocol {
	request(requestOptions: RequestOptions, handleResponse: Function): HttpClientRequest | HttpsClientRequest;
}

export function get(address: string, instanceConfig: InstanceConfig): Promise<any> {
	const requestOptions: RequestOptions = constructGetRequestOptions(address, instanceConfig);

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

		const protocol: Protocol = getProtocol(instanceConfig.secure);
		const request: HttpClientRequest | HttpsClientRequest = protocol.request(requestOptions, handleResponse);

		request.on('error', (err: Error) => reject(err));
		request.end();
	});
}

export function post(apiPath: string, payload: Object, instanceConfig: InstanceConfig): Promise<any> {
	const requestOptions: RequestOptions = constructPostRequestOptions(apiPath, payload, instanceConfig);

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

		const protocol: Protocol = getProtocol(instanceConfig.secure);
		const request: HttpClientRequest | HttpsClientRequest = protocol.request(requestOptions, handleResponse);

		request.on('error', (err: Error) => reject(err));
		request.write(querystring.stringify(payload));
		request.end();
	});
}

function constructGetRequestOptions(
	address: string, instanceConfig: InstanceConfig): RequestOptions {
	const port: number | void = instanceConfig.port;

	const urlPath: string = url.parse(address).path || '/api/jsonws';

	const requestOptions: RequestOptions = {
		auth: `${instanceConfig.username}:${instanceConfig.password}`,
		host: instanceConfig.host,
		method: 'GET',
		path: urlPath
	};

	if (validateNumber(port) && port != 443 && port != 80) {
		requestOptions['port'] = Number(instanceConfig.port);
	}

	return requestOptions;
}

function constructPostRequestOptions(
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

function getProtocol(secure: boolean): Protocol {
	if (secure) {
		return https;
	}

	return http;
}
