import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { ObjectId } from 'mongodb';

import { ServiceError } from '@/common/error/catch.service';

export const generateRandomBuffer = (size: number) => {
	return randomBytes(size);
};

export const bufferToHex = (buffer: Buffer) => {
	return buffer.toString('hex');
};

export const generateRandomToken = () => {
	return bufferToHex(generateRandomBuffer(16));
};

export const hash = async (data: string, salt: Buffer) => {
	return argon2.hash(data, { salt });
};

export const argonVerify = async (oldData: string, newData: string) => {
	if (isEmpty(oldData) || isEmpty(newData)) return false;
	return argon2.verify(oldData, newData);
};

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
	if (value === null) {
		return true;
	} else if (typeof value !== 'number' && value === '') {
		return true;
	} else if (typeof value === 'undefined' || value === undefined) {
		return true;
	} else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
		return true;
	} else {
		return false;
	}
};

export const pluralize = (n: number, word: string) => {
	return n < 1 ? word : word + 's';
};

export const convertToObjectId = (id: string) => {
	const objectIdPattern = /^[0-9a-fA-F]{24}$/;

	if (typeof id !== 'string' || id.length !== 24 || !objectIdPattern.test(id))
		throw new ServiceError('BAD_REQUEST', 'Invalid payload');

	return new ObjectId(id);
};
