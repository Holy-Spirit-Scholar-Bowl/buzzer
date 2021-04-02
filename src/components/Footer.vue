<template>
  <footer
    class="w-100 bg-secondary text-white p-2 mt-3 row no-gutters"
    id="footer"
  >
    <div class="w-100">
      HS Scholar Bowl
      <router-link class="text-primary font-sm align-center d-inline-block" to="/changelog">
        {{ changelogVersion }}
      </router-link>

      <a
        v-for="[urlending, name] in [
          ['', 'GitHub'],
          ['/buzzer', 'Code'],
          ['/server', 'Server'],
        ]"
        :key="name"
        :href="`https://github.com/Holy-Spirit-Scholar-Bowl${urlending}`"
        class="float-right ml-4"
      >
        {{ name }}
      </a>
    </div>
  </footer>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class Footer extends Vue {
  get changelogVersion(): string {
    return vxm.changelogVersion;
  }
}
</script>