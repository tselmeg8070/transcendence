<script lang="ts">
	import { onMount } from "svelte";
	import type { GroupInterface } from "../../../../interfaces/types";
	import { getAllGroups, getGroups } from "../../../../services/gqlGroups";
	import ChannelComponent from "$components/chat/channel_component.svelte";
	import AvailableChannelComponent from "$components/chat/available_channel_component.svelte";

	let name: string = "";
	let channels: GroupInterface[] = [];

	function handleJoin(channel: GroupInterface) {
		const i = channels.findIndex(e => e.id === channel.id);
		if (i > -1) {
			channels.splice(i, 1);
			channels = [...channels];
		}
	}

	onMount(async () => {
		try {
			const tempChannels = await getAllGroups();
			tempChannels.forEach((element: GroupInterface) => {
				if (!element.isDirectMessage)
					channels.push(element);
			});
			channels = [...channels];
		} catch (e) {

		}
	})
</script>
<div class="flex mx-7 h-full">
	<div class="flex-1 h-full">
		<p class="mt-5 text-base font-semibold uppercase">Available - {channels.length}</p>
		<input
			type="text"
			bind:value={name}
			class="bg-gray-800 my-5 border text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
			placeholder="Search with name"
		/>
		<div class="overflow-y-scroll max-w-full scrollbar-hide no-scrollbar">
			{#each channels.filter(e => {
				if (name.length == 0)
					return (true);
				const pattern = new RegExp(`\\b${name}`, 'i');
				return pattern.test(e.name);
			}) as channel}
				<AvailableChannelComponent channel={channel} handleJoin={handleJoin}/>
			{/each}
		</div>
	</div>
</div>

