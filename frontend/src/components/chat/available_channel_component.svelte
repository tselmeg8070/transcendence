<script lang="ts">
	import type { GroupInterface } from '../../interfaces/types';
	import { joinChannel, leaveChannel } from '../../services/gqlGroups';
	export let channel: GroupInterface;
	export let handleJoin: (channel: GroupInterface) => void;

	let loading: boolean = false;
	let password: string = "";
	async function simulateAsyncAction() {
		loading = true;
		try {
			const res = await joinChannel(channel.id, password);
			if (res.success)
				handleJoin(channel);
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
			<div class="text-sm text-gray-500">{channel.members.length} members</div>
		</div>
	</div>
	<div>
		{#if channel.isPrivate}
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
						d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
					/>
				</svg>
				<input class="bg-gray-800 border-none" bind:value={password} type="password" placeholder="Password..." />
				<button
					class="hover:bg-gray-900 rounded-full"
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
								d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
							/>
						</svg>
					{/if}
				</button>
			</div>
		{:else}
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
					Loading
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
						/>
					</svg>
				{/if}
			</button>
		{/if}
	</div>
</div>
