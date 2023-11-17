<script>
	import Play from '$components/play.svelte';
	import { onMount } from 'svelte';
	import Background from '$components/experience/background.svelte'
	import Home from '$components/experience/home.svelte'

	export let data;

	onMount(async () => {
		console.log(data.user);
	});
</script>

<!-- <Background /> -->
<!-- <Play /> -->
<Home />