<script lang="ts">
	import PrimaryButton from '$components/buttons/primary_button.svelte';
	import ConversationInfo from '$components/chat/conversation.svelte';
	import AddFriendModal from '$components/friends/add_friend.svelte';
	import CreateGroupModal from '$components/chat/create_group.svelte';
	import Chat from '$components/chat/chat.svelte';
	import { onMount } from 'svelte';
	import { getGroups } from '../../services/gqlGroups.js';
	import type { GroupInterface } from '../../interfaces/types.js';

	let isOpenAddFriend: boolean = false;
	let isOpenCreateGroup: boolean = false;

	let selectedConversation: GroupInterface | null = null;

	function handleOpenAddFriend() {
		isOpenAddFriend = true;
	}

	function handleCloseAddFriend() {
		isOpenAddFriend = false;
	}

	function handleOpenCreateGroup() {
		isOpenCreateGroup = true;
	}

	function handleCloseCreateGroup() {
		isOpenCreateGroup = false;
	}

	async function handleGroupAdded() {
		try {
			groups = await getGroups();
		} catch (e) {}
		isOpenCreateGroup = false;
		//Get all the groups
	}

	function handleClick(group: GroupInterface) {
		selectedConversation = group;
	}

	let headerHeight = 0;
	let groups: GroupInterface[] = [];
	onMount(async () => {
		const header = document.querySelector('header'); // Replace 'header' with your actual header element selector
		if (header) {
			headerHeight = header.offsetHeight;
		}
		try {
			groups = await getGroups();
			console.log(groups);
		} catch (e) {}
	});
</script>

<AddFriendModal isOpen={isOpenAddFriend} onClose={handleCloseAddFriend} />
<CreateGroupModal
	isOpen={isOpenCreateGroup}
	onClose={handleCloseCreateGroup}
	onSuccess={handleGroupAdded}
/>
<div class="flex-1 bg-gray-100 w-full h-full" style="height: calc(100vh - {headerHeight}px);">
	<div class="m-auto w-11/12 h-full flex flex-col">
		<div class="py-4 flex-2 flex flex-row">
			<div class="flex-1">
				<span class="xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom">
					<span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
						<svg
							class="w-4 h-4"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							stroke="currentColor"
							viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg
						>
					</span>
				</span>
				<span class="lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
					<span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
						<svg
							class="h-4 w-4"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/></svg
						>
					</span>
				</span>
			</div>
		</div>

		<div class="h-full flex-1 flex flex-col">
			<div class="flex-1 flex h-full">
				<div class="sidebar hidden lg:flex w-1/4 flex-2 flex-col pr-6">
					<div class="flex w-full items-center justify-between pb-3 px-2">
						<h1 class="text-3xl text-gray-700">Chat</h1>
						<div class="flex">
							<button on:click={handleOpenCreateGroup} type="button" class="p-2 mr-2 rounded-md bg-indigo-500 text-sm font-semibold text-white text-white">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
									<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
								</svg>
							</button>
							<button on:click={handleOpenAddFriend} type="button" class="p-2 rounded-md bg-indigo-500 text-sm font-semibold text-white text-white">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
								</svg>
							</button>
							<!-- <PrimaryButton text="Create a group" onClick={handleOpenCreateGroup} />
							<PrimaryButton text="Add a friend" onClick={handleOpenAddFriend} /> -->
						</div>
					</div>

					<div class="flex-1 h-full max-h-full overflow-y-auto px-2 pb-3 pt-5">
						{#each groups as group}
							<ConversationInfo {group} isSelected={(group.id === selectedConversation?.id)} onClick={handleClick}/>
						{/each}
					</div>
				</div>
				{#if selectedConversation !== null}
					<Chat group={selectedConversation}/>
				{/if}
			</div>
		</div>
	</div>
</div>
