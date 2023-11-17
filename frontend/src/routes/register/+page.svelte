<script lang="ts">
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import AuthServices from '../../services/auth';
	import Cookies from 'js-cookie';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import Device from 'svelte-device-info';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { userInformationNoToken } from '../../services/gqlUser';
	import { authentication } from '../../stores/authentication';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	const loading = writable(false);
	const serverError = writable<string | undefined>(undefined);
	let timeoutId: any;

	$: isMobile = Device.isMobile;
	const { form, handleChange, errors, state, handleSubmit } = createForm({
		initialValues: {
			password: '',
			firstName: '',
			lastName: '',
			email: ''
		},
		validationSchema: yup.object().shape({
			password: yup
				.string()
				.min(1, 'Password must be at least 1 characters long')
				.required('Password is required'),
			firstName: yup.string().required('First name is required'),
			lastName: yup.string().required('Last name is required'),
			email: yup.string().email().required()
		}),
		onSubmit: async (values) => {
			loading.set(true);
			try {
				const response = await AuthServices.register(values);
				if (Cookies.get('access_token')) Cookies.remove('access_token');
				Cookies.set('access_token', response.accessToken, { expires: 1 });
				const user = await userInformationNoToken();
				authentication.setUser(user);
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
				console.log(errorMessage);
				serverError.set(errorMessage);
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
	class="relative flex h-screen w-screen bg-black flex-col items-center p-4 justify-center sm:px-6 lg:px-8"
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
	<div class="absolute inset-0 left-4 top-4 text-white h-[50px] w-[40px]">
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
	<header class="mb-2">
		<h2 class="text-center text-xl sm:text-2xl font-bold leading-9 tracking-tight text-white">
			Sign up
		</h2>
	</header>
	<div class="relative max-w-[480px] w-full ring-1 ring-gray-600/40 rounded-md shadow-lg bg-black">
		<div
			class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
		/>
		<div class="absolute inset-0 bg-black rounded-md" />
		<div class="relative p-6 px-12 shadow rounded-md">
			<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
				<div>
					<label
						for="firstName"
						class="block text-[13px] sm:text-sm font-medium leading-6 text-white">First name</label
					>
					<div class="mt-2">
						<input
							id="firstName"
							name="firstName"
							type="firstName"
							on:change={handleChange}
							bind:value={$form.firstName}
							class="p-2 block w-full rounded-md border-0 p-0 sm:py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6"
						/>
					</div>
					{#if $errors.firstName}
						<small class="text-white">{$errors.firstName}</small>
					{/if}
				</div>
				<div>
					<label
						for="lastName"
						class="block text-[13px] sm:text-sm font-medium leading-6 text-white">Last name</label
					>
					<div class="mt-2">
						<input
							id="lastName"
							name="lastName"
							type="lastName"
							on:change={handleChange}
							bind:value={$form.lastName}
							class="p-2 block w-full rounded-md border-0 p-0 sm:py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6"
						/>
					</div>
					{#if $errors.lastName}
						<small class="text-white">{$errors.lastName}</small>
					{/if}
				</div>
				<div>
					<label for="email" class="block text-[13px] sm:text-sm font-medium leading-6 text-white"
						>Email</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							on:change={handleChange}
							bind:value={$form.email}
							class="p-2 block w-full rounded-md border-0 p-0 sm:py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
						/>
					</div>
					{#if $errors.email}
						<small class="text-white">{$errors.email}</small>
					{/if}
				</div>

				<div>
					<label
						for="password"
						class="block text-[13px] sm:text-sm font-medium leading-6 text-white">Password</label
					>
					<div class="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							on:change={handleChange}
							bind:value={$form.password}
							autocomplete="current-password"
							class="p-2 block w-full rounded-md border-0 p-0 sm:py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
						/>
					</div>
					{#if $errors.password}
						<small class="text-white">{$errors.password}</small>
					{/if}
				</div>
				<div>
					{#if $serverError}
						<small>{$serverError}</small>
					{/if}
					<div class="relative">
						<div
							class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 hover:opacity-75 transition duration-1000 hover:duration-200 animate-tilt"
						/>
						<button
							type="submit"
							class="flex w-full justify-center relative rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>Sign up</button
						>
					</div>
				</div>
			</form>

			<div>
				<div class="relative mt-10">
					<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="w-full border-t border-gray-200" />
					</div>
					<div class="relative flex justify-center text-sm rounded-md font-medium leading-6">
						<span class="bg-white px-6 text-black rounded-md">Or continue with</span>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-2 gap-4">
					<a
						href="{PUBLIC_BACKEND_URL}/auth/42"
						class="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0]/40 hover:bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
					>
						<svg
							version="1.1"
							class="h-5 w-5 text-white"
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
			<div class="group/member">
				<p class="mt-4 text-center text-sm text-white/40 group-hover/member:text-white font-medium">
					Already a member?{' '}
					<a
						href="/login"
						class="font-bold tracking-wide leading-6 text-blue-600 group-hover/member:text-blue-500 brightness-100 group-hover/member:brightness-200"
						>Sign in</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
