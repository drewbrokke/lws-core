/* @flow */

import Engine from './engine';
import {getMethodScraper} from './scraper-util';

export function getBaseMethodPayload(methodName: string, engine: Engine): Promise<Object> {
	return getMethodScraper(methodName, engine).then(methodScraper => {
		const parameterNames: string[] = methodScraper.getParameterNamesArray();
		const parameterTypes: string[] = methodScraper.getParameterTypesArray();
		const parameterValues: string[] = parameterTypes.map(getBasicTypeValue);

		return zipObjectFromArrays(parameterNames, parameterValues);
	})
}

function getBasicTypeValue(type: string): any {
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

function zipObjectFromArrays(keys: string[], values: string[], object: Object = {}): {[index:string]: string} {
	if (keys.length === 0 || values.length === 0) {
		return object;
	}

	object[keys[0]] = values[0];

	return zipObjectFromArrays(keys.slice(1), values.slice(1), object);
}
