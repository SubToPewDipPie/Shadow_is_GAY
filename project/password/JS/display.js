function DisplayManager() {
    throw new Error("This is a static class.");
}

DisplayManager.data = {};
// it will be null until initialisation
DisplayManager.container = document.getElementById("container");
DisplayManager.passList = document.getElementsByClassName("passList")[0];

DisplayManager.initialisation = async function () {
    DisplayManager.container = document.getElementById("container");
    DisplayManager.passList = document.getElementsByClassName("passList")[0];
    DisplayManager.getData().then(result => {
        if (result) {
            DisplayManager.createPasswordList();
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
         *  "username": string | null,
         *  "email": string | null,
         *  "phone": number,
         *  "login": 0 | 1 | 2
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
    DisplayManager.passList.children[0].appendChild(DisplayManager.stringToHTML(`<li><button class="passListObject classFlex" onclick="DisplayManager.show(${id})"><img class="passWebIcon"src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16"><p class="passName">${name}</p></button></li>`));
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

/**
 * @param {number} id 
 */
DisplayManager.show = function (id) {
    console.log(DisplayManager.data.list[id]);
};