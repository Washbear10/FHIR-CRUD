export const saveBasicAuthCreds = (b64Value, expiringDays) => {
	const d = new Date();
	d.setTime(d.getTime() + expiringDays * 24 * 60 * 60 * 1000);
	let expires = "expires=" + d.toUTCString();
	document.cookie = "basicCreds=" + b64Value + ";" + expires + ";path=/";
};

export const getBasicAuthCreds = () => {
	let creds = getCookie("basicCreds");
	return creds;
};

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

export const createAuthHeaderValue = (username, password) => {
	let b64encoded = btoa(String(username) + ":" + String(password));
	return b64encoded;
};
