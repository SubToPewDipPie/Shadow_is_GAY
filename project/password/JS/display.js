function DisplayManager() {
    throw new Error("This is a static class.");
}

DisplayManager.data = {};
// it will be null until initialisation
DisplayManager.main = document.getElementById("main");
DisplayManager.passList = document.getElementsByClassName("passList")[0];

DisplayManager.initialisation = async function () {
    DisplayManager.main = document.getElementById("main");
    DisplayManager.passList = document.getElementsByClassName("passList")[0];
    DisplayManager.getData().then(result => {
        if (result) {
            DisplayManager.createPasswordList();
            DisplayManager.info(0);
        } else {
            return alert("Password loading failed.");
        }
    });
};


DisplayManager.getData = function () {
    return new Promise((resolve, reject) => {
        var url = "./data.json";
        let httpRequest = new XMLHttpRequest(); // asynchronous request
        httpRequest.open("GET", url);
        httpRequest.overrideMimeType('application/json');
        httpRequest.addEventListener("readystatechange", async function () {
            // when the request has completed
            if (this.readyState === this.DONE) {
                try {
                    let object = JSON.parse(this.response);
                    DisplayManager.data = object;
                    return resolve(true);
                } catch (err) {
                    DisplayManager.error(url, err);
                    return resolve(false);
                }
            }
        });
        httpRequest.onerror = function (err) {
            console.error(`${url} failed.\n${err}`);
            DisplayManager.error(url, err);
            return resolve(false);
        };

        httpRequest.send();
    });
};

DisplayManager.createPasswordList = function () {
    DisplayManager.data.list.forEach(
        /**
         * @param {{
         *  "url": URL,
         *  "password": string,
         *  "identification": string
         * }} password 
         * @param {number} id 
         */
        (password, id) => {
            const url = password.url;
            const name = new URL(url).hostname;
            DisplayManager.createPasswordElement(name, url, id);
        });
};

DisplayManager.error = function (file, error) {
    console.error(`[FILE]: ${file}\n[TRACE]: ${error}`);
};

DisplayManager.createPasswordElement = function (name, url, id) {
    if (!DisplayManager.passList) return;
    DisplayManager.passList.children[0].appendChild(DisplayManager.stringToHTML(`<li id="${id}"><button class="passListObject classFlex" onclick="DisplayManager.info(${id})"><img class="passWebIcon"src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16"><p class="passName">${name}</p></button></li>`));
};

DisplayManager.stringToHTML = function (string) {
    let temp = document.createElement('template');
    string = string.trim(); // Never return a space text node as a result
    temp.innerHTML = string;
    return temp.content.firstChild;
};

/**
 * @param {number} timestamp 
 */
DisplayManager.timestampToDate = function (timestamp) { };

DisplayManager.show = function () {
    const passwordInput = document.getElementsByClassName("passwordInput")[0];
    if (!passwordInput) return;
    passwordInput.type = (passwordInput.type == "text" ? "password" : "text");
    const buttonShow = document.getElementsByClassName("show")[0];
    if (!buttonShow) return;
    buttonShow.innerHTML = (buttonShow.innerHTML == "Show" ? "Hide" : "Show");
};

/**
 * @param {number} id 
 */
DisplayManager.info = function (id) {
    const data = DisplayManager.data.list[id];
    const url = data.url;
    const name = new URL(url).hostname;
    const password = data.password;
    const identification = data.identification;

    console.log(data);
    // remove any existing info
    if (document.getElementsByClassName("passInfo")[0]) document.getElementsByClassName("passInfo")[0].remove();
    DisplayManager.main.appendChild(DisplayManager.stringToHTML(`<div class="passInfo">
            <a class="passWebsite classFlex" href="${url}" target="_blank">
                <img class="passWebIcon"
                    src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16">
                <p class="passName">${name}</p>
            </a>
            <div class="passData">
                <div class="classFlex">
                    <p class="passId">Identification: </p>
                    <input class="idInput" type="text" value="${identification}" hidden>
                    <p class="idShow">${identification}</p>
                </div>
                <div class="classFlex">
                    <p class="password">Password:</p>
                    <input class="passwordInput" type="password" value="${password}">
                </div>
            </div>
            <div class="passEdit">
                <button class="passButton delete" onclick="ManageManager.delete(${id})">Delete</button>
                <button class="passButton edit" onclick="ManageManager.edit(${id})">Edit</button>
                <button class="passButton copy" onclick="ManageManager.copy()">Copy</button>
                <button class="passButton show" onclick="DisplayManager.show()">Show</button>
            </div>
        </div>`));
};