import fs from 'fs';
import test from 'ava';

import MainScraper from '../../build/scraper/main-scraper';

const HTML = fs.readFileSync('jsonws.html', 'utf8');

const testMainScraper = new MainScraper(HTML);

test('scraper returns available contexts', t => {
	const contexts = testMainScraper.getContexts();

	t.true(contexts.length > 0);
});

test('scraper returns available services', t => {
	const services = testMainScraper.getServices();

	t.true(services.length > 0);
});

test('scraper returns available methods', t => {
	const methods = testMainScraper.getMethods();

	t.true(methods.length > 0);
});

test('scraper returns a subset of methods when provided a service', t => {
	const methods = testMainScraper.getMethods();
	const userMethods = testMainScraper.getMethods('User');

	t.plan(3);

	t.true(methods.length > 0);
	t.true(userMethods.length > 0);
	t.true(methods.length > userMethods.length);
});

test('scraper returns the URL for a particular method', t => {
	let links = testMainScraper.getMethodURLs('add-entry', 'BlogsEntry');

	const testLinks = ['/api/jsonws?contextName=&signature=%2Fblogsentry%2Fadd-entry-16-title-subtitle-description-content-displayDateMonth-displayDateDay-displayDateYear-displayDateHour-displayDateMinute-allowPingbacks-allowTrackbacks-trackbacks-coverImageCaption-coverImageImageSelector-smallImageImageSelector-serviceContext'];

	t.is(links.length, testLinks.length);
	t.deepEqual(links, testLinks);
});
