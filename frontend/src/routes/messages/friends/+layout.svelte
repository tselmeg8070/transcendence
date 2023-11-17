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
				d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
			/>
		</svg>
		<span class="mr-2 font-title text-white whitespace-nowrap"><b>Friends</b></span>
	</div>
	<div class=" mx-2 w-px h-6 bg-white/[.06] md:block" />
	<a href="/messages/friends" class="{!$page.url.pathname.includes("pending") && !$page.url.pathname.includes("add") && "bg-gray-800"} px-2 py-1 mx-2 rounded-md text-sm font-medium text-gray-200 truncate md:block hover:bg-gray-800 ">
		All
	</a>
	<a href="/messages/friends/pending" class="{$page.url.pathname.includes("pending") && "bg-gray-800"} px-2 mx-2 py-1 rounded-md text-sm font-medium text-gray-200 truncate md:block hover:bg-gray-800">
		Pending
	</a>
	<a href="/messages/friends/add" class="{$page.url.pathname.includes("add") && "bg-gray-800"} px-2 mx-2 py-1 rounded-md text-sm font-medium text-green-400 truncate md:block hover:bg-gray-800">
		+ Add friend
	</a>
</div>
<div class="overflow-y-scroll flex-1">
		<slot/>
</div>
