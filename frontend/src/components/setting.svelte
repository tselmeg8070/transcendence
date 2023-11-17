<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { authentication, type AuthenticationType } from '../stores/authentication';
	import { deleteAccount, updateAvatar, updateUserPseudo } from '../services/gqlUser';
	import { changeUserPassword } from '../services/gqlUser';
	import { writable } from 'svelte/store';
	import API from '../services/api';
	import { goto } from '$app/navigation';
	import { storage, ref, uploadBytes, getDownloadURL } from './../utils/firebaseConfig';

	let pseudo = writable('');
	let user: AuthenticationType;
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let enabled: boolean;
	let qrCodeUrl: string | null = null;

	const onsubscribe = authentication.subscribe((value) => {
		console.log('Subscribe', value);
		user = value;
		pseudo.update((val) => user.pseudo);
		enabled = user.isTwoFactorEnabled;
	});
	onDestroy(onsubscribe);

	async function handleMutationPseudo() {
		try {
			if ($pseudo.length > 0)
				await updateUserPseudo($pseudo);
			authentication.update((val) => ({ ...val, pseudo: $pseudo }));
		} catch (error) {
			console.log(`Error`, error);
		}
	}

	async function handleChangePassword() {
		if (newPassword !== confirmPassword) {
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			console.error(`New password and confirm password do not match.`);
			return;
		}
		try {
			const result = await changeUserPassword(currentPassword, newPassword);
			if (result) {
				console.log(`Password changed successfully`);
				currentPassword = '';
			} else {
				console.error('Error changing password');
				currentPassword = '';
			}
		} catch (error) {
			console.error(error.message);
			currentPassword = '';
		} finally {
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		}
	}

	async function handleDeleteAccount() {
		try {
			const response = await deleteAccount();
			goto('/signout');
			if (response) {
				console.log(`Account has been deleted with success !`);
			} else {
				console.error('Error while deleting the user Account !');
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	async function handleActivate2FA() {
		try {
			if (!enabled) {
				const response = await API.post('/auth/enable-two-factor', {});
				if (response && response.qrCodeUrl) {
					console.log(response);
					qrCodeUrl = response.qrCodeUrl;
					enabled = true;
				} else {
					console.error(`Erreur lors de l'obtention du QR code.`);
					enabled = false;
				}
			} else {
				const response = await API.post('/auth/disable-two-factor', {});
				console.log(response);
				qrCodeUrl = null;
				enabled = false;
			}
		} catch (error) {
			console.log(error);
			alert('Une erreur est survenue. Veuillez reessayer.');
		}
	}

	async function uploadAvatar(file: File) {
		const storageRef = ref(storage, `avatars/${file.name}`);
		await uploadBytes(storageRef, file);
		const url = await getDownloadURL(storageRef);
		return url;
	}

	async function handleFileSelect(event: any) {
		const file = event.target.files[0];
		if (file) {
			try {
				const avatarUrl = await uploadAvatar(file);
				// Envoyez l'URL à votre API NestJS ici
				await updateAvatar(avatarUrl);
				authentication.update((val) => ({ ...val, avatar: avatarUrl }));
			} catch (error) {
				console.error('Erreur lors du téléchargement de l’avatar :', error);
			}
		}
	}
	function triggerFileInput() {
		document.getElementById('fileInput')?.click();
	}

	$: console.log(qrCodeUrl);
</script>

<div class="w-full h-full overflow-auto">
	<div
		class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
	>
		<div>
			<h2 class="text-base font-semibold leading-7">Personal Information</h2>
			<p class="mt-1 sm:text-sm leading-6 text-gray-300">Modify the profile</p>
		</div>

		<form class="md:col-span-2">
			<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
				<div class="col-span-full flex items-center gap-x-8">
					<img
						src={user.avatar}
						alt=""
						class="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
					/>
					<div>
						<div class="relative rounded-md max-w-[120px] group">
							<div
								class="absolute -inset-0.5 bg-gradient-to-r from-red-500/80 to-blue-500/80 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"
							/>
							<button
								id="openModalButton"
								type="button"
								class="relative rounded-md bg-white px-3 py-2 text-black text-sm font-semibold shadow-sm transition duration-300 group-hover:font-bold"
								on:click={triggerFileInput}>Change avatar</button
							>
							<!-- hidden file input -->
							<input
								type="file"
								id="fileInput"
								class="hidden"
								accept="image/*"
								on:change={handleFileSelect}
							/>
							<div id="fileUploadModal" class="modal hidden fixed z-10 inset-0 overflow-y-auto">
								<div class="modal-content bg-white p-6 m-auto max-w-md">
									<span class="close absolute top-0 right-0 p-4 text-2xl cursor-pointer"
										>&times;</span
									>
									<h2 class="text-xl font-semibold">Sélectionner un fichier</h2>
									<!-- <input type="file" id="fileInput" class="mt-2 border p-2" accept="image/*" /> -->
									<button id="uploadButton" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
										>Télécharger</button
									>
								</div>
							</div>
						</div>
						<p class="mt-2 text-[11px] sm:text-xs leading-5 text-gray-300">
							JPG, GIF or PNG. 1MB max.
						</p>
					</div>
				</div>
				<div class="col-span-full">
					<label for="email" class="block text-sm font-medium text-white leading-6">Email</label>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/20 border border-gray-900/5 ring-1 ring-inset ring-white/10 focus-within:ring-1 focus-within:ring-inset focus-within:ring-white"
						>
							<div class="flex items-center pl-2">
								<svg
									class="h-5 w-5 text-gray-300"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"
									/>
									<path
										d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"
									/>
								</svg>
							</div>
							<input
								type="text"
								name="email"
								id="email"
								class="flex-1 border-0 bg-transparent py-1.5 pl-2 placeholder:text-white/60 placeholder:tracking-wide focus:ring-0 sm:text-sm sm:leading-6"
								placeholder={user.email}
								readonly
							/>
						</div>
					</div>
					<label for="pseudo" class="mt-2 block text-sm font-medium leading-6 text-white"
						>Pseudo</label
					>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
						>
							<input
								type="text"
								name="pseudo"
								id="pseudo"
								class="flex-1 ring-0 border border-white rounded-md shadow-sm bg-transparent py-1.5 pl-1 focus:ring-0 sm:text-sm sm:leading-6"
								placeholder={user.pseudo}
								bind:value={$pseudo}
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="group relative max-w-[60px] mt-8 flex">
				<div
					class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"
				/>
				<button
					type="button"
					class="relative rounded-md w-[60px] group-hover:font-bold bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					on:click={handleMutationPseudo}>Save</button
				>
			</div>
		</form>
	</div>

	<div
		class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
	>
		<div>
			<h2 class="text-base font-semibold leading-7">Change password</h2>
			<p class="mt-1 text-sm leading-6 text-gray-300">
				Update your password associated with your account.
			</p>
		</div>

		<form class="md:col-span-2" on:submit|preventDefault={handleChangePassword}>
			<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
				<div class="col-span-full">
					<label for="current-password" class="block text-sm font-medium leading-6 text-white"
						>Current password</label
					>
					<div class="mt-2">
						<input
							id="current-password"
							name="current_password"
							type="password"
							autocomplete="current-password"
							class="block w-full ring-1 border border-white rounded-md shadow-sm bg-white py-1.5 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
							bind:value={currentPassword}
						/>
					</div>
				</div>

				<div class="col-span-full">
					<label for="new-password" class="block text-sm font-medium leading-6 text-white"
						>New password</label
					>
					<div class="mt-2">
						<input
							id="new-password"
							name="new_password"
							type="password"
							autocomplete="new-password"
							class="block w-full ring-1 border border-white rounded-md shadow-sm bg-white py-1.5 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
							bind:value={newPassword}
						/>
					</div>
				</div>

				<div class="col-span-full">
					<label for="confirm-password" class="block text-sm font-medium leading-6 text-white"
						>Confirm password</label
					>
					<div class="mt-2">
						<input
							id="confirm-password"
							name="confirm_password"
							type="password"
							autocomplete="new-password"
							class="block w-full ring-1 border border-white rounded-md shadow-sm bg-white py-1.5 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
							bind:value={confirmPassword}
						/>
					</div>
				</div>
			</div>

			<div class="group max-w-[60px] relative mt-8 flex">
				<div
					class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"
				/>
				<button
					type="submit"
					class="relative rounded-md w-[60px] group-hover:font-bold bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>Save</button
				>
			</div>
		</form>
	</div>
	<div
		class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
	>
		<div>
			<h2 class="text-base font-semibold leading-7">Activate Two Factor Authentication</h2>
			<p class="mt-1 text-sm leading-6 text-gray-300">
				Make your account more safe by activating 2FA
			</p>
		</div>

		<div class="flex flex-col">
			<form class="md:col-span-2" on:submit|preventDefault={handleActivate2FA}>
				<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
					<div class="col-span-full">
						<div class="flex items-center sm:mt-8">
							<button
								type="submit"
								class={`${
									enabled ? 'bg-blue-800' : 'bg-gray-200'
								} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
								role="switch"
								aria-checked="false"
								aria-labelledby="annual-billing-label"
							>
								<span
									aria-hidden="true"
									class={` ${
										enabled ? 'translate-x-5' : 'translate-x-0'
									} translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
								/>
							</button>
							<span class="ml-3 text-sm" id="annual-billing-label">
								<span class="font-medium text-white">{enabled ? `Disable 2FA` : `Enable 2FA`}</span>
							</span>
						</div>
					</div>
				</div>
			</form>
			{#if qrCodeUrl !== null}
				<img class="mt-5" src={qrCodeUrl} alt="2FA" />
			{/if}
		</div>
	</div>
	<div
		class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 mb-32"
	>
		<div>
			<h2 class="text-base font-semibold leading-7">Delete account</h2>
			<p class="mt-1 text-sm leading-6 text-gray-300">
				No longer want to play our Pong? You can delete your account here. This action is not
				reversible. All information related to this account will be deleted permanently.
			</p>
		</div>

		<form class="flex items-start md:col-span-2" on:submit|preventDefault={handleDeleteAccount}>
			<button
				type="submit"
				class="sm:mt-10 rounded-md bg-red-500/20 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-red-500/30 text-white"
				>Yes, delete my account</button
			>
		</form>
	</div>
</div>
