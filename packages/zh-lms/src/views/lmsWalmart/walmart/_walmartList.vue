<template>
  <basic-container>
    <div :class="isToggle && 'toggle'" class="isToggle">
      <div class="mb-2">
        <el-button type="primary" size="mini" @click="createListing()">创建Listing</el-button>
        <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" :disabled="!selectedIds.length" @click="batchUpdate()">批量更新价格/库存</el-button>
      </div>
      <SearchHead ref="searchDataRef" :form-attrs="formAttrs" :model="searchData" :search-data="searchData" :search-sort-option="searchSortOption" :store-list="storeList" :platform-code="'WM'" @toggleListingType="getAmazonTableList(1)">
        <el-form-item slot="btn">
          <el-button type="primary" @click="getAmazonTableList(1)">搜索</el-button>
          <el-button @click="resetForm('searchDataRef')">重置</el-button>
        </el-form-item>
      </SearchHead>
    </div>
    <div class="justify-toggler">
      <el-button size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down' " /></el-button>
    </div>
    <el-tabs v-model="auditTabActiveName" type="border-card" class="tab-box" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item,index) in tabActiveList"
                   :key="index"
                   :label="`${item.label}(${item.auditTabActiveTotal})`"
                   :name="item.label"
      />
      <walmartTable ref="walmartTable" :audit-tab-active-name="auditTabActiveName" :audit-tab-active-num="auditTabActiveNum" :search-data="searchData" :selected-ids.sync="selectedIds" @changeStatus="getStatisticsStatus" />
    </el-tabs>
  </basic-container>
</template>

<script>
// import { walmartlisting } from '@/api/walmart/walmart.js'
import { optionsWithPlatformCode } from '@/api/amazon/amazon.js'
import walmartTable from './components/walmartTable'
import AddListing from './addListing.vue'
import { statisticsStatus } from '@/api/lmsCommon.js'
// import batchUpdateModal from './components/batchUpdateModal.vue'
//
// import logListing from './components/logListing'
import { tabActiveList } from './addListing.handle.js'
import SearchHead from '../../components/searchHead/index.vue'
import { generateRandomNum } from '@/views/components/utils.js'

