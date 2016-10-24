/* @flow */

import validateNumber from './validate-number';

export function constructBasePath(host: string, port: number): string {
	if (validateNumber(port)) {
		return constructBasePathWithPort(host, port);
	}

	return constructBasePathNoPort(host);
};

export function prependProtocol(path: string, secure: boolean): string {
	if (secure) {
		return prependHTTPS(path);
	}

	return prependHTTP(path);
};

function constructBasePathNoPort(host: string): string {
	return `${host}/api/jsonws`;
}

function constructBasePathWithPort(host: string, port: number): string {
	return `${host}:${port}/api/jsonws`;
}

function prependHTTP(path: string): string {
	return `http://${path}`;
}

function prependHTTPS(path: string): string {
	return `https://${path}`;
}
