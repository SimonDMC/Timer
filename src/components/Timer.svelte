<script lang="ts">
	export let downScale: number = 1;

	// size of one timer
	let timerWidth = `${(1 / downScale) * 100}%`;
	let timerHeight = `${(1 / downScale) * 100}%`;

	// gap between timers
	let gap = `${(0.2 * (downScale - 1)) / downScale}rem`;

	// set size and font size of timer element
	let sizeStyling = `
        font-size: ${1 / downScale}rem;
        width: calc(${timerWidth} - ${gap});
        height: calc(${timerHeight} - ${gap});
    `;
</script>

<div class="background" style={sizeStyling}>
	<h1>Default Timer</h1>
	<p>5:34</p>
	<ul>
		<li><button /></li>
		<li><button /></li>
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
		font-family: 'Inter', sans-serif;
		font-weight: 200;
	}
</style>
