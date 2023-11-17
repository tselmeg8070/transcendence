<script lang="ts">
	import type { GroupInterface } from '../../interfaces/types';

	export let group: GroupInterface;
	export let onClick: (gr: GroupInterface) => void;
	export let isSelected: boolean = false;

</script>

<div
	on:click={() => onClick(group)}
	on:keydown={() => onClick(group)}
	class="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-2 rounded p-4 flex  {isSelected && "border-l-4 border-red-500"}"
>
	<div class="flex-2">
		<div class="w-12 h-12 relative">
			<img
				class="w-12 h-12 rounded-full mx-auto"
				src="https://api.dicebear.com/7.x/thumbs/svg?seed={group.name}"
				alt="chat-user"
			/>
			<!-- <span
				class="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"
			/> -->
		</div>
	</div>
	<div class="flex-1 px-2">
		<div class="truncate w-32"><span class="text-gray-800">{group.name}</span></div>
		<div><small class="text-gray-600">{group.members.length + 1} members</small></div>
	</div>
	<div class="flex-2 text-right">
		<small class="text-gray-500 ">
			{#if group.isPrivate}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
				</svg>
			{/if}
		</small>
	</div>
</div>
