export function getCompactNumber(n: number): String {
	let compact = '';
	let compactNo = 0;
	if (n > 999 && n < 1000000) {
		compactNo = Math.floor(n / 1000);
		compact = `${compactNo}k`;
	} else if (n > 999999) {
		compactNo = Math.round(n / 1000000);
		compact = `${compactNo}M`;
	} else {
		compact = `${n}`;
	}

	return compact;
};
