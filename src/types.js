/* @flow */

export type InstanceConfig = {
	host: string,
	maildomain: string,
	password: string,
	port?: number,
	secure: boolean,
	username: string
}

export type Config = {
	currentInstance: string,
	instances: {[id:string]: InstanceConfig}
}

type GET = 'GET';
type POST = 'POST';

type HTTPMethod = GET | POST;

export type RequestOptions = {
	auth: string,
	host: string,
	method: HTTPMethod,
	path: string,
	port?: number,
	headers: {
		'Content-Type': string,
		'Content-Length': number
	}
}