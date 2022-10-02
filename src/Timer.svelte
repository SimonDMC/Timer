<script lang="ts">
    export let downScale: number = 1;

    // size of one timer
    let timerWidth = `${1/downScale*100}vw`;
    let timerHeight = `${1/downScale*100}vh`;

    // gap between timers
    let gap = `${0.5/downScale}rem`;

    // set size and font size of timer element
    let sizeStyling = `
        font-size: ${1/downScale}rem;
        width: calc(${timerWidth} - ${gap});
        height: calc(${timerHeight} - ${gap});
    `;
</script>

<style>
    .background {
        background-color: #282C34;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    h1 {
        color: white;
        font-size: 6em;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
    }

    p {
        color: white;
        font-size: 12em;
        font-family: 'Inter', sans-serif;
        font-weight: 200;
    }
</style>

<div class="background" style={sizeStyling}>
    <h1>Default Timer</h1>
    <p>5:34</p>
</div>