import test from 'ava';

import {zipObjectFromArrays} from '../build/parameter-util';

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
