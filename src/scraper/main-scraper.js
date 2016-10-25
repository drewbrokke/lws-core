/* @flow */

import cheerio from 'cheerio';

const SELECTOR_CONTEXTS: string = '#contextName > option';
const SELECTOR_METHODS: string = '.lfr-api-signature .method-name';
const SELECTOR_SERVICES: string = '.panel-heading .title-text';
const SEPARATOR: string = '  ';

function capitalize(word: string): string {
	const letters = word.split('');
	let first = letters.shift().toUpperCase();

	first = first.toUpperCase();
	letters.unshift(first);

	return letters.join('');
}

function composeMethodsSelector(serviceName: string): string {
	return `${SELECTOR_METHODS}[data-metadata="${capitalize(serviceName)}ServiceImpl"]`;
}

function truthyArrayFromString(s: string): string[] {
	return s.trim().split(SEPARATOR).filter(item => Boolean(item));
}

export default class MainScraper {
	$: Function;

	constructor(html: string): void {
		this.$ = cheerio.load(html);
	}

	getContexts(): string[] {
		const optionsString: string = this.$(SELECTOR_CONTEXTS).text();

		return truthyArrayFromString(optionsString);
	}

	getMethods(service?: string): string[] {
		let selector = SELECTOR_METHODS;

		if (service) {
			selector = composeMethodsSelector(service);
		}

		const methods = this.$(selector).text();

		return truthyArrayFromString(methods);
	}

	getMethodURLs(method: string, service?: string): string[] {
		const $: Function = this.$;

		let selector: string = SELECTOR_METHODS;

		if (service) {
			selector = composeMethodsSelector(service);
		}

		const rawMethods: Object = $(selector).filter(
			(k, v) => $(v).text().trim() === method);

		return rawMethods.map((k: string, v: Object) => $(v).attr('href')).toArray();
	}

	getServices(): string[] {
		const services = this.$(SELECTOR_SERVICES).text();

		return truthyArrayFromString(services);
	}
}
