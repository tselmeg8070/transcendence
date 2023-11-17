<script lang="ts">
	export let status: string = "OFFLINE";
	export let avatar: string;
	export let number: number = 12;
</script>

<span class="relative inline-block">
	<img class={`h-6 w-6 sm:h-${number} sm:w-${number} rounded-full`} src={avatar} alt="" />
	<span
		class={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${
			status === 'ONLINE' ? 'bg-green-800 brightness-150' : 'bg-red-800 brightness-150'
		} ring-1 ring-white`}
	/>
</span>
