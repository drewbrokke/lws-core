/* @flow */

import {get, post} from './http-util.js';

import MainScraper from './scraper/main-scraper';
import MethodScraper from './scraper/method-scraper';
import {getBasicTypeValue, zipObjectFromArrays} from './payload-util';
import type {InstanceConfig, RequestOptions} from './types';

export default class Engine {
	instanceConfig: InstanceConfig;
	mainScraper: MainScraper;
	methodScrapers: Map<string, MethodScraper>;

	constructor(instanceConfig: InstanceConfig) {
		this.instanceConfig = instanceConfig;
		this.methodScrapers = new Map();
	}

	invoke(apiPath: string, payload: Object): Promise<any> {
		return post(apiPath, payload, this.instanceConfig);
	}

	getCompany(): Promise<Object> {
		return this.invoke('/company/get-company-by-virtual-host', {virtualHost: this.instanceConfig.host});
	}

	async getMainScraper(): Promise<MainScraper> {
		if (this.mainScraper) {
			return this.mainScraper;
		}

		const rootHtml: string = await this.getRootHTML();
		const mainScraper = new MainScraper(rootHtml);

		this.mainScraper = mainScraper;

		return mainScraper;
	}

	async getMethodBasePayload(methodName: string): Promise<Object> {
		const methodScraper: MethodScraper = await this.getMethodScraper(methodName);

		const parameterNames: string[] = methodScraper.getParameterNamesArray();
		const parameterTypes: string[] = methodScraper.getParameterTypesArray();
		const parameterValues: string[] = parameterTypes.map(getBasicTypeValue);

		const fullObject: Object = zipObjectFromArrays(parameterNames, parameterValues);

		if (fullObject.hasOwnProperty('p_auth')) {
			delete fullObject.p_auth;
		}

		if (fullObject.hasOwnProperty('serviceContext')) {
			delete fullObject.serviceContext;
		}

		return fullObject;
	}

	async getMethodScraper(methodName: string): Promise<MethodScraper> {
		let methodScraper: MethodScraper | void = this.methodScrapers.get(methodName);

		if (methodScraper) {
			return methodScraper;
		}

		const mainScraper = await this.getMainScraper();
		const urls: string[] = mainScraper.getMethodURLs(methodName);
		const methodHtml: string = await this.getHTML(urls[0]);

		methodScraper = new MethodScraper(methodHtml);

		this.methodScrapers.set(methodName, methodScraper);

		return methodScraper;
	}

	getHTML(address: string): Promise<string> {
		return get(address, this.instanceConfig);
	}

	getRootHTML(): Promise<string> {
		return this.getHTML('/api/jsonws');
	}
}
