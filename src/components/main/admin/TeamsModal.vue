<template>
  <b-modal title="Configure Teams" id="teams-modal" @ok="submitTeams">
    <section>
      Teams
      <ul class="list-group p-2">
        <li
          class="list-group-item row p-2"
          v-for="team in teamsList"
          :key="team"
        >
          <span class="col-10 justify-content-sm-start">
            {{ team }}
          </span>

          <b-button
            class="col-12 col-sm float-right clearfix"
            style="width: auto"
            @click="teamsList = teamsList.filter((item) => item !== team)"
          >
            Remove
          </b-button>
        </li>
        <li class="list-group-item row p-2" style="padding-left: 0 !important">
          <span class="col-10 justify-content-sm-start">
            <b-form-input v-model="newTeam" @keypress.enter="addTeam"> </b-form-input>
          </span>
          <b-button
            class="col-12 col-sm float-right clearfix"
            style="width: auto"
            @click="addTeam"
          >
            Add
          </b-button>
        </li>
      </ul>
    </section>
    <section>
      Users

      <ul class="list-group p-2">
        <li
          class="list-group-item row p-2"
          v-for="user in onlineList"
          :key="user"
        >
          <span class="col-9 justify-content-sm-start">
            {{ user }}
          </span>

          <b-form-select
            class="col-12 col-sm-3 float-right clearfix"
            v-model="newTeams[user]"
            :options="teamOptions"
          >
          </b-form-select>
        </li>
      </ul>
    </section>
  </b-modal>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BuzzerStore, vxm } from "@/store";
import { SendTeamsParameters } from "@/types";
import { ProxyWatchers } from "vuex-class-component/dist/interfaces";

@Component
export default class TeamsModal extends Vue {
  teamsList: string[] = [];

  get teamOptions(): { value: string, text: string}[] {
    let ret = this.teamsList.map((teamOption) => {
      return {
        value: teamOption,
        text: teamOption
      }
    });
    ret.push({ value: "", text: "None" });

    return ret;
  }

  newTeam = "";

  addTeam(): void {
    if (this.newTeam.trim()) {
      this.teamsList.push(this.newTeam);
      this.newTeam = "";
    }
  }

  get vxm(): ProxyWatchers & BuzzerStore {
    return vxm;
  }

  get onlineList(): string[] {
    return vxm.onlineList.map((user) => user.name);
  }

  newTeams: Record<string, string> = {};

  /**
   * Submits the teams to the server
   */
  submitTeams(): void {
    let data: SendTeamsParameters = {
      users: Object.entries(this.newTeams)
        .filter((opt) => opt[1])
        .map((user) => {
          return { name: user[0], team: user[1] };
        }),
    };

    vxm.sendCommand({ type: "teams", parameters: data });
  }
}
</script>
<style lang="scss" scoped>
#teams-modal li.list-group-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
