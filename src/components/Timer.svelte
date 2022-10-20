<script lang="ts">
	import Button from './Button.svelte';
	import { onMount } from 'svelte';
	import { getFormattedSecondsFromMs, getFormattedMinutesFromMs } from '../util/numberFormat';

	export let downScale: number = 1;
	export let timerIndex: number;

	// size of one timer
	let timerWidth = `${(1 / downScale) * 100}%`;
	let timerHeight = `${(1 / downScale) * 100}%`;

	// gap between timers
	let gap = `${(3 * (downScale - 1)) / downScale}px`;

	// set size and font size of timer element
	let sizeStyling = `
        font-size: ${1 / downScale}em;
        width: calc(${timerWidth} - ${gap});
        height: calc(${timerHeight} - ${gap});
    `;

	// timer data interface (god i love ts)
	interface TimerData {
		time: number;
		isRunning: boolean;
		name: string;
		lastSavedTime: Date | undefined;
	}

	let saveData: TimerData = {
		time: 0,
		isRunning: false,
		name: '',
		lastSavedTime: undefined
	};

	/* TIMER LOGIC */

	let running = false;
	let timeInMs: number = 0;
	let seconds: string = '00';
	let minutes: string = '0';
	let latestSavedTime: Date | undefined = undefined;

	// when component loads for the first time
	onMount(() => {
		// attempt to get data from local storage
		if (localStorage.getItem(`timer${timerIndex}`)) {
			let importedData = localStorage.getItem(`timer${timerIndex}`);
			if (importedData) {
				saveData = JSON.parse(importedData);
				try {
					// try setting all the data to the imported data
					timeInMs = saveData.time;
					running = saveData.isRunning;
					latestSavedTime = saveData.lastSavedTime ? new Date(saveData.lastSavedTime) : undefined;
					console.info(`Loaded timer${timerIndex} from local storage`);
					console.log(saveData);
				} catch (e) {
					// if fails, set everything to zero and log error
					console.error('Error importing timer data', e);
					timeInMs = 0;
					running = false;
					latestSavedTime = undefined;
				}
				updateTimer();
			}
		}

		// start timer incrementer
		incrementTime();
	});

	// increment time every 100ms
	function incrementTime() {
		if (running && latestSavedTime == undefined) {
			// no time captured yet
			latestSavedTime = new Date();
		} else if (running && latestSavedTime != undefined) {
			// get time difference between now and last saved time
			// this is necessary because the interval is not always 100ms, such as when the tab is inactive or the window is closed
			let timeElapsed = new Date().getTime() - latestSavedTime.getTime();
			timeInMs += timeElapsed;

			// capture current time
			latestSavedTime = new Date();

			// display and save to localStorage
			updateTimer();
		}
		setTimeout(incrementTime, 100);
	}

	function updateTimer() {
		// update seconds and minutes
		seconds = getFormattedSecondsFromMs(timeInMs);
		minutes = getFormattedMinutesFromMs(timeInMs, false);

		saveToLocalStorage();
	}

	function toggleTimer() {
		running = !running;
		if (running) {
			latestSavedTime = new Date();
		} else {
			// invalidate latest saved time as we don't want to keep track while the timer is paused
			latestSavedTime = undefined;
		}
		saveToLocalStorage();
	}

	function resetTimer() {
		timeInMs = 0;
		latestSavedTime = undefined;
		// pause timer
		running = false;
		updateTimer();
	}

	function saveToLocalStorage() {
		// save data to local storage
		saveData.name = 'Default Timer';
		saveData.time = timeInMs;
		saveData.isRunning = running;
		saveData.lastSavedTime = latestSavedTime;
		localStorage.setItem(`timer${timerIndex}`, JSON.stringify(saveData));
	}
</script>

<div class="background" style={sizeStyling}>
	<h1>Default Timer</h1>
	<p>{minutes}:{seconds}</p>
	<ul>
		<li><Button type={running ? 'pause' : 'play'} on:click={toggleTimer} /></li>
		<li><Button type="stop" on:click={resetTimer} /></li>
	</ul>
</div>

<style>
	.background {
		background-color: #282c34;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	h1 {
		color: white;
		font-size: 4.5em;
		font-family: 'Inter', sans-serif;
		font-weight: 700;
	}

	p {
		color: white;
		font-size: 20.5em;
		font-family: 'Roboto', sans-serif;
		font-weight: 200;
	}

	ul {
		display: flex;
		gap: 5em;
		list-style: none;
	}
</style>
