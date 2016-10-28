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