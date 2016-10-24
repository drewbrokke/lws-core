/* @flow */

import Configstore from 'configstore';

import pkg from '../package.json';

const CURRENT_INSTANCE_KEY = 'currentInstance';

import ConfigError from './config-error';
import {DEFAULT_CONFIG, DEFAULT_INSTANCE_CONFIG} from './default-config';
import validateInstanceConfig from './validate-instance-config.js';

import type {InstanceConfig, Config} from './types';

interface Conf {
	get(key: string): any;
	has(key: string): boolean;
	set(key: string, value: any): void;
	all: Object;
}

const conf: Conf = new Configstore(pkg.name, DEFAULT_CONFIG);

export default class ConfigUtil {
	static addInstance(instanceName: string, instanceConfig: InstanceConfig): string {
		validateInstanceConfig(instanceConfig);

		conf.set(`instances.${instanceName}`, instanceConfig);

		return instanceName;
	}

	static getCurrentInstance(): InstanceConfig {
		return conf.get(`instances.${conf.get(CURRENT_INSTANCE_KEY)}`);
	}

	static getCurrentInstanceName(): string {
		return conf.get(CURRENT_INSTANCE_KEY);
	}

	static getDefaultConfig(): Config {
		return DEFAULT_CONFIG;
	}

	static getDefaultInstanceConfig(): InstanceConfig {
		return DEFAULT_INSTANCE_CONFIG;
	}

	static getInstance(instanceName: string): InstanceConfig {
		if (!conf.has(`instances.${instanceName}`)) {
			throw new ConfigError(`Cannot get current instance "${instanceName}": instance does not exist`);
		}

		return conf.get(`instances.${instanceName}`);
	}

	static resetConfig(): void {
		conf.all = DEFAULT_CONFIG;
	}

	static setCurrentInstance(instanceName: string): string {
		if (!conf.has(`instances.${instanceName}`)) {
			throw new ConfigError(`Cannot set current instance "${instanceName}": instance does not exist`);
		}

		conf.set(CURRENT_INSTANCE_KEY, instanceName);

		return instanceName;
	}
}
