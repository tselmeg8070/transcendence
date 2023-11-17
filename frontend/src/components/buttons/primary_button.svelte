<script lang="ts">
	export let text = 'Default Text';
	export let onClick: any;
</script>

<button
	on:click={onClick}
	type="button"
	class="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
	>{text}</button
>
