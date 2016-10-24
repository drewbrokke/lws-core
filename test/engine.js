import test from 'ava';

import Engine from '../build/engine';

test('correctly formed base path', t => {
	const engineOpts = {username: 'test@liferay.com', password: 'test', secure: false, host: 'localhost', port: 8080};

	const engine = new Engine(engineOpts);

	const expected = 'localhost:8080/api/jsonws';

	t.is(engine.basePath, expected);
});
