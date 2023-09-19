export function formatNumberSpace(str) {
	const convertToString = str.toString()
	const s = convertToString.length
	const chars = convertToString.split("")
	const strWithSpaces = chars.reduceRight((acc, char, i) => {
		const spaceOrNothing = (s - i) % 3 === 0 ? " " : ""
		return spaceOrNothing + char + acc
	}, "")

	return strWithSpaces[0] === " " ? strWithSpaces.slice(1) : strWithSpaces
}
