<script context="module" lang="ts">
	export const ssr = false;
	export type TimerData = {
		time: number;
		isRunning: boolean;
		name: string;
		lastSavedTime: Date | undefined;
	};

	export type TimerContainer = {
		timer0?: TimerData;
		timer1?: TimerData;
		timer2?: TimerData;
		timer3?: TimerData;
		timer4?: TimerData;
		timer5?: TimerData;
		timer6?: TimerData;
		timer7?: TimerData;
		timer8?: TimerData;
	};

	export type LocalSave = {
		size: number;
		timers: TimerContainer;
	};
</script>

<script lang="ts">
	import Timer from '../components/Timer.svelte';
	import ButtonRow from '../components/ButtonRow.svelte';
	import { onMount } from 'svelte';

	let loaded = false;
	let boardSize = 0;
	let timerData: TimerContainer = {};
	let saveData: LocalSave = {
		size: 1,
		timers: {}
	};

	onMount(() => {
		// attempt to get data from local storage
		if (localStorage.getItem('timer-data')) {
			let importedData = localStorage.getItem('timer-data');

			if (importedData) {
				saveData = JSON.parse(importedData);
				console.log('imported data', saveData);

				try {
					// try setting all the data to the imported data
					boardSize = saveData.size;
					timerData = saveData.timers;
				} catch (e) {
					console.log('Error loading data from local storage');
				}
			}
		} else {
			saveData = {
				size: 1,
				timers: {}
			};
			boardSize = saveData.size;
			timerData = saveData.timers;
		}
		loaded = true;
	});

	function getTimerData(timerIndex: number): TimerData {
		const tempSaveData = timerData[`timer${timerIndex}` as keyof TimerContainer];
		if (tempSaveData !== undefined) {
			return tempSaveData;
		} else {
			return {
				time: 0,
				isRunning: false,
				name: 'Default Timer',
				lastSavedTime: undefined
			};
		}
	}

	function changeSize(event: CustomEvent) {
		boardSize = event.detail[0];
		saveData.size = boardSize;

		localStorage.setItem('timer-data', JSON.stringify(saveData));
	}

	function save(event: CustomEvent) {
		console.log('saving', event.detail);

		const timerIndex: number = event.detail.index;
		const timer = event.detail.data;
		timerData[`timer${timerIndex}` as keyof TimerContainer] = timer;
		saveData.size = boardSize;

		localStorage.setItem('timer-data', JSON.stringify(saveData));
	}
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<div class="app-background">
	<div class="container">
		<div class="loadingblanket" style={loaded ? 'display: none' : ''} />
		{#key boardSize}
			{#each Array(boardSize) as _, i}
				{#each Array(boardSize) as _, j}
					<Timer
						downScale={boardSize}
						timerIndex={i * boardSize + j}
						shiftDown={i == 0}
						timerData={getTimerData(i * boardSize + j)}
						on:save={save}
					/>
				{/each}
			{/each}
		{/key}
		<ButtonRow buttons="grid" on:changeSize={changeSize} />
	</div>
</div>

<style>
	.app-background {
		background-color: #23262c;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		/* flexible font size */
		font-size: calc(1.8vmin);
	}

	.container {
		display: flex;
		flex-wrap: wrap;
		gap: 3px;
		width: 100vw;
		max-width: 1310px;
		height: 100vh;
		background-color: white;
		/* fix weird 1px white line */
		margin-right: 1px;
		position: relative;
	}

	.loadingblanket {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #282c34;
		pointer-events: none;
	}
</style>
