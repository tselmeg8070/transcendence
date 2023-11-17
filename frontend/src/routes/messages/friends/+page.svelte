<script lang="ts">
	import { onMount } from "svelte";
	import { getFriends, getPendingFriendRequests, getUsers } from "../../../services/gqlFriends";
	import type { AuthenticationType } from "../../../stores/authentication";
	import { authentication } from "../../../stores/authentication";
	import UserComponent from "$components/friends/user_component.svelte";
	import FriendComponent from "$components/friends/friend_component.svelte";
	import ActiveFriendComponent from "$components/friends/active_friend_component.svelte";
	import type { FriendInterface } from "../../../interfaces/types";
	import {getSocket, initSocket} from "../../../services/socket";

	let pseudo: string = "";
	let users: FriendInterface[] = [];

	async function loadFriends() {
		const tempFriends = await getFriends();
		users = [];
		tempFriends.forEach((element: FriendInterface) => {
			users.push(element);
		});
		users = [...users];
	}

	onMount(async () => {
		initSocket();
		try {
			getSocket().on("updateChat", () => {
				loadFriends();
			});
		} catch (e) {
			console.log("Socket is not initialized");
		}
		try {
			loadFriends();
		} catch (e) {
			console.log('There was an error during the loadFriends!');
		}
	})
</script>
<div class="flex mx-7 h-full">
	<div class="flex-1 h-full">
		<p class="mt-5 text-base font-semibold uppercase">Friends - {users.length}</p>
		<input
			type="text"
			bind:value={pseudo}
			class="bg-gray-800 my-5 border text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
			placeholder="Search with pseudo"
		/>
		<div class="overflow-y-scroll no-scrollbar max-w-full scrollbar-hide">
			{#each users.filter(e => {
				const pattern = new RegExp(`\\b${pseudo}`, 'i');
				return pattern.test(e.pseudo);
			}) as user}
				<FriendComponent user={user}/>
			{/each}
		</div>
	</div>
	<div class="ml-5 pl-5 w-1/4 border-l-gray-800 border-l-2 hidden md:flex flex-col">
		<p class="mt-5 mb-5 text-base font-semibold">Active now</p>
		{#each users.filter((e) => e.status !== "OFFLINE") as user}
			<ActiveFriendComponent user={user}/>
		{/each}
	</div>
</div>

