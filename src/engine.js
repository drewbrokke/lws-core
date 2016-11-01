/* @flow */

import url from 'url';

import {get, post} from './http-util.js';

import MainScraper from './scraper/main-scraper';
import MethodScraper from './scraper/method-scraper';
import {getBasicTypeValue, zipObjectFromArrays} from './payload-util';
import type {InstanceConfig, InvokerOptions, RequestOptions} from './types';

const BASE_PATH = '/api/jsonws';
const BASE_CONTEXT = 'portal';

export default class Engine {
	instanceConfig: InstanceConfig;
	mainScrapers: Map<string, MainScraper>;
	methodScrapers: Map<string, MethodScraper>;

	constructor(instanceConfig: InstanceConfig) {
		this.instanceConfig = instanceConfig;
		this.mainScrapers = new Map();
		this.methodScrapers = new Map();
	}

	invoke(apiPath: string, payload: Object): Promise<any> {
		return post(apiPath, payload, this.instanceConfig);
	}

	async invokeFromObject(invokerOptions: InvokerOptions, payload: Object): Promise<any> {
		const context: string = invokerOptions.context || BASE_PATH;

		const methodScraper: MethodScraper = await this.getMethodScraper(invokerOptions.methodName, context);

		const apiPath: string = methodScraper.getApiPath();

		return this.invoke(apiPath, payload);
	}

	async getAvalableContexts(): Promise<string[]> {
		const mainScraper: MainScraper = await this.getMainScraper(BASE_CONTEXT);

		return mainScraper.getContexts();
	}

	async getAvailableMethods(context?: string = BASE_CONTEXT, service?: string): Promise<string[]> {
		const contextScraper: MainScraper = await this.getMainScraper(context);

		return contextScraper.getMethods(service);
	}

	async getAvaliableServices(context: string = BASE_CONTEXT): Promise<string[]> {
		const contextScraper: MainScraper = await this.getMainScraper(context);

		return contextScraper.getServices();
	}

	getContextHTML(context?: string): Promise<string> {
		if (!context || context == BASE_CONTEXT) {
			return this.getRootHTML();
		}

		const urlObject: Object = {
			pathname: BASE_PATH,
			query: {
				contextName: context
			}
		}

		const urlString = url.format(urlObject);

		return this.getHTML(urlString);
	}

	getCompany(): Promise<Object> {
		return this.invoke('/company/get-company-by-virtual-host', {virtualHost: this.instanceConfig.host});
	}

	getHTML(address: string): Promise<string> {
		return get(address, this.instanceConfig);
	}

	async getMainScraper(context?: string = BASE_CONTEXT): Promise<MainScraper> {
		let mainScraper: MainScraper | void = this.mainScrapers.get(context);

		if (mainScraper) {
			return mainScraper;
		}

		const contextHTML: string = await this.getContextHTML(context);

		mainScraper = new MainScraper(contextHTML);

		this.mainScrapers.set(context, mainScraper);

		return this.getMainScraper(context);
	}

	async getMethodBasePayload(methodName: string, context?: string = BASE_CONTEXT): Promise<Object> {
		const methodScraper: MethodScraper = await this.getMethodScraper(methodName, context);

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

	async getMethodScraper(methodName: string, context?: string = BASE_PATH): Promise<MethodScraper> {
		let methodScraper: MethodScraper | void = this.methodScrapers.get(methodName);

		if (methodScraper) {
			return methodScraper;
		}

		const mainScraper = await this.getMainScraper(context);
		const urls: string[] = mainScraper.getMethodURLs(methodName);
		const methodHtml: string = await this.getHTML(urls[0]);

		methodScraper = new MethodScraper(methodHtml);

		this.methodScrapers.set(methodName, methodScraper);

		return this.getMethodScraper(methodName, context);
	}

	getRootHTML(): Promise<string> {
		return this.getHTML(BASE_PATH);
	}
}
