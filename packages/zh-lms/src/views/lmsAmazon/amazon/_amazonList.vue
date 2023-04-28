<template>
  <basic-container>
    <div :class="isToggle && 'toggle'" class="isToggle">
      <div class="mb-2">
        <el-button type="primary" size="mini" @click="createListing()">创建单个普通Listing</el-button>
        <el-button type="primary" size="mini" @click="createVaryListing()">创建单个vary Listing</el-button>
        <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" :disabled="!(checkIds.length || variantIds.length)" @click="batchUpdate">批量更新价格/库存</el-button>
      </div>
      <SearchHead ref="searchDataRef" :model="searchData" :form-attrs="formAttrs" :search-data="searchData" :class="isToggle && 'toggle'" class="isToggle" :store-list="storeList" @changeSearchType="changeSearchType" @toggleListingType="getAmazonTableList(1)">
        <el-form-item slot="btn">
          <el-button type="primary" @click="getAmazonTableList(1)">搜索</el-button>
          <el-button @click="resetForm('searchDataRef')">重置</el-button>
        </el-form-item>
      </SearchHead>
    </div>
    <div class="justify-toggler">
      <el-button size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down'" /></el-button>
    </div>
    <el-tabs v-model="auditTabActiveName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in tabActiveList"
                   :key="index"
                   :label="`${item.label}(${item.auditTabActiveTotal})`"
                   :name="item.value"
      />
      <AmazonTable ref="AmazonTable" :audit-tab-active-name="auditTabActiveName" :audit-tab-active-num="auditTabActiveNum" :search-data="searchData" :check-ids.sync="checkIds" :variant-ids.sync="variantIds" @changeStatus="getStatisticsStatus" />
    </el-tabs>
  </basic-container>
</template>

<script>
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import AddListing from './addListing.vue'
import { generateRandomNum } from '@/views/components/utils.js'
import AddVaryListing from './addVaryListing.vue'
import AmazonTable from './components/amazonTable.vue'
import batchUpdateModal from './components/batchUpdateModal.vue'
import { statisticsStatus } from '@/api/lmsCommon.js'
import { tabActiveList } from './components/addListing.handle.js'
import SearchHead from '../../components/searchHead/index.vue'
export default {
  name: 'LmsLmsAmazonAmazonAmazonList',
  components: {
    AmazonTable,
    SearchHead
  },
  data() {
    return {
      formAttrs: [
        { slot: 'searchType', type: 'searchType', span: 9, labelWidth: '0', prop: 'searchSort', items: () => this.searchTypeOption },
        { slot: 'selectStore', type: 'selectStore', span: 6, label: '店铺', prop: 'accounts' },
        { slot: 'selectUser', type: 'selectUser', span: 5, label: '创建人' },
        {
          label: '是否后台刊登',
          prop: 'isAmazonUpload',
          span: 4,
          type: 'select',
          items: (cb) => cb(this.isAliexpressUploadOption),
          events: {
            change: () => {
              this.getAmazonTableList(1)
            }
          }
        },
        { slot: 'dateTime', type: 'dateTime', prop: 'dateTime', span: 7, label: '创建时间', dateTimeStart: 'createTimeStart', dateTimeEnd: 'createTimeEnd' },
        { slot: 'listingType', type: 'listingType', prop: 'listingType', span: 6, label: 'Listing类型' },
        { slot: 'btn', span: 4 }
      ],
      isToggle: true,
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,
      tabActiveList: tabActiveList(),
      isAliexpressUploadOption: [{ label: '请选择', value: null }, { label: '是', value: true }, { label: '否', value: false }],
      searchTypeOption: [{ label: '标题', value: 1 },
        { label: 'SKU', value: 2 },
        { label: '平台SKU', value: 3 },
        { label: 'ListingID', value: 5 } // 新增一个listing id
      ],
      checkIds: [], // 勾选处理的ids
      variantIds: [], // 勾选处理变体的ids
      storeList: [], // 店铺列表
      searchData: {
        upOnlineTimeStart: '',
        isAmazonUpload: null,
        listingType: '',
        createUser: '',
        accounts: [],
        searchType: '',
        searchContentNum: '',
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
      const upOnlineDateTime = { slot: 'upOnlineDateTimeateTime', type: 'dateTime', prop: 'upOnlineDateTimeateTime', span: 7, label: '上架时间', dateTimeStart: 'upOnlineTimeStart', dateTimeEnd: 'upOnlineTimeEnd' }
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
    this.getOptionsWithPlatformCode()
  },
  methods: {
    // 切换类型
    changeSearchType(val) {
      this.searchData.isSearchSort = ![1].includes(val)
    },
    getStatisticsStatus() {
      statisticsStatus({ ...this.searchData, listingStatus: Number(this.auditTabActiveNum) }, 'amazon').then(res => {
        const data = res.data
        this.tabActiveList = tabActiveList()
        Object.keys(data).forEach(list => {
          this.tabActiveList[Number(list) - 1].auditTabActiveTotal = data[list]
        })
      })
    },
    // 获取Table List
    getAmazonTableList(current = 1) {
      this.$refs.AmazonTable.getAmazonlisting(current)
      this.$refs.AmazonTable.changeExpand({}, [])
      this.getStatisticsStatus()
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
          selectedIds: this.checkIds,
          variantIds: this.variantIds,
          listingStatus: this.auditTabActiveNum
        },
        callback: refresh => {
          refresh && this.getAmazonTableList(1)
        }
      })
    },
    // 切换状态
    handleTabClick(item) {
      this.auditTabActiveNum = Number(item.index) + 1
      if (this.auditTabActiveNum > 4) {
        if (this.searchTypeOption.length <= 4) {
          this.searchTypeOption.splice(3, 0, { label: 'ASIN', value: 4 })
        }
      } else {
        if (this.searchData.searchContentNum) {
          this.searchData.searchContentNum = ''
        }
        this.searchData.upOnlineTimeStart = ''
        this.searchData.upOnlineTimeEnd = ''
        this.searchData.searchType = this.searchData.searchType === 4 ? '' : this.searchData.searchType
        if (this.searchTypeOption.length === 5) {
          this.searchTypeOption.splice(3, 1)
        }
      }
      this.$nextTick(() => {
        this.getAmazonTableList(1)
      })
    },
    // 单个listing
    createListing() {
      this.$newTab({
        path: '/lms/amazon/add/listing' + generateRandomNum(),
        title: '创建单个普通Listing',
        component: AddListing,
        clearCache: true,
        callback: refresh => {
          refresh && this.getAmazonTableList()
        }
      })
    },
    // vary listing
    createVaryListing() {
      this.$newTab({
        path: 'amazon/amazon/amazon/list' + generateRandomNum(),
        title: '创建Listing',
        component: AddVaryListing,
        clearCache: true,
        callback: refresh => {
          refresh && this.getAmazonTableList()
        }
      })
    },

    // 店铺列表
    getOptionsWithPlatformCode() {
      optionsWithPlatformCode({ platformCode: 'AM' }).then(res => {
        this.storeList = res.data
      })
    },
    // 清空
    resetForm(formName) {
      this.$refs[formName].resetSearch()
      this.searchData.accounts = []
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
.w300{
 width: 300px;
}
.el-button-group ::v-deep.el-button--mini{
  padding:7px 5px;
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
  </style>
