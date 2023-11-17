import client from './apolloClient';
import { gql } from '@apollo/client/core/index.js';

export const getUsers = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					users {
						id
						email
						name
						pseudo
						avatar
						status
					}
				}
			`
		});
		return response.data.users;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching user information');
	}
};

export const getFriends = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					getAllFriendsOfUser {
						id
						email
						name
						pseudo
						avatar
						status
						channelId
					}
				}
			`
		});
		return response.data.getAllFriendsOfUser;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching user information');
	}
};

export const getPendingFriendRequests = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					getPendingSentFriendRequests {
						id
						senderId
						receiverId
						status
						receiver {
							id
							avatar
							name
							pseudo
						}
						sender {
							id
							avatar
							name
							pseudo
						}
					}
				}
			`
		});
		return response.data.getPendingSentFriendRequests;
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching user information');
	}
};

export const getPendingRequests = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					getPendingFriendRequests {
						id
						senderId
						receiverId
						status
						receiver {
							id
							avatar
							name
							pseudo
						}
						sender {
							id
							avatar
							name
							pseudo
						}
					}
				}
			`
		});
		return response.data.getPendingFriendRequests;
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching user information');
	}
};

export const acceptFriendRequest = async (pseudo: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation acceptFriendRequest($pseudo: String!) {
					acceptFriendRequest(senderPseudo: $pseudo)
				}
			`,
			variables: {
				pseudo: pseudo
			}
		});
		return response.data.acceptFriendRequest;
	} catch (error) {
		console.error(error.message);
		throw new Error('Error during the acceptFriendRequest');
	}
};

export const rejectFriendRequest = async (pseudo: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation rejectFriendRequest($pseudo: String!) {
					rejectFriendRequest(senderPseudo: $pseudo)
				}
			`,
			variables: {
				pseudo: pseudo
			}
		});
		return response.data.rejectFriendRequest;
	} catch (error) {
		console.log(error.message);
		throw new Error('Error during the rejectFriendRequest');
	}
};

export const cancelFriendRequest = async (pseudo: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation cancelSentFriendRequest($pseudo: String!) {
					cancelSentFriendRequest(receiverPseudo: $pseudo)
				}
			`,
			variables: {
				pseudo: pseudo
			}
		});
		return response.data.cancelSentFriendRequest;
	} catch (error) {
		console.log(error.message);
		throw new Error('Error during the rejectFriendRequest');
	}
};


export const unFriend = async (pseudo: string, channelId: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation unFriend($pseudo: String!, $channelId: String!) {
					unFriend(receiverPseudo: $pseudo, channelId: $channelId)
				}
			`,
			variables: {
				pseudo: pseudo,
				channelId: channelId
			}
		});
		return response.data.unFriend;
	} catch (error) {
		console.log(error.message);
		throw new Error('Error during the rejectFriendRequest');
	}
};

export const sendFriendRequest = async (pseudo: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation sendFriendRequest($pseudo: String!) {
					sendFriendRequest(receiverPseudo: $pseudo)
				}
			`,
			variables: {
				pseudo: pseudo
			}
		});
		return response.data.sendFriendRequest;
	} catch (error) {
		throw new Error(error.message);
	}
};

export const searchUsersByNameOrPseudo = async (term: string) => {
	try {
		const response = await client.query({
			query: gql`
				query SearchUsers($term: String!) {
					searchUsers(term: $term) {
						id
						email
						name
						pseudo
						avatar
						status
					}
				}
			`,
			variables: {
				term: term
			}
		});
		return response.data.searchUsers;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching user search results');
	}
};
