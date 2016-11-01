/* @flow */

import Engine from './engine';
import MainScraper from './scraper/main-scraper';
import MethodScraper from './scraper/method-scraper';
import type {InstanceConfig} from './types';

export async function getMainScraper(engine: Engine): Promise<MainScraper> {
	const rootHtml = await engine.getRootHTML();

	return new MainScraper(rootHtml);
}

export async function getMethodScraper(methodName: string, engine: Engine): Promise<MethodScraper> {
	const mainScraper: MainScraper = await getMainScraper(engine);
	const urls = mainScraper.getMethodURLs(methodName);
	const methodHtml = await engine.getHTML(urls[0]);

	return new MethodScraper(methodHtml);
}