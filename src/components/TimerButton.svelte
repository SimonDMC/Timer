<script lang="ts">
	export let type: string = 'none';
</script>

<button on:click>
	{#if type == 'play'}
		<i class="fa-solid fa-play" />
	{:else if type == 'pause'}
		<i class="fa-solid fa-pause" />
	{:else if type == 'stop'}
		<i class="fa-solid fa-stop" />
	{/if}
</button>

<style>
	button {
		background-color: #325362;
		border: 0.08em solid white;
		box-shadow: 0 0 0.22em #000;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		font-size: 4.5em;
		width: 2em;
		height: 2em;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background-color 0.15s;
		/* no mobile selection */
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}

	button:hover {
		background-color: #35677e;
	}

	i {
		filter: drop-shadow(0 0 0.085em #000);
	}

	/* fix icon inconsistencies */

	.fa-play {
		transform: translate(0.05em, 0);
	}

	.fa-pause {
		transform: scale(1.1);
	}
</style>
