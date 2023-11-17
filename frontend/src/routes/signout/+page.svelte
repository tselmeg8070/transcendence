<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';

	Cookies.remove("access_token");
	goto("/login");
</script>
