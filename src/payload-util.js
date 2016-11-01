/* @flow */

import Engine from './engine';
import MethodScraper from './scraper/method-scraper';
import {getMethodScraper} from './scraper-util';

export async function getBaseMethodPayload(methodName: string, engine: Engine): Promise<Object> {
	const methodScraper: MethodScraper = await getMethodScraper(methodName, engine);

	const parameterNames: string[] = methodScraper.getParameterNamesArray();
	const parameterTypes: string[] = methodScraper.getParameterTypesArray();
	const parameterValues: string[] = parameterTypes.map(getBasicTypeValue);

	return zipObjectFromArrays(parameterNames, parameterValues);
}

export function getBasicTypeValue(type: string): any {
	if (type.includes('[]') ||
		type.includes('util.List')) {
		return null;
	}

	if (type.includes('Map')) {
		return JSON.stringify({});
	}

	if (type.includes('long') ||
		type.includes('int') ||
		type.includes('short') ||
		type.includes('double')) {
		return  0;
	}

	if (type.includes('boolean')) {
		return false;
	}

	return '';
}

export function zipObjectFromArrays(keys: string[], values: string[], object: Object = {}): {[index:string]: string} {
	if (keys.length === 0 || values.length === 0) {
		return object;
	}

	object[keys[0]] = values[0];

	return zipObjectFromArrays(keys.slice(1), values.slice(1), object);
}
