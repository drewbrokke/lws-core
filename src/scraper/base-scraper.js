/* @flow */

import cheerio from 'cheerio';

const SEPARATOR: string = '  ';

export default class BaseScraper {
	$: Function;

	constructor(html: string): void {
		this.$ = cheerio.load(html);
	}

 	getArrayFromSelector(selector: string): string[] {
		return BaseScraper.truthyArrayFromString(this.getTextFromSelector(selector));
	}

	getTextFromSelector(selector: string): string {
		return this.$(selector).text();
	}

	static truthyArrayFromString(s: string): string[] {
		return s.trim().split(SEPARATOR).filter(item => Boolean(item));
	}
}