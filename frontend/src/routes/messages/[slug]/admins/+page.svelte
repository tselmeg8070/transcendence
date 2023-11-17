<script lang="ts">
	import { afterUpdate } from "svelte";
	import type { GroupInterface, GroupMemberInterface } from "../../../../interfaces/types";
	import DiscordAvailableAdmin from "$components/chat/discord_available_admin.svelte";
	import type { PageDataInterface } from "../+layout";
	import { getChannel } from "../../../../services/gqlGroups";
	import DiscordAdmin from "$components/chat/discord_admin.svelte";

	export let data: PageDataInterface;

	let pseudo: string = "";

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

	afterUpdate(async () => {
		if (data.slug !== prevChannelId) {
			if (data.slug && data.slug.length > 0) {
				prevChannelId = data.slug;
				loadChannel(data.slug);
			}
		}
	});

	async function update() {
		channel = await getChannel(data.slug);
	}
</script>

<div class="mx-7 w-full">
	<p class="mt-5 text-base font-semibold uppercase">Admins</p>
	<div class="overflow-y-scroll no-scrollbar max-w-full scrollbar-hide mt-3">
		{#if !loading}
			{#each channel.admins.filter(e => {
				const pattern = new RegExp(`\\b${pseudo}`, 'i');
				return pattern.test(e.pseudo);
			}) as user}
				<DiscordAdmin user={user} channel={channel} handleSent={update}/>
			{/each}
		{/if}
	</div>
	<p class="mt-5 text-sm font-semibold uppercase">Members</p>
	<p class="text-xs text-gray-300 mt-2">You can add admins from here</p>
	<input
		type="text"
		bind:value={pseudo}
		class="bg-gray-800 my-5 border text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
		placeholder="Enter user pseudo"
	/>
	<div class="overflow-y-scroll no-scrollbar max-w-full scrollbar-hide">
		{#if !loading}
			{#each channel.members.filter(e => {
				if (channel.admins.find(c => e.id === c.id))
					return (false);
				const pattern = new RegExp(`\\b${pseudo}`, 'i');
				return pattern.test(e.pseudo);
			}) as user}
				<DiscordAvailableAdmin user={user} channel={channel} handleSent={update}/>
			{/each}
		{/if}
	</div>
</div>
