import type { GroupActions } from '../interfaces/types';
import client from './apolloClient';
import { gql } from '@apollo/client/core/index.js';

type CreateChannelInput = {
	name: String;
	isPrivate: Boolean;
	password: String;
}

export const getGroups = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					getUsersChannel {
						id
						name
						isPrivate
						isDirectMessage
						ownerId
						owner {
							id
							pseudo
							name
							avatar
							status
						}
						members {
							id
							pseudo
							name
							avatar
							status
						}
						admins {
							id
							pseudo
							name
							avatar
							status
						}
					}
				}
			`
		});
		return response.data.getUsersChannel;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching groups');
	}
};

export const getAllGroups = async () => {
	try {
		const response = await client.query({
			query: gql`
				{
					getAllChannels {
						id
						name
						isPrivate
						isDirectMessage
						ownerId
						owner {
							id
							pseudo
							name
							avatar
							status
						}
						members {
							id
							pseudo
							name
							avatar
							status
						}
						admins {
							id
							pseudo
							name
							avatar
							status
						}
					}
				}
			`
		});
		return response.data.getAllChannels;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching groups');
	}
};

export const getGroup = async (channelId: string) => {
	try {
		const response = await client.query({
			query: gql`
				query getChannel($channelId: String!) {
					getChannel(input: {
						channelId: $channelId
					}) {
						id
						name
						isPrivate
						isDirectMessage
						ownerId
						owner {
							id
							pseudo
							name
							avatar
							status
						}
						members {
							id
							pseudo
							name
							avatar
							status
						}
						admins {
							id
							pseudo
							name
							avatar
							status
						}
					}
				}
			`,
			variables: {
				channelId: channelId
			}
		});
		return response.data.getChannel;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching groups');
	}
};


export const getChannel = async (groupId: string) => {
	try {
		const response = await client.query({
			query: gql`
				query getChannel($input: GetChannelInput!) {
					getChannel(input: $input) {
						id
						name
						isPrivate
						isDirectMessage
						ownerId
						owner {
							id
							pseudo
							name
							avatar
							status
						}
						mutes {
							userId
							channelId
							expireAt
							mutedBy
							user {
								id
								pseudo
								name
								avatar
								status
							}
						}
						bans {
							userId
							channelId
							bannedBy
							user {
								id
								pseudo
								name
								avatar
								status
							}
						}
						members {
							id
							pseudo
							name
							avatar
							status
						}
						admins {
							id
							pseudo
							name
							avatar
							status
						}
					}
				}
			`,
			variables: {
				input: {
					channelId: groupId
				}
			}
		});
		return response.data.getChannel;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching user search results');
	}
};

export const getMessages = async (groupId: string) => {
	try {
		const response = await client.query({
			query: gql`
				query getMessages($channelId: String!) {
					getMessages(input: {
						channelId: $channelId
					}) {
						id
						content
						userId
						user {
							id
							name
							avatar
							pseudo
						}
						createdAt
					}
				}
			`,
			variables: {
				channelId: groupId
			}
		});
		return response.data.getMessages;
	} catch (error) {
		console.log(error);
		throw new Error('Error fetching user search results');
	}
};

export const sendMessage = async (channelId: string, message: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation sendMessage($input: SendMessageInput!) {
					sendMessage(input: $input) {
						success
					}
				}
			`,
			variables: {
				input: {
					channelId,
					content: message,
				}
			}
		});
		return response.data.sendMessage;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating groups');
	}
};

export const deleteMessage = async (messageId: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation deleteMessage($input: DeleteMessageInput!) {
					deleteMessage(input: $input) {
						success
					}
				}
			`,
			variables: {
				input: {
					messageId,
				}
			}
		});
		return response.data.deleteMessage;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating groups');
	}
};

export const updateMessageInvite = async (messageId: string, content: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation updateMessageInvite($input: UpdateMessageInviteInput !) {
					updateMessageInvite(input: $input) {
						success
					}
				}
			`,
			variables: {
				input: {
					messageId,
					content
				}
			}
		});
		return response.data.updateMessageInvite;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating groups');
	}
};

export const createGroup = async (name: string, isPrivate: boolean,
	password: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation createChannel($input: CreateChannelInput!) {
					createChannel(input: $input) {
						success
					}
				}
			`,
			variables: {
				input: {
					name,
					isPrivate,
					password
				}
			}
		});
		return response.data.createChannel;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating groups');
	}
};

export const leaveChannel = async (channelId: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation leaveChannel($input: leaveChannelInput!) {
					leaveChannel(input: $input) {
						success
					}
				}
			`,
			variables: {
				input: {
					channelId
				}
			}
		});
		return response.data.leaveChannel;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating groups');
	}
};

export const joinChannel = async (channelId: string, passwordInput: string) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation joinChannel($input: joinChannelInput!) {
					joinChannel(input: $input) {
						success
					}
				}
			`,
			variables: {
				input: {
					channelId,
					passwordInput
				}
			}
		});
		return response.data.joinChannel;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating groups');
	}
};

export const setChannelPassword = async (channelId: string, password: string | undefined) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation setChannelPassword($input: ChannelPasswordInput!) {
					setChannelPassword(input: $input) {
						success
					}
				}
			`,
			variables: {
				input: {
					channelId,
					password
				}
			}
		});
		return response.data.setChannelPassword;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating groups');
	}
};

export const doGroupAction = async (channelId: string, userId: string, duration: number|undefined, action: GroupActions) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation manageUser($input: ManageUserInput!) {
					manageUser(input: $input) {
						success
					}
				}
			`,
			variables: {
				input: {
					channelId,
					targetUserId: userId,
					action,
					duration
				}
			}
		});
		return response.data.sendMessage;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating groups');
	}
};
