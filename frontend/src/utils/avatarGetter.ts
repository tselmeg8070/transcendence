export function getAvatar(url: string, pseudo: string) {
	if (url === "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1")
		return ("https://api.dicebear.com/7.x/bottts/svg?seed=" + pseudo);
	return (url);
}
