<script lang="ts">
	import Cookies from 'js-cookie';
	import AuthServices from '../../services/auth';
	import { goto } from '$app/navigation';
	import { userInformationNoToken } from '../../services/gqlUser';
	import { authentication } from '../../stores/authentication';
	let otp: string = "";

	let loading : boolean = false;

	async function handleSubmit() {
		let token = Cookies.get('access_token');
		if (token && !loading) {
			try {
				loading = true;
				const response = await AuthServices.check2FA(otp, token);
				Cookies.set('access_token', response.accessToken, { expires: 1 });
				const user = await userInformationNoToken();
				authentication.setUser(user);
				goto("/")
			} catch (e) {
				loading = false;
			}
		}
	}
</script>

<div class="bg-black h-screen w-full place-items-center overflow-x-scroll p-6 lg:overflow-visible">
	<div class="mt-7 mb-4 flex flex-col w-full items-center justify-center">
		<div class="relative w-[50px] h-[40px]">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="text-white absolute top-0 left-0 w-full h-full"
				width="50"
				height="50"
				viewBox="0 0 100 100"
				><path
					fill="#ffffff"
					d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
				/></svg
			>
			<svg
				class="absolute top-0 left-0 w-full h-full"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				version="1.1"
				id="Calque_1"
				x="0px"
				y="0px"
				viewBox="0 -200 960 960"
				enable-background="new 0 -200 960 960"
				xml:space="preserve"
			>
				<polygon
					id="polygon5"
					points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1   32,279.1 "
				/>
				<polygon id="polygon7" points="597.9,114.2 762.7,-51.1 597.9,-51.1 " />
				<polygon
					id="polygon9"
					points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1 "
				/>
				<polygon id="polygon11" points="928,279.1 762.7,443.9 928,443.9 " />
			</svg>
		</div>
		<h2
			class="m-4 text-center text-medium sm:text-2xl font-bold leading-9 tracking-tight text-white"
		>
			Google 2 factor authentication
		</h2>
		<div style="mt-5 mb-5" class="pincode-input-container">
			<input
				id="otp"
				name="otp"
				type="text"
				bind:value={otp}
				class="block w-full rounded-md border-0 p-5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600/40 sm:text-sm sm:leading-6"
			/>
		</div>
		<div class="relative mt-5">
			<button
				type="submit"
				disabled={loading}
				on:click={handleSubmit}
				class="relative bg-black flex w-full z-50 justify-center rounded-md px-3 py-1.5 text-sm leading-6 tracking-wide text-white shadow-sm font-semibold hover:font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
				>Authenticate</button
			>
			<div
				class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
			/>
		</div>
	</div>
</div>
