/**
 * Decodes HTML entities into readable text
 * @param {string} html - The string containing HTML entities to decode
 * @returns {string} - The decoded string
 */
export const decodeHTML = (html: string): string => {
	const txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};
