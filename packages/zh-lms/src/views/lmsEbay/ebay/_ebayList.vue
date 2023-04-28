<template>
  <basic-container>
    <div :class="isToggle && 'toggle'" class="isToggle">
      <div class="mb-2">
        <el-button type="primary" size="mini" @click="createListing()">创建单个普通Listing</el-button>
        <el-button type="primary" size="mini" @click="createVaryListing()">创建单个vary Listing</el-button>
        <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" :disabled="!selectedIds.length" @click="batchUpdate()">批量更新价格/库存</el-button>
      </div>
      <SearchHead ref="searchDataRef" :form-attrs="formAttrs" :model="searchData" :search-data="searchData" :search-sort-option="searchSortOption" :store-list="storeList" :platform-code="'EB'" @changeSearchType="changeSearchType" @toggleListingType="getAmazonTableList(1)">
        <el-form-item slot="btn">
          <el-button type="primary" @click="getAmazonTableList(1)">搜索</el-button>
          <el-button @click="resetForm('searchDataRef')">重置</el-button>
        </el-form-item>
      </SearchHead>
    </div>
    <div class="justify-toggler">
      <el-button size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down' " /></el-button>
    </div>
    <el-tabs v-model="auditTabActiveName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in tabActiveList"
                   :key="index"
                   :label="`${item.label}(${item.auditTabActiveTotal})`"
                   :name="item.value"
      />
      <EbayTable ref="ebayTable" :audit-tab-active-name="auditTabActiveName" :audit-tab-active-num="auditTabActiveNum" :search-data="searchData" :selected-ids.sync="selectedIds" @changeStatus="getStatisticsStatus" />
    </el-tabs>
  </basic-container>
</template>

