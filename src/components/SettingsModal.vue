<template>
  <b-modal id="settings-modal" title="Settings" ok-only>
    <div id="modal-container">
      <section>
        <li class="row p-2">
          <span class="col justify-content-sm-start">
            <span
              v-b-tooltip
              title="Whether a sound should be played when someone buzzes"
            >
              Audio
            </span>
          </span>
          <b-button @click="vxm.muted = !vxm.muted" class="col-12 col-sm-2">
            {{ vxm.muted ? "Unmute" : "Mute" }}
          </b-button>
        </li>
        <li class="row p-2">
          <span class="col justify-content-sm-start">
            <label
              v-b-tooltip
              title="Your real name. This is tied to your points"
              name="realname"
            >
              Real Name
            </label>
          </span>
          <b-input
            :value="vxm.realName"
            @input="updateRealName"
            style="max-width: 75%"
            class="col-12 col-sm-8"
            aria-labelledby="realname"
          />
        </li>
        <li class="row p-2">
          <span class="col justify-content-sm-start">
            <label
              v-b-tooltip
              title="The team you are on. If left blank, you will not be on a team"
              name="team"
            >
              Team
            </label>
          </span>
          <b-input
            :value="vxm.team"
            @input="updateTeam"
            style="max-width: 75%"
            class="col-12 col-sm-8"
            aria-labelledby="team"
          />
        </li>
        <li class="row p-2">
          <b-button class="w-100" @click="vxm.enableDeveloperMode">
            Enter Developer Mode
          </b-button>
        </li>
      </section>
    </div>
  </b-modal>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BuzzerStore, vxm } from "@/store";
import debounce from "lodash.debounce";
import { ProxyWatchers } from "vuex-class-component/dist/interfaces";

@Component
export default class SettingsModal extends Vue {
  get vxm(): ProxyWatchers & BuzzerStore {
    return vxm;
  }

  updateRealName(event: string): void {
    vxm.realName = event.trim();
    if (event.trim().length && vxm.connected) {
      this.debounceReconnect();
    }
  }

  updateTeam(event: string): void {
    vxm.team = event.trim();
    if (event.trim().length && vxm.connected) {
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
<style lang="scss" scoped>
#modal-container > section {
  list-style-type: none;
}

#modal-container span.col {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
