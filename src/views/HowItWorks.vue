<template>
  <div>
    <p>
      Please see the <a href="https://github.com/Holy-Spirit-Scholar-Bowl/buzzer/blob/main/docs.md">documentation</a> or the code below.
    </p>
    <br />
    <h4>See the full code</h4>
    <details>
      <summary>Server</summary>
      <pre><code id="server-inject"></code></pre>
    </details>
    <details>
      <summary>Client logic</summary>
      <pre><code id="store-inject"></code></pre>
    </details>
    <details>
      <summary>App code</summary>
      <pre><code id="app-inject"></code></pre>
    </details>
    <details>
      <summary>Routing</summary>
      This controls what you see. It allows you to navigate pages without
      reloading
      <pre><code id="router-inject"></code></pre>
    </details>
    <details>
      <summary>Main view</summary>
      <pre><code id="main-inject"></code></pre>
    </details>
    <details>
      <summary>Alerts</summary>
      <pre><code id="alerts-inject"></code></pre>
    </details>
    <details>
      <summary>Footer</summary>
      <pre><code id="footer-inject"></code></pre>
    </details>
    <details>
      <summary>Navbar</summary>
      <pre><code id="navbar-inject"></code></pre>
    </details>
    <details>
      <summary>Stylesheet</summary>
      <pre><code id="stylesheet-inject"></code></pre>
    </details>
    <details>
      <summary>Deploy script</summary>
      <pre><code id="deploy-inject"></code></pre>
    </details>
    Still not enough code? See the full source for the website and server on
    <a class="text-secondary" href="https://github.com/Holy-Spirit-Scholar-Bowl">GitHub</a>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HowItWorks extends Vue {
  mounted(): void {
    let inject = (elementID: string, path: string, specialURL?: string) => {
      let el = document.getElementById(elementID);
      let url =
        specialURL ??
        `https://raw.githubusercontent.com/Holy-Spirit-Scholar-Bowl/buzzer/main/${path}`;
      fetch(url)
        .then((data) => data.text())
        .then((text) => {
          if (!el) {
            console.error(`No element found with id ${elementID}`);
            return;
          }
          el.innerText = text;
        });
    };
    let files = [
      { id: "store-inject", path: "src/store/index.ts" },
      { id: "deploy-inject", path: "scripts/gh-pages-deploy.js" },
      { id: "stylesheet-inject", path: "src/styles/custom.scss" },
      { id: "navbar-inject", path: "src/components/Navbar.vue" },
      { id: "footer-inject", path: "src/components/Footer.vue" },
      { id: "main-inject", path: "src/views/Main.vue" },
      { id: "alerts-inject", path: "src/views/Alerts.vue" },
      { id: "app-inject", path: "src/App.vue" },
      { id: "router-inject", path: "src/router/index.ts" },
    ];
    for (let file of files) {
      inject(file.id, file.path);
    }
    inject(
      "server-inject",
      "",
      "https://raw.githubusercontent.com/Holy-Spirit-Scholar-Bowl/server/main/index.ts"
    );
  }
}
</script>
