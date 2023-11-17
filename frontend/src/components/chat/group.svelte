<!-- <script lang="ts">
	import type { GroupInterface, MessageInterface } from "../../interfaces/types";

	export let group: GroupInterface;

	let messages: MessageInterface[] = [
		{ sender: 'You', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'You', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' },
		{ sender: 'Him', text: 'bonjour le monde' }
	];

	function sendMessage() {
		if (newMessage.trim()) {
			messages.push({ sender: 'You', text: newMessage });
			newMessage = '';
		}
	}
	let newMessage: string = "";
</script>

<div>

</div>
<div class="px-2 flex items-center justify-between h-[10%] w-full border-b border-gray-500/50">
	<div class="h-full w-[30%] flex items-center gap-2">
		<div class="h-10 w-10">
			<img
				src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${group.name}`}
				class="rounded-full w-full h-full object-cover"
				alt="avatar"
			/>
		</div>
		<h1 class="font-bold">{group.name}</h1>
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
<div class="h-[5%] border border-gray-500/ rounded-full mx-[2px] p-2 flex w-full justify-between m-2">
	<input
		bind:value={newMessage}
		class="border-none w-[90%] focus:border-none focus:ring-0 outline-none"
		placeholder="Your message..."
	/>
	<button
		class="flex h-full items-center rounded-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>Send</button
	>
</div> -->