// import walmartDetail from './~walmartDetail.vue'
// import batchUpdateModal from './components/batchUpdateModal.vue'
const searchData = () => {
  return {
    source: null, // 是否后台刊登
    isOverseasWarehouses: null, // 是否海外仓
    listingType: '',
    createUser: null, // 创建人
    storeCodes: [], // 店铺
    searchType: null,
    searchContent: [],
    searchContentNum: '',
    createStartTime: '',
    createEndTime: '',
    upOnlineTimeEnd: '',
    upOnlineTimeStart: '',
    isSearchSort: true,
    searchSort: 1 // 搜索类别 1-子sku 2-父sku 默认为:1
  }
}
export default {
  name: 'LmsWalmartWalmartWalmartList',
  components: {
    walmartTable,
    SearchHead
    // skuCompImport
  },
  data() {
    return {
      formAttrs: [
        { slot: 'searchType', type: 'searchType', span: 9, labelWidth: '0', items: () => this.searchTypeOption, prop: 'searchSort' },
        { slot: 'selectStore', type: 'selectStore', span: 6, label: '店铺', prop: 'storeCodes' },
        { slot: 'selectUser', type: 'selectUser', span: 5, label: '创建人' },
        {
          label: '刊登方式',
          prop: 'source',
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
          label: '是否海外仓',
          prop: 'isOverseasWarehouses',
          span: 4,
          type: 'select',
          items: (cb) => cb(this.isWishUploadOption),
          events: {
            change: () => {
              this.searchWishListing(1)
            }
          }
        },
        { slot: 'dateTime', type: 'dateTime', prop: 'dateTime', span: 8, label: '创建时间', dateTimeStart: 'createStartTime', dateTimeEnd: 'createEndTime' },
        { slot: 'listingType', type: 'listingType', prop: 'listingType', span: 6, label: 'Listing类型' },
        { slot: 'btn', span: 4 }
      ],
      searchTypeOption: [{ label: '标题', value: 1 },
        { label: 'SKU', value: 2 },
        { label: '平台SKU', value: 3 },
        { label: 'itemID', value: 4 }, // 新增一个listing id
        { label: 'UPC', value: 5 }
      ],
      tabActiveList: tabActiveList(),
      publishMethodOption: [{ label: '请选择', value: null }, { label: '后台刊登', value: 1 }, { label: '蝌蚪刊登', value: 2 }, { label: '新系统刊登', value: 3 }],
      searchSortOption: [{ label: '子', value: false }, { label: '父', value: true }],
      isToggle: true,
      storeList: [],
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,
      constList: {},
      isWishUploadOption: [
        { label: '请选择', value: null },
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      isAutoPublication: [
        { label: '请选择', value: null },
        { label: '是', value: 0 },
        { label: '否', value: 1 }
      ],
      selectedIds: [], // 勾选处理的ids
      searchData: searchData()
    }
  },
  watch: {
    auditTabActiveNum() {
      const upOnlineDateTime = { slot: 'upOnlineDateTimeateTime', type: 'dateTime', prop: 'upOnlineDateTimeateTime', span: 8, label: '上架时间', dateTimeStart: 'upOnlineTimeStart', dateTimeEnd: 'upOnlineTimeEnd' }
      const result = this.formAttrs.some(item => item.slot === 'upOnlineDateTimeateTime')
      if (this.auditTabActiveNum > 4) {
        if (!result) {
          this.formAttrs.splice(5, 0, upOnlineDateTime)
        }
      } else {
        result && this.formAttrs.splice(5, 1)
      }
    }
  },
  mounted() {
    // this.getEbayconstants()
    this.getOptionsWithPlatformCode()
  },
  methods: {
    getStatisticsStatus() {
      statisticsStatus({ ...this.searchData, listingStatus: Number(this.auditTabActiveNum) }, 'walmart').then(res => {
        const data = res.data
        this.tabActiveList = tabActiveList()
        Object.keys(data).forEach((item) => {
          this.tabActiveList[item].auditTabActiveTotal = data[item]
        })
      })
    },
    // getEbayconstants() {
    //   ebayconstants().then(res => {
    //     this.constList = res.data.constants
    //   })
    // },
    // 获取Table List
    getAmazonTableList(current = 1) {
      this.$refs.walmartTable && this.$refs.walmartTable.getAmazonlisting(current)
      this.getStatisticsStatus()
    },
    // 切换状态
    handleTabClick(item) {
      this.auditTabActiveNum = Number(item.index) + 1
      if (this.auditTabActiveNum <= 4) {
        this.searchData.putawayStartTime = ''
        this.searchData.putawayEndTime = ''
      }
      this.$nextTick(() => {
        this.getAmazonTableList(1)
      })
    },
    // 单个listing
    createListing(row) {
      this.$newTab({
        path: row ? '/lms/walmart/edit/listing' : '/lms/walmart/add/listing' + generateRandomNum(),
        title: row ? '编辑Listing' : '创建Listing',
        component: AddListing,
        clearCache: true,
        data: {
          id: row?.id,
          itemId: row?.itemId
        },
        callback: refresh => {
          refresh && this.getAmazonTableList()
        }
      })
    },
    // 批量更新价格/库存弹窗
    // batchUpdate() {
    //   this.$modal({
    //     title: '批量更新价格/库存',
    //     component: batchUpdateModal,
    //     width: '600px',
    //     minHeight: '300px',
    //     padding: '20px',
    //     data: {
    //       selectedIds: this.selectedIds,
    //       productStatus: this.auditTabActiveNum
    //     },
    //     callback: refresh => {
    //       refresh && this.getAmazonTableList()
    //     }
    //   })
    // },

    // 店铺列表
    getOptionsWithPlatformCode() {
      optionsWithPlatformCode({ platformCode: 'WM' }).then(res => {
        this.storeList = res.data
      })
    },
    // 清空
    resetForm(formName) {
      this.$refs[formName].resetSearch()
      this.searchData.searchContent = []
      this.searchData.listingType = ''
      this.$nextTick(() => {
        this.getAmazonTableList(1)
      })
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
::v-deep .el-table__expanded-cell[class*=cell]{
  padding:0 0!important;
}
.el-button-group ::v-deep.el-button--mini{
  padding:7px 6px;
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
  ::v-deep .el-textarea__inner{
  height: 30px;
  }
  ::v-deep .el-radio{
    margin-right: 6px;
  }
  .btn-flex{
    display:flex;
    justify-content:flex-end;
    align-items: center;
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
  .justify-toggler{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::v-deep .g-table.el-table.g-table-dense td .cell{
  white-space: pre-wrap !important;
}
  </style>
