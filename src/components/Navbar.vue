<template>
  <b-navbar
    toggleable="lg"
    variant="secondary"
    class="text-white"
    :sticky="true"
  >
    <b-navbar-brand><router-link to="/">Home</router-link></b-navbar-brand>
    <b-navbar-toggle class="bg-primary" target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item
          ><router-link to="/about">How it works</router-link></b-nav-item
        >
        <b-nav-item
          ><router-link to="/changelog">Changelog</router-link></b-nav-item
        >
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <button class="btn btn-primary w-auto" v-b-modal.settings-modal>
          Customize
        </button>
        <b-nav-form class="ml-lg-4">
          <label for="username">Your name is</label>
          <pre> </pre>
          <b-form-input
            size="sm"
            class="mr-sm-2"
            :value="vxm.name"
            @input="updateName"
            placeholder="Anonymous"
            id="username"
          >
          </b-form-input>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BuzzerStore, vxm } from "@/store";
import debounce from "lodash.debounce";
import { ProxyWatchers } from "vuex-class-component/dist/interfaces";

@Component
export default class Navbar extends Vue {
  get vxm(): ProxyWatchers & BuzzerStore {
    return vxm;
  }

  updateName(event: string): void {
    vxm.name = event.trim();
    if (!event.includes(",") && event.trim().length && vxm.connected) {
      this.debounceReconnect();
    }
  }

  debounceReconnect = debounce(this.reconnect, 1000);

  async reconnect(): Promise<void> {
    let currentlyIsHost = vxm.name === vxm.host;
    await vxm.disconnect();
    await vxm.connect(currentlyIsHost);
  }
}
</script>
