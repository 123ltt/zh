<template>
  <basic-container>
    <div>
      <div :class="isToggle && 'toggle'" class="isToggle">
        <div class="mb-2">
          <el-button v-if="$auth('ali_save')" type="primary" size="mini" @click="createListing()">创建Listing</el-button>
          <el-button v-if="$auth('ali_updateIsNoPrice')" type="primary" size="mini" :disabled="!checkIds.length" @click="addIsNoPrice">加入不可调价</el-button>
          <el-button v-if="$auth('ali_updateIsNoPrice')" type="primary" size="mini" :disabled="!checkIds.length" @click="delIsNoPrice">移出不可调价</el-button>
          <el-button v-if="[1,5].includes(auditTabActiveNum) && $auth('ali_batch_feed')" type="primary" size="mini" :disabled="!checkIds.length" @click="batchUpdate()">批量更新价格/库存</el-button>
        </div>
        <SearchHead ref="searchDataRef"
                    :form-attrs="formAttrs"
                    :model="searchData"
                    :search-data="searchData"
                    :search-sort-option="searchSortOption"
                    :search-type-option="searchTypeOption"
                    :store-list="storeList"
                    @changeSearchType="changeSearchType"
                    @toggleListingType="searchSmtListing(1)"
        >
          <el-form-item slot="btn">
            <el-button type="primary" @click="searchSmtListing(1)">搜索</el-button>
            <el-button @click="resetForm('searchDataRef')">重置</el-button>
          </el-form-item>
        </SearchHead>
      </div>
    </div>
    <el-button class="d-flex justify-content-center g-w100" size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down' " /></el-button>
    <el-tabs v-model="auditTabActiveName" type="border-card" class="tab-box" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in tabActiveList"
                   :key="index"
                   :label="`${item.label}(${item.auditTabActiveTotal})`"
                   :name="item.label"
      />
      <AliExpressTable ref="aliExpressTable" :audit-tab-active-name="auditTabActiveName" :audit-tab-active-num="auditTabActiveNum" :search-data="searchData" @changeCheckIds="changeCheckIds" @changeStatus="getStatisticsStatus" />
    </el-tabs>
  </basic-container>