<script>
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import { ebayconstants, statisticsStatus } from '@/api/ebay/ebay'
import { generateRandomNum } from '@/views/components/utils.js'
import AddListing from './addListing.vue'
import addVaryListing from './addVaryListing.vue'
import EbayTable from './components/ebayTable.vue'
import batchUpdateModal from './components/batchUpdateModal.vue'
import SearchHead from '../../components/searchHead/index.vue'
const salesTypeOption = () => [
  { label: '固定价', value: '1', isActive: true },
  { label: '拍卖', value: '2', isActive: false }
]
const searchData = () => {
  return {
    searchType: null, // 关键词类型
    searchContent: [], // 关键词
    storeCodes: [], // 店铺编号
    listingType: null, // Listing类型
    saleType: '1', // 销售类型
    listingStatus: null, // Listing状态
    isBackPublish: null, // 是否后台刊登
    isAutoPublish: null, // 是否自动刊登
    createUser: null, // 创建人
    createStartTime: null, // 创建开始时间
    createEndTime: null, // 创建结束时间
    putawayStartTime: null, // 上架开始时间
    putawayEndTime: null, // 上架结束时间
    searchContentNum: '',
    isParentSku: true, // 父子切换
    isSearchSort: false
  }
}
export default {
  name: 'LmsLmsEbayEbayEbayList',
  components: {
    EbayTable, SearchHead
  },
  data() {
    return {
      formAttrs: [
        { slot: 'searchType', type: 'searchType', span: 9, labelWidth: '0', prop: 'isParentSku' },
        { slot: 'selectStore', type: 'selectStore', span: 6, label: '店铺', prop: 'storeCodes' },
        { slot: 'selectUser', type: 'selectUser', span: 5, label: '创建人' },
        {
          label: '是否后台刊登',
          prop: 'isBackPublish',
          span: 4,
          type: 'select',
          items: (cb) => cb(this.isWishUploadOption),
          events: {
            change: () => {
              this.getAmazonTableList(1)
            }
          }
        },
        {
          label: '是否自动刊登',
          prop: 'isAutoPublish',
          span: 4,
          type: 'select',
          items: (cb) => cb(this.isAutoPublication),
          events: {
            change: () => {
              this.getAmazonTableList(1)
            }
          }
        },
        { slot: 'dateTime', type: 'dateTime', prop: 'dateTime', span: 8, label: '创建时间', dateTimeStart: 'createStartTime', dateTimeEnd: 'createEndTime' },
        { slot: 'listingType', type: 'listingType', prop: 'listingType', span: 6, label: 'Listing类型' },
        { slot: 'saleType', type: 'listingType', prop: 'saleType', span: 4, label: '销售类型', items: () => this.salesTypeOption },
        { slot: 'btn', span: 4 }
      ],
      searchSortOption: [{ label: '子', value: false }, { label: '父', value: true }],
      isToggle: true,
      storeList: [],
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,
      tabActiveList: [{
        label: 'Draft',
        value: 'Draft',
        cindex: '1',
        auditTabActiveTotal: 0
      }, {
        label: 'Approving',
        value: 'Approving',
        cindex: '2',
        auditTabActiveTotal: 0
      }, {
        label: 'Uploading',
        value: 'Uploading',
        cindex: '3',
        auditTabActiveTotal: 0
      }, {
        label: 'Upload Failed',
        value: 'Upload Failed',
        cindex: '4',
        auditTabActiveTotal: 0
      }, {
        label: 'Online',
        value: 'Online',
        cindex: '5',
        auditTabActiveTotal: 0
      }, {
        label: 'Updating',
        value: 'Updating',
        cindex: '6',
        auditTabActiveTotal: 0
      }, {
        label: 'Update Failed',
        value: 'Update Failed',
        cindex: '7',
        auditTabActiveTotal: 0
      }, {
        label: 'Match Failed',
        value: 'Match Failed',
        cindex: '8',
        auditTabActiveTotal: 0
      }, {
        label: 'Canceling',
        value: 'Canceling',
        cindex: '9',
        auditTabActiveTotal: 0
      }, {
        label: 'Canceled',
        value: 'Canceled',
        cindex: '10',
        auditTabActiveTotal: 0
      }],
      constList: {},
      salesTypeOption: salesTypeOption(),
      isWishUploadOption: [
        { label: '请选择', value: null },
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      isAutoPublication: [
        { label: '请选择', value: null },
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      selectedIds: [], // 勾选处理的ids
      searchData: searchData()
    }
  },
  watch: {
    auditTabActiveNum() {
      const upOnlineDateTime = { slot: 'upOnlineDateTimeateTime', type: 'dateTime', prop: 'upOnlineDateTimeateTime', span: 8, label: '上架时间', dateTimeStart: 'putawayStartTime', dateTimeEnd: 'putawayEndTime' }
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
    this.getEbayconstants()
    this.getOptionsWithPlatformCode()
  },
  methods: {
    // 切换类型
    changeSearchType(val) {
      // 1:标题 2:sku 3:平台sku 4:ItemId 5:listingID
      this.searchData.isSearchSort = ![1, 4, 5].includes(val)
      // val为1,4,5时入参不要isParentSku
      if ([1, 4, 5].includes(val)) {
        delete this.searchData.isParentSku
      }
    },
    getStatisticsStatus() {
      // val为1,4,5时入参不要isParentSku
      if ([1, 4, 5].includes(this.searchData.searchType)) {
        delete this.searchData.isParentSku
      }
      statisticsStatus({ ...this.searchData, listingStatus: Number(this.auditTabActiveNum) }).then(res => {
        const data = res.data
        this.tabActiveList.forEach(item => {
          item.auditTabActiveTotal = 0
        })
        Object.keys(data).forEach(list => {
          this.tabActiveList[Number(list) - 1].auditTabActiveTotal = data[list]
        })
      })
    },
    getEbayconstants() {
      ebayconstants().then(res => {
        this.constList = res.data.constants
      })
    },
    // 获取Table List
    getAmazonTableList(current = 1) {
      this.$refs.ebayTable && this.$refs.ebayTable.getAmazonlisting(current)
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
        path: row ? '/lms/ebay/edit/listing' : '/lms/ebay/add/listing' + generateRandomNum(),
        title: row ? '编辑单个普通Listing' : '创建单个普通Listing',
        component: AddListing,
        data: { current: { ...row } },
        callback: refresh => {
          refresh && this.getAmazonTableList()
        }
      })
    },
    // vary listing
    createVaryListing(row) {
      this.$newTab({
        path: row ? '/lms/ebay/edit/varylisting' : '/lms/ebay/add/varylisting' + generateRandomNum(),
        title: row ? '编辑Listing' : '创建Listing',
        component: addVaryListing,
        clearCache: true,
        data: { current: row, type: 'Variation' },
        callback: refresh => {
          refresh && this.getAmazonTableList()
        }
      })
    },
    // 批量更新价格/库存弹窗
    batchUpdate() {
      this.$modal({
        title: '批量更新价格/库存',
        component: batchUpdateModal,
        width: '600px',
        minHeight: '300px',
        padding: '20px',
        data: {
          selectedIds: this.selectedIds,
          productStatus: this.auditTabActiveNum
        },
        callback: refresh => {
          refresh && this.getAmazonTableList()
        }
      })
    },

    // 店铺列表
    getOptionsWithPlatformCode() {
      optionsWithPlatformCode({ platformCode: 'EB' }).then(res => {
        this.storeList = res.data
      })
    },
    // 清空
    resetForm(formName) {
      // this.searchData = searchData()
      this.$refs[formName].resetSearch()
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
