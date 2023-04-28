<template>
  <basic-container>
    <div>
      <div class="mb-2">
        <el-button v-if="$auth('wish_add')" type="primary" size="mini" @click="createListing">创建Listing</el-button>
        <g-auth code="wish_batch_feed">
          <el-button v-if="['Draft','Online'].includes(auditTabActiveName)" :disabled="!checkIds.length" type="primary" size="mini" @click="batchUpdata">批量更新价格库存</el-button>
        </g-auth>
      </div>
      <SearchHead ref="searchDataRef" :form-attrs="formAttrs" :search-data="searchData" :class="isToggle && 'toggle'" class="isToggle" :model="searchData" :search-sort-option="searchSortOption" :store-list="storeList" @changeSearchType="changeSearchType" @toggleListingType="searchWishListing(1)">
        <el-form-item slot="btn" label-width="0">
          <el-button type="primary" @click="searchWishListing(1)">搜索</el-button>
          <el-button @click="resetForm('searchDataRef')">重置</el-button>
        </el-form-item>
      </SearchHead>
    </div>
    <el-button class="d-flex justify-content-center g-w100" size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down' " /></el-button>
    <el-tabs v-model="auditTabActiveName" type="border-card" class="tab-box" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in tabActiveList"
                   :key="index"
                   :label="`${item.label}(${item.auditTabActiveTotal})`"
                   :name="item.value"
      />
      <WishTable ref="wishTable" :audit-tab-active-num="auditTabActiveNum" :audit-tab-active-name="auditTabActiveName" :search-data="searchData" :tab-active-list="tabActiveList" @changeCheckIds="changeCheckIds" @changeStatus="getStatisticsStatus" />
    </el-tabs>
  </basic-container>
</template>

