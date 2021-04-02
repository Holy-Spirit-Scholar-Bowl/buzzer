<template>
  <div id="app" class="h-100">
    <router-link to="#main" class="skiplink" @click.native="scrollFix('#main')"
      >Skip to content</router-link
    >
    <Navbar />
    <div class="container pt-3" id="content">
      <h2 v-if="showName">{{ location }}</h2>
      <RouterView />
      <SettingsModal />
    </div>
    <Footer />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import BootstrapVue from "bootstrap-vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import SettingsModal from "@/components/SettingsModal.vue";
import "nprogress/nprogress.css";

Vue.use(BootstrapVue);

@Component({
  components: {
    Navbar,
    Footer,
    SettingsModal,
  },
})
export default class App extends Vue {
  mounted(): void {
    document.title = "HS Scholar Bowl";
    vxm.name = (localStorage.hasName ?? "Anonymous").replace(/"(.*?)"/, "$1");
    vxm.realName = localStorage.realName ?? "Anonymous" + Math.floor(Math.random() * 100);
    vxm.team = localStorage.team ?? "";
  }

  scrollFix(hashbang: string): void {
    window.location.hash = hashbang;
  }

  get showName(): boolean {
    return !["Main"].includes(this.location);
  }

  get location(): string {
    let { name } = this.$route;
    return name ?? "";
  }
}
</script>
<style lang="scss">
@import "@/styles/global.scss";
</style>
<style scoped lang="scss">
@import "@/styles/global.scss";
.skiplink {
  background-color: $primary;
  padding: 3px 6px;
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  border: 0 none;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  width: 1px;
  color: $secondary;
  box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.75);
  z-index: 2;
}
.skiplink:focus {
  clip: auto;
  height: auto;
  position: fixed;
  width: auto;
}
.skiplink:focus:hover {
  color: $dark;
}
#app {
  display: flex;
  flex-direction: column;
}
#content {
  flex: 1 0 auto;
}
#footer {
  flex-shrink: 0;
}
</style>
