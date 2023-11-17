import Cookies from 'js-cookie';
import client from './apolloClient';
import { gql } from '@apollo/client/core/index.js';

export const userInformation = async (access_token: string) => {
	try {
		const response = await client.query({
			query: gql`
				{
					userInformation {
						id
						email
						name
						pseudo
						avatar
						isTwoFactorEnabled
						status
					}
				}
			`,
			context: {
				headers: {
					Authorization: `Bearer ${access_token}` // Add the access token to the Authorization header
				}
			}
		});
		return response.data;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching user information');
	}
};

export const getUserInformationPerPseudo = async (pseudo: string) => {
	try {
		const response = await client.query({
			query: gql`
				query GetUserInformation($pseudo: String!) {
					getUserInformationWithPseudo(pseudo: $pseudo) {
						id
						email
						name
						pseudo
						avatar
						isTwoFactorEnabled
						status
					}
				}
			`,
			variables: {
				pseudo: pseudo
			}
		});
		return response.data.getUserInformationWithPseudo;
	} catch (error) {
		throw new Error(`Error to get information via Pseudo, ${error.message}`);
	}
};

export const userInformationNoToken = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					userInformation {
						id
						email
						name
						pseudo
						avatar
						isTwoFactorEnabled
						status
					}
				}
			`
		});
		if (!response.data) throw new Error('Error fetching user information');
		return response.data.userInformation;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching user information');
	}
};

export const updateUserPseudo = async (newPseudo: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation updatePseudo($newPseudo: String!) {
					updatePseudo(newPseudo: $newPseudo)
				}
			`,
			variables: {
				newPseudo: newPseudo
			}
		});
		return response.data.updatePseudo;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating user pseudo');
	}
};

export const changeUserPassword = async (currentPassword: string, newPassword: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
					changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
				}
			`,
			variables: {
				currentPassword,
				newPassword
			}
		});
		return response.data.changePassword;
	} catch (error) {
		console.log(error);
		throw new Error('Error changing user password');
	}
};

export const deleteAccount = async () => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation {
					deleteAccount
				}
			`
		});
		console.log(`this is the response of the deleteAccount: `, response.data.deleteAccount);
		return response.data.deleteAccount;
	} catch (error) {
		console.log(error);
		throw new Error('Error deleting user account');
	}
};

export const updateAvatar = async (avatarUrl: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation UploadAvatar($avatarUrl: String!) {
					uploadAvatar(avatarUrl: $avatarUrl)
				}
			`,
			variables: {
				avatarUrl
			}
		});
		return response.data.uploadAvatar;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating user avatar');
	}
};

export const getRanking = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					getRanking {
						id
						pseudo
						eloScore
						avatar
					}
				}
			`
		});
		return response.data.getRanking;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching ranking');
	}
};

export const getUserMatchHistory = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					getUserMatchHistory {
						id
						player1 {
							id
							pseudo
							avatar
						}
						player2 {
							id
							pseudo
							avatar
						}
						winnerId
						playedAt
					}
				}
			`
		});
		return response.data.getUserMatchHistory;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching match history');
	}
};



export const getUserStats = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					getUserStats {
						victories
						losses
						winRatio
						lossRatio
						totalGames
						longestStreak
					}
				}
			`
		});
		return response.data.getUserStats;
	} catch (error) {
		console.error(error);
		throw new Error(`Error fetching user stats`);
	}
};
