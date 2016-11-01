/* @flow */

import Engine from './engine';
import {getBaseMethodPayload} from './payload-util';
import MainScraper from './scraper/main-scraper';
import MethodScraper from './scraper/method-scraper';
import ScraperUtil from './scraper-util';

export default async function main(engine: Engine) {
	const mainScraper: MainScraper = await ScraperUtil.getMainScraper(engine);
	const methodScraper: MethodScraper = await ScraperUtil.getMethodScraper('add-user', mainScraper, engine);

	const company: Object = await engine.getCompany();

	const baseMethodPayload: Object = await getBaseMethodPayload(methodScraper);

	baseMethodPayload.firstName = 'fdfdfddfdf';
	baseMethodPayload.lastName = 'brokke';
	baseMethodPayload.autoScreenName = true;
	baseMethodPayload.emailAddress = 'fdfdfddfdf.brokke@liferay.com';
	baseMethodPayload.password1 = 'test';
	baseMethodPayload.password2 = 'test';
	baseMethodPayload.birthdayYear = 1985;
	baseMethodPayload.birthdayMonth = 10;
	baseMethodPayload.birthdayDay = 30;
	baseMethodPayload.male = true;
	baseMethodPayload.companyId = company.companyId;

	const user = await engine.invoke('/user/add-user', baseMethodPayload)
		.catch(err => console.error(err));

	console.log('user: ', user);
}