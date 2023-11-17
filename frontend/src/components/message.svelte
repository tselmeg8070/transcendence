<script lang="ts">
	import PrimaryButton from './buttons/primary_button.svelte';
	import ConversationInfo from './chat/conversation.svelte';
	import type { Message, Conversation } from '../interfaces/types.ts';

	let messages: Message[] = [
		{ sender: 'You', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'You', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' }
	];
	let selectedConversation: Conversation | null = null;

	function handleClick(event: CustomEvent<Conversation>) {
		selectedConversation = event.detail;
		// console.log(selectedConversation);
	}

	let newMessage = '';
	function sendMessage() {
		if (newMessage.trim()) {
			messages.push({ sender: 'You', text: newMessage });
			newMessage = '';
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="flex h-full w-full border border-gray-500/50">
	<div class="flex flex-col h-full w-[27%]">
		<div class="w-full h-[15%]">
			<div class="flex w-full h-[65%] items-center justify-around">
				<h1 class="font-bold text-[16px]">jean.emp</h1>
				<div>
					<PrimaryButton text="Create a group" />
					<PrimaryButton text="Add a friend" />
				</div>
			</div>
			<div class="flex justify-between px-2 h-[35%] items-center justify-content w-full flex">
				<h1 class="font-bold text-[18px]">Messages</h1>
				<h1 class="text-gray-500 text-[15px]">Demands</h1>
			</div>
		</div>
		<div class="w-full h-[85%]">
			<div class="w-full h-[80px]">
				<ConversationInfo on:select={handleClick} />
			</div>
		</div>
	</div>
	<div class="flex flex-col border-l border-gray-500/50 h-full w-[73%]">
		{#if selectedConversation}
			<div
				class="px-2 flex items-center justify-between h-[10%] w-full border-b border-gray-500/50"
			>
				<div class="h-full w-[30%] flex items-center gap-2">
					<div class="h-16 w-16">
						<img
							src={selectedConversation.avatar}
							class="rounded-full w-full h-full object-cover"
							alt="avatar"
						/>
					</div>
					<h1 class="font-bold">{selectedConversation.name}</h1>
				</div>
				<div class="h-full w-[30%]" />
			</div>
			<div class="h-[83%] w-full px-2">
				{#each messages as message}
					<div class={`${message.sender === 'You' ? 'text-right' : ''} mb-2.5`}>
						<div
							class={`${
								message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
							}
							inline-block px-4 py-2.5 rounded-xl max-w-4/5`}
						>
							<p>{message.text}</p>
						</div>
					</div>
				{/each}
			</div>
			<div
				class="h-[5%] border border-gray-500/ rounded-full mx-[2px] p-2 flex w-full justify-between m-2"
			>
				<input
					bind:value={newMessage}
					on:keydown={handleKeyDown}
					class="border-none w-[90%] focus:border-none focus:ring-0 outline-none"
					placeholder="Your message..."
				/>
				<button
					on:click={sendMessage}
					class="flex h-full items-center rounded-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>Send</button
				>
			</div>
		{:else}
			<div class=" flex flex-col items-center justify-center h-full w-full gap-2">
				<img
					src="https://i.postimg.cc/6p8Hp6fr/Screenshot-2023-10-12-004957.png"
					width="100px"
					height="100px"
					alt=""
				/>
				<div class="flex items-center justify-center flex-col">
					<h1>Your Messages</h1>
					<p class="text-[#737373] text-[15px]">
						Send photos and private messages to a friend or group
					</p>
				</div>
				<PrimaryButton text="Send a message" />
			</div>
		{/if}
	</div>
</div>
