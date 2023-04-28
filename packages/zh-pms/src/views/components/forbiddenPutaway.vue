<template>
  <div class="wrap">
    <div class="border rounded py-1 px-2">
      <div class="m-1">
        <el-checkbox v-model="allPlatformChecked"
                     :indeterminate="allPlatformIndeterminate"
                     @change="onSelectAllPlatform"
        >全选</el-checkbox>
      </div>
      <div class="d-flex flex-wrap">
        <div v-for="(item,index) in platformList"
             :key="item.value"
             class="d-flex align-items-center list-item m-1"
             :class="{actived:currentIndex===index}"
             @click="onClickPlatform(item,index)"
        >
          <el-checkbox v-model="item.checked"
                       :indeterminate="item.indeterminate"
                       @change="onSelectPlatform"
          />
          <span class="text-truncate item-label">{{ item.platName }}</span>
        </div>
      </div>
    </div>
    <template v-if="siteList.length>0">
      <div class="text-center">
        <i class="el-icon-arrow-down" />
      </div>
      <div class="border rounded py-1 px-2">
        <div class="m-1">
          <el-checkbox v-model="platformList[currentIndex].checked"
                       :indeterminate="platformList[currentIndex].indeterminate"
                       @change="onSelectPlatform"
          >全选</el-checkbox>
        </div>
        <div class="d-flex flex-wrap">
          <div v-for="item in siteList"
               :key="item.siteCode"
               class="d-flex align-items-center list-item m-1"
          >
            <el-checkbox v-model="item.checked"
                         @change="onSelectSite(item, siteList)"
            >{{ item.siteName }}</el-checkbox>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getPlatformTree } from '@/api/info'

export default {
  props: {
    /** @type {ZHKJ.VueProps<{platform:string;ifAll:boolean;countryList:string[]}[]>} */
    forbiddenList: Array
  },
  data() {
    return {
      platformList: [],
      siteList: [],
      currentIndex: -1,
      allPlatformChecked: false,
      allPlatformIndeterminate: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getPlatformTree().then(({ data }) => {
        this.platformList = data.map(item => {
          const d = (this.forbiddenList || []).find(el => el.platform === item.platCode)
          if (d) {
            const ifAll = d.ifAll || false
            item.checked = ifAll
            let indeterminate = !ifAll
            if (!ifAll) {
              const len1 = item.lstSite.length
              const len2 = d.countryList.length
              // 可能后端给的ifAll为null，但给出的已选择项是全部
              if (len1 > 0 && len1 === len2) {
                indeterminate = false
                item.checked = true
              } else if (len2 > 0) {
                indeterminate = true
              }
            }
            item.indeterminate = indeterminate
          } else {
            item.checked = false
            item.indeterminate = false
          }
          item.lstSite.forEach(el => {
            if (d) {
              el.checked = d.ifAll || d.countryList.includes(el.siteCode)
            } else {
              el.checked = false
            }
          })
          return item
        })
        this.updateAllPlatform()
      })
    },
    // 更新平台全选checkbox的状态
    updateAllPlatform() {
      let countChecked = 0
      let countIndeterminate = 0
      this.platformList.forEach(item => {
        if (item.checked) countChecked++
        if (item.indeterminate) countIndeterminate++
      })
      if (countChecked === this.platformList.length) {
        this.allPlatformChecked = true
        this.allPlatformIndeterminate = false
      } else if (countChecked > 0 || countIndeterminate > 0) {
        this.allPlatformChecked = false
        this.allPlatformIndeterminate = true
      } else {
        this.allPlatformChecked = false
        this.allPlatformIndeterminate = false
      }
      this.$emit('select', this.getCheckedData())
    },
    onClickPlatform(data, index) {
      this.siteList = data.lstSite
      this.currentIndex = index
    },
    // 勾选某个平台，同时勾选该平台下所有的站点
    onSelectPlatform(status) {
      const d = this.platformList[this.currentIndex]
      d.checked = status
      d.indeterminate = false
      d.lstSite.forEach(item => {
        item.checked = status
      })
      this.updateAllPlatform()
    },
    // 勾选站点，同时影响 平台的勾选状态 和 所有平台全选状态
    onSelectSite(site, siteList) {
      let checkedLen = 0
      siteList.forEach(item => {
        if (item.checked) checkedLen++
      })
      const d = this.platformList[this.currentIndex]
      if (checkedLen === siteList.length) {
        d.checked = true
        d.indeterminate = false
      } else if (checkedLen > 0) {
        d.checked = false
        d.indeterminate = true
      } else {
        d.checked = false
        d.indeterminate = false
      }
      this.updateAllPlatform()
    },
    // 勾选所有平台
    onSelectAllPlatform(status) {
      this.allPlatformChecked = status
      this.allPlatformIndeterminate = false
      this.platformList.forEach(item => {
        item.checked = status
        item.indeterminate = false
        item.lstSite.forEach(el => {
          el.checked = status
        })
      })
      this.updateAllPlatform()
    },
    // 获取勾选的数据
    getCheckedData() {
      return this.platformList.map(platform => {
        if (platform.checked) {
          return { ifAll: true, platform: platform.platCode, countryList: [] }
        } else if (platform.indeterminate) {
          const countryList = platform.lstSite.filter(item => item.checked).map(item => item.siteCode)
          return { ifAll: false, platform: platform.platCode, countryList }
        }
        return null
      }).filter(item => item)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  line-height: 1;
}
.list-item {
  width: 140px;
  cursor: pointer;
  &:hover, &.actived {
    color: var(--color-primary);
  }
  &.actived {
    font-weight: 700;
  }
  .item-label {
    line-height: 19px;
  }
}
</style>
