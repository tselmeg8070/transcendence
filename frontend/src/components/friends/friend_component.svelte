<script lang="ts">
	import type { FriendInterface } from '../../interfaces/types';
	import { unFriend } from '../../services/gqlFriends';
	import { getAvatar } from '../../utils/avatarGetter';
	export let user: FriendInterface;

	let loading = false;

	async function simulateAsyncAction() {
		loading = true;
		try {
			await unFriend(user.pseudo, user.channelId);
			loading = false;
		} catch (e) {
			loading = false;
		}
	}

</script>

<div class="flex w-full justify-between mb-3 content-center">
	<a href="/profile/{user.pseudo}" class="flex items-center space-x-4">
		<img
			class="w-10 h-10 rounded-full"
			src={getAvatar(user.avatar, user.pseudo)}
			alt=""
		/>
		<div class="font-medium">
			<div>{user.name}</div>
			<div class="text-sm text-gray-500">{user.pseudo}</div>
		</div>
	</a>
	<div>
		<a
			href="/messages/{user.channelId}"
			type="button"
			class="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2"
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
			</svg>
		</a>
		<button
			type="button"
			disabled={loading}
			on:click={simulateAsyncAction}
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
					<path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
				</svg>
			{/if}
		</button>
	</div>

</div>
