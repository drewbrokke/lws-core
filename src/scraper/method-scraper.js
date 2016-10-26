/* @flow */

import BaseScraper from './base-scraper';

const SELECTOR_RETURN_TYPE: string = '.lfr-api-return-type .lfr-api-param-name';
const SELECTOR_PARAMETERS: string = '.lfr-api-parameters';
const SELECTOR_PARAMETER_NAMES: string = `${SELECTOR_PARAMETERS} .lfr-api-param-name`;
const SELECTOR_PARAMETER_TYPES: string = `${SELECTOR_PARAMETERS} .lfr-api-param-type`;

export default class MethodScraper extends BaseScraper {
	getParameterNamesArray(): string[] {
		return this.getArrayFromSelector(SELECTOR_PARAMETER_NAMES);
	}

	getParameterTypesArray(): string[] {
		return this.getArrayFromSelector(SELECTOR_PARAMETER_TYPES);
	}

	getReturnType(): string {
		return this.getTextFromSelector(SELECTOR_RETURN_TYPE);
	}
}