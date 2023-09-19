export function selectWord(num, arr) {
	const lastTwoNum = +num.toString().split("").slice(-2).join("")
	const lastNum = +num.toString().split("").slice(-1).join("")

	if (lastNum === 1) {
		return arr[0]
	}
	if (lastNum >= 2 && lastNum <= 4) {
		return arr[1]
	}

	if (lastTwoNum >= 11 && lastTwoNum <= 19) {
		return arr[2]
	}

	return arr[2]
}
