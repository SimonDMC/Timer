<script lang="ts">
	export let icon: string = 'none';
	export let type: string = 'left';

	let styling = ``;

	switch (type) {
		case 'left':
			styling = `
                border-right: 0.04em solid white;
                border-bottom-left-radius: 0.3em;
                border-top-left-radius: 0.3em;
            `;
			break;
		case 'middle':
			styling = `
                border-left: 0.04em solid white;
                border-right: 0.04em solid white;
            `;
			break;
		case 'right':
			styling = `
                border-left: 0.04em solid white;
                border-bottom-right-radius: 0.3em;
                border-top-right-radius: 0.3em;
            `;
			break;
	}
</script>

<button on:click style={styling}>
	{#if icon == '1'}
		<i class="fa-regular fa-square" />
	{:else if icon == '4'}
		<i class="fa-solid fa-border-all" />
	{:else if icon == '9'}
		<i class="fa-solid fa-table-cells" />
	{:else if icon == 'import'}
		<i class="fa-solid fa-file-import" />
	{:else if icon == 'export'}
		<i class="fa-solid fa-file-export" />
	{/if}
</button>

<style>
	button {
		background-color: #325362;
		border: 0.06em solid white;
		color: white;
		cursor: pointer;
		font-size: max(2.5em, 7.5vw);
		width: 1.8em;
		height: 1.8em;
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
</style>
