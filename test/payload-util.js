import test from 'ava';

import {zipObjectFromArrays} from '../build/payload-util';

test.todo('getBasicTypeValue returns a basic value for each of the possible parameter types');

test('zipObjectFromArrays returns an object created from two arrays', t => {
	const expected = {
		keyOne: 'valueOne',
		keyTwo: 'valueTwo',
		keyThree: 'valueThree'
	}
	const keyArray = ['keyOne', 'keyTwo', 'keyThree'];
	const valueArray = ['valueOne', 'valueTwo', 'valueThree'];

	t.deepEqual(zipObjectFromArrays(keyArray, valueArray), expected);
});
