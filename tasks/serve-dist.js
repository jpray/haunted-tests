var browserSync = require("browser-sync").create();

browserSync.init({
    server: "./dist"
}, () => {});
