<template>
  <div class="q-edit-content">
    <div class="q-edit-select">
      <el-select v-model="provinceVal"
                 @change="changeProvince"
                 @focus="focusProvince"
                 placeholder="省/自治区/直辖市">
        <el-option v-for="(item,index) in provinces"
                   :label="item.label"
                   :value="item.value"
                   :key="index">
        </el-option>
      </el-select>
    </div>
    <div class="q-edit-select">
      <el-select v-model="cityVal"
                 @change="changeCity"
                 @focus="focusCity"
                 placeholder="市">
        <el-option v-for="(item,index) in cities"
                   :label="item.label"
                   :value="item.value"
                   :key="index">
        </el-option>
      </el-select>

    </div>
    <div v-if="edit||(!edit&&(this.value.detail.level === 'county' || this.value.detail.level === 'address'))"
         class="q-edit-select">
      <el-select v-model="countyVal"
                 @change="changeCounty"
                 @focus="focusCounty"
                 placeholder="区/县">
        <el-option v-for="(item,index) in counties"
                   :label="item.label"
                   :value="item.value"
                   :key="index">
        </el-option>
      </el-select>
      <span v-if="edit"
            @click="setLevel('county')"
            class="remove">{{getCountyState}}</span>
    </div>
    <div v-if="edit||(!edit&&this.value.detail.level === 'address')"
         class="q-edit-select select-last">
      <com-input placeholder="详细地址"
                 :disabled="edit"
                 v-model="addressVal"
                 @focus="focusAddress"
                 :max-length="50"></com-input>
      <span v-if="edit"
            @click="setLevel('address')"
            class="remove">{{getAddressState}}</span>
    </div>
    <div v-if="!edit&&errorTip"
         class="error-msg">{{errorTip}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      provinceVal: '',
      cityVal: '',
      countyVal: '',
      addressVal: '',
      area: {},
      province: '',
      city: '',
      county: '',
      provinces: [],
      cities: [],
      counties: [],
      errorTip: ''
    }
  },
  mounted () {
    window.VHALL_ZK.$api.getArea().then((res) => {
      this.area = res
      this.provinces = this.area.provinces
    })
  },
  methods: {
    setLevel (level) {
      if (level === 'address' && this.value.detail.level === level) {
        this.value.detail.level = 'county'
      } else if (level === 'county' && (this.value.detail.level === level || this.value.detail.level === 'address')) {
        this.value.detail.level = 'city'
      } else {
        this.value.detail.level = level
      }
    },
    changeProvince (value) {
      this.cities = this.area.cities[value]
      this.cityVal = ''
      this.countyVal = ''
    },
    focusProvince () {
      this.errorTip = ''
    },
    blurProvince () {
      setTimeout(() => {
        if (this.value.required === 'Y' && !this.value.province) {
          this.errorTip = '此项为必填项'
        }
      }, 300)
    },
    changeCity (value) {
      this.counties = this.area.counties[value]
      this.countyVal = ''
    },
    focusCity () {
      this.errorTip = ''
    },
    blurCity () {
      setTimeout(() => {
        if (this.value.required === 'Y' && !this.value.city) {
          this.errorTip = '此项为必填项'
        }
      }, 300)
    },
    changeCounty () {

    },
    focusCounty () {
      this.errorTip = ''
    },
    blurCounty () {
      setTimeout(() => {
        if (this.value.required === 'Y' && !this.value.county) {
          this.errorTip = '此项为必填项'
        }
      }, 300)
    },
    focusAddress () {
      this.errorTip = ''
    },
    blurAddress () {
      if (this.value.required === 'Y' && !this.value.address) {
        this.errorTip = '此项为必填项'
      }
    },
    validate () {
      let result = true
      if (!this.value.title) {
        result = false
        this.value.error = true
        this.value.title = '请设置问卷内容'
      }

      return result
    },
    check () {
      let value = []
      if (this.value.required === 'Y' && (!this.provinceVal || !this.cityVal)) {
        this.errorTip = '此项为必填项'
        return false
      }
      if (this.provinceVal) {
        this.provinces.forEach((item) => {
          if (item.value === this.provinceVal) {
            value.push(item.label)
          }
        })
      }
      if (this.cityVal) {
        this.cities.forEach((item) => {
          if (item.value === this.cityVal) {
            value.push(item.label)
          }
        })
      }

      if (this.value.required === 'Y' && (this.value.detail.level === 'county' || this.value.detail.level === 'address') && !this.countyVal) {
        this.errorTip = '此项为必填项'
        return false
      }
      if (this.countyVal) {
        this.counties.forEach((item) => {
          if (item.value === this.countyVal) {
            value.push(item.label)
          }
        })
      }
      if (this.value.required === 'Y' && this.value.detail.level === 'address' && !this.addressVal) {
        this.errorTip = '此项为必填项'
        return false
      }
      this.addressVal && value.push(this.addressVal)
      let ext = this.value.ext
      return { id: this.value.id, value: value.join('|'), type: ext.key }
    }
  },
  computed: {
    getCountyState () {
      if (this.value.detail.level === 'county' || this.value.detail.level === 'address') {
        return '隐'
      } else {
        return '显'
      }
    },
    getAddressState () {
      if (this.value.detail.level === 'address') {
        return '隐'
      } else {
        return '显'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.q-edit-content {
  margin-bottom: 20px;
  .q-edit-select {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    &.select-last{
      margin-bottom: 0;
    }
    .el-select {
      width: 93%;
    }
    .com-input {
      width: 93%;
    }
    .remove {
      cursor: pointer;
      font-size: 12px;
      margin-left: 10px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  &.display {
    margin-bottom: 0;
  }
  /deep/ {
    .error-msg {
      position: absolute;
      color: #fc5659;
      padding-left: 10px;
      line-height: 20px;
      font-size: 12px;
    }
    .q-select-item {
      height: 40px;
    }
    .el-input__inner {
      padding-left: 10px;
    }
  }
}
</style>
