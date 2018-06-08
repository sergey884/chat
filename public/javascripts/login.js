const userNotExist = () => {
	const invalid_user = document.querySelector('.invalid_user');
	invalid_user.className += " active";
	console.log(invalid_user);
}

function sendUserDate() {
	const loginForm = document.forms['loginForm'];
	const elements = loginForm.elements;

	const loginValue = elements.login.value;
	const passwordValue = elements.password.value;

	fetch("/login", {
		method: "POST",
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		credentials: "include",
		body: JSON.stringify({
			login: loginValue,
			password: passwordValue
		})
	})
	.then((response) => {
		console.log('response', response)
		return response.json();
	})
	.then(function(userObj) {
	  console.log("userObj", userObj);
	  if (userObj.err) {
	  	userNotExist();
		}
		window.location.href = '/chat';
	  // alert(userObj);
	})
	.catch(error => console.error(error));
	console.log("sendUserDate", loginValue, passwordValue);
	return true;
}

