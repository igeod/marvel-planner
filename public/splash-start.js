// Splash on the first load of a session; later loads only run the intro. The fallback frees the
// page if the bundle never starts.
(function () {
  var d = document.documentElement;
  var seen = false;
  try {
    seen = sessionStorage.getItem("splash-seen") === "1";
  } catch (e) {}
  if (seen) {
    d.dataset.intro = "";
    setTimeout(function () {
      delete d.dataset.intro;
    }, 450);
    return;
  }
  d.dataset.splash = "on";
  d.dataset.splashStart = String(performance.now());
  d.dataset.splashFallback = String(
    setTimeout(function () {
      var r = document.getElementById("root");
      if (r) r.inert = false;
      delete d.dataset.splash;
    }, 6000),
  );
})();
