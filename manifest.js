function getUrl() {
  return window.location.href.replace("/create.html?", "/pwa.html?");
}
function getId(url) {
  return btoa(encodeURIComponent(getUrl()));
}
function getManifest(name, url, icon_url) {
  return {
    name: name,
    id: getId(url),
    display: "standalone",
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
  };
}
function showManifest(manifest) {
  const jsonString = JSON.stringify(manifest, null, 2);

  const preElement = document.createElement("pre");
  preElement.id = "manifest_json";
  preElement.textContent = jsonString;

  document.body.appendChild(preElement);
}
function setAll({ name: name, url: url, icon_url: icon_url }, redirect) {
  console.log({ name: name, url: url, icon_url: icon_url });
  setTitle(name);
  setIcon(icon_url);
  const manifest = getManifest(name, url, icon_url);
  setManifest(manifest);
  if (redirect) {
    window.location.replace(url);
  } else {
    showManifest(manifest);
  }
}
