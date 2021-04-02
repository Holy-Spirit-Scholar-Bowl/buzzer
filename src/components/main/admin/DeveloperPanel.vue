<template>
  <div class="my-3" v-show="vxm.developerMode && vxm.connected">
    <h4>Developer</h4>
    <section>
      Set the points of 
      <b-form-select :options="vxm.onlineList.map(user => user.name)" style="width: auto" v-model="newPointsName"/>
      to
      <b-form-input type="number" v-model="newPoints" @keypress.enter="setPoints(newPointsName, newPoints)" style="width: auto" class="d-inline-block"/>
    </section>
    <section class="mt-2">
      Send command of type
      <b-form-select :options="availableCommands" style="width: auto" v-model="cmdTypes" />
      with parameters
      <b-form-input :state="isValidJSON(cmdParamsStr)" v-model="cmdParamsStr" class="d-inline-block w-auto" @keypress.native.enter="sendCommand" trim />
    </section>
    <section class="mt-2">
      <b-button @click="restartServer">
        Restart server
      </b-button>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { BuzzerStore, vxm } from "@/store";
import { ProxyWatchers } from "vuex-class-component/dist/interfaces";
import { SendCommands } from "@/types";

@Component({
  components: {
  }
})
export default class DeveloperPanel extends Vue {
  get vxm(): ProxyWatchers & BuzzerStore {
    return vxm;
  }

  setPoints(name: string, points: string | number): void {
    vxm.sendCommand({ type: "points", parameters: { name, points: parseInt(points.toString(), 10) }});
  }

  newPoints = 0;
  newPointsName = "";

  @Watch("newPointsName")
  updatePointsField(): void {
    let user = vxm.onlineList.find(e => e.name === this.newPointsName);
    if (user) {
      this.newPoints = user.points
    }
  }

  restartServer(): void {
    vxm.sendCommand({ type: "restart", parameters: null });
  }

  cmdTypes: keyof typeof SendCommands = SendCommands.ans;

  get availableCommands(): string[] {
    return Object.values(SendCommands);
  }

  /**
  * Sets the parameters field to a sensible default when the command type is changed
  */
  @Watch("cmdTypes")
  updateParamsTemplate(): void {
    let templates: Record<keyof typeof SendCommands, string | string[] | null | Record<string, string[]>> = {
      reset: null,
      clear: null,
      restart: null,
      kick: "name",
      name: null,
      host: "host",
      ans: ["correct", "powerOrNeg"],
      buzz: "buzzer",
      chat: "message",
      teams: {
        "users": ["name", "points"]
      },
      points: ["name", "points"]
    }

    let template = templates[this.cmdTypes];

    if (template === null) {
      this.cmdParamsStr = "null";
      return;
    }

    if (Array.isArray(template)) {
      this.cmdParamsStr = "{ "
      this.cmdParamsStr += template.map((field) => `"${field}": `).join();
      this.cmdParamsStr += "}"
      return;
    }

    if (typeof template === "string") {
      this.cmdParamsStr = `{ "${template}": }`;
      return;
    }

    if (typeof template === "object") {
      this.cmdParamsStr = "{ "
      for (let [key, value] of Object.entries(template)) {
        this.cmdParamsStr += `"${key}": [ `
        this.cmdParamsStr += value.map((val) => `"${val}": `).join(", ");
        this.cmdParamsStr += "] "
      }
      this.cmdParamsStr += "}"
      return;
    }

    this.cmdParamsStr = "";
  }

  cmdParamsStr = "";

  /**
   * @returns whether the string was valid JSON
   */
  isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Sends the custom command
   */
  sendCommand(): void {
    if (!this.isValidJSON(this.cmdParamsStr)) {
      vxm.addAlert("Invalid JSON");
      return
    }

    let paramsObj = JSON.parse(this.cmdParamsStr);
    vxm.sendCommand({ type: this.cmdTypes, parameters: paramsObj });
  }
}
</script>
