<script lang="ts">
	import { onMount } from "svelte";
	import { getFriends, getPendingFriendRequests, getPendingRequests, getUsers } from "../../../../services/gqlFriends";
	import type { AuthenticationType } from "../../../../stores/authentication";
	import { authentication } from "../../../../stores/authentication";
	import PendingComponent from "$components/friends/pending_component.svelte";
	import type { FriendRequestInterface } from "../../../../interfaces/types";
	import PendingSentComponent from "$components/friends/pending_sent_component.svelte";

	let requests: FriendRequestInterface[] = [];
	let sentRequests: FriendRequestInterface[] = [];

	function handleAccepted(request: FriendRequestInterface) {
		const i = requests.findIndex(e => e.id === request.id);
		if (i > -1) {
			requests.splice(i, 1);
			requests = [...requests];
		}
	}

	function handleCancel(request: FriendRequestInterface) {
		const i = sentRequests.findIndex(e => e.id === request.id);
		if (i > -1) {
			sentRequests.splice(i, 1);
			sentRequests = [...sentRequests];
		}
	}

	onMount(async () => {
		try {
			const pendingRequests = await getPendingRequests();
			const pendingSentRequests = await getPendingFriendRequests();
			let tempRequests:FriendRequestInterface[] = []
			let tempSentRequests:FriendRequestInterface[] = []
			pendingRequests.forEach((element: FriendRequestInterface) => {
				tempRequests.push(element);
			});
			pendingSentRequests.forEach((element: FriendRequestInterface) => {
				tempSentRequests.push(element);
			});
			sentRequests = [...tempSentRequests];
			requests = [...tempRequests];
		} catch (e) {

		}
	})
</script>

<div class="mx-7">
	<p class="mt-5 text-base mb-5 font-semibold uppercase">Pending - {requests.length + sentRequests.length}</p>
	<div class="overflow-y-scroll no-scrollbar max-w-full scrollbar-hide">
		{#each requests as request}
			<PendingComponent request={request} handleAccept={handleAccepted} handleReject={handleAccepted}/>
		{/each}
		{#each sentRequests as request}
			<PendingSentComponent request={request} handleReject={handleCancel}/>
		{/each}
	</div>

</div>
