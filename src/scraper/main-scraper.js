/* @flow */

import BaseScraper from './base-scraper';

const SELECTOR_CONTEXTS: string = '#contextName > option';
const SELECTOR_METHODS: string = '.lfr-api-signature .method-name';
const SELECTOR_SERVICES: string = '.panel-heading .title-text';

function capitalize(word: string): string {
	const letters = word.split('');
	let first = letters.shift().toUpperCase();

	first = first.toUpperCase();
	letters.unshift(first);

	return letters.join('');
}

export default class MainScraper extends BaseScraper {
	getContexts(): string[] {
		return this.getArrayFromSelector(SELECTOR_CONTEXTS);
	}

	getMethods(service?: string): string[] {
		let selector = SELECTOR_METHODS;

		if (service) {
			selector = MainScraper.composeMethodsSelector(service);
		}

		return this.getArrayFromSelector(selector);
	}

	getMethodURLs(method: string, service?: string): string[] {
		const $: Function = this.$;

		let selector: string = SELECTOR_METHODS;

		if (service) {
			selector = MainScraper.composeMethodsSelector(service);
		}

		const rawMethods: Object = $(selector).filter(
			(k:string, v: string) => $(v).text().trim() === method);

		return rawMethods.map((k: string, v: Object) => $(v).attr('href')).toArray();
	}

	getServices(): string[] {
		return this.getArrayFromSelector(SELECTOR_SERVICES);
	}

	static composeMethodsSelector(serviceName: string): string {
		return `${SELECTOR_METHODS}[data-metadata="${capitalize(serviceName)}ServiceImpl"]`;
	}
}
