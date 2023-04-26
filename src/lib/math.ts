export function getCompactNumber(number: Number): String {
	let compact = '';
	let compactNo = 0;
	if (number > 999 && number < 1000000) {
		compactNo = parseInt(number / 1000);
		compact = `${compactNo}k`;
	} else if (number > 999999) {
		compactNo = Math.round(number / 1000000);
		compact = `${compactNo}M`;
	} else {
		compact = `${number}`;
	}

	return compact;
};