<script>
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import { statisticsStatus } from '@/api/lmsCommon.js'
import batchUpdatePirce from './modal/batchUpdatePirce.vue'
import WishTable from './components/wishTable.vue'
import AddListing from './addListing.vue'
import { tabActiveList } from './components/wish.handle.js'
import SearchHead from '../../components/searchHead/index.vue'
import { generateRandomNum } from '@/views/components/utils.js'
export default {
  name: 'LmsLmsWishListingList',
  components: { WishTable, SearchHead },
  data() {
    return {
      formAttrs: [
        { slot: 'searchType', type: 'searchType', span: 9, labelWidth: '0', prop: 'searchSort' },
        { slot: 'selectStore', type: 'selectStore', span: 6, label: '店铺', prop: 'accounts' },
        { slot: 'selectUser', type: 'selectUser', span: 5, label: '创建人' },
        {
          label: '刊登方式',
          prop: 'publishMethod',
          span: 4,
          type: 'select',
          items: (cb) => cb(this.publishMethodOption),
          events: {
            change: () => {
              this.searchWishListing(1)
            }
          }
        },
        {
          label: '是否自动刊登',
          prop: 'autoPublish',
          span: 4,
          type: 'select',
          items: (cb) => cb(this.isAliexpressUploadOption),
          events: {
            change: () => {
              this.searchWishListing(1)
            }
          }
        },
        { slot: 'dateTime', type: 'dateTime', prop: 'dateTime', span: 9, label: '创建时间', dateTimeStart: 'createTimeStart', dateTimeEnd: 'createTimeEnd' },
        {
          label: '是否海外仓',
          prop: 'isWishExpress',
          span: 5,
          type: 'select',
          items: (cb) => cb(this.isAliexpressUploadOption),
          events: {
            change: () => {
              this.searchWishListing(1)
            }
          }
        },
        { slot: 'listingType', type: 'listingType', prop: 'listingType', span: 6, label: 'Listing类型' },
        { slot: 'btn', span: 4 }
      ],
      isToggle: true,
      storeList: [],
      searchSortOption: [{ label: '子', value: 1 }, { label: '父', value: 2 }],
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,
      tabActiveList: tabActiveList(),
      publishMethodOption: [{ label: '请选择', value: null }, { label: '后台刊登', value: 1 }, { label: '蝌蚪刊登', value: 2 }, { label: '新系统刊登', value: 3 }],
      isAliexpressUploadOption: [{ label: '请选择', value: null }, { label: '是', value: true }, { label: '否', value: false }],
      checkIds: [], // 勾选处理的ids
      searchData: {
        upOnlineTimeStart: '',
        publishMethod: null,
        autoPublish: null,
        listingType: '',
        createUser: '',
        accounts: [],
        searchType: '',
        searchContent: [],
        searchContentNum: '',
        isWishExpress: null,
        upOnlineTimeEnd: '',
        createTimeStart: '',
        createTimeEnd: '',
        isSearchSort: false,
        searchSort: 1 // 搜索类别 1-子sku 2-父sku 默认为:1
      }
    }
  },
  watch: {
    auditTabActiveNum() {
      const upOnlineDateTime = { slot: 'upOnlineDateTimeateTime', type: 'dateTime', prop: 'upOnlineDateTimeateTime', span: 8, label: '上架时间', dateTimeStart: 'upOnlineTimeStart', dateTimeEnd: 'upOnlineTimeEnd' }
      const result = this.formAttrs.some(item => item.slot === 'upOnlineDateTimeateTime')
      if (this.auditTabActiveNum > 4 && !['55', '66'].includes(this.auditTabActiveNum)) {
        if (!result) {
          this.formAttrs.splice(6, 0, upOnlineDateTime)
        }
      } else {
        result && this.formAttrs.splice(6, 1)
      }
    }
  },
  mounted() {
    this.getOptionsWithPlatformCode()
  },
  methods: {
    // 切换类型
    changeSearchType(val) {
      this.searchData.isSearchSort = ![1, 5].includes(val)
    },
    getStatisticsStatus() {
      statisticsStatus({ ...this.searchData, listingStatus: this.auditTabActiveNum }, 'wish').then(res => {
        const data = res.data
        this.tabActiveList = tabActiveList()
        Object.keys(data).forEach(list => {
          this.tabActiveList.forEach(arr => {
            if (arr.cindex === list) {
              arr.auditTabActiveTotal = data[list]
            }
          })
        })
      })
    },
    // 店铺列表
    getOptionsWithPlatformCode() {
      optionsWithPlatformCode({ platformCode: 'WH' }).then(res => {
        this.storeList = res.data
      })
    },
    searchWishListing(current = 1) {
      this.$refs.wishTable && this.$refs.wishTable.listWishListing(current)
      this.getStatisticsStatus()
    },
    // 单个listing
    createListing() {
      this.$newTab({
        path: '/lms/wish/add/listing' + generateRandomNum(),
        title: '创建Listing',
        component: AddListing,
        clearCache: true,
        data: {
          auditTabActiveName: this.auditTabActiveName
        },
        callback: refresh => {
          refresh && this.searchWishListing(1)
        }
      })
    },
    // 清空
    resetForm(formName) {
      this.$refs[formName].resetSearch()
      this.searchData.searchType = ''
      this.searchData.searchContentNum = ''
      this.searchData.createUser = ''
      this.searchData.accounts = []
      this.searchData.searchContent = []
      this.searchData.searchSort = 2
      this.$nextTick(() => {
        this.searchWishListing(1)
      })
    },
    // 切换状态
    handleTabClick(item) {
      this.checkIds = []
      this.auditTabActiveNum = this.tabActiveList.filter(list => list.label === item.name).map(acc => Number(acc.cindex))[0]
      if (this.auditTabActiveNum <= 4) {
        this.searchData.upOnlineTimeStart = ''
        this.searchData.upOnlineTimeEnd = ''
      }
      this.$nextTick(() => {
        this.searchWishListing(1)
      })
    },
    batchUpdata() {
      this.$modal({
        title: '批量更新价格/库存',
        component: batchUpdatePirce,
        data: {
          ids: this.checkIds,
          listingStatus: this.auditTabActiveName
        },
        width: '40%',
        callback: (updata) => {
          if (updata) {
            this.searchWishListing(1)
            this.checkIds = []
          }
        }
      })
    },
    btnShow(arr) {
      return arr.includes(this.auditTabActiveNum)
    },
    changeCheckIds(ids) {
      this.checkIds = ids
    }
  }
}
</script>
<style >
  .expand .el-table__expand-column .cell {
    display: none;
  }
</style>
<style lang="scss" scoped>
 .search-flex{
    display: flex;
    flex-wrap:wrap;
    flex-direction:row;
    // margin-bottom: 14px;
  }
// 设置tab按钮样式
.tab-box{
  ::v-deep {
    .el-tabs__item.is-active {
      border-bottom: 1px solid #dcdfe6;
      border-top: 1px solid #dcdfe6;
    }
    .el-tabs__nav{
      white-space: initial
    }
  }
}
.el-button-group ::v-deep.el-button--mini{
  padding:7px 5px;
}
  ::v-deep.el-table__expanded-cell[class*=cell]{
    padding:0 0!important;
  }
  .w300{
    width: 300px;
  }

  .search-flex{
    display: flex;
    flex-wrap:wrap;
    flex-direction:row;
  }
  .flex-box{
    width: 33%;
  }
  .f25{
    width: 25%;
  }
  .flex-line{
    display: flex;
    justify-content:space-between;
  }
  .m-b-0{
    margin-bottom: 0;
  }
  ::v-deep.el-textarea__inner{
    height: 30px;
  }
  ::v-deep.el-radio{
    margin-right: 6px;
  }
  ::v-deep .el-textarea__inner{
    height: 30px;
  }
  .head{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 14px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.1s ease;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
  }
  .isToggle{
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: all 0.25s ease;
    &.toggle{
      opacity: 1;
      height: auto;
    }
  }
</style>
