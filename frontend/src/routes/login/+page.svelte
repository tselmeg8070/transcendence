<script lang="ts">
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import AuthServices from '../../services/auth';
	import Cookies from 'js-cookie';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { authentication } from '../../stores/authentication';
	import Device from 'svelte-device-info';
	import { onDestroy } from 'svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	const loading = writable(false);
	const serverError = writable<string | undefined>(undefined);
	let timeoutId: any;

	$: isMobile = Device.isMobile;
	const { form, handleChange, errors, state, handleSubmit } = createForm({
		initialValues: {
			password: '',
			email: ''
		},
		validationSchema: yup.object().shape({
			password: yup.string().required('Password is required'),
			email: yup.string().email().required()
		}),
		onSubmit: async (values) => {
			loading.set(true);
			serverError.set(undefined);
			try {
				const response = await AuthServices.loginCredentials(values.email, values.password);
				if (Cookies.get('access_token')) Cookies.remove('access_token');
				Cookies.set('access_token', response.token, { expires: 1 });
				authentication.setUser(response);
				if (response.isTwoFactorEnabled)
					goto('/2fa');
				else
					goto('/');
			} catch (error) {
				let errorMessage = 'An unexpected error occured. Please try again.';
				if (error.response && error.response.data && error.response.data.message) {
					errorMessage = error.response.data.message;
				} else if (error.request) {
					errorMessage = 'No response from server. Check your network connection';
				} else {
					errorMessage = error.message;
				}
				serverError.set(error.data.message);
			} finally {
				loading.set(false);
			}
		}
	});

	function clearErrorTimeout() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	$: if ($serverError) {
		clearErrorTimeout();
		timeoutId = setTimeout(() => {
			serverError.set(undefined);
		}, 3000);
		onDestroy(() => {
			clearTimeout(timeoutId);
		});
	}
</script>

<div
	class="flex h-screen w-screen flex-col bg-black items-center justify-center py-12 sm:px-6 lg:px-8"
>
	{#if $serverError}
		<div
			class="z-10 p-2 rounded-md bg-red-500 text-white fixed top-4 right-4"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
		>
			{$serverError}
		</div>
	{/if}
	<div class="sm:mx-auto flex flex-col items-center justify-center sm:w-full sm:max-w-md">
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
			Sign in to your account
		</h2>
	</div>

	<div class="relative bg-black h-full w-full flex items-center justify-center">
		<div class="relative sm:max-w-[480px] w-[75%] sm:w-1/2 shadow-lg">
			<div
				class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
			/>
			<div
				class="relative bg-black w-full sm:max-w-[480px] h-full ring-1 ring-gray-500/20 rounded-md shadow-lg backdrop-blur-md"
			>
				<div class="relative px-6 py-6 shadow sm:rounded-lg sm:px-12">
					<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
						<div>
							<label
								for="email"
								class="block text-[14px] sm:text-sm font-medium leading-6 text-white">Email</label
							>
							<div class="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									autocomplete="email"
									on:change={handleChange}
									bind:value={$form.email}
									class="block p-2 w-full rounded-md border-0 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600/40 sm:text-sm sm:leading-6"
								/>
							</div>
							{#if $errors.email}
								<small class="text-white">{$errors.email}</small>
							{/if}
						</div>

						<div>
							<label for="password" class="block text-sm font-medium leading-6 text-white"
								>Password</label
							>
							<div class="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									on:change={handleChange}
									bind:value={$form.password}
									autocomplete="current-password"
									class="block p-2 w-full rounded-md border-0 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600/40 text-[14px] sm:text-sm sm:leading-6"
								/>
							</div>
							{#if $errors.password}
								<small class="text-white">{$errors.password}</small>
							{/if}
						</div>

						<!-- <div class="flex items-center justify-between">
							<div class="text-sm leading-6">
								<a
									href="#"
									class="font-semibold text-white/70 hover:text-white text-[14px] sm:text-sm"
									>Forgot password?</a
								>
							</div>
						</div> -->

						<div>
							{#if !loading}
								<button
									disabled
									class="flex w-full justify-center rounded-md bg-indigo-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									><svg
										aria-hidden="true"
										class="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="currentFill"
										/>
									</svg></button
								>
							{:else}
								<div class="relative">
									<button
										type="submit"
										class="relative bg-black flex w-full z-50 justify-center rounded-md px-3 py-1.5 text-sm leading-6 tracking-wide text-white shadow-sm font-semibold hover:font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
										>Sign in</button
									>
									<div
										class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
									/>
								</div>
							{/if}
						</div>
					</form>

					<div>
						<div class="relative mt-10">
							<div class="absolute inset-0 flex items-center" aria-hidden="true">
								<div class="w-full border-t border-gray-200" />
							</div>
							<div
								class="relative flex justify-center text-[13px] sm:text-sm font-medium leading-6"
							>
								<span class="bg-white px-2 sm:px-6 text-gray-900 rounded-md">Or continue with</span>
							</div>
						</div>

						<div class="mt-6 grid grid-cols-2 gap-4">
							<a
								href="{PUBLIC_BACKEND_URL}/auth/42"
								class="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0]/40 hover:bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
							>
								<svg
									version="1.1"
									class="h-5 w-5"
									fill="#ffffff"
									id="Calque_1"
									x="0px"
									y="0px"
									viewBox="0 -200 960 960"
									enable-background="new 0 -200 960 960"
									xml:space="preserve"
								>
									<polygon
										id="polygon5"
										points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1
				32,279.1 "
									/>
									<polygon id="polygon7" points="597.9,114.2 762.7,-51.1 597.9,-51.1 " />
									<polygon
										id="polygon9"
										points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1 "
									/>
									<polygon id="polygon11" points="928,279.1 762.7,443.9 928,443.9 " />
								</svg>
								{#if !isMobile}
									<span class="text-sm font-semibold leading-6">School</span>
								{/if}
							</a>

							<a
								href="{PUBLIC_BACKEND_URL}/auth/google"
								class="flex w-full items-center justify-center gap-3 rounded-md bg-red-500/40 hover:bg-red-500 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
							>
								<svg viewBox="0 0 48 48" class="h-5 w-5">
									<title>Google Logo</title>
									<clipPath id="g">
										<path
											d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
										/>
									</clipPath>
									<g class="colors" clip-path="url(#g)">
										<path fill="#FBBC05" d="M0 37V11l17 13z" />
										<path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
										<path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
										<path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
									</g>
								</svg>
								{#if !isMobile}
									<span class="text-sm font-semibold leading-6">Google</span>
								{/if}
							</a>
						</div>
					</div>
				</div>

				<div class="group/notmember">
					<p
						class="relative mt-4 pb-2 group-hover/notmember:text-white tracking-wide text-center text-[15px] sm:text-sm text-white/50 font-semibold"
					>
						Not a member?{' '}{#if isMobile}<br />{/if}
						<a
							href="/register"
							class="font-bold leading-6 text-blue-600 tracking-wide hover:text-blue-500 brightness:100 group-hover/notmember:brightness-200"
						>
							Register an account
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
