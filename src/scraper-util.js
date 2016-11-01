/* @flow */

import Engine from './engine';
import MainScraper from './scraper/main-scraper';
import MethodScraper from './scraper/method-scraper';

export default class ScraperUtil {
	static async getMainScraper(engine: Engine): Promise<MainScraper> {
		const rootHtml: string = await engine.getRootHTML();

		return new MainScraper(rootHtml);
	}

	static async getMethodScraper(methodName: string, mainScraper: MainScraper, engine: Engine): Promise<MethodScraper> {
		const urls: string[] = mainScraper.getMethodURLs(methodName);

		const methodHtml: string = await engine.getHTML(urls[0]);

		return new MethodScraper(methodHtml);
	}
}

