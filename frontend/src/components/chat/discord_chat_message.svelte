<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { GroupInterface, MessageInterface } from '../../interfaces/types';
	import { deleteMessage, updateMessageInvite } from '../../services/gqlGroups';
	import { authentication, type AuthenticationType } from '../../stores/authentication';
	import { getAvatar } from '../../utils/avatarGetter';
	import { goto } from '$app/navigation';
	import { getGameSocket, initGameSocket } from '../../services/gameSocket';
	import type { Socket } from 'socket.io-client';

	export let isGrouped: boolean = false;
	export let message: MessageInterface;
	export let group: GroupInterface;
	export let onDelete: (mess: MessageInterface) => void;

	let userStore: AuthenticationType;
	const unsubscribe = authentication.subscribe((value) => {
		userStore = value;
	});
	onDestroy(unsubscribe);

	let loading: boolean = false;

	function formatRelativeDate(dateString: Date) {
		const date = new Date(dateString);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return `Today at ${date.toLocaleString('en-US', {
				hour: 'numeric',
				minute: 'numeric',
				hour12: true
			})}`;
		} else if (date.toDateString() === yesterday.toDateString()) {
			return `Yesterday at ${date.toLocaleString('en-US', {
				hour: 'numeric',
				minute: 'numeric',
				hour12: true
			})}`;
		} else {
			return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
		}
	}

	async function handleDelete() {
		loading = true;
		try {
			const res = await deleteMessage(message.id);
			loading = false;
			onDelete(message);
		} catch (e) {
			loading = false;
		}
	}

	async function handleInvitation(content: string) {
		try {
			const res = await updateMessageInvite(message.id, content);
		} catch (e) {

		}
	}

	async function handleGoToGame(content: string) {
		let opponentId: string = "";
		let gameSocket: Socket;

		if (content.includes("done"))
			return ;
		if (content.includes("started"))
		{
			try {
				await handleInvitation("/invite true started done");
				goto("/");
			} catch (e) {

			}
		}
		else {
			for (let i = 0; i < group.members.length; i++)
			{
				if (group.members[i].id !== userStore.id)
					opponentId = group.members[i].id;
			}
			try {
				gameSocket = getGameSocket();
				await handleInvitation("/invite true started");
				gameSocket.emit("playfriend", {opponentId: opponentId})
				goto("/");
			} catch (e) {
				initGameSocket();
				try {
					gameSocket = getGameSocket();
					await handleInvitation("/invite true started");
					gameSocket.emit("playfriend", {opponentId: opponentId})
					goto("/");
				} catch (e) {

				}
			}
		}
	}

</script>

{#if message.content.includes("/invite") && group.isDirectMessage}
<div>
	<div class="group flex py-0.5 pr-16 pl-4 mt-[17px] leading-[22px] hover:bg-gray-950/[.07]">
		<div class="overflow-hidden relative mt-0.5 mr-4 w-10 min-w-fit h-10 rounded-full">
			<span
				style="box-sizing: border-box; display: inline-block; overflow: hidden; width: 40px; height: 40px; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative;"
			>
				<img
					alt="Mervin.Graham"
					src={getAvatar(message.user.avatar, message.user.pseudo)}
					decoding="async"
					data-nimg="fixed"
					class="mt-0.5 mr-4 w-10 h-10 rounded-full"
					style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%; filter: none; background-size: cover; background-image: none; background-position: 0% 0%;"
				/><noscript />
			</span>
		</div>
		<div class="w-full">
			<p class="flex items-baseline">
				<a href="/profile/{message.user.pseudo}" class="mr-2 font-medium text-green-400">{message.user.name}</a>
				<span
					class="text-xs font-medium text-gray-400">{formatRelativeDate(message.createdAt)}</span
				>
			</p>
			<div class="flex justify-between">
				<div>
					<p class=" text-gray-100">
						You are invited to play:
					</p>
					{#if message.content.includes("true")}
						<div class="flex">
							<button on:click={() => handleGoToGame(message.content)} class="bg-gray-800 hover:bg-gray-900 p-3 mr-2 rounded-md mt-3 text-center">
								Go to game
							</button>
						</div>
					{:else if message.content.includes("false")}
						<div class="flex">
							<button  disabled={true} on:click={() => handleInvitation("/invite false")} class="bg-gray-800 hover:bg-gray-900 p-3 rounded-md mt-3 text-center">
								Declined
							</button>
						</div>
					{:else}
					<div class="flex">
						<button disabled={message.userId === userStore.id} on:click={() => handleInvitation("/invite true")} class="bg-gray-800 hover:bg-gray-900 p-3 mr-2 rounded-md mt-3 text-center">
							Accept
						</button>
						<button  disabled={message.userId === userStore.id} on:click={() => handleInvitation("/invite false")} class="bg-gray-800 hover:bg-gray-900 p-3 rounded-md mt-3 text-center">
							Decline
						</button>
					</div>
					{/if}
				</div>
				{#if message.userId === userStore.id}
					<button class="hidden group-hover:block w-4" on:click={() => handleDelete()} disabled={loading}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
							<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
{:else if isGrouped}
	<div>
		<div class="group flex py-0.5 pr-16 pl-4 mt-[17px] leading-[22px] hover:bg-gray-950/[.07]">
			<div class="overflow-hidden relative mt-0.5 mr-4 w-10 min-w-fit h-10 rounded-full">
				<span
					style="box-sizing: border-box; display: inline-block; overflow: hidden; width: 40px; height: 40px; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative;"
				>
					<img
						alt="Mervin.Graham"
						src={getAvatar(message.user.avatar, message.user.pseudo)}
						decoding="async"
						data-nimg="fixed"
						class="mt-0.5 mr-4 w-10 h-10 rounded-full"
						style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%; filter: none; background-size: cover; background-image: none; background-position: 0% 0%;"
					/><noscript />
				</span>
			</div>
			<div class="w-full">
				<p class="flex items-baseline">
					<a href="/profile/{message.user.pseudo}" class="mr-2 font-medium text-green-400">{message.user.name}</a>
					<span
						class="text-xs font-medium text-gray-400">{formatRelativeDate(message.createdAt)}</span
					>
				</p>
				<div class="flex justify-between">
					<p class=" text-gray-100">
						{message.content}
					</p>
					{#if message.userId === userStore.id}
						<button class="hidden group-hover:block w-4" on:click={() => handleDelete()} disabled={loading}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
								<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
							</svg>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
<div>
	<div class="group py-0.5 pr-16 pl-4 leading-[22px] hover:bg-gray-950/[.07]">
		<div class="flex justify-between">
			<p class="pl-14 text-gray-100">
				{message.content}
			</p>
			{#if message.userId === userStore.id}
				<button class="hidden group-hover:block w-4" on:click={() => handleDelete()} disabled={loading}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
						<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
</div>
{/if}
