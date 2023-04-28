<template>
  <basic-container>
    <div>
      <div :class="isToggle && 'toggle'" class="isToggle">
        <div class="mb-2">
          <el-button type="primary" size="mini" @click="createListing()">创建单个普通Listing</el-button>
          <el-button type="primary" size="mini" @click="createVaryListing()">创建单个vary Listing</el-button>
          <!-- <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" @click="batchUpdate">批量更新价格/库存</el-button>
          <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" @click="batchCancel">批量取消listing活动价</el-button> -->
          <!-- <el-button type="primary" size="mini" :disabled="!checkIds.length" @click="addIsNoPrice">加入不可调价</el-button>
          <el-button type="primary" size="mini" :disabled="!checkIds.length" @click="delIsNoPrice">移出不可调价</el-button> -->
          <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" :disabled="!checkIds.length" @click="batchUpdate">批量更新价格/库存</el-button>
          <!-- <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" :disabled="!checkIds.length" @click="batchCancel">批量取消listing活动价</el-button> -->
          <!-- 批量取消活动价 -->
          <syncFromPlatformBtn
            v-if="[5].includes(auditTabActiveNum)"
            :check-ids="checkIds"
            :check-item-ids="itemIds"
            cancel-price="cancelPrice"
            source="shopee"
            text="批量取消listing活动价"
            @refreshList="refreshList"
          />
          <el-button type="primary" size="mini" :disabled="!checkIds.length" @click="batchUpdateDate">批量更新发货期</el-button>
        </div>
        <SearchHead ref="searchDataRef" :form-attrs="formAttrs" :model="searchData" :search-data="searchData" :class="isToggle && 'toggle'" class="isToggle" :store-list="storeList" @changeSearchType="changeSearchType" @toggleListingType="searchSmtListing(1)">
          <el-form-item slot="btn" label-width="0px">
            <el-button type="primary" @click="searchSmtListing(1)">搜索</el-button>
            <el-button @click="resetForm('searchDataRef')">重置</el-button>
          </el-form-item>
        </SearchHead>
      </div>
    </div>
    <el-button class="d-flex justify-content-center g-w100" size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down' " /></el-button>
    <el-tabs v-model="auditTabActiveName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in tabActiveList"
                   :key="index"
                   :label="`${item.label}(${item.auditTabActiveTotal})`"
                   :name="item.value"
      />
      <ShopeeTable ref="shopeeTable" :audit-tab-active-name="auditTabActiveName" :audit-tab-active-num="auditTabActiveNum" :search-data="searchData" @changeCheckIds="changeCheckIds" @changeStatus="getStatisticsStatus" />
    </el-tabs>
  </basic-container>
