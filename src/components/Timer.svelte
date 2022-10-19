<script lang="ts">
	import Button from './Button.svelte';
	import { onMount } from 'svelte';
	import { getFormattedSecondsFromMs, getFormattedMinutesFromMs } from '../util/numberFormat';

	export let downScale: number = 1;

	// size of one timer
	let timerWidth = `${(1 / downScale) * 100}%`;
	let timerHeight = `${(1 / downScale) * 100}%`;

	// gap between timers
	let gap = `${(3 * (downScale - 1)) / downScale}px`;

	// set size and font size of timer element
	let sizeStyling = `
        font-size: ${1 / downScale}rem;
        width: calc(${timerWidth} - ${gap});
        height: calc(${timerHeight} - ${gap});
    `;

	// assign timer incrementer on mount
	onMount(() => {
		incrementTime();
	});

	/* TIMER LOGIC */

	let running = false;
	let timeInMs: number = 0;
	let seconds: string = '00';
	let minutes: string = '0';
	let latestSavedTime: Date | undefined = undefined;

	// increment time every 100ms
	function incrementTime() {
		if (running && latestSavedTime == undefined) {
			// no time captured yet
			latestSavedTime = new Date();
		} else if (running && latestSavedTime != undefined) {
			// get time difference between now and last saved time
			// this is necessary because the interval is not always 100ms, such as when the tab is inactive or the window is closed
			let timeElapsed = new Date().getTime() - latestSavedTime.getTime();
			// sometimes the time difference is negative, so we need to add 1000ms to it
			if (timeElapsed < 0) {
				timeElapsed += 1000;
			}
			timeInMs += timeElapsed;
			console.log(timeElapsed);

			// capture current time
			latestSavedTime = new Date();

			// update seconds and minutes
			seconds = getFormattedSecondsFromMs(timeInMs);
			minutes = getFormattedMinutesFromMs(timeInMs, false);
		}
		setTimeout(incrementTime, 100);
	}

	function toggleTimer() {
		running = !running;
		if (running) {
			latestSavedTime = new Date();
		} else {
			// invalidate latest saved time as we don't want to keep track while the timer is paused
			latestSavedTime = undefined;
		}
	}

	function resetTimer() {
		timeInMs = 0;
		seconds = '00';
		minutes = '0';
		latestSavedTime = undefined;
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
