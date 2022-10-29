<script lang="ts">
	export let type: string = 'none';
	export let timerIndex: number = 0;
</script>

<!-- assign id so that it can be targeted by space press -->
<button
	on:click
	id={type != 'stop' ? `timer-button-${timerIndex}` : 'timer-stop-button'}
	aria-label={`Timer Button ${type}`}
>
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

	button:focus {
		outline: none;
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
