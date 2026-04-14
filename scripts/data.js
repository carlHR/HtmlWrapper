// Js does support Base64 by default, but its messed up. I prefer to reimplement this to ensure it really works.
class Base64 {
	static letter(code) {
		switch (code) {
		case 0: return 'A';
		case 1: return 'B';
		case 2: return 'C';
		case 3: return 'D';
		case 4: return 'E';
		case 5: return 'F';
		case 6: return 'G';
		case 7: return 'H';
		case 8: return 'I';
		case 9: return 'J';
		case 10: return 'K';
		case 11: return 'L';
		case 12: return 'M';
		case 13: return 'N';
		case 14: return 'O';
		case 15: return 'P';
		case 16: return 'Q';
		case 17: return 'R';
		case 18: return 'S';
		case 19: return 'T';
		case 20: return 'U';
		case 21: return 'V';
		case 22: return 'W';
		case 23: return 'X';
		case 24: return 'Y';
		case 25: return 'Z';
		case 26: return 'a';
		case 27: return 'b';
		case 28: return 'c';
		case 29: return 'd';
		case 30: return 'e';
		case 31: return 'f';
		case 32: return 'g';
		case 33: return 'h';
		case 34: return 'i';
		case 35: return 'j';
		case 36: return 'k';
		case 37: return 'l';
		case 38: return 'm';
		case 39: return 'n';
		case 40: return 'o';
		case 41: return 'p';
		case 42: return 'q';
		case 43: return 'r';
		case 44: return 's';
		case 45: return 't';
		case 46: return 'u';
		case 47: return 'v';
		case 48: return 'w';
		case 49: return 'x';
		case 50: return 'y';
		case 51: return 'z';
		case 52: return '0';
		case 53: return '1';
		case 54: return '2';
		case 55: return '3';
		case 56: return '4';
		case 57: return '5';
		case 58: return '6';
		case 59: return '7';
		case 60: return '8';
		case 61: return '9';
		case 62: return '+';
		case 63: return '/';
		default: return '=';
		}
	}

	static byte(letter) {
		switch (letter) {
		case 'A': return 0;
		case 'B': return 1;
		case 'C': return 2;
		case 'D': return 3;
		case 'E': return 4;
		case 'F': return 5;
		case 'G': return 6;
		case 'H': return 7;
		case 'I': return 8;
		case 'J': return 9;
		case 'K': return 10;
		case 'L': return 11;
		case 'M': return 12;
		case 'N': return 13;
		case 'O': return 14;
		case 'P': return 15;
		case 'Q': return 16;
		case 'R': return 17;
		case 'S': return 18;
		case 'T': return 19;
		case 'U': return 20;
		case 'V': return 21;
		case 'W': return 22;
		case 'X': return 23;
		case 'Y': return 24;
		case 'Z': return 25;
		case 'a': return 26;
		case 'b': return 27;
		case 'c': return 28;
		case 'd': return 29;
		case 'e': return 30;
		case 'f': return 31;
		case 'g': return 32;
		case 'h': return 33;
		case 'i': return 34;
		case 'j': return 35;
		case 'k': return 36;
		case 'l': return 37;
		case 'm': return 38;
		case 'n': return 39;
		case 'o': return 40;
		case 'p': return 41;
		case 'q': return 42;
		case 'r': return 43;
		case 's': return 44;
		case 't': return 45;
		case 'u': return 46;
		case 'v': return 47;
		case 'w': return 48;
		case 'x': return 49;
		case 'y': return 50;
		case 'z': return 51;
		case '0': return 52;
		case '1': return 53;
		case '2': return 54;
		case '3': return 55;
		case '4': return 56;
		case '5': return 57;
		case '6': return 58;
		case '7': return 59;
		case '8': return 60;
		case '9': return 61;
		case '+': return 62;
		case '/': return 63;
		default: return -1;
		}
	}

