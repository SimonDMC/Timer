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
		selected: number;
		timers: TimerContainer;
	};
</script>

<script lang="ts">
	import Timer from '../components/Timer.svelte';
	import ButtonRow from '../components/ButtonRow.svelte';
	import { updateTitle } from '../titleManager';
	import { onMount } from 'svelte';

	let loaded = false;
	let boardSize = 0;
	let selected = 0;
	let timerData: TimerContainer = {};
	let saveData: LocalSave = {
		size: 1,
		selected: 0,
		timers: {}
	};

	// make listener global
	let listener = (event: KeyboardEvent) => {
		if (event.code === 'Space') {
			const timerButton = document.getElementById(
				`timer-button-${saveData.selected}`
			) as HTMLElement;
			timerButton.click();
			event.preventDefault();
		}
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
					selected = saveData.selected;
				} catch (e) {
					console.log('Error loading data from local storage');
				}
			}
		} else {
			saveData = {
				size: 1,
				selected: 0,
				timers: {}
			};
			boardSize = saveData.size;
			timerData = saveData.timers;
			selected = saveData.selected;
		}
		loaded = true;

		// update listener to reflect loaded data
		listener = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				const timerButton = document.getElementById(
					`timer-button-${saveData.selected}`
				) as HTMLElement;
				timerButton.click();
				event.preventDefault();
			}
		};
		document.addEventListener('keydown', listener);
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

		// reset selected timer if it is out of bounds
		if (selected > boardSize ** 2 - 1) {
			selected = 0;
			saveData.selected = selected;
		}

		localStorage.setItem('timer-data', JSON.stringify(saveData));
	}

	function save(event: CustomEvent) {
		const timerIndex: number = event.detail.index;
		const timer = event.detail.data;
		timerData[`timer${timerIndex}` as keyof TimerContainer] = timer;
		saveData.size = boardSize;

		// only update selected timer if save wasn't caused by tick
		if (event.detail.changeSelected === true) {
			selected = timerIndex;
			saveData.selected = timerIndex;

			// update listener to reflect new selected timer
			document.removeEventListener('keydown', listener);
			// pause/resume active timer when space is pressed
			listener = (event: KeyboardEvent) => {
				if (event.target != null && (event.target as HTMLElement).isContentEditable) return;
				if (event.code === 'Space') {
					const timerButton = document.getElementById(`timer-button-${selected}`) as HTMLElement;
					timerButton.click();
					event.preventDefault();
				}
			};
			document.addEventListener('keydown', listener);
		}

		// update title
		updateTitle(saveData);

		// save to local
		localStorage.setItem('timer-data', JSON.stringify(saveData));
	}

	function importData() {
		// create file input
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.style.display = 'none';
		document.body.appendChild(input);

		// add listener to file input
		input.addEventListener('change', (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const importedData = event.target?.result;
					if (importedData) {
						try {
							// try parsing the data
							saveData = JSON.parse(importedData as string);

							// try setting all the data to the imported data
							boardSize = saveData.size;
							timerData = saveData.timers;
							selected = saveData.selected;

							// save data
							localStorage.setItem('timer-data', JSON.stringify(saveData));
						} catch (e) {
							alert('Error loading data from file. Perhaps the file is corrupted?');
						}
					}
				};
				reader.readAsText(file);
			}
		});

		// trigger file input
		input.click();

		// remove file input
		document.body.removeChild(input);
	}

	function exportData() {
		const dataStr =
			'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(saveData, null, 4));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', 'timer-data.json');
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
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
		<ButtonRow buttons="data" on:importData={importData} on:exportData={exportData} />
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
