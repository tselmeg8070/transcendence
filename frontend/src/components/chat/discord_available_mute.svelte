<script lang="ts">
	import {
		GroupActions,
		type GroupInterface,
		type GroupMemberInterface
	} from '../../interfaces/types';
	import { doGroupAction } from '../../services/gqlGroups';
	import { getAvatar } from '../../utils/avatarGetter';
	export let user: GroupMemberInterface;
	export let channel: GroupInterface;
	export let handleSent: () => void;

	let loading = false;
	let duration: number;
	async function simulateAsyncAction() {
		loading = true;
		// Simulating an asynchronous action
		try {
			const result = await doGroupAction(
				channel.id,
				user.id,
				duration ? duration * 60 : undefined,
				GroupActions.MUTE
			);
			handleSent();
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
	<div
		class="text-white bg-gray-800 font-medium rounded-full text-sm text-center inline-flex items-center mr-2"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6 m-2.5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>

		<input
			class="bg-gray-800 border-none"
			bind:value={duration}
			type="number"
			placeholder="Duration in min"
		/>
		<button
			class="bg-gray-900 hover:bg-gray-800 rounded-full"
			disabled={loading}
			on:click={handleButtonClick}
		>
			{#if loading}
				<svg
					class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 m-2.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
					/>
				</svg>
			{/if}
		</button>
	</div>
</div>
