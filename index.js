/*
  ================================================================================
    VARIABLES
  ================================================================================
*/
// Buttons
const btnSignin = document.getElementById("btnSignin");
const btnRegister = document.getElementById("btnRegister");

// Sign In elements
const formSignIn = document.getElementById("formSignIn");
const username = document.getElementById("username");
const password = document.getElementById("password");

// Register elements
const formRegister = document.getElementById("formRegister");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");

let usernameValid = false;
let passwordValid = false;

/*
  ================================================================================
    FUNCTIONS
  ================================================================================
*/
const switchForm = (currentBtn, otherBtn, displayForm, hideForm) => {
  currentBtn.classList.remove("bg-slate-900");
  otherBtn.classList.add("bg-slate-900");

  displayForm.classList.remove("hidden");
  hideForm.classList.add("hidden");

  usernameValid = false;
  passwordValid = false;
};

const displaySubmitError = () => {
  if (!usernameValid) {
    setError("displayUsername", "Invalid Username");
  }

  if (!passwordValid) {
    setError("displayPassword", "Invalid Password");
  }
};

const setError = (elementId, errorMsg) => {
  const selectedElement = document.getElementById(elementId);

  selectedElement.innerText = errorMsg;
  selectedElement.classList.remove("hidden");
};

const setSuccess = (elementId) => {
  const selectedElement = document.getElementById(elementId);

  selectedElement.innerText = "";
  selectedElement.classList.add("hidden");
};

/*
  ================================================================================
    EVENT LISTENERS
  ================================================================================
*/

btnSignin.addEventListener("click", () => {
  switchForm(btnRegister, btnSignin, formSignIn, formRegister);
});

btnRegister.addEventListener("click", () => {
  switchForm(btnSignin, btnRegister, formRegister, formSignIn);
});

/* ----------------- SIGN IN ----------------- */
username.addEventListener("input", () => {
  const value = username.value;

  if (value === "") {
    setError("displayUsername", "Username is required");
    usernameValid = false;
  } else if (value.length < 3) {
    setError("displayUsername", "Username too short");
    usernameValid = false;
  } else {
    setSuccess("displayUsername");
    usernameValid = true;
  }
});

password.addEventListener("input", () => {
  const value = password.value;

  if (value === "") {
    setError("displayPassword", "Password is required");
    passwordValid = false;
  } else {
    setSuccess("displayPassword");
    passwordValid = true;
  }
});

formSignIn.addEventListener("submit", (e) => {
  e.preventDefault();

  const userValue = username.value;
  const passwordValue = password.value;
  const userData = JSON.parse(localStorage.getItem(`user-${userValue}`));

  console.log(userData);

  if (usernameValid && passwordValid) {
    if (userData === null) {
      setError("displaySignin", "Account doesn't exist");
      setTimeout(() => {
        setSuccess("displaySignin");
      }, 1800);
    } else {
      if (
        userValue === userData.username &&
        passwordValue === userData.password
      ) {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setSuccess("displaySignin");
        window.location.href = "/dashboard/index.html";
      } else {
        setError("displaySignin", "Incorrect password");
        setTimeout(() => {
          setSuccess("displaySignin");
        }, 1800);
      }
    }
  } else {
    displaySubmitError();
  }
});

/* ----------------- REGISTER ----------------- */
registerUsername.addEventListener("input", () => {
  const value = registerUsername.value;

  if (value === "") {
    setError("displayRegisterUsername", "Username is required");
    usernameValid = false;
  } else if (value.length < 3) {
    setError("displayRegisterUsername", "Username too short");
    usernameValid = false;
  } else {
    setSuccess("displayRegisterUsername");
    usernameValid = true;
  }
});

registerPassword.addEventListener("input", () => {
  const value = registerPassword.value;

  if (value === "") {
    setError("displayRegisterPassword", "Password is required");
    passwordValid = false;
  } else {
    setSuccess("displayRegisterPassword");
    passwordValid = true;
  }
});

formRegister.addEventListener("submit", (e) => {
  e.preventDefault();

  if (usernameValid && passwordValid) {
    localStorage.setItem(
      `user-${registerUsername.value}`,
      JSON.stringify({
        username: registerUsername.value,
        password: registerPassword.value,
      })
    );
    switchForm(btnRegister, btnSignin, formSignIn, formRegister);
  } else {
    displaySubmitError();
  }
});
