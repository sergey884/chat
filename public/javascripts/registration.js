
const registerUser = () => {
	const loginForm = document.forms['registrationForm'];
	const elements = loginForm.elements;

	const loginValue = elements.username.value;
	const emailValue = elements.email.value;
	const passwordValue = elements.password.value;
	const repeatedPasswordValue = elements['repeat-password'].value;
	// console.log(loginValue, emailValue, passwordValue, repeatedPasswordValue);

	fetch("/registration", {
		method: "POST",
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		credentials: "include",
		body: JSON.stringify({
			login: loginValue,
			email: emailValue,
			password: passwordValue,
			repeatedPassword: repeatedPasswordValue,
		})
	})
	.then(response => response.json())
	.then(function(userObj) {
	  console.log("userObj", userObj);
	})
	.catch(error => console.error(error))
}