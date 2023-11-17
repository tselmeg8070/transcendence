<script lang="ts">
	import type { GroupInterface } from '../../interfaces/types';
	import { leaveChannel } from '../../services/gqlGroups';
	export let channel: GroupInterface;
	export let handleLeave: (channel: GroupInterface) => void;

	let loading: boolean = false;
	async function simulateAsyncAction() {
		loading = true;
		try {
			await leaveChannel(channel.id);
			handleLeave(channel);
			loading = false;
		} catch (e) {
			loading = false;
		}
	}

	function handleButtonClick() {
		if (!loading) {
			simulateAsyncAction();
		}
	}
</script>

<div class="flex w-full justify-between mb-3 content-center">
	<div class="flex items-center space-x-4">
		<img
			class="w-10 h-10 rounded-full"
			src="https://api.dicebear.com/7.x/bottts/svg?seed={channel.name}"
			alt=""
		/>
		<div class="font-medium">
			<div>{channel.name}</div>
			<div class="text-sm text-gray-500">{channel.members.length + 1} members</div>
		</div>
	</div>
	<div>
		<a
			href="/messages/{channel.id}"
			type="button"
			class="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2"
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
			</svg>
		</a>
		<button
			type="button"
			on:click={handleButtonClick}
			disabled={loading}
			class="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2"
		>
			{#if loading}
				<svg
					class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				Loading
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
				</svg>
			{/if}
		</button>
	</div>

</div>
