function ManageManager() {
    throw new Error("This is a static class.");
}

ManageManager.edit = function (id) {
    const buttonEdit = document.getElementsByClassName("edit")[0];
    const idShow = document.getElementsByClassName("idShow")[0];
    /**
     * @type {HTMLInputElement}
     */
    const password = document.getElementsByClassName("passwordInput")[0];
    /**
     * @type {HTMLInputElement}
     */
    const idInput = document.getElementsByClassName("idInput")[0];
    if (!buttonEdit || !password || !idShow || !idInput) return;

    if (buttonEdit.innerHTML == "Edit") {
        //enable edit mode
        buttonEdit.innerHTML = "Save";
        idShow.hidden = true;
        idInput.hidden = false;
        password.style.userSelect = "text";
        password.style.pointerEvents = "all";
    } else {
        //get changes and save
        buttonEdit.innerHTML = "Edit";
        idShow.hidden = false;
        idInput.hidden = true;
        password.style.userSelect = "none";
        password.style.pointerEvents = "none";

        const idNew = idInput.value,
            passwordNew = password.value;

        idShow.innerHTML = idNew;
        //TODO to check
        /**
         * @type {any[]}
         */
        const a = DisplayManager.data.list;
        a[id] = {
            "password": passwordNew,
            "identification": idNew,
            "url": a[id].url
        };
        //save if nwjs
    }
};


ManageManager.delete = function (id) {
    const result = confirm("Are you sure?");
    if (!result) return;
    //remove element from list by using the id of the li element
    const li = document.getElementById(id);
    if (li) li.remove();
    const classInfo = document.getElementsByClassName("passInfo")[0];
    // just hide it, it will be replaced when we click a new pass
    if (classInfo) classInfo.remove();
    // remove id from db
    //TODO to check
    /**
     * @type {any[]}
     */
    const a = DisplayManager.data.list;
    a.splice(id, id + 1);
};

ManageManager.copy = function () {
    // Get the text field
    var copyText = document.getElementsByClassName("passwordInput")[0];
    if (!copyText) return;

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    const buttonCopy = document.getElementsByClassName("copy")[0];
    if (!buttonCopy) return;
    buttonCopy.innerHTML = "Copied!";
    setTimeout(() => {
        buttonCopy.innerHTML = "Copy";
    }, 1500);
};