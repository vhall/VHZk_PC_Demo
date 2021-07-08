<template>
    <div id="app">
      <router-view></router-view>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    })
  },
  provide () {
    return {
      upLoadBuyPoint: this.upLoadBuyPoint
    }
  },
  methods: {
    upLoadBuyPoint (key, name) {
      if (!key || !name) {
        console.error(`upLoadBuyPoint方法参数不全: key=${key}, name=${name}`)
        return
      }
      try {
        this.$vhall_paas_port({
          k: key,
          data: {
            business_uid: this.loginInfo.business_user_id,
            user_id: this.loginInfo.user_id,
            s: this.loginInfo.session_id || '',
            report_extra: {
              page_name: encodeURIComponent(name)
            },
            ref_url: '',
            req_url: window.location.href
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  min-width: 1100px;
  overflow: hidden;
}
</style>
