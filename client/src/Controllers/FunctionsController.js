export function setTitle(path, routeArray) {
    let pageTitle
    
	for (let i = 0; i < routeArray.length; i++) {
		if (routeArray[i].path === path) {
			pageTitle = routeArray[i].title
		}
    }
    
	document.title = (pageTitle) ? pageTitle : 'People'
}

export function getCookie(name) {
	let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

export function calculateAge(birthday) {
	let ageDifMs = Date.now() - birthday
	let ageDate = new Date(ageDifMs)
	return Math.abs(ageDate.getUTCFullYear() - 1970)
}