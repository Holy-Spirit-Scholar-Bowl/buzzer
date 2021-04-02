<template>
  <main id="main">
    <button
      class="btn btn-primary d-inline btn-sm align-baseline col-md"
      @click="vxm.connect(false)"
      v-if="!vxm.connected"
    >
      Connect
    </button>
    <button
      class="btn btn-primary d-inline btn-sm align-baseline col-md"
      @click="vxm.disconnect()"
      v-else
    >
      Disconnect
    </button>
    <button
      class="btn btn-primary d-inline btn-sm align-baseline mt-2 mb-3 col-md"
      @click="vxm.connect(true)"
      v-b-tooltip.hover
      title="Connect as a host; the host can clear buzzes"
      v-if="!vxm.connected"
    >
      Connect as host
    </button>
    <button
      class="btn btn-primary d-inline btn-sm align-baseline col-md mt-2 mb-3"
      @click="reconnect"
      v-else
    >
      Reconnect
    </button>
    <button
      @click="vxm.buzz"
      class="btn btn-secondary btn-lg w-100 mb-3"
      v-show="vxm.connected"
    >
      Buzz
    </button>
    <button
      @click="vxm.clear"
      class="btn btn-secondary btn-lg w-100 mb-3"
      v-if="isHost"
      v-show="vxm.connected"
    >
      Clear
    </button>
    <b-form-input
      v-model="message"
      @keypress.enter="send"
      placeholder="Send a chat message..."
      v-show="vxm.connected"
    />
    <AdminPanel />
    <DeveloperPanel />
    <OnlineList />
    <Alerts class="sticky-bottom mb-5 pb-5" />
    <audio src="@/assets/buzz.mp3" id="buzzerAudio"></audio>
  </main>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { BuzzerStore, vxm } from "@/store";
import Alerts from "@/components/main/alerts/Alerts.vue";
import debounce from "lodash.debounce";
import OnlineList from "@/components/main/OnlineList.vue";
import AdminPanel from "@/components/main/admin/AdminPanel.vue";
import DeveloperPanel from "@/components/main/admin/DeveloperPanel.vue";
import { ProxyWatchers } from "vuex-class-component/dist/interfaces";

@Component({
  components: {
    Alerts,
    OnlineList,
    AdminPanel,
    DeveloperPanel
  },
})
export default class Main extends Vue {
  get isHost(): boolean {
    return vxm.host === vxm.name;
  }

  message = "";

  send(): void {
    if (!this.message.trim()) return;
    vxm.chat(this.message);
    this.message = "";
  }

  makeHost(user: string): void {
    vxm.makeHost(user);
    vxm.addAlert("You are no longer the host");
  }

  get vxm(): ProxyWatchers & BuzzerStore {
    return vxm;
  }

  updateName(event: string): void {
    vxm.name = event;
    if (!event.includes(",") && event.trim().length) this.debounceReconnect();
  }

  debounceReconnect = debounce(this.reconnect, 500);

  connect(host = false): void {
    vxm.connect(host);
  }

  async reconnect(): Promise<void> {
    let currentlyIsHost = this.isHost;
    await vxm.disconnect();
    await vxm.connect(currentlyIsHost);
  }
}
</script>
