<script lang="ts">
	import { beforeUpdate, afterUpdate } from 'svelte';
	import type { GroupInterface, MessageInterface } from '../../interfaces/types';
	import { getMessages, sendMessage } from '../../services/gqlGroups';
	import { authentication } from '../../stores/authentication';
	import GroupSettings from './group_settings.svelte/group_settings.svelte';

	export let group: GroupInterface;

	let loading: boolean = false;
	let isOpenGroupSettings: boolean = false;
	let prevGroupId: string;
	let messages: MessageInterface[] = [];
	let message: string = '';

	async function loadMessages(groupId: string) {
		try {
			loading = true;
			messages = await getMessages(groupId);
			message = '';
			loading = false;
		} catch (e) {
			console.log(e);
			loading = false;
		}
	}

	afterUpdate(async () => {
		if (group.id !== prevGroupId) {
			prevGroupId = group.id;
			loadMessages(group.id);
		}
	});

	async function handleSend() {
		try {
			await sendMessage(group.id, message);
			messages = await getMessages(group.id);
			message = '';
		} catch (e) {
			console.log(e);
		}
	}

	function handleOpenGroupSettings() {
		isOpenGroupSettings = true;
	}
	function handleCloseGroupSettings() {
		isOpenGroupSettings = false;
	}
</script>

<GroupSettings {group} isOpen={isOpenGroupSettings} onClose={handleCloseGroupSettings} />
<div class="chat-area flex-1 flex flex-col">
	<div class="flex-3">
		<div
			class="flex w-full py-1 mb-8 border-b-2 border-gray-200 justify-between items-center content-around"
		>
			<h2 class="text-xl">
				<b>{group.name}</b>
			</h2>
			<button
				on:click={handleOpenGroupSettings}
				type="button"
				class="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm text-white"
			>
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
						d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</button>
		</div>
	</div>
	<div class="messages flex-1 overflow-auto">
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
				{#if $authentication.id === message.userId}
					<div class="message me mb-4 flex text-right">
						<div class="flex-1 px-2">
							<div class="inline-block bg-blue-600 rounded-full p-2 px-6 text-white">
								<span>{message.content}</span>
							</div>
							<!-- <div class="pr-4"><small class="text-gray-500">{message.createdAt.toDateString()}</small></div> -->
						</div>
					</div>
				{:else}
					<div class="message mb-4 flex">
						<div class="flex-2">
							<div class="w-12 h-12 relative">
								<img
									class="w-12 h-12 rounded-full mx-auto"
									src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=2080&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									alt="chat-user"
								/>
								<span
									class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"
								/>
							</div>
						</div>
						<div class="flex-1 px-2">
							<div class="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700">
								<span>{message.content}</span>
							</div>
							<!-- <div class="pl-4"><small class="text-gray-500">{message.createdAt.toDateString()}</small></div> -->
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
	<div class="flex-2 pt-4 pb-10">
		<div class="write bg-white shadow flex rounded-lg">
			<div class="flex-3 flex content-center items-center text-center p-4 pr-0">
				<span class="block text-center text-gray-400 hover:text-gray-800">
					<svg
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						stroke="currentColor"
						viewBox="0 0 24 24"
						class="h-6 w-6"
						><path
							d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				</span>
			</div>
			<div class="flex-1">
				<textarea
					name="message"
					bind:value={message}
					class="w-full block outline-none py-4 px-4 bg-transparent border-none"
					rows="1"
					placeholder="Type a message..."
				/>
			</div>
			<div class="flex-2 w-16 p-2 flex content-center items-center">
				<div class="flex-1">
					<button on:click={handleSend} class="bg-indigo-500 w-10 h-10 rounded-full inline-block">
						<span class="inline-block align-text-bottom">
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								viewBox="0 0 24 24"
								class="w-4 h-4 text-white"><path d="M5 13l4 4L19 7" /></svg
							>
						</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
