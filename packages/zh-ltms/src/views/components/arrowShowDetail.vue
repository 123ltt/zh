<template>
  <div>
    {{ stringDetail }}
    <el-popover
      placement="left"
      :width="width"
      trigger="hover"
      popper-class="lli"
    >
      <template v-if="renderType==='country'">
        <div v-for="(item,index) in countryArray" v-show="showAll" :key="index">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="fw-bold">{{ item.name }}</span>
            </div>
            <template class="body">
              <span v-for="i in item.list" :key="i.id" class="d-inline-block me-3">
                {{ i.name }}
              </span>
            </template>

          </el-card>
        </div>
        <div v-show="!showAll">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="fw-bold"> 国家列表</span>
            </div>
            <div v-for="i in selectedList" :key="i.id" class="d-inline-block me-3">
              {{ i.name }}
            </div>
          </el-card>
        </div>
      </template>
      <template v-if="renderType==='stores'">
        <div v-for="item in selectedList" v-show="hasPlatform && !storeAll" :key="item.platformId">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="fw-bold">{{ item.platformName }}</span>
            </div>
            <div v-for="i in item.channelSaleLimitStores" :key="i.storeId" class="d-inline-block me-3">
              {{ i.storeCode }}
            </div>
          </el-card>
        </div>
        <el-card v-if="storeAll">
          <div slot="header" class="clearfix">
            <span class="fw-bold">全部店铺的平台</span>
          </div>
          <div v-for="(i,index) in selectedList" :key="index" class="d-inline-block me-3">
            {{ i.platformName }}
          </div>
        </el-card>
        <el-card v-show="!hasPlatform">
          <div slot="header" class="clearfix">
            <span class="fw-bold"> 店铺列表</span>
          </div>
          <div v-for="(i,index) in selectedList" :key="index" class="d-inline-block me-3">
            {{ i.storeCode }}
          </div>
        </el-card>
      </template>
      <span v-show="showArrow" id="hand" slot="reference" class="text-danger"> >> </span>
    </el-popover>
  </div>

</template>
<script>
import { getCountryList } from '@/api/common'
export default {
  name: 'ArrowShowDetail',
  props: {
    selectedList: {
      type: Array,
      required: true
    },
    renderType: {
      type: String,
      required: true
    },
    length: {
      type: Number,
      required: false,
      default: 10
      // validator: value => value > 10
    },
    hasPlatform: {
      type: Boolean,
      required: false,
      default: false
    }

  },
  data() {
    return {
      width: 300,
      showArrow: false,
      showAll: false,
      stringDetail: '',
      countryArray: [],
      storeAll: false
    }
  },
  mounted() {
    if (this.renderType === 'country') {
      this.countryArray = [
        { name: '亚洲国家列表(Asia)', key: 'Asia', list: [] },
        { name: '欧洲国家列表(Europe)', key: 'Europe', list: [] },
        { name: '非洲国家列表(Africa)', key: 'Africa', list: [] },
        { name: '北美国家列表(North_America)', key: 'North_america', list: [] },
        { name: '南美国家列表(South_America)', key: 'South_america', list: [] }
      ]
      this.initCountry()
    }
    if (this.renderType === 'stores') {
      this.initPlatformStores()
    }
  },
  methods: {
    initCountry() {
      getCountryList().then(res => {
      // 将id转成要渲染的格式
        res.data.forEach(element => {
          this.selectedList.map(item => {
            if (element.id === item.countryId) {
              item.name = element.countryNameCn
              item.countryContinent = element.countryContinent
            }
          })
        })

        this.selectedList.forEach((item, index, arr) => {
          const stringDetail = this.stringDetail
          // 如果超过十个字符就悬浮展示
          if (stringDetail.length + item.name.length > this.length) {
            this.showArrow = true
            if (arr.length > 20) {
              this.showAll = true
              this.countryArray.forEach(element => {
                const data = this.selectedList.filter(e => e.countryContinent === element.key)
                element.list = data
              })
              this.width = 500
              return
            }
            this.showAll = false
            return
          }
          // 拼接字符串 不超过十个字符直接展示
          this.stringDetail = stringDetail.length ? stringDetail + '，' + item.name : item.name
        })
      })
    },
    initPlatformStores() {
      let platformJoinString = ''
      let flag = true
      this.selectedList.forEach(item => {
        if (flag) {
          if (this.hasPlatform) {
            if (item.storeAll) {
              this.storeAll = true
              if (platformJoinString.length + item.platformName.length > this.length - 10) {
                platformJoinString += '...'
                flag = false
                return
              }
              platformJoinString += (platformJoinString.length ? '、' : '') + item.platformName + '（全部店铺）'
              return
            }
            if (platformJoinString.length + item.platformName.length > this.length - 5) return
            platformJoinString += item.platformName + '（）'
            item.channelSaleLimitStores.forEach(element => {
              const index = platformJoinString.lastIndexOf('）')
              if (flag) {
                if (platformJoinString.length + (element.storeCode + ';').length + 3 > this.length) {
                  platformJoinString = platformJoinString.substring(0, index - 1) + '...）'
                  flag = false
                  return
                }
                const confirmEmpty = platformJoinString.slice(-2) === '（）'
                platformJoinString = platformJoinString.substring(0, index) + (confirmEmpty ? '' : ';') + element.storeCode + '），'
              }
            })
            return
          }

          if (platformJoinString.length + item.storeCode.length > this.length - 3) {
            platformJoinString += '...'
            flag = false
            return
          }
          platformJoinString += (platformJoinString.length ? '、' : '') + item.storeCode
        }
      })
      this.showArrow = !flag
      this.width = 500
      this.stringDetail = platformJoinString
    }
  }

}
</script>
<style lang="scss">
.lli{
  max-height:500px;
  height:auto;
  overflow-x:hidden;
  overflow-y:auto;
  top:500px
}
</style>
<style lang="scss" scoped>
#hand{
    position:relative;
    left:0;
    animation: myfirst 2s infinite;
    -webkit-animation: myfirst 2s infinite; /* Safari 与 Chrome */
}

@keyframes myfirst
{
  0%   {left: 0px;}
  25%  {left: 5px;}
  50%  {left: 10px;}
  100% {left: 0px;}
}

@-webkit-keyframes myfirst /* Safari 与 Chrome */
{
  0%   {left: 0px;}
  25%  {left: 5px;}
  50%  {left: 10px;}
  100% {left: 0px;}
}

</style>