</template>
<script>
import syncFromPlatformBtn from '@/views/components/syncFromPlatformBtn.vue'
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import { updateIsNoPriceChange } from '@/api/aliExpress/aliexpress.js'
import { statisticsStatus } from '@/api/lmsCommon.js'
import ShopeeTable from './components/shopeeTable'
// import changeIsNoPrice from './components/changeIsNoPrice.vue'
import batchUpdateModal from './components/batchUpdateModal.vue'
import addListing from './_addListing.vue'
import addVaryListing from './_addVaryListing.vue'
import batchUpdateDate from './modal/batchUpdateDate.vue'
import { tabActiveList } from './components/addListing.handle.js'
import SearchHead from '../../components/searchHead/index.vue'
import { generateRandomNum } from '@/views/components/utils.js'
/** 分割线 */
import { cancelPrice } from '@/api/shopee/shopee'
export default {
  name: 'LmsLmsShopeeShopeeShopeeList',
  components: {
    ShopeeTable,
    syncFromPlatformBtn,
    SearchHead
  },
  data() {
    return {
      formAttrs: [
        { slot: 'searchType', type: 'searchType', span: 9, labelWidth: '0', prop: 'searchSort' },
        { slot: 'selectStore', type: 'selectStore', span: 6, label: '店铺', prop: 'accounts' },
        { slot: 'selectUser', type: 'selectUser', span: 5, label: '创建人' },
        {
          label: '是否后台刊登',
          prop: 'isAliexpressUpload',
          span: 4,
          type: 'select',
          items: (cb) => cb(this.isAliexpressUploadOption),
          events: {
            change: () => {
              this.searchSmtListing(1)
            }
          }
        },
        { slot: 'dateTime', type: 'dateTime', prop: 'dateTime', span: 7, label: '创建时间', dateTimeStart: 'createTimeStart', dateTimeEnd: 'createTimeEnd' },
        {
          label: '是否预售',
          prop: 'isPreOrder',
          span: 4,
          type: 'select',
          items: (cb) => cb(this.isAliexpressUploadOption),
          events: {
            change: () => {
              this.searchSmtListing(1)
            }
          }
        },
        {
          label: '是否含有活动价',
          prop: 'isAliexpressPrice',
          labelWidth: '98px',
          span: 5,
          type: 'select',
          items: (cb) => cb(this.isAliexpressUploadOption),
          events: {
            change: () => {
              this.searchSmtListing(1)
            }
          }
        },
        { slot: 'listingType', type: 'listingType', prop: 'listingType', span: 6, label: 'Listing类型' },
        { slot: 'btn', span: 4, labelWidth: '0' }
      ],
      isToggle: true,
      checkIds: [],
      checkItems: [],
      itemIds: [],
      storeList: [],
      searchData: {
        isAliexpressUpload: null, // 是否后台刊登
        listingType: '',
        createUser: '',
        accounts: [],
        searchType: '',
        isPreOrder: null, // 是否预售
        isAliexpressPrice: null, // 活动价
        searchContentNum: '',
        searchContent: [],
        upOnlineTimeStart: '',
        upOnlineTimeEnd: '',
        createTimeStart: '',
        createTimeEnd: '',
        isSearchSort: false,
        searchSort: 1 // 搜索类别 1-子sku 2-父sku 默认为:1
      },
      isAliexpressUploadOption: [{ label: '请选择', value: null }, { label: '是', value: true }, { label: '否', value: false }],
      loadingUser: false,
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,

      tabActiveList: tabActiveList()
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
    this.searchSmtListing()
    this.getOptionsWithPlatformCode()
  },
  methods: {
    // 切换类型
    changeSearchType(val) {
      this.searchData.isSearchSort = ![1, 5].includes(val)
    },
    refreshList() {
      this.$refs.shopeeTable.getListingData()
    },
    getStatisticsStatus() {
      statisticsStatus({ ...this.searchData, listingStatus: Number(this.auditTabActiveNum) }, 'shopee').then(res => {
        const data = res.data
        this.tabActiveList = tabActiveList()
        Object.keys(data).forEach(item => {
          this.tabActiveList[Number(item) - 1].auditTabActiveTotal = data[item]
        })
      })
    },
    // 接收子组件勾选的ids
    changeCheckIds(ids, item, itemIds) {
      this.checkItems = item // 当前被勾选的对象
      this.checkIds = ids
      this.itemIds = itemIds
    },
    // addIsNoPrice() {
    //   this.$modal({
    //     title: '加入不可调价',
    //     component: changeIsNoPrice,
    //     data: {
    //       checkIds: this.checkIds
    //     },
    //     callback: refresh => {
    //       refresh && this.searchSmtListing()
    //     }
    //   })
    // },
    // 单个listing
    createListing(row) {
      this.$newTab({
        path: row ? '/lms/shopee/edit/listing' + row.id : '/lms/shopee/add/listing' + generateRandomNum(),
        title: row ? '编辑单个普通Listing' : '创建单个普通Listing',
        component: addListing,
        data: { current: { ...row } },
        callback: refresh => {
          refresh && this.searchSmtListing()
        }
      })
    },
    // vary listing
    createVaryListing(row) {
      this.$newTab({
        path: row ? '/lms/shopee/edit/varylisting' + row.id : '/lms/shopee/add/varylisting' + generateRandomNum(),
        title: row ? '编辑Listing' : '创建Listing',
        component: addVaryListing,
        clearCache: true,
        data: { current: row, type: 'Variation' },
        callback: refresh => {
          refresh && this.searchSmtListing()
        }
      })
    },
    delIsNoPrice() {
      this.$confirm('移出不可调价,将同时移出系统不可调价和手动不可调价，请确认是否移出？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateIsNoPriceChange({ ids: this.checkIds }).then(res => {
          this.$message.success(res.msg)
          this.searchSmtListing()
        })
      })
    },
    // 批量更新价格/库存弹窗
    batchUpdate() {
      this.$modal({
        title: '批量更新价格/库存',
        component: batchUpdateModal,
        width: '650px',
        minHeight: '300px',
        padding: '20px',
        data: {
          selectedIds: this.checkIds,
          productStatus: this.auditTabActiveNum
        },
        callback: refresh => {
          refresh && this.searchSmtListing()
        }
      })
    },
    // 批量取消listing活动价
    batchCancel() {
      this.$confirm('请确认是否取消选中listing活动价？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelPrice({ ids: JSON.stringify(this.checkIds) }).then(res => {
          this.$message.success(res.msg)
        })
      }).catch(() => {})
    },
    getOptionsWithPlatformCode() {
      optionsWithPlatformCode({ platformCode: 'SP' }).then(res => {
        this.storeList = res.data
      })
    },
    // 查询速卖通的listing
    searchSmtListing(current = 1) {
      this.$refs.shopeeTable && this.$refs.shopeeTable.listSmtListing(current)
      this.getStatisticsStatus()
    },
    // 清空
    resetForm(formName) {
      this.$refs[formName].resetSearch()
      this.searchData.accounts = []
      this.$nextTick(() => {
        this.searchSmtListing(1)
      })
    },
    // 切换状态
    handleTabClick(item) {
      this.auditTabActiveNum = Number(item.index) + 1
      // 切换tab清空选中数据
      this.checkIds = []
      this.itemIds = []
      this.$nextTick(() => {
        this.searchSmtListing(1)
      })
    },
    changeTotal(val) {
      this.tabActiveList.forEach(item => {
        if (item.label === this.auditTabActiveName) {
          item.auditTabActiveTotal = val
        } else {
          item.auditTabActiveTotal = 0
        }
      })
    },
    // 批量更新发货期
    batchUpdateDate() {
      const orderList = this.checkItems.map(item => {
        return {
          itemId: item.itemId,
          id: item.id,
          account: item.account,
          daysToShip: item.daysToShip, // 预售天数
          isPreOrder: item.isPreOrder// 是否预售
        }
      })
      this.$modal({
        title: '批量更新发货期',
        component: batchUpdateDate,
        data: {
          orderList: orderList
        },
        callback: refresh => {
          refresh && this.searchSmtListing()
        }
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
</style>
