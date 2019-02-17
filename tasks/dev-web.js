const Bundler = require("parcel-bundler");
const Path = require("path");
var browserSync = require("browser-sync").create();

const entryFiles = Path.join(__dirname, "../src/_html-web/*.html");

const options = {
  outDir: "./dist",
  publicUrl: '.',
  watch: true,
  cache: true,
  cacheDir: ".cache",
  minify: false,
  target: "browser",
  https: false,
  logLevel: 3,
  hmr: false,
  sourceMaps: true,
  detailedReport: false,
  autoinstall: false
};

const bundler = new Bundler(entryFiles, options);

bundler.on("bundled", () => {
  browserSync.init({
    server: "./dist"
  }, () => {});
});

bundler.on("buildEnd", () => {
  browserSync.reload();
});

bundler.bundle();
