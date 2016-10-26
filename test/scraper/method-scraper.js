import fs from 'fs';
import test from 'ava';

import MethodScraper from '../../build/scraper/method-scraper';

const methodHtml = fs.readFileSync('./method.html', {encoding: 'utf8'});

const methodScraper = new MethodScraper(methodHtml);

test('scraper returns an array of paramter names', t => {
	const parameterNamesArray = methodScraper.getParameterNamesArray();
	const expectedNames = ['p_auth', 'virtualHost'];

	t.is(parameterNamesArray.length, expectedNames.length);
	t.deepEqual(parameterNamesArray, expectedNames);
});

test('scraper returns an array of paramter value types', t => {
	const parameterTypesArray = methodScraper.getParameterTypesArray();
	const expectedNames = ['String', 'java.lang.String'];

	t.is(parameterTypesArray.length, expectedNames.length);
	t.deepEqual(parameterTypesArray, expectedNames);
});
