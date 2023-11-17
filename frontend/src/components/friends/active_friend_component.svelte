<script lang="ts">
	import type { FriendInterface } from '../../interfaces/types';
	import { getAvatar } from '../../utils/avatarGetter';
	export let user: FriendInterface;

</script>

<div class="flex w-full justify-between mb-3 content-center rounded-lg p-3 bg-gray-800">
	<a href="/profile/{user.pseudo}" class="flex items-center space-x-4">
		<img
			class="w-10 h-10 rounded-full"
			src={getAvatar(user.avatar, user.pseudo)}
			alt=""
		/>
		<div class="font-medium">
			<div>{user.name}</div>
			<div class="text-sm text-gray-500">{user.status}</div>
		</div>
	</a>
</div>
