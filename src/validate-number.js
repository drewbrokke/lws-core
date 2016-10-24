/* @flow */

export default function validateNumber(port: number | string): boolean {
	if (typeof port === 'number') {
		return true;
	}

	if (typeof port !== 'string') {
		return false;
	}

	if (port === '') {
		return false;
	}

	if (isNaN(Number(port))) {
		return false;
	}

	return true;
};
