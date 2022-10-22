<script lang="ts">
	import Timer from '../components/Timer.svelte';
	import ButtonRow from '../components/ButtonRow.svelte';

	let boardSize = 1;

	function changeSize(event: CustomEvent) {
		boardSize = event.detail[0];
	}
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<div class="app-background">
	<div class="container">
		{#key boardSize}
			{#each Array(boardSize) as _, i}
				{#each Array(boardSize) as _, j}
					<Timer downScale={boardSize} timerIndex={i * boardSize + j} shiftDown={i == 0} />
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
</style>
