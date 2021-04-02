<template>
  <div class="my-3" v-show="vxm.name === vxm.host || vxm.developerMode && vxm.connected">
    <h4>Host Options</h4>
    <b-button @click="vxm.resetPoints()">Reset Scoreboard</b-button>
    <br>
    <b-button v-b-modal.teams-modal class="mt-2">Configure Teams</b-button>
    <teams-modal />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BuzzerStore, vxm } from "@/store";
import TeamsModal from "./TeamsModal.vue";
import { ProxyWatchers } from "vuex-class-component/dist/interfaces";

@Component({
  components: {
    TeamsModal
  }
})
export default class AdminPanel extends Vue {
  get vxm(): ProxyWatchers & BuzzerStore {
    return vxm;
  }
}
</script>
