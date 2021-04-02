<template>
  <b-alert show="5" fade dismissible @dismissed="remove(alert)">
    <div class="row">
      <div class="col-auto">{{ alert.message }}</div>
      <div class="col text-sm-right">{{ timePassed }} seconds ago</div>
    </div>
  </b-alert>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { Alert as AlertData } from "@/types";

@Component
export default class Alert extends Vue {
  @Prop({ required: true }) alert!: AlertData;

  remove(alert: AlertData): void {
    vxm.removeAlert(alert);
  }

  created(): void {
    setInterval(this.refresh, 100);
  }

  refresh(): void {
    this.currentTime = new Date();
  }

  currentTime: Date = new Date();

  /**
   * @returns seconds passed since the alert was created
   */
  get timePassed(): number {
    let offsetMilliseconds =
      this.currentTime.valueOf() - this.alert.time.valueOf();
    return Math.floor(offsetMilliseconds / 1000);
  }
}
</script>
