const SCRIPT_PATH = document.currentScript.src;
class ConfigForm {
  static FORM_HTML = `\
    <form id="configForm" method="get">
      <label>name:</label>
      <input type="text" name="name" required /><br />
      <label>url:</label>
      <input type="url" name="url" required /><br />
      <label>icon url:</label>
      <input type="url" name="icon_url" required /><br />
      <label>display:</label>
      <select name="display" required>
        <option>standalone</option>
        <option>fullscreen</option>
        <option>minimal-ui</option>
        <option>browser</option></select
      ><br />
      <label>Copy to use:</label>
      <input
        type="number"
        name="copy_number"
        min="0"
        max="99"
        value="0"
        required
      /><br />
      <input type="submit" />
    </form>
    `;

  static get_target_action(copy_number) {
    function is_the_same_dir() {
      const currentDir = new URL(window.location.href).pathname;
      let scriptDir = new URL(SCRIPT_PATH).pathname;
      scriptDir = scriptDir.substring(0, scriptDir.lastIndexOf("/") + 1);
      return currentDir.startsWith(scriptDir);
    }

    if (is_the_same_dir()) {
      return `../${copy_number}`;
    } else {
      return `./copy/${copy_number}`;
    }
  }

  _configure_form(form) {
    form.addEventListener("submit", function (e) {
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "redirect";
      hiddenInput.value = "false";
      form.appendChild(hiddenInput);

      const data = new FormData(e.target);
      e.target.action = ConfigForm.get_target_action(data.get("copy_number"));
    });
    return form;
  }

  static add_form() {
    const form_container = document.createElement("div");
    form_container.id = "form_container";

    form_container.innerHTML = this.FORM_HTML;
    const form_element = form_container.querySelector("#configForm");
    return new ConfigForm(form_element, form_container);
  }

  constructor(form_element, form_container) {
    this.form_element = this._configure_form(form_element);

    this.form_container = form_container;
  }

  show() {
    document.body.appendChild(this.form_container);
    return this;
  }

  set_values(config) {
    this.form_element.querySelector('[name="name"]').value = config.name;
    this.form_element.querySelector('[name="url"]').value = config.url;
    this.form_element.querySelector('[name="icon_url"]').value =
      config.icon_url;
    this.form_element.querySelector('[name="display"]').value = config.display;
    this.form_element.querySelector('[name="copy_number"]').value =
      config.copy_number;
    return this;
  }
}

class Config {
  _get_redirection_url() {
    const url = new URL(this.currentUrl);
    url.searchParams.set("redirect", "true");
    return url.toString();
  }
  static simpleHash(str, base = 1289, mod = 10 ** 9 + 7) {
    let hash = 0;
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);

      hash = (hash * base + char) % mod;
    }
    return hash.toString(16);
  }
  _get_id(url) {
    return Config.simpleHash(encodeURIComponent(url));
  }
  _get_manifest() {
    return {
      name: this.name,
      id: this.id,
      display: this.display,
      start_url: this.redirection_url,
      icons: [
        {
          src: this.icon_url,
          sizes: "any",
        },
      ],
    };
  }
  constructor() {
    this.currentUrl = window.location.href;

    const params = new URLSearchParams(new URL(this.currentUrl).search);

    this.name = params.get("name");
    this.url = params.get("url");
    this.icon_url = params.get("icon_url");
    this.display = params.get("display");
    this.copy_number = parseInt(params.get("copy_number"), 10);
    this.redirect = params.get("redirect") === "true";

    this.redirection_url = this._get_redirection_url();
    this.id = this._get_id(this.redirection_url);

    this.manifest = this._get_manifest();
  }

  set_manifest() {
    const link = document.createElement("link");
    link.rel = "manifest";
    const b64manifest = btoa(JSON.stringify(this.manifest));
    link.href = "data:application/json;base64," + b64manifest;
    document.head.appendChild(link);
  }
  set_icon() {
    const faviconElement = document.getElementById("favicon");
    faviconElement.href = this.icon_url;
  }
  set_title() {
    document.title = this.name;
  }

  set_common() {
    this.set_title();
    this.set_icon();
    this.set_manifest();
  }

  do_redirect() {
    window.location.replace(this.url);
  }

  show_manifest() {
    function addJson(name, content) {
      const preElement = document.createElement("pre");
      preElement.id = name;
      preElement.textContent = JSON.stringify(content, null, 2);
      document.body.appendChild(preElement);
    }
    addJson("manifest", this.manifest);
  }
  do_rest() {
    if (this.redirect) {
      this.redirect();
    } else {
      this.config_form = ConfigForm.add_form().set_values(this).show();
      this.show_manifest();
    }
  }
  do_all() {
    this.set_common();
    if (this.redirect) {
      this.do_redirect();
    } else {
      this.do_rest();
    }
    return this;
  }
}

function form_main() {
  ConfigForm.add_form().show();
}

function pwa_main() {
  new Config().do_all();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
