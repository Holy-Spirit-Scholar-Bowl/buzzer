<template>
  <div class="my-3" v-show="vxm.connected">
    <h4>Online</h4>
    <b-list-group>
      <OnlineListItem v-for="user in vxm.onlineList.users" :key="user.user" :name="user.user" :points="user.points" />
      <b-list-group-item v-for="team in vxm.onlineList.teams" :key="team.team">
        <span class="mb-2">
          {{ team.team }}
          <span class="float-right ml-2 pt-1">
            <span>{{ team.points }} points</span>
          </span>
        </span>
        <div class="mb-3"></div>
        <OnlineListItem v-for="user in team.users" :key="user.user" :name="user.user" :points="user.points" />
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BuzzerStore, vxm } from "@/store";
import { ProxyWatchers } from "vuex-class-component/dist/interfaces";
import OnlineListItem from "./OnlineListItem.vue";

@Component({
  components: {
    OnlineListItem
  }
})
export default class OnlineList extends Vue {
  get vxm(): ProxyWatchers & BuzzerStore {
    return vxm;
  }
}
</script>
