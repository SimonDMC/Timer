/**
 * @param {number} ms - milliseconds to convert
 * @returns {string} converted seconds
 */
export const getFormattedSecondsFromMs = (ms: number): string => {
	return formatTimeWithLeadingZero(Math.floor(ms / 1000) % 60);
};

/**
 * @param {number} ms - milliseconds to convert
 * @param {boolean} leadingZero - whether to add a leading zero to the result
 * @returns {string} converted minutes
 */
export const getFormattedMinutesFromMs = (ms: number, leadingZero: boolean): string => {
	const minutes = Math.floor(ms / 1000 / 60) % 60;
	return leadingZero ? formatTimeWithLeadingZero(minutes) : minutes.toString();
};

/**
 * @param {number} ms - milliseconds to convert
 * @returns {string} converted hours
 */
export const getHoursFromMs = (ms: number): string => {
	return `${Math.floor(ms / 1000 / 60 / 60)}`;
};

/**
 * @param {number} time - time to format
 * @returns {string} formatted time
 */
export const formatTimeWithLeadingZero = (time: number): string => {
	return time < 10 ? `0${time}` : `${time}`;
};
