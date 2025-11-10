function getUrl() {
  return window.location.href.replace("/create.html?", "/pwa.html?");
}
function getId(url) {
  return btoa(encodeURIComponent(getUrl()));
}
function getManifest(name, url, icon_url, display) {
  return {
    name: name,
    id: getId(url),
    display: display,
    start_url: getUrl(url),
    icons: [
      {
        src: icon_url,
        sizes: "any",
      },
    ],
  };
}
function setManifest(manifest) {
  const link = document.createElement("link");
  link.rel = "manifest";
  const b64manifest = btoa(JSON.stringify(manifest));
  link.href = "data:application/json;base64," + b64manifest;
  document.head.appendChild(link);
}
function setIcon(icon_url) {
  const faviconElement = document.getElementById("favicon");
  faviconElement.href = icon_url;
}
function setTitle(title) {
  document.title = title;
}
function getAll() {
  const params = new URLSearchParams(window.location.search);
  return {
    name: params.get("name"),
    url: params.get("url"),
    icon_url: params.get("icon_url"),
    display: params.get("display"),
  };
}
function addJson(name, content) {
  const preElement = document.createElement("pre");
  preElement.id = name;
  preElement.textContent = JSON.stringify(content, null, 2);
  document.body.appendChild(preElement);
}
function showManifest(config, manifest) {
  addJson("config", config);
  addJson("manifest", manifest);
}
function setAll(config, redirect) {
  setTitle(config.name);
  setIcon(config.icon_url);
  const manifest = getManifest(
    config.name,
    config.url,
    config.icon_url,
    config.display
  );
  setManifest(manifest);
  if (redirect) {
    window.location.replace(config.url);
  } else {
    showManifest(config, manifest);
  }
}
