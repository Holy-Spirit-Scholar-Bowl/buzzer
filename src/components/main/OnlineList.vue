<template>
  <div class="my-3" v-show="vxm.connected">
    <h4>Online</h4>
    <b-list-group>
      <b-list-group-item
        v-for="{ name, points} in vxm.onlineList"
        :key="name"
        :active="vxm.activeBuzzer === name"
      >
        <span class="align-middle">
          <span v-b-tooltip.hover :title="`${name} is the host`">{{
            vxm.host === name ? "◆" : ""
          }}</span>
          {{ name }}
        </span>
        <span class="float-right ml-2 pt-1">
          <span>{{ points }} points</span>
        </span>
        <b-button-group size="sm" class="ml-2 float-right" v-if="isHost || vxm.developerMode">
          <b-button
            class="host-action"
            variant="success"
            v-if="vxm.host !== name"
            @click="vxm.makeHost(name)"
            >Make Host</b-button
          >
          <b-button
            class="host-action"
            variant="danger"
            v-if="vxm.name !== name"
            @click="vxm.kick(name)"
            >Kick</b-button
          >
        </b-button-group>
        <b-button-group
          size="sm"
          class="ml-2 float-right"
          v-if="vxm.activeBuzzer === name && isHost && vxm.answerBanner"
        >
          <b-button
            variant="info"
            class="host-action"
            @click="setAnswer(true, false)"
            >Correct</b-button
          >
          <b-button
            variant="success"
            class="host-action"
            @click="setAnswer(true, true)"
            >Power</b-button
          >
          <b-button
            variant="warning"
            class="host-action"
            @click="setAnswer(false, false)"
            >Incorrect</b-button
          >
          <b-button
            variant="danger"
            class="host-action"
            @click="setAnswer(false, true)"
            >Neg</b-button
          >
        </b-button-group>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BuzzerStore, vxm } from "@/store";
import { ProxyWatchers } from "vuex-class-component/dist/interfaces";

@Component
export default class OnlineList extends Vue {
  get vxm(): ProxyWatchers & BuzzerStore {
    return vxm;
  }

  get isHost(): boolean {
    return vxm.host === vxm.name;
  }

  setAnswer(correct: boolean, powerOrNeg: boolean): void {
    vxm.answerIs({ correct, powerOrNeg });
    vxm.clear();
  }
}
</script>
