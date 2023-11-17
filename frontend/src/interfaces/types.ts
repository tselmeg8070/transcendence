export interface Conversation {
	name: string;
	avatar: string;
	lastmessage_author: string;
	lastmessage_content: string;
	lastmessage_hour: string;
}

export interface MessageInterface {
	id: string;
	content: string;
	userId: string;
	user: RequestUserInterface;
	createdAt: Date;
}

export interface Request {
	id: string;
	senderId: string;
	receiverId: string;
	status: string;
	sender: {
		avatar: string;
		name: string;
		pseudo: string;
	};
}

export interface userStats {
	totalGames: number;
	victories: number;
	losses: number;
	winRatio: number;
	lossRatio: number;
	longestStreak: number;
}

export interface searchUser {
	id: string;
	email: string;
	name: string;
	pseudo: string;
	avatar: string;
	status: string;
}

export interface User {
	id: string;
	pseudo: string;
	avatar: string;
  }
  
  export interface MatchHistory {
	id: string;
	player1: User;
	player2: User;
	winnerId: string;
	playedAt: string;
  }

export interface GroupMemberInterface {
	id: string;
	name: string;
	pseudo: string;
	avatar: string;
	status: string;
}

export interface GroupMutesInterface {
	userId: string;
	channelId: string;
	mutedId: Date;
	reason: string;
	expireAt: Date;
	mutedBy: string;
	user: GroupMemberInterface;
}
export interface GroupBansInterface {
	userId: string;
	channelId: string;
	bannedBy: string;
	user: GroupMemberInterface;
}

export interface GroupInterface {
	id: string;
	name: string;
	isPrivate: boolean;
	isDirectMessage: boolean;
	ownerId: string;
	mutes: GroupMutesInterface[];
	bans: GroupBansInterface[];
	owner: GroupMemberInterface[];
	members: GroupMemberInterface[];
	admins: GroupMemberInterface[];
}

export interface RequestUserInterface {
	id: string;
	avatar: string;
	name: string;
	pseudo: string;
}

export interface FriendRequestInterface {
	id: string;
	senderId: string;
	receiverId: string;
	status: string;
	receiver: RequestUserInterface;
	sender: RequestUserInterface;
}

export interface FriendInterface {
	id: string;
	avatar: string;
	name: string;
	pseudo: string;
	email: string;
	channelId: string;
	status: string;
}

export enum GroupActions {
	KICK = 'KICK',
	BAN = 'BAN',
	MUTE = 'MUTE',
	UNMUTE = 'UNMUTE',
	UNBAN = 'UNBAN',
	ADD = 'ADD',
	UPADMIN = 'UPADMIN',
	DOWNADMIN = 'DOWNADMIN'
}
