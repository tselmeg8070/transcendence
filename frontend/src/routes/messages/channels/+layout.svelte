<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex items-center px-2 h-12 shadow-sm border-b-2 border-gray-800">
	<div class="flex items-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="ml-3 mr-3 w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
			/>
		</svg>

		<span class="mr-2 font-title text-white whitespace-nowrap"><b>Channels</b></span>
	</div>
	<div class=" mx-2 w-px h-6 bg-white/[.06] md:block" />
	<a href="/messages/channels" class="{!$page.url.pathname.includes("available") && !$page.url.pathname.includes("add") && "bg-gray-800"} px-2 py-1 mx-2 rounded-md text-sm font-medium text-gray-200 truncate md:block hover:bg-gray-800 ">
		My
	</a>
	<a href="/messages/channels/available" class="{$page.url.pathname.includes("available") && "bg-gray-800"} px-2 mx-2 py-1 rounded-md text-sm font-medium text-gray-200 truncate md:block hover:bg-gray-800">
		Available
	</a>
	<a href="/messages/channels/add" class="{$page.url.pathname.includes("add") && "bg-gray-800"} px-2 mx-2 py-1 rounded-md text-sm font-medium text-green-400 truncate md:block hover:bg-gray-800">
		+ Create channel
	</a>
</div>
<div class="overflow-y-scroll flex-1">
		<slot/>
</div>
