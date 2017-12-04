function sendUserDate() {
	const loginForm = document.forms['loginForm'];
	const elements = loginForm.elements;

	const loginValue = elements.login.value;
	const passwordValue = elements.password.value;

	return fetch("/login", {
		method: "POST",
		headers: {
		  // 'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		credentials: "include",
		body: JSON.stringify({
			login: loginValue,
			password: passwordValue
		})
	})
	.then(response => {
		let res = response;
		// window.location.href = "/login";
		console.log(res.json());
		return res;
	})
	.then(function(userObj) {
	  console.log("userObj", userObj);
	  // alert(userObj);
	})
	.catch(error => console.error(error))
	console.log("sendUserDate", loginValue, passwordValue);
	return true;
}