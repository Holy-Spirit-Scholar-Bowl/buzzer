<template>
    <b-modal
        v-model="vxm.showPrivacyPolicy"
        title="Privacy Policy"
        ok-only
        :ok-title="finalItem ? 'OK' : 'Next'"
        @ok="forward"
        ref="privacyPolicyModal"
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
        :ok-disabled="disableOK"
    > 
        {{ privacyPolicy[currentItem] }}
    </b-modal>
</template>
<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator"
import { BuzzerStore, vxm } from "@/store"
import { ProxyWatchers } from "vuex-class-component/dist/interfaces"
import { BModal } from "bootstrap-vue";
import debounce from "lodash.debounce"

@Component
export default class PrivacyPolicyModal extends Vue {
    get vxm(): ProxyWatchers & BuzzerStore {
        return vxm;
    }

    readonly privacyPolicy = [
        "Please read through the privacy policy. It won't take long, I promise.",
        "I (the site) don't collect much data.",
        "When you use the buzzer system, I inform the server so that it works properly.",
        "If I don't do this, there's no buzzer system.",
        "That data isn't stored and isn't linked to you.",
        "I also keep your name, real name, and team saved on your device.",
        "That way, you don't have to type it in each time you visit.",
        "And that's all I collect.",
        "Your data is never sold or given away.",
        "Plus, no cookies or analytics.",
        "Thanks for reading and enjoy the site!"
    ]

    currentItem = 0

    get finalItem(): boolean {
        return this.currentItem === this.privacyPolicy.length - 1
    }

    disableOK = true

    forward(event: MouseEvent): void {
        if (this.finalItem) {
            vxm.readPrivacyPolicy()
            return
        }
        event.preventDefault()
        this.currentItem++
        this.disableOK = localStorage.seenPrivacyPolicy !== "true"
        this.showOK()
    }

    showOK = debounce(this.showOk, 1000, {
        leading: false,
        trailing: true
    });

    showOk(): void {
        this.disableOK = false
    }

    @Ref("privacyPolicyModal") privacyPolicyModal!: BModal

    created(): void {
        this.showOK()
    }
}
</script>