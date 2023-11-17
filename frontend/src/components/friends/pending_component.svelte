<script lang="ts">
	import type { FriendRequestInterface } from '../../interfaces/types';
	import { acceptFriendRequest, rejectFriendRequest } from '../../services/gqlFriends';
	import { getAvatar } from '../../utils/avatarGetter';
	export let request: FriendRequestInterface;
	export let handleAccept: (req: FriendRequestInterface) => void;
	export let handleReject: (req: FriendRequestInterface) => void;

	let loading = false;
	let loadingReject = false;
	async function simulateAsyncAction() {
		loading = true;
		try {
			await acceptFriendRequest(request.sender.pseudo);
			handleAccept(request);
			loading = false;
		} catch (e) {
			loading = false;
		}
	}

	async function simulateAsyncRejectAction() {
		loadingReject = true;
		try {
			await rejectFriendRequest(request.sender.pseudo);
			handleReject(request);
			loadingReject = false;
		} catch (e) {
			loadingReject = false;
		}
	}

	function handleButtonClick() {
		if (!loading) {
			simulateAsyncAction();
		}
	}

	function handleRejectButtonClick() {
		if (!loadingReject) {
			simulateAsyncRejectAction();
		}
	}

</script>

<div class="flex w-full justify-between mb-3 content-center">
	<a href="/profile/{request.sender.pseudo}" class="flex items-center space-x-4">
		<img
			class="w-10 h-10 rounded-full"
			src={getAvatar(request.sender.avatar, request.sender.pseudo)}
			alt=""
		/>
		<div class="font-medium">
			<div>{request.sender.name}</div>
			<div class="text-sm text-gray-500">Incoming request</div>
		</div>
	</a>
	<div>
	<button
		type="button"
		class="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2"
		on:click={handleButtonClick}
		disabled={loading || loadingReject}
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
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
			</svg>
		{/if}
	</button>
	<button
		type="button"
		class="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		on:click={handleRejectButtonClick}
		disabled={loadingReject}
	>
		{#if loadingReject}
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
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		 	 </svg>
		{/if}
	</button>
	</div>
</div>
