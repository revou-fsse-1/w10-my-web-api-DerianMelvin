/*
  ================================================================================
    VARIABLES
  ================================================================================
*/
const API_NOTES = "https://6422d38d001cb9fc2030d81e.mockapi.io/Notes";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Stores fetched notes locally
let localNoteList;

let displayNotes = document.getElementById("displayNotes");

// Navbar elements
const addNoteButton = document.getElementById("addNoteButton");
const currentUsername = document.getElementById("currentUsername");
const userLogout = document.getElementById("userLogout");
const hamburgerButton = document.getElementById("hamburgerButton");

// Mobile menu elements
const mobileMenu = document.getElementById("mobileMenu");
const userLogoutMobile = document.getElementById("userLogoutMobile");

// Background overlay
const bgOverlay = document.getElementById("bgOverlay");

// Add New Note elements
const addNoteEditor = document.getElementById("addNoteEditor");
const addNoteForm = document.getElementById("addNoteForm");
const formTitle = document.getElementById("formTitle");
const formContent = document.getElementById("formContent");

// Edit Note elements
const editNoteEditor = document.getElementById("editNoteEditor");
const editNoteForm = document.getElementById("editNoteForm");
const formEditTitle = document.getElementById("formEditTitle");
const formEditContent = document.getElementById("formEditContent");

// Delete Confirmation Screen elements
const confirmationScreen = document.getElementById("confirmationScreen");
const confirmationButton = document.getElementById("confirmationButton");

// HTML components
const spinner = `
<div id="loading" class="w-full h-56 flex items-center justify-center">
  <div class="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]" >Loading...</span>
  </div>
</div>
`;

/*
  ================================================================================
    FUNCTIONS
  ================================================================================
*/
const getAllNotes = async () => {
  const data = await fetch(API_NOTES);
  const notes = await data.json();

  return notes;
};

const createNewNote = async (noteTitle, noteContent) => {
  const params = {
    method: "POST",
    body: JSON.stringify({
      title: noteTitle,
      text: noteContent,
      updatedOn: new Date(),
    }),
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await fetch(API_NOTES, params);
  const result = await response.json();
  return true;
};

const editNote = async (noteTitle, noteContent, noteId) => {
  const params = {
    method: "PUT",
    body: JSON.stringify({
      title: noteTitle,
      text: noteContent,
      updatedOn: new Date(),
    }),
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await fetch(`${API_NOTES}/${noteId}`, params);
  const result = await response.json();
  return true;
};

const deleteNote = async (noteId) => {
  const params = {
    method: "DELETE",
  };

  const response = await fetch(`${API_NOTES}/${noteId}`, params);
  const result = await response.json();
  return true;
};

const viewSelectedNote = async (index) => {
  const deleteBtn = editNoteEditor.children[0].children[0].children[1];
  const note = localNoteList[index];

  formEditTitle.value = note.title;
  formEditContent.value = note.text;

  openEditor(editNoteEditor);

  editNoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Remove all child elements & add a loading screen
    while (editNoteForm.hasChildNodes()) {
      editNoteForm.removeChild(editNoteForm.firstChild);
    }
    editNoteForm.innerHTML += spinner;

    const response = await editNote(
      formEditTitle.value,
      formEditContent.value,
      note.id
    );

    if (response) {
      window.location.reload();
    }
  });

  deleteBtn.addEventListener("click", () => {
    closeEditor(editNoteEditor);
    viewConfirmationScreen(note.id);
  });
};

const viewConfirmationScreen = (noteId) => {
  openEditor(confirmationScreen);

  confirmationButton.addEventListener("click", async () => {
    // Remove all child elements & add a loading screen
    while (confirmationScreen.children[0].hasChildNodes()) {
      confirmationScreen.children[0].removeChild(
        confirmationScreen.children[0].firstChild
      );
    }
    confirmationScreen.children[0].innerHTML += spinner;

    const response = await deleteNote(noteId);

    if (response) {
      window.location.reload();
    }
  });
};

const closeEditor = (editorId) => {
  bgOverlay.classList.add("hidden");
  editorId.classList.add("hidden");
};

const openEditor = (editorId) => {
  bgOverlay.classList.remove("hidden");
  editorId.classList.remove("hidden");
};

/*
  ================================================================================
    EVENT LISTENERS
  ================================================================================
*/
window.onload = async () => {
  // Set account name to currently logged in username
  currentUsername.innerHTML = currentUser.username;

  // Empty all elements and add a loading screen
  displayNotes.innerHTML = "";
  displayNotes.innerHTML += spinner;

  const noteList = await getAllNotes();

  // Stores fetched notes to the local variable
  localNoteList = noteList;

  localNoteList.forEach((note, i) => {
    let noteDate = new Date(note.updatedOn);
    let htmlData = `
      <div class="w-64 h-56 p-3 flex flex-col gap-3 justify-between border rounded-lg border-gray-300 sm:w-72 xl:w-96">
        <h2 class="line-clamp-1 font-bold text-xl" onclick="viewSelectedNote(${i})">${
      note.title
    }</h2>
        <div class="line-clamp-4 text-gray-600" onclick="viewSelectedNote(${i})">
          <p>${note.text}</p>
        </div>
        <div class="flex justify-between">
          <div class="p-1 flex gap-3">
            <img class="w-6 object-contain object-center cursor-pointer" src="/assets/icon-delete.svg" alt="Delete note" onclick="viewConfirmationScreen(${
              note.id
            })">
            <img class="w-6 object-contain object-center cursor-pointer" src="/assets/icon-edit.svg" alt="Edit note" onclick="viewSelectedNote(${i})">
          </div>
          <span class="text-sm text-gray-400 self-end">${noteDate.toLocaleDateString(
            "en-US"
          )}</span>
        </div>
      </div>
    `;
    displayNotes.innerHTML += htmlData;
  });

  // Remove loading screen
  const loading = document.getElementById("loading");
  loading.remove();
};

addNoteButton.addEventListener("click", () => {
  openEditor(addNoteEditor);
});

addNoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Remove all child elements & add a loading screen
  while (addNoteForm.hasChildNodes()) {
    addNoteForm.removeChild(addNoteForm.firstChild);
  }
  addNoteForm.innerHTML += spinner;

  const response = await createNewNote(formTitle.value, formContent.value);

  if (response) {
    window.location.reload();
  }
});

hamburgerButton.addEventListener("click", () => {
  const hasHidden = mobileMenu.classList.contains("hidden");

  if (hasHidden) {
    mobileMenu.classList.remove("hidden");
  } else {
    mobileMenu.classList.add("hidden");
  }
});

// Removes current user account when logged out
userLogout.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/index.html";
});

userLogoutMobile.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/index.html";
});