	// Reads UTF-8, converts into Base64 UTF-8.
	// If padding is true, it completes content with '=' or '=='.
	static encode(text, padding=true) {
		let offset;
		let len;
		let old;
		let cur;
		let ss;
		let w;
		let b;

		ss = '';
		len = text.length;
		for (let i = 0; i < len; ++i) {
			cur = text.charCodeAt(i);

			switch (i % 3) {
			case 0:
				b = (cur >> 2) & 0x3F;
				w = Base64.letter(b);
				break;
			case 1:
				b = ((old << 4) | (cur >> 4)) & 0x3F;
				w = Base64.letter(b);
				break;
			default:
				b = ((old << 2) | (cur >> 6)) & 0x3F;
				w = Base64.letter(b);
				b = (cur) & 0x3F;
				w += Base64.letter(b);
				break;
			}

			old = cur;
			ss += w;
		}

		switch (len % 3) {
		case 0:
			ss += Base64.letter((old << 4) & 0x3F);
			if (padding) {
				ss += '==';
			}
			break;
		case 1:
			ss += Base64.letter((old << 2) & 0x3F);
			if (padding) {
				ss += '=';
			}
			break;
		default:
			break;
		}

		return ss;
	}

	// Reads Base64 UTF-8, converts into plain UTF-8.
	static decode(text) {
		let ss;
		let len;
		let a, b, c, d;
		let pattern;
		let match;
		let w;

		ss = '';
		pattern = /(.)(.)(.?)(.?)/g;
		while ((match = pattern.exec(text)) != null) {
			len = 3;

			a = match[1];
			b = match[2];
			c = match[3];
			d = match[4];

			a = Base64.byte(a);
			b = Base64.byte(b);

			if (c == null || c === '' || c === '=') {
				--len;
				c = 0;
			} else {
				c = Base64.byte(c);
			}

			if (d == null || d === '' || d === '=') {
				--len;
				d = 0;
			} else {
				d = Base64.byte(d);
			}

			switch (len) {
			case 1: //  a b
				w = ((a << 2) & 0xFF) | (b >> 4);
				w = String.fromCharCode(w);
				ss += w;
				break;
			case 2: //  a b c
				w = ((a << 2) & 0xFF) | (b >> 4);
				w = String.fromCharCode(w);
				ss += w;
				w = ((b << 4) & 0xFF) | (c >> 2);
				w = String.fromCharCode(w);
				ss += w;
				break;
			default: // a b c d
				w = ((a << 2) & 0xFF) | (b >> 4);
				w = String.fromCharCode(w);
				ss += w;
				w = ((b << 4) & 0xFF) | (c >> 2);
				w = String.fromCharCode(w);
				ss += w;
				w = ((c << 6) & 0xFF) | d;
				w = String.fromCharCode(w);
				ss += w;
				break;
			}

		}

		return ss;
	}

	static decodeToUint8Array(text) {
		let arr;
		let len;
		let a, b, c, d;
		let pattern;
		let match;
		let w;

		arr = [];
		pattern = /(.)(.)(.?)(.?)/g;
		while ((match = pattern.exec(text)) != null) {
			len = 3;

			a = match[1];
			b = match[2];
			c = match[3];
			d = match[4];

			a = Base64.byte(a);
			b = Base64.byte(b);

			if (c == null || c === '' || c === '=') {
				--len;
				c = 0;
			} else {
				c = Base64.byte(c);
			}

			if (d == null || d === '' || d === '=') {
				--len;
				d = 0;
			} else {
				d = Base64.byte(d);
			}

			switch (len) {
			case 1: //  a b
				w = ((a << 2) & 0xFF) | (b >> 4);
				w = String.fromCharCode(w);
				arr.push(w);
				break;
			case 2: //  a b c
				w = ((a << 2) & 0xFF) | (b >> 4);
				w = String.fromCharCode(w);
				arr.push(w);
				w = ((b << 4) & 0xFF) | (c >> 2);
				w = String.fromCharCode(w);
				arr.push(w);
				break;
			default: // a b c d
				w = ((a << 2) & 0xFF) | (b >> 4);
				w = String.fromCharCode(w);
				arr.push(w);
				w = ((b << 4) & 0xFF) | (c >> 2);
				w = String.fromCharCode(w);
				arr.push(w);
				w = ((c << 6) & 0xFF) | d;
				w = String.fromCharCode(w);
				arr.push(w);
				break;
			}

		}

		return new Uint8Array(arr);
	}
}

function plaintext(id) {
	let elem = document.getElementById(id);
	let text = '';

	if (elem == null) {
		console.warn("Couldn't find element with id: `"+ id +"`");
	} else {
		text = Base64.decode(elem.text);
	}

	return text;
}

function binary(id) {
	let elem = document.getElementById(id);
	let bin = new Uint8Array([]);

	if (elem == null) {
		console.warn("Couldn't find element with id: `"+ id +"`");
	} else {
		bin = Base64.decodeToUint8Array(elem.text);
	}

	return bin;
}
