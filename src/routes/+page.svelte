<script lang="ts">
	import Timer from '../components/Timer.svelte';

	const boardSize = 2;
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<div class="app-background">
	<div class="container">
		{#each Array(boardSize ** 2) as _, i}
			<Timer downScale={boardSize} />
		{/each}
	</div>
</div>

<style>
	.app-background {
		background-color: #23262c;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
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
	}
</style>
