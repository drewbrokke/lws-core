/* @flow */

import Engine from './engine';
import {getBaseMethodPayload} from './payload-util';
import {DEFAULT_INSTANCE_CONFIG} from './default-config';

const testEngine = new Engine(DEFAULT_INSTANCE_CONFIG);

export default async function main() {
	const baseMethodPayload: Object = await getBaseMethodPayload('add-user', testEngine);

	console.log('baseMethodPayload: ', baseMethodPayload);
}