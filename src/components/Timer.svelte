<script lang="ts">
	import Button from './TimerButton.svelte';
	import { onMount, onDestroy } from 'svelte';
	import {
		getFormattedSecondsFromMs,
		getFormattedMinutesFromMs,
		getHoursFromMs
	} from '../util/numberFormat';
	import type { TimerData } from '../routes/+page.svelte';
	import { mobile } from '../routes/+page.svelte';
	import { createEventDispatcher } from 'svelte';

	export let downScale: number = 1;
	export let timerIndex: number;
	export let shiftDown: boolean = false;
	export let timerData: TimerData;

	const dispatch = createEventDispatcher();

	// if on mobile, use (1, 1, 2) as width, otherwise (1, 2, 3)
	const scaleW = mobile ? Math.max(1, downScale - 1) : downScale;
	const scaleH = downScale;

	// size of one timer
	let timerWidth = `${(1 / scaleW) * 100}%`;
	let timerHeight = `${(1 / scaleH) * 100}%`;

	// gap between timers
	let gapW = `${(3 * (scaleW - 1)) / scaleW}px`;
	let gapH = `${(3 * (scaleH - 1)) / scaleH}px`;

	// figure out mobile upscale
	let mobileUpscale = 1;
	let maxVH = 100;
	if (mobile) {
		switch (downScale) {
			case 1:
				mobileUpscale = 1;
				maxVH = 2;
				break;
			case 2:
				mobileUpscale = 1.9;
				maxVH = 0.9;
				break;
			case 3:
				mobileUpscale = 1.7;
				maxVH = 0.55;
				break;
		}
	}

	// figure out shift down
	let shiftDownClass = '';
	if (mobile) {
		if (downScale == 2 && timerIndex == 0) {
			shiftDownClass = ' shift-small';
		}
		if (downScale == 3 && timerIndex <= 1) {
			shiftDownClass = ' shift';
		}
	}

	// set size and font size of timer element
	let sizeStyling = `
        font-size: min(${(1 / downScale) * mobileUpscale}em, ${maxVH}vh);
        width: calc(${timerWidth} - ${gapW});
        height: calc(${timerHeight} - ${gapH});
    `;

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
	let hours: string = '0';
	let displayHours: boolean = false;
	let timerName: string = 'Default Timer';
	let latestSavedTime: Date | undefined = undefined;
	let incrementer: ReturnType<typeof setTimeout>;

	// when component loads for the first time
	onMount(() => {
		saveData = timerData;
		timeInMs = saveData.time;
		running = saveData.isRunning;
		latestSavedTime = saveData.lastSavedTime ? new Date(saveData.lastSavedTime) : undefined;
		timerName = saveData.name;
		updateTimer();

		// start timer incrementer
		incrementTime();
	});

	// cancel incrementer when component is destroyed
	onDestroy(() => {
		clearTimeout(incrementer);
	});

	// increment time every 100ms
	function incrementTime() {
		if (running && latestSavedTime == undefined) {
			// no time captured yet
			latestSavedTime = new Date();
		} else if (saveData.isRunning && latestSavedTime != undefined) {
			// get time difference between now and last saved time
			// this is necessary because the interval is not always 100ms, such as when the tab is inactive or the window is closed
			let timeElapsed = new Date().getTime() - latestSavedTime.getTime();

			timeInMs += timeElapsed;

			// capture current time
			latestSavedTime = new Date();

			// display and save to localStorage
			updateTimer();
		}
		incrementer = setTimeout(incrementTime, 100);
	}

	function updateTimer() {
		// figure out whether to display hours
		displayHours = timeInMs >= 3600000;
		// update seconds and minutes
		seconds = getFormattedSecondsFromMs(timeInMs);
		minutes = getFormattedMinutesFromMs(timeInMs, displayHours);
		hours = getHoursFromMs(timeInMs);

		save(false);
	}

	function toggleTimer() {
		if (running) {
			// invalidate latest saved time as we don't want to keep track while the timer is paused
			latestSavedTime = undefined;
			running = false;
		} else {
			latestSavedTime = new Date();
			running = true;
		}
		save(true);
	}

	function resetTimer() {
		timeInMs = 0;
		latestSavedTime = undefined;
		// pause timer
		running = false;
		save(true);
		updateTimer();
	}

	function changeTimerName(e: KeyboardEvent) {
		// prevent enter
		if (e.key == 'Enter') {
			e.preventDefault();
			return;
		}

		let target = e.target as HTMLInputElement;

		// wait for input to update
		setTimeout(() => {
			timerName = target.innerHTML;
			save(true);
		}, 0);
	}

	function save(changeSelected: boolean) {
		// save data
		saveData.name = timerName;
		saveData.time = timeInMs;
		saveData.isRunning = running;
		saveData.lastSavedTime = latestSavedTime;
		dispatch('save', {
			index: timerIndex,
			data: saveData,
			changeSelected: changeSelected
		});
	}
</script>

<div
	class={`background${shiftDown && !mobile ? ' shift' : ''}${shiftDownClass}`}
	style={sizeStyling}
>
	<h1
		contenteditable
		class={shiftDown && scaleW == 3 && timerIndex != 1 ? ' shifted' : ''}
		bind:innerHTML={timerName}
		on:keydown={(e) => changeTimerName(e)}
	>
		{timerName}
	</h1>
	<div class="wrapper">
		<p style={displayHours ? 'font-size: min(18em, 12vw)' : 'font-size: 20.5em'}>
			{displayHours ? `${hours}:` : ''}{minutes}:{seconds}
		</p>
	</div>
	<ul>
		<li><Button type={running ? 'pause' : 'play'} {timerIndex} on:click={toggleTimer} /></li>
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

	/* shift everything down if the timer is in the first row */
	.background.shift > *:not(h1) {
		transform: translateY(5em);
	}
	.background.shift > h1 {
		transform: translateY(1.4em);
	}

	.background.shift-small > *:not(h1) {
		transform: translateY(2.8em);
	}
	.background.shift-small > h1 {
		transform: translateY(0.6em);
	}

	.wrapper {
		pointer-events: none;
	}

	/* if scale is 3, shift text down even further */
	h1.shifted {
		transform: translateY(1.8em) !important;
	}

	h1 {
		color: white;
		font-size: 4.5em;
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		outline: none;
		width: 10em;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
	}

	p {
		color: white;
		font-family: 'Roboto', sans-serif;
		font-weight: 200;
	}

	.wrapper {
		height: 24.6em;
		display: flex;
		align-items: center;
	}

	ul {
		display: flex;
		gap: 5em;
		list-style: none;
	}
</style>
