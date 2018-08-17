const userNotExist = () => {
  const invalid_user = document.querySelector('.invalid_user');
  invalid_user.className += ' active';
};

function sendUserDate() {
  const loginForm = document.forms.loginForm;
  const { elements } = loginForm;

  const loginValue = elements.login.value;
  const passwordValue = elements.password.value;

  fetch('/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      login: loginValue,
      password: passwordValue,
    }),
  })
    .then(response => response.json())
    .then((userObj) => {
      if (userObj.err) {
        userNotExist();
      } else {
        window.location.href = '/chat';
      }
    })
    .catch(error => console.error(error));

  return true;
}

