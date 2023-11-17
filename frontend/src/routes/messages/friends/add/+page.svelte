<script lang="ts">
	import { onMount } from "svelte";
	import { getFriends, getPendingFriendRequests, getUsers } from "../../../../services/gqlFriends";
	import type { AuthenticationType } from "../../../../stores/authentication";
	import { authentication } from "../../../../stores/authentication";
	import UserComponent from "$components/friends/user_component.svelte";

	let pseudo: string = "";
	let users: AuthenticationType[] = [];

	function handleSentFrientReq(mPseudo: string) {
		const i = users.findIndex(e => e.pseudo === mPseudo);
		if (i > -1) {
			users.splice(i, 1);
			users = [...users];
		}
	}

	onMount(async () => {
		try {
			const tempUsers = await getUsers();
			const tempFriends = await getFriends();
			const pendingRequests = await getPendingFriendRequests();
			tempUsers.forEach((element: AuthenticationType) => {
				if (!tempFriends.find((e: AuthenticationType) => e.pseudo === element.pseudo))
				{
					if (!pendingRequests.find((e: any) => e.receiverId === element.id) && $authentication.id !== element.id)
						users.push(element);
				}
			});
			users = [...users];
		} catch (e) {

		}
	})
</script>

<div class="mx-7">
	<p class="mt-5 text-base font-semibold uppercase">Add friend</p>
	<p class="text-xs text-gray-300 mt-2">You can add friends with their pseudo</p>
	<input
		type="text"
		bind:value={pseudo}
		class="bg-gray-800 my-5 border text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
		placeholder="Enter user pseudo"
	/>
	<div class="overflow-y-scroll no-scrollbar max-w-full scrollbar-hide">
		{#each users.filter(e => {
			const pattern = new RegExp(`\\b${pseudo}`, 'i');
			return pattern.test(e.pseudo);
		}) as user}
			<UserComponent user={user} handleSent={handleSentFrientReq}/>
		{/each}
	</div>

</div>
