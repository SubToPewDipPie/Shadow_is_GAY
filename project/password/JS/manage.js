function ManageManager() {
    throw new Error("This is a static class.");
}

ManageManager.show = function (id) {
    console.log(DisplayManager.data.list[id]);
};
