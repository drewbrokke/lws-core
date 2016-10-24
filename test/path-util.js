import test from 'ava';

import {constructBasePath, prependProtocol} from '../build/path-util';

test('constructBasePath with port', t => {
	const expected = 'localhost:8080/api/jsonws';

	t.is(constructBasePath('localhost', '8080'), expected);
});

test('constructBasePath without port', t => {
	const expected = 'some.domain.com/api/jsonws';

	t.is(constructBasePath('some.domain.com'), expected);
});

test('prependProtocol not secure', t => {
	const expected = 'http://some.domain.com';

	t.is(prependProtocol('some.domain.com', false), expected);
});

test('prependProtocol secure', t => {
	const expected = 'https://some.domain.com';

	t.is(prependProtocol('some.domain.com', true), expected);
});
