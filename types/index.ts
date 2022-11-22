export type UserExtension = {
	currentUser?: {
		isFollowing?: boolean
	}
}

export type PostExtension = {
	currentUser?: {
		hasLiked?: boolean
	}
}
