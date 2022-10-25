/**
 * Converts milliseconds to seconds in the current minute.
 * @param {number} ms - milliseconds to convert
 * @returns {string} converted seconds
 */
export const getFormattedSecondsFromMs = (ms: number): string => {
	return formatTimeWithLeadingZero(Math.floor(ms / 1000) % 60);
};

/**
 * Converts milliseconds to minutes in the current hour.
 * @param {number} ms - milliseconds to convert
 * @param {boolean} leadingZero - whether to add a leading zero to the result
 * @returns {string} converted minutes
 */
export const getFormattedMinutesFromMs = (ms: number, leadingZero: boolean): string => {
	const minutes = Math.floor(ms / 1000 / 60) % 60;
	return leadingZero ? formatTimeWithLeadingZero(minutes) : minutes.toString();
};

/**
 * Converts milliseconds to hours.
 * @param {number} ms - milliseconds to convert
 * @returns {string} converted hours
 */
export const getHoursFromMs = (ms: number): string => {
	return `${Math.floor(ms / 1000 / 60 / 60)}`;
};

/**
 * Formats a number to have a leading zero if it is less than 10.
 * @param {number} time - time to format
 * @returns {string} formatted time
 */
export const formatTimeWithLeadingZero = (time: number): string => {
	return time < 10 ? `0${time}` : `${time}`;
};

/**
 * Gets the time from milliseconds in M:SS format if the time is less than an hour, or H:MM:SS format if the time is more than an hour.
 * @param {number} ms - milliseconds to convert
 * @returns {string} converted time
 */
export const getCompleteTimeFromMs = (ms: number): string => {
	const hours = Math.floor(ms / 1000 / 60 / 60);
	const minutes = Math.floor(ms / 1000 / 60) % 60;
	const seconds = Math.floor(ms / 1000) % 60;
	if (hours > 0) {
		return `${hours}:${formatTimeWithLeadingZero(minutes)}:${formatTimeWithLeadingZero(seconds)}`;
	} else {
		return `${minutes}:${formatTimeWithLeadingZero(seconds)}`;
	}
};
