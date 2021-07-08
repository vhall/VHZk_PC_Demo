<template>
  <div class="rank-menu">
    <div class="rank-tabs-container tl-c">
      <rank-tabs v-model="rankType" :types="rankTypes" />
    </div>
    <div class="rank-list-container">
      <div class="rank-list" v-for="(rankList, key) in rankMap" :key="key">
        <div v-show="key == rankType">
          <div v-for="item of rankList" :key="item.id">
            <rank-item
              :rank-type="key"
              :ranking="item.rank"
              :rank-item="item"
            />
          </div>
          <div v-if="!rankList.length" class="empty">
            <img class="img" :src="require('assets/image/no-data.png')" />
            <span class="img-sub">暂无数据</span>
          </div>
          <my-rank
            :rank-type="key"
            :rank-item="myRankMap[key]"
            v-if="myRankMap[key]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { RankListTool } from 'src/utils/ConfigTool'
import rankItem from 'src/pages/hudong/rank-list/rank-item'
import myRank from 'src/pages/hudong/rank-list/my-rank'
import rankTabs from 'src/pages/hudong/rank-list/rank-tabs'
import { mapState } from 'vuex'
export default {
  name: 'rank-menu',
  components: {
    rankItem,
    myRank,
    rankTabs
  },
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  watch: {
    rankType(type) {
      if (!type) return false
      this.getRankList(type)
      if (this.loginInfo && this.loginInfo.mobile) {
        this.getMyRank(type)
      }
    }
  },
  async created() {
    await this.getMenuRank()
    const typeListTemp = Object.keys(this.rankMap)
    this.rankType = typeListTemp.length ? typeListTemp[0] : ''
  },
  data() {
    return {
      rankType: '',
      rankMap: {},
      myRankMap: {}
    }
  },
  methods: {
    getRankTypeTitle(key) {
      return RankListTool[key]
    },
    // 初始化获取可显示菜单
    async getMenuRank() {
      return window.VHALL_ZK.$api.getRankMenuList(this.menu.menu_id).then((res) => {
        if (res.code === 200) {
          res.data.rank.forEach((rank) => {
            if (rank.status === 'OPEN') {
              this.$set(this.rankMap, rank.type, [])
            }
          })
        }
      })
    },
    getRankList(type) {
      window.VHALL_ZK.$api.getRankList({
        menu_id: this.menu.menu_id,
        type: type
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.list) {
            this.rankMap[type] = [...res.data.list]
          }
        }
      })
    },
    getMyRank(type) {
      window.VHALL_ZK.$api.getMySelfRankInfo({
        menu_id: this.menu.menu_id,
        type: type
      }).then((res) => {
        if (res.code === 200) {
          this.$set(this.myRankMap, type, res.data)
        }
      })
    }
  },
  computed: {
    ...mapState('login', {
      loginInfo: (state) => state.loginInfo
    }),
    rankTypes() {
      return Object.keys(this.rankMap)
    }
  }
}
</script>

<style lang="scss" socped>
@import 'assets/css/mixin.scss';
@import 'assets/css/transitions.scss';

.rank-menu {
  padding: 20px 16px 60px 16px;
  height: 100%;
  overflow: auto;
  .rank-tabs-container {
    margin-bottom: 14px;
  }
}
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .img {
    width: 130px;
    height: 130px;
  }
  .img-sub {
    display: block;
    width: 100%;
    margin-top: 20px;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
}
</style>
