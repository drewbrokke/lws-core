/* @flow */

import Engine from './engine';
import MainScraper from './scraper/main-scraper';
import MethodScraper from './scraper/method-scraper';
import type {InstanceConfig} from './types';

export function getMainScraper(engine: Engine): Promise<MainScraper> {
	return engine.getRootHTML().then(html => new MainScraper(html));
}

export function getMethodScraper(methodName: string, engine: Engine): Promise<MethodScraper> {
	return getMainScraper(engine).then(mainScraper => {
		const urls = mainScraper.getMethodURLs(methodName);

		return engine.getHTML(urls[0]).then(html => new MethodScraper(html));
	})
}