<script lang="ts">
	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';

	export let buttons: string;

	const dispatch = createEventDispatcher();
</script>

<div class="buttonrow">
	{#if buttons === 'grid'}
		<Button icon="1" type="left" on:click={() => dispatch('changeSize', [1, 1])} />
		<Button icon="4" type="middle" on:click={() => dispatch('changeSize', [2, 2])} />
		<Button icon="9" type="right" on:click={() => dispatch('changeSize', [3, 3])} />
	{/if}
</div>

<style>
	.buttonrow {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 1em;
		left: 1em;
	}
</style>