</template>
<script>
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import { updateIsNoPriceChange, statisticsStatus } from '@/api/aliExpress/list.js'
import { getSkuAffix } from '@/api/lmsCommon.js'
import AliExpressTable from './components/aliExpressTable.vue'
import AddListing from './addListing.vue'
import changeIsNoPrice from './components/changeIsNoPrice.vue'
import batchUpdateModal from './components/batchUpdateModal.vue'
import { tabActiveList } from './components/aliExpress.handle.js'
import SearchHead from '../../components/searchHead/index.vue'
import { generateRandomNum } from '@/views/components/utils.js'
const searchData = () => ({
  upOnlineTime: [],
  isAliexpressUpload: null,
  listingType: '',
  createUser: '',
  accounts: [],
  searchType: undefined,
  searchContent: [],
  searchContentNum: '',
  upOnlineTimeStart: '',
  upOnlineTimeEnd: '',
  createTimeStart: '',
  createTimeEnd: '',
  isSearchSort: false,
  isNoPriceChangeBool: null,
  warehouseIds: [],
  searchSort: 1 // 搜索类别 1-子sku 2-父sku 默认为:1
})
export default {
  name: 'LmsLmsAliExpressAliExpressAliExpressList',
  components: {
    AliExpressTable,
    SearchHead
  },
  data() {
    return {
      isToggle: true,
      formAttrs: [
        { slot: 'searchType', type: 'searchType', span: 9, labelWidth: '0', prop: 'searchSort' },
        { slot: 'selectStore', type: 'selectStore', span: 6, label: '店铺', props: 'accounts' },
        { slot: 'selectUser', type: 'selectUser', span: 5, label: '创建人' },
        { label: '后台刊登', span: 4, prop: 'isAliexpressUpload', type: 'select', items: (cb) => cb(this.isAliexpressUploadOption) },
        { slot: 'dateTime', type: 'dateTime', prop: 'dateTime', span: 9, label: '创建时间', dateTimeStart: 'createTimeStart', dateTimeEnd: 'createTimeEnd' },
        { label: '不可调价', span: 5, prop: 'isNoPriceChangeBool', type: 'select', items: (cb) => cb(this.isAliexpressUploadOption) },
        { slot: 'listingType', type: 'listingType', prop: 'listingType', span: 6, label: 'Listing类型' },
        {
          label: '仓库',
          span: 8,
          prop: 'warehouseIds',
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: (resolve) => { this.getWareHouseList(resolve) },
          attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }
        },
        { slot: 'btn', span: 4 }
      ],
      checkIds: [],
      searchData: searchData(),
      searchSortOption: [{ label: '子', value: 1 }, { label: '父', value: 2 }],
      findform: {
        createUserOption: [],

        listingTypeOption: [
          { label: 'Normal', value: 'Normal', isActive: false },
          { label: 'Variation', value: 'Variation', isActive: false },
          { label: 'Combo', value: 'Combo', isActive: false }
        ]
      },
      storeList: [],
      loadingUser: false,
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,
      tabActiveList,
      searchTypeOption: [{ label: '标题', value: 1 }, { label: 'SKU', value: 2 }, { label: '平台SKU', value: 3 }, { label: 'ItemID', value: 4 }, { label: 'ListingID', value: 5 }],
      isAliexpressUploadOption: [{ label: '请选择', value: null }, { label: '是', value: true }, { label: '否', value: false }]
    }
  },
  watch: {
    auditTabActiveNum() {
      const upOnlineDateTime = { slot: 'upOnlineDateTimeateTime', prop: 'upOnlineDateTimeateTime', type: 'dateTime', span: 7, label: '上架时间', dateTimeStart: 'upOnlineTimeStart', dateTimeEnd: 'upOnlineTimeEnd' }
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
    this.searchSmtListing(1)
    this.getOptionsWithPlatformCode()
  },
  methods: {
    // 切换类型
    changeSearchType(val) {
      this.searchData.isSearchSort = ![1, 4, 5].includes(val)
      this.searchData.searchSort = [1, 4, 5].includes(val) ? '' : this.searchData.searchSort
    },
    // 修改创建人
    createListing() {
      this.$newTab({
        path: '/lms/aliExpress/add/listing' + generateRandomNum(),
        title: '创建Listing',
        component: AddListing,
        clearCache: true,
        callback: refresh => {
          refresh && this.searchSmtListing(1)
        }
      })
    },
    // 仓库
    getWareHouseList(resolve) {
      getSkuAffix([]).then(res => {
        const local = {
          affixContent: '',
          type: 'SELF_BUILT',
          value: 'Z20',
          label: '本地仓'
        }
        let list = []
        const data = res.data || []
        data.forEach(item => {
          item.affixList.forEach(affix => {
            affix.warehouseList.forEach(item => {
              if (item.warehouseName.indexOf('/自建仓/深圳仓') === -1) {
                item.warehouseName = (item.warehouseName.substring(item.warehouseName.length - 1) === '/') ? item.warehouseName.substring(0, item.warehouseName.length - 1) : item.warehouseName
                item.warehouseName = item.warehouseName.substring(1).replaceAll('/', '>')
                list.push({
                  affixContent: affix.affixContent,
                  type: item.type,
                  value: `${affix.affixContent}-${affix.ruleName}-${item.deliveryWarehouse}`,
                  label: `${affix.affixContent ? '(' + affix.affixContent + ')' : ''}${item.warehouseName}(${affix.ruleName})`,
                  virtualWarehouse: item.virtualWarehouse
                })
              }
            })
          })
        })
        const obj = {} // 去重
        list = [local, ...list].reduce((cur, next) => {
          !obj[next.value] && ((obj[next.value] = true) && cur.push(next))
          return cur
        }, [])
        resolve(list)
      })
    },
    // 接收子组件勾选的ids
    changeCheckIds(ids) {
      this.checkIds = ids
    },
    addIsNoPrice() {
      this.$modal({
        title: '速卖通加入不可调价',
        component: changeIsNoPrice,
        data: {
          checkIds: this.checkIds
        },
        callback: refresh => {
          if (refresh) {
            this.searchSmtListing(1)
          }
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
          this.searchSmtListing(1)
        })
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
          selectedIds: this.checkIds,
          productStatus: this.auditTabActiveNum
        },
        callback: refresh => {
          refresh && this.searchSmtListing(1)
        }
      })
    },
    getOptionsWithPlatformCode() {
      optionsWithPlatformCode({ platformCode: 'SM' }).then(res => {
        this.storeList = res.data
      })
    },
    // 查询速卖通的listing
    searchSmtListing(current = 1) {
      this.$refs.aliExpressTable.listSmtListing(current)
      this.getStatisticsStatus()
      this.checkIds = []
    },
    // 清空
    resetForm(formName) {
      this.$refs[formName].resetSearch()
      this.$nextTick(() => {
        this.searchSmtListing(1)
      })
    },
    // 切换状态
    handleTabClick(item) {
      this.auditTabActiveNum = this.tabActiveList[item.index].value
      this.$nextTick(() => {
        this.searchSmtListing(1)
      })
    },
    // 统计状态数量
    getStatisticsStatus() {
      const { searchContent } = this.searchData
      const params = Object.assign({
        ...this.searchData,
        upOnlineTime: undefined,
        searchContent: searchContent,
        listingStatus: Number(this.auditTabActiveNum),
        pageNumber: 1,
        pageSize: 10
      })
      statisticsStatus(params).then(res => {
        const data = res.data || {}
        // 统计查询无数据时，统计为0
        this.tabActiveList.forEach(item => {
          item.auditTabActiveTotal = data[item.value] || 0
        })
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
  .search-flex{
    display: flex;
    flex-wrap:wrap;
    flex-direction:row;
  }
  ::v-deep .el-textarea__inner{
    height: 30px;
  }
  ::v-deep .el-radio{
    margin-right: 6px;
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
