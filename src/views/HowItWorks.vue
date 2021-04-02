<template>
  <div>
    <ol class="list-group">
      <li>
        You connect to the server. You tell it your name and it tells you and
        others information about the connection.
        <details>
          <summary>Details</summary>
          When you connect, the server asks for you name by sending
          <code>NAME</code>. You respond by sending
          <code>NAME &lt;your_name&gt;</code> (if you're the host, it looks like
          <code>NAME &lt;your_name&gt; HOST</code>). If someone else is using
          that name, the server sends <code>NAME_IN_USE</code> and closes the
          connection. If the name is valid, the server send
          <code>SUCCESS</code>. It immediately sends a
          <code>HOST &lt;name_of_host&gt;</code> message to tell you who the
          host is. It also updates the online list and sends an
          <code>ONLINE &lt;name_one&gt;,&lt;name_two&gt;...</code> message to
          everyone to let them know the user list has updated.<br />
        </details>
      </li>
      <li>
        When you buzz or clear, the server receives the message and echoes it to
        everyone else
        <details>
          <summary>Details</summary>
          Buzz messages are sent as <code>BUZZ &lt;name_of_buzzer&gt;</code
          ><br />
          Clear messages are sent as <code>CLEAR</code><br />
          The server relays these messages to everyone connected except you, to
          avoid infinite loops (those are never fun)
        </details>
      </li>
      <li>
        There are two ways users can be made host - either when they connect or
        when a host makes them the host
        <details>
          <summary>Details</summary>
          During connection, users can connect as a host by adding the
          <code>HOST</code> option the the <code>NAME</code> command Host
          messages are sent as <code>HOST &lt;new_host&gt;</code><br />
          The server sends this to everyone except you.
        </details>
      </li>
      <li>
        When you disconnect, the server updates the online list
        <details>
          <summary>Details</summary>
          That's all there is. All the code that handles this logic below, under
          Server and Client logic.
        </details>
      </li>
    </ol>
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
    <a class="text-secondary" href="https://github.com/hsscholarbowl">GitHub</a>
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
        `https://raw.githubusercontent.com/hsscholarbowl/hssb/master/${path}`;
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
      "https://raw.githubusercontent.com/hsscholarbowl/server/master/index.ts"
    );
  }
}
</script>
