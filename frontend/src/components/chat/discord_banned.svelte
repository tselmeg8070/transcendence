<script lang="ts">
	import {
		GroupActions,
		type GroupBansInterface,
		type GroupInterface,
	} from '../../interfaces/types';
	import { doGroupAction } from '../../services/gqlGroups';
	import moment from "moment"
	import { getAvatar } from '../../utils/avatarGetter';
	export let banInfo: GroupBansInterface;
	export let channel: GroupInterface;
	export let handleSent: () => void;

	let loading = false;
	async function simulateAsyncAction() {
		loading = true;
		// Simulating an asynchronous action
		try {
			const result = await doGroupAction(
				channel.id,
				banInfo.user.id,
				undefined,
				GroupActions.UNBAN
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
	<a href="/profile/{banInfo.user.pseudo}" class="flex items-center space-x-4">
		<img
			class="w-10 h-10 rounded-full"
			src={getAvatar(banInfo.user.avatar, banInfo.user.pseudo)}
			alt=""
		/>
		<div class="font-medium">
			<div>{banInfo.user.name}</div>
			<div class="text-sm text-gray-500">{banInfo.user.pseudo}</div>
		</div>
	</a>
	<div class="flex">
		<button
			class="ml-3 bg-gray-800 hover:bg-gray-900 rounded-full"
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
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 m-2.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			  </svg>
			{/if}
		</button>
	</div>
</div>
