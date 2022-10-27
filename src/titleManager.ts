import type { LocalSave, TimerContainer, TimerData } from './routes/+page.svelte';
import { getCompleteTimeFromMs } from './util/numberFormat';
import { decodeHTML } from './util/stringUtil';

export function updateTitle(data: LocalSave) {
	switch (getRunningTimers(data.timers)) {
		case 0:
			document.title = 'No running timers';
			break;
		// exactly one running timer
		case 1: {
			const timer = getRunningTimer(data.timers);

			if (timer) {
				document.title = `${getCompleteTimeFromMs(timer.time)} | ${decodeHTML(timer.name)}`;
			}
			break;
		}
		// two or more running timers
		default:
			document.title = `${getRunningTimers(data.timers)} timers running`;
			break;
	}
}

/**
 * Gets the number of running timers.
 * @param {TimerContainer} data - A list of timers
 * @returns {number} The number of running timers
 */
function getRunningTimers(data: TimerContainer): number {
	// get values
	const values = Object.values(data);
	// sum running timers and return
	const running = values.reduce((acc, cur) => {
		if (cur.isRunning) {
			return acc + 1;
		}
		return acc;
	}, 0);
	return running;
}

/**
 * Gets the first running timer, or undefined if there are no running timers.
 * @param {TimerContainer} data - A list of timers
 * @returns {TimerData | undefined} The first running timer, or undefined if there are no running timers
 */
function getRunningTimer(data: TimerContainer): TimerData | undefined {
	// get values
	const values = Object.values(data);
	// find running timer and return
	const running = values.find((timer) => timer.isRunning);
	return running;
}
