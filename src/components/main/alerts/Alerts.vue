<template>
  <div>
    <Alert v-for="alert in alerts" :alert="alert" :key="alert.id" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import Alert from "./Alert.vue";

@Component({
  components: {
    Alert,
  },
})
export default class Alerts extends Vue {
  get alerts(): typeof vxm.alerts {
    return vxm.alerts;
  }
}
</script>
