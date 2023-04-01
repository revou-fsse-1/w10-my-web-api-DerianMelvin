/*
  ================================================================================
    VARIABLES
  ================================================================================
*/
const API_USERS = "https://6422d38d001cb9fc2030d81e.mockapi.io/users";

// Buttons
const btnSignin = document.getElementById("btnSignin");
const btnRegister = document.getElementById("btnRegister");

// Sign In elements
const formSignIn = document.getElementById("formSignIn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loadingSignin = document.getElementById("loadingSignin");

// Register elements
const formRegister = document.getElementById("formRegister");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const loadingRegister = document.getElementById("loadingRegister");

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

formSignIn.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userValue = username.value;
  const passwordValue = password.value;

  if (usernameValid && passwordValid) {
    loadingSignin.classList.remove("hidden");

    // Fetch user data
    const response = await fetch(`${API_USERS}?userName=${userValue}`);
    const jsonData = await response.json();
    const userData = jsonData[0];

    if (jsonData.length === 0) {
      loadingSignin.classList.add("hidden");
      setError("displaySignin", "Account doesn't exist");
      setTimeout(() => {
        setSuccess("displaySignin");
      }, 1800);
    } else {
      if (
        userValue === userData.userName &&
        passwordValue === userData.password
      ) {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setSuccess("displaySignin");
        loadingSignin.classList.add("hidden");
        window.location.href = "/dashboard/index.html";
      } else {
        loadingSignin.classList.add("hidden");
        setError("displaySignin", "Incorrect username/password");
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
  } else if (value.length < 5) {
    setError("displayRegisterPassword", "Password too short");
    passwordValid = false;
  } else {
    setSuccess("displayRegisterPassword");
    passwordValid = true;
  }
});

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();

  loadingRegister.classList.remove("hidden");

  if (usernameValid && passwordValid) {
    const params = {
      method: "POST",
      body: JSON.stringify({
        userName: registerUsername.value,
        password: registerPassword.value,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await fetch(API_USERS, params);
    const result = await response.json();

    switchForm(btnRegister, btnSignin, formSignIn, formRegister);
    loadingRegister.classList.add("hidden");
  } else {
    displaySubmitError();
  }
});
