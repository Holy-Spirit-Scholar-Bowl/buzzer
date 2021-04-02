<template>
  <main>
    <b-card
      v-for="item in changelog"
      :key="item.version"
      tag="article"
      class="mb-5"
    >
      <b-card-body>
        <b-card-title>{{ item.header }}</b-card-title>
        <b-card-sub-title>{{ item.version }}</b-card-sub-title>
        <b-card-text>
          {{ item.body }}
        </b-card-text>
        <b-list-group class="mb-2">
          <b-list-group-item v-for="change in item.items" :key="change">
            {{ change }}
          </b-list-group-item>
        </b-list-group>
        <b-card-text
          class="text-muted"
          text-tag="time"
          :datetime="`${item.date.month}/${item.date.day}/${item.date.year}`"
        >
          {{ `${item.date.month}/${item.date.day}/${item.date.year}` }}
        </b-card-text>
      </b-card-body>
    </b-card>
  </main>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import { ChangelogItem } from "@/types";

@Component
export default class Changelog extends Vue {
  get changelog(): ChangelogItem[] {
    return vxm.changelog;
  }
}
</script>
