<script lang="ts">
	import { beforeUpdate, afterUpdate, onMount } from 'svelte';
	import type { GroupInterface, MessageInterface } from '../../interfaces/types';
	import { getMessages, sendMessage } from '../../services/gqlGroups';
	import DiscordChatMessage from './discord_chat_message.svelte';
	import {getSocket, initSocket} from '../../services/socket';

	export let group: GroupInterface;

	let loading: boolean = false;
	let prevGroupId: string;
	let messages: MessageInterface[] = [];
	let message: string = "";
	let scrollContainer: HTMLElement;

	function scrollDown() {
		if (scrollContainer)
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
	}

	async function loadMessages(groupId: string) {
		try {
			loading = true;
			messages = await getMessages(groupId);
			message = "";
			loading = false;
		} catch (e) {
			console.log(e);
			loading = false;
		}
	}

	afterUpdate(async () => {
		if (group && group.id !== prevGroupId) {
			prevGroupId = group.id;
			loadMessages(group.id);
			scrollDown();
		}
	});

	onMount(() => {
		try {
			initSocket();
			getSocket().on("updateChat", async () => {
				messages = await getMessages(group.id);
				scrollDown();
			})
		} catch (e) {

		}
	});

	async function handleSend() {
		try {
			await sendMessage(group.id, message);
			messages = await getMessages(group.id);
			message = "";
			scrollDown();
		} catch (e) {
			console.log(e);
		}
	}

	function onDelete(item: MessageInterface) {
		const i = messages.findIndex(e => e.id === item.id);
		if (i >= 0)
		{
			messages.splice(i, 1);
			messages = [...messages];
		}
	}

	function checkGrouped(items: MessageInterface[], item: MessageInterface)
	{
		const index = items.findIndex(e => e.id === item.id);
		if (index <= 0)
			return (false);
		if (items[index - 1].userId === items[index].userId) {
			return (true);
		}
		return (false);
	}
</script>

<div class="overflow-y-scroll flex-auto h-60 no-scrollbar" bind:this={scrollContainer}>
	{#if loading}
			<div class="text-center">
				<div role="status">
					<svg
						aria-hidden="true"
						class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		{:else}
			{#each messages as message}
				<DiscordChatMessage
					message={message}
					group={group}
					isGrouped={!checkGrouped(messages, message)}
					onDelete={onDelete}
				/>
			{/each}
		{/if}
</div>
<div class="pb-6 px-4 flex-initial h-16">
	<div class="flex rounded-lg overflow-hidden">
		<input
			bind:value={message}
			type="text"
			class="w-full px-4 bg-gray-600 border-none"
			placeholder="Message #general"
		/>
		<button
			on:click={handleSend}
			class="text-3xl text-grey border-r-4 border-gray-600 bg-gray-600 p-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6 block bg-gray-500 hover:bg-gray-400 cursor-pointer rounded-xl"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
				/>
			</svg>
		</button>
	</div>
</div>
