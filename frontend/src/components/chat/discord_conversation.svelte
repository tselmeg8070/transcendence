<script lang="ts">
	import type { GroupInterface } from '../../interfaces/types';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	let currentpage = $page.url.pathname;
	const unsubscribe = page.subscribe((value) => {
		currentpage = value.url.pathname;
	});
	onDestroy(unsubscribe);
	export let group: GroupInterface;

</script>

<a
	href="/messages/{group.id}"
	class="px-2 py-1 my-1 w-full flex items-center rounded-md font-title text-xs tracking-wide {currentpage.includes(group.id) && "text-gray-100 bg-gray-600"} hover:text-gray-100 hover:bg-gray-600"
>
	<img
		class="w-8 h-8 rounded-full bg-indigo-400"
		src="https://api.dicebear.com/7.x/bottts/svg?seed={group.name}"
		alt="chat-user"
	/>
	<div class="ml-3 flex flex-col justify-start content-start place-content-start justify-items-start">
		<p class="text-sm text-left">{!group.isDirectMessage ? "#" : ""}{group.name}</p>
		{#if !group.isDirectMessage }
			<p class="text-xs text-left">{group.members.length + 1} members</p>
		{/if}
	</div>
</a>
