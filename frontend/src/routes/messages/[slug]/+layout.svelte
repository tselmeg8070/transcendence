<script lang="ts">
	import { afterUpdate, onDestroy } from 'svelte';
	import { getChannel } from '../../../services/gqlGroups';
	import type { GroupInterface } from '../../../interfaces/types';
	import type { PageDataInterface } from './+layout';
	import { page } from '$app/stores';
	import { authentication, type AuthenticationType } from '../../../stores/authentication';

	export let data: PageDataInterface;

	let channel: GroupInterface;
	let loading: boolean = true;
	let prevChannelId: string = '';
	let userStore: AuthenticationType;
	const unsubscribeUserStore = authentication.subscribe((value) => {
		userStore = value;
	});
	onDestroy(unsubscribeUserStore);
	let currentpage = "";
	const unsubscribe = page.subscribe((value) => {
		currentpage = value.url.pathname;
	});

	onDestroy(() => {
		unsubscribeUserStore();
		unsubscribe();
	});

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
		if (data.slug && data.slug !== prevChannelId) {
			if (data.slug && data.slug.length > 0) {
				prevChannelId = data.slug;
				loadChannel(data.slug);
			}
		}
	});
</script>

<div class="flex flex-col h-full overflow-hidden">
	<div class="flex flex-none items-center px-2 h-12 shadow-sm border-b-2 border-gray-800">
		<div class="flex items-center">
			<svg viewBox="0 0 24 24" class="mx-2 w-6 h-6 font-semibold text-gray-400">
				<title>Hashtag</title>
				<path
					fill="currentColor"
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M5.887 21a.5.5 0 01-.493-.587L6 17H2.595a.5.5 0 01-.492-.586l.175-1A.5.5 0 012.77 15h3.58l1.06-6H4.005a.5.5 0 01-.492-.586l.175-1A.5.5 0 014.18 7h3.58l.637-3.587A.5.5 0 018.889 3h.984a.5.5 0 01.493.587L9.76 7h6l.637-3.587A.5.5 0 0116.889 3h.984a.5.5 0 01.493.587L17.76 7h3.405a.5.5 0 01.492.586l-.175 1A.5.5 0 0120.99 9h-3.58l-1.06 6h3.405a.5.5 0 01.492.586l-.175 1a.5.5 0 01-.492.414H16l-.637 3.587a.5.5 0 01-.492.413h-.984a.5.5 0 01-.493-.587L14 17H8l-.637 3.587a.5.5 0 01-.492.413h-.984zM9.41 9l-1.06 6h6l1.06-6h-6z"
				/>
			</svg>
			{#if !loading}
				<a href="/messages/{channel.id}">
					<span class="mr-2 font-title text-white whitespace-nowrap"
					>{channel.name}</span>
				</a>
			{/if}
		</div>
		<div class="hidden mx-2 w-px h-6 bg-white/[.06] md:block" />
		{#if !loading && !channel.isDirectMessage}
			{#if userStore && channel.ownerId === userStore.id}
				<a href="/messages/{channel.id}/admins" class="{currentpage.includes("admins") && "bg-gray-800"} px-2 mx-2 py-1 rounded-md text-sm font-medium text-gray-200 truncate md:block hover:bg-gray-800">
					Admins
				</a>
			{/if}
			{#if userStore && channel.admins.find(e => e.id === userStore.id)}
				<a href="/messages/{channel.id}/muted" class="{currentpage.includes("muted") && "bg-gray-800"} px-2 mx-2 py-1 rounded-md text-sm font-medium text-gray-200 truncate md:block hover:bg-gray-800">
					Muted
				</a>
				<a href="/messages/{channel.id}/banned" class="{currentpage.includes("banned") && "bg-gray-800"} px-2 mx-2 py-1 rounded-md text-sm font-medium text-gray-200 truncate md:block hover:bg-gray-800">
					Banned
				</a>
			{/if}
			{#if userStore && channel.ownerId === userStore.id}
				<a href="/messages/{channel.id}/settings" class="{currentpage.includes("settings") && "bg-gray-800"} px-2 mx-2 py-1 rounded-md text-sm font-medium text-gray-200 truncate md:block hover:bg-gray-800">
					Settings
				</a>
			{/if}
		{/if}
	</div>
	<div class="flex flex-1">
		<slot/>
	</div>
</div>
