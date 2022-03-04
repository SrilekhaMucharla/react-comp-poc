/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @see https://github.com/garycourt/murmurhash-js/blob/master/murmurhash3_gc.js
 *
 * @param {byte array} key Byte values of ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */

function murmurhash3_32_gc(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;

	while (i < bytes) {
		k1 =
				((key[i] & 0xff)) |
				((key[++i] & 0xff) << 8) |
				((key[++i] & 0xff) << 16) |
				((key[++i] & 0xff) << 24);
		++i;

		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
		h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}

	k1 = 0;

	switch (remainder) {
		case 3: k1 ^= (key[i + 2] & 0xff) << 16;
		case 2: k1 ^= (key[i + 1] & 0xff) << 8;
		case 1: k1 ^= (key[i] & 0xff);

			k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
			k1 = (k1 << 15) | (k1 >>> 17);
			k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
			h1 ^= k1;
	}

	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	h1 = h1 >>> 0;
	h1 = swap32ToBigEndianness(h1) >>> 0;
	return h1;
}

/**
 * Returns whether machine is big endianness or not. Required due to
 * Javascript using underlying hardware endianness
 * @returns {boolean} isBigEndian
 */
function isBigEndian() {
	return new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12;
}

function swap32ToBigEndianness(val) {
	if (isBigEndian()) { return val; }
	return ((val & 0xFF) << 24)
			| ((val & 0xFF00) << 8)
			| ((val >> 8) & 0xFF00)
			| ((val >> 24) & 0xFF);
}

const radix = 62;
const digits = [
	'0' , '1' , '2' , '3' , '4' , '5' ,
	'6' , '7' , '8' , '9' , 'a' , 'b' ,
	'c' , 'd' , 'e' , 'f' , 'g' , 'h' ,
	'i' , 'j' , 'k' , 'l' , 'm' , 'n' ,
	'o' , 'p' , 'q' , 'r' , 's' , 't' ,
	'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' ,
	'G' , 'H' , 'I' , 'J' , 'K' , 'L' ,
	'M' , 'N' , 'O' , 'P' , 'Q' , 'R' ,
	'S' , 'T' , 'U' , 'V' , 'W' , 'X' ,
	'Y' , 'Z'
];

function generateSherlock(key, source) {
	if (!key || !source) {
		throw "Key and Source cannot be empty";
	}

	var stringBytesArr = convertKeyStringToByteArr(key).concat(convertSourceStringToByteArr(source));

	var hashIntValue = murmurhash3_32_gc(stringBytesArr, 0);
	var result = "";
	while (hashIntValue >= radix) {
		result += digits[hashIntValue % radix];
		hashIntValue = Math.floor(hashIntValue/radix);
	}
	result += digits[hashIntValue];

	return result.split("").reverse().join("");
}

/**
 * Convert Key string to byte array. This method assumes UTF-16 as by our Java Parser Lib
 * implementation and Javascript are by default UTF-16.
 * @param key String only
 * @returns {Array} array of bytes
 */
function convertKeyStringToByteArr(key) {
	var arr = [];

	var isLittleEndian = !isBigEndian();
	for (var i = 0, j = 0; i < key.length; i++) {
		var char = key.charCodeAt(i);
		if (isLittleEndian) {
			arr[j++] = char & 0xFF;
			arr[j++] = (char & 0xFF00) >>> 8;
		} else {
			arr[j++] = (char & 0xFF00) >>> 8;
			arr[j++] = char & 0xFF;
		}
	}

	return arr
}

/**
 * Convert Unit source string to byte array. Javascript strings are by default UTF-16.
 * To match Java sherlock generation logic in GL Tools Parser Lib we need to first convert to UTF-8
 * @param source String only
 * @returns {Array} Array of bytes
 */
function convertSourceStringToByteArr(source) {
	var utf8 = unescape(encodeURIComponent(source));
	var arr = [];
	for (var i = 0; i < utf8.length; i++) {
		arr.push(utf8.charCodeAt(i));
	}
	return arr;
}

module.exports = {generateSherlock};
