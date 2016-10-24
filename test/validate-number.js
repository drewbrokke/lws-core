import test from 'ava';

import validateNumber from '../build/validate-number';

test('number is valid', t => {
	t.true(validateNumber(10));
});

test('number string is valid', t => {
	t.true(validateNumber('10'));
});

test('blank string is invalid', t => {
	t.false(validateNumber(''));
});

test('non-number string is invalid', t => {
	t.false(validateNumber('hello world'));
});

test('partial-number string is invalid', t => {
	t.false(validateNumber('10xx'));
});

test('object is invalid', t => {
	t.false(validateNumber({}));
});

test('array is invalid', t => {
	t.false(validateNumber([]));
});

test('boolean true is invalid', t => {
	t.false(validateNumber(true));
});

test('boolean false is invalid', t => {
	t.false(validateNumber(false));
});
