/* @flow */

export function zipObjectFromArrays(keys: string[], values: string[]): {[index:string]: string} {
	return keys.reduce((prev, cur, i) => {
			prev[cur] = values[i];
			return prev;
		}, {});
}