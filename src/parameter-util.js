/* @flow */


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

export function zipObjectFromArrays(keys: string[], values: string[]): {[index:string]: string} {
	return keys.reduce((prev, cur, i) => {
			prev[cur] = values[i];
			return prev;
		}, {});
}
