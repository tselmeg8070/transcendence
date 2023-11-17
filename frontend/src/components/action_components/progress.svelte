<script lang="ts">
    export let progress: number = 0;
    export let level: number = 7;
</script>

<div class={`mt-2 flex flex-row items-center justify-center relative rounded-lg h-3 sm:h-5 w-[60%] border bg-gray-500/10 border-gray-500/15 shadow-sm`}>
    <div class={`absolute inset-0 rounded-l-lg h-full w-[${progress}%] bg-white`} />
    <div class="absolute top-6 left-2 text-[10px] sm:text-xs">Level {level}</div>
</div>
