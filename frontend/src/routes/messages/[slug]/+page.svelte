<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { getChannel } from '../../../services/gqlGroups';
	import type { GroupInterface } from '../../../interfaces/types';
	import type { PageDataInterface } from './+layout';
	import DiscordChat from '$components/chat/discord_chat.svelte';
	import DiscordChannelMember from '$components/chat/discord_channel_member.svelte';
	import {getSocket, initSocket} from '../../../services/socket';

	export let data: PageDataInterface;

	let channel: GroupInterface;
	let loading: boolean = true;
	let prevChannelId: string = '';

	async function loadChannel(groupId: string) {
		try {
			loading = true;
			channel = await getChannel(groupId);
			console.log(channel);
			loading = false;
		} catch (e) {
			console.log(e);
			loading = false;
		}
	}

	async function onUpdate() {
		channel = await getChannel(data.slug);
	}

	onMount(async () => {
		initSocket();
		try {
			getSocket().on("updateChat", async () => {
				channel = await getChannel(data.slug);
			});
		} catch (e) {
			console.log("Socket is not initialized");
		}
	})

	afterUpdate(async () => {
		if (data.slug !== prevChannelId) {
			if (data.slug && data.slug.length > 0) {
				prevChannelId = data.slug;
				loadChannel(data.slug);
			}
		}
	});
</script>


<div class="flex-1 flex flex-col max-h-full">
	<DiscordChat group={channel} />
</div>
<div class="ml-5 pl-5 pr-5 w-1/4 border-l-gray-800 border-l-2 hidden md:flex flex-col">
	<p class="mt-5 mb-3 text-base font-semibold">Members</p>
	{#if !loading}
		{#each channel && channel.members as member}
			<DiscordChannelMember {member} {channel} handleUpdate={onUpdate}/>
		{/each}
	{/if}
</div>
