<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" :expand-row-keys="expandIds" row-key="id" :row-class-name="setClassName" @select="select" @expand-change="expandChange">
      <template slot="header">
        <div class="pb-2">
          <el-button type="primary" size="mini" @click="createListing()">创建Listing</el-button>
          <!-- <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" :disabled="!checkIds.length" @click="batchUpdate()">批量更新价格/库存</el-button> -->
          <!-- <el-button type="primary" size="mini" @click="turnToDetail">详情</el-button> -->
        </div>
        <SearchHead ref="searchDataRef" :form-attrs="formAttrs" :search-data="searchData" :class="isToggle && 'toggle'" class="isToggle" @changeSearchType="changeSearchType">
          <el-form-item slot="btn">
            <el-button type="primary" @click="search(1)">搜索</el-button>
            <el-button @click="clearSearch('searchDataRef')">重置</el-button>
          </el-form-item>
        </SearchHead>
        <el-button class="d-flex justify-content-center g-w100" size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down' " /></el-button>
        <el-tabs v-model="auditTabActiveName" @tab-click="handleTabClick">
          <el-tab-pane v-for="(v, k, index) in tabActiveList"
                       :key="index"
                       :label="`${v.label}(${v.auditTabActiveTotal})`"
                       :name="v.label"
                       :stretch="true"
          />
        </el-tabs>
        <el-row type="flex" justify="end" class="pb-2">
          <!-- <el-button type="success" size="mini" :disabled="!checkIds.length" @click="batchDetails">批量打开详情页</el-button> -->
          <skuCompImport v-if="['Online', 'Update Failed','Match Failed','Canceled'].includes(auditTabActiveName)" :check-ids="checkIds" source="walmart" text="sku对照表导入" @refreshList="getData()" />
          <el-button v-if="auditTabActiveName === 'Canceled'" type="danger" size="mini" :disabled="!checkIds.length" @click="reShelve()">重新上架</el-button>
          <el-button v-if="showDel" type="success" size="mini" :disabled="!checkIds.length" @click="batchDel()">删除</el-button>
          <el-button v-if="showUnShelve" type="success" size="mini" :disabled="!checkIds.length" @click="unShelve()">下架</el-button>
          <el-button v-if="auditTabActiveName === 'Draft'" type="warning" size="mini" :disabled="!checkIds.length" @click="listingAudit()">提交审核</el-button>
          <el-button v-if="['Draft', 'Approving'].includes(auditTabActiveName)" type="warning" size="mini" :disabled="!checkIds.length" @click="getUpdateListing">上传</el-button>
          <!-- <el-button size="mini" @click="handlerAllImport">批量导入UPC</el-button> -->
        </el-row>
      </template>
      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :label-width="item.labelWidth" :arr-key="item.key" :item-data="item.itemData" />
      <el-table-column slot="Title" label="标题">
        <template slot-scope="{ row }">
          <g-link @click="handleTitleCell(row)">
            <g-text-ellipsis>{{ row.name }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" class="ms-0" @click="handleEdit(row)">编辑</el-button><br>
          <el-button type="text" size="mini" class="ms-0" @click="batchDel(row)">删除</el-button><br>
          <el-button type="text" size="mini" class="ms-0" @click="handleRecord(row)">日志</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import platItem from '../../components/platItem/index.js'
import { listVariant } from '@/api/lazada/lazadaList.js'
import { walmartlisting } from '@/api/walmart/walmart.js'
import { optionsWithPlatformCode } from '@/api/amazon/amazon.js'
import walmartTable from './components/table/table.vue'
import AddListing from './addListing.vue'
import { statisticsStatus } from '@/api/lmsCommon.js'
// import batchUpdateModal from './components/batchUpdateModal.vue'
import { tabActiveList } from './addListing.handle.js'
import logListing from './components/logListing'
import SearchHead from '../../components/searchHead/index.vue'
import { generateRandomNum } from '@/views/components/utils.js'
import walmartDetail from './~walmartDetail.vue'

export default {
  name: 'WakmartList',
  components: {
    walmartTable,
    SearchHead
  },
  data() {
    return {
      platItem: platItem,
      formAttrs: [
        { slot: 'searchType', type: 'searchType', span: 9, labelWidth: '0', prop: 'searchSort' },
        { label: '店铺', prop: 'storeCodes', span: 6, labelField: 'displayName', valueField: 'displayName', type: 'select', attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }, items: this.getOptionsWithPlatformCode },
        { slot: 'selectUser', type: 'selectUser', span: 5, label: '创建人' },
        { label: '是否后台刊登', prop: 'isWalmartUpload', span: 4, type: 'select', items: (cb) => cb(this.isAliexpressUploadOption) },
        { slot: 'dateTime', type: 'dateTime', prop: 'dateTime', span: 9, label: '开始时间', dateTimeStart: 'createStartTime', dateTimeEnd: 'createEndTime' },
        { label: '是否海外仓', prop: 'isOverseasWarehouses', span: 5, type: 'select', items: (cb) => cb(this.isAliexpressUploadOption) },
        { slot: 'listingType', type: 'listingType', prop: 'listingType', span: 6, label: 'Listing类型' },
        { slot: 'btn', span: 4 }
      ],
      pageConfig: [
        {
          path: 'Expand',
          itemData: [
            {
              type: 'expand',
              table: [
                {
                  type: 'label-text',
                  label: '子SKU',
                  item: [
                    // {
                    //   label: '状态',
                    //   key: 'id',
                    //   type: 'text'
                    // },
                    {
                      label: 'SKU',
                      key: 'productSku',
                      type: 'text'
                    },
                    {
                      label: '平台SKU',
                      key: 'sellerSku',
                      type: 'text'
                    },
                    {
                      label: 'itemId',
                      key: 'itemId',
                      type: 'text'
                    }
                  ]
                },
                {
                  label: '主图',
                  type: 'image',
                  key: 'imageUrl'
                },
                {
                  label: '标题',
                  type: 'text',
                  key: 'title'
                },
                {
                  label: '库存',
                  type: 'text',
                  key: 'stock'
                },
                {
                  label: '成本',
                  type: 'text',
                  key: 'costPrice'
                },
                {
                  label: '售价',
                  type: 'text',
                  key: 'price'
                },
                {
                  label: '时间',
                  type: 'text',
                  item: [
                    {
                      label: '创建',
                      key: 'createTime',
                      type: 'text'
                    },
                    {
                      label: '上架',
                      key: 'offerStartDate',
                      type: 'text'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: 'SKU',
          itemData: [
            {
              label: 'SKU',
              key: 'productSpu',
              type: 'label-text',
              inlineText: 'variantCount',
              inlineType: 'Variation'
            },
            { label: '平台SKU', key: 'sellerSku', type: 'label-text' },
            { label: 'ItemID', key: 'groupId', type: 'label-text' }
          ]
        },
        {
          path: 'MainImage',
          itemData: [
            { key: 'masterImage', type: 'iamge' }
          ]
        },
        // {
        //   path: 'Title',
        //   labelWidth: '0',
        //   itemData: [
        //     { key: 'name', type: 'text' }
        //   ]
        // },
        {
          path: 'Store',
          labelWidth: '0',
          itemData: [
            { key: 'storeName', type: 'text' }
          ]
        },
        {
          path: 'Site',
          labelWidth: '0',
          itemData: [
            { key: 'site', type: 'text' }
          ]
        },
        {
          path: 'Endpub',
          labelWidth: '0',
          itemData: [
            { key: 'isLazadaUpload', type: 'select', selectList: ['否', '是'] }
          ]
        },
        {
          path: 'Time',
          labelWidth: '60',
          itemData: [
            { label: '创建', key: 'createTime', type: 'label-text' },
            { label: '上架', key: 'upOnlineTime', type: 'label-text' },
            { label: '定时刊登', key: 'timedUploadTime', type: 'label-text' }
          ]
        },
        {
          path: 'PersonInfo',
          labelWidth: '50',
          itemData: [
            { label: '创建人', key: 'createUserName', type: 'label-text' },
            { label: '负责人', key: 'saleUserName', type: 'label-text' },
            { label: '开发', key: 'developUser', type: 'label-text' },
            { label: '客服', key: 'developerName', type: 'label-text' }
          ]
        }
      ],
      headers: [
        { type: 'selection' },
        { slot: true, slotName: 'Expand' },
        { slot: true, slotName: 'SKU' },
        { slot: true, slotName: 'MainImage' },
        { slot: true, slotName: 'Title' },
        { slot: true, slotName: 'Store' },
        { slot: true, slotName: 'Site' },
        { slot: true, slotName: 'Endpub' },
        { slot: true, slotName: 'Time' },
        { slot: true, slotName: 'PersonInfo' },
        { slot: true, slotName: 'handler' }
      ],
      textarea: '',
      isToggle: true,
      checkIds: [],
      searchData: {
        isWalmartUpload: null, // 是否后台刊登
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
        isSearchSort: false,
        searchSort: 1 // 搜索类别 1-子sku 2-父sku 默认为:1
      },
      expandIds: [],
      loadingUser: false,
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,
      tabActiveList: tabActiveList(),
      isAliexpressUploadOption: [{ label: '请选择', value: null }, { label: '是', value: true }, { label: '否', value: false }]
    }
  },
  computed: {
    showDel() { // 显示删除
      return ['Draft', 'Upload Failed', 'Online', 'Update Failed', 'Pending QC', 'Out Of Stock', 'Canceled', 'Suspend'].includes(this.auditTabActiveName)
    },
    showUnShelve() { // 显示下架
      return ['Online', 'Out Of Stock', 'Suspend', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    },
    showEdit() { // 显示编辑
      return ['Draft', 'Upload Failed', 'Online', 'Pending QC', 'Out Of Stock', 'Canceled', 'Suspend'].includes(this.auditTabActiveName)
    },
    isShowDesc() { // 显示报错信息
      return ['Upload Failed', 'Update Failed', 'Pending QC'].includes(this.auditTabActiveName)
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
    this.getData()
  },
  methods: {
    // 切换类型
    changeSearchType(val) {
      this.searchData.isSearchSort = ![1, 5].includes(val)
    },
    // 详情
    // turnToDetail() {
    //   this.$newTab({
    //     path: '/lms/walmartList/walmartDetail',
    //     title: 'listing详情',
    //     component: walmartDetail,
    //     data: {
    //     },
    //     clearCache: true,
    //     callback: refresh => {
    //       refresh && console.log(refresh, '打印详情')
    //     }
    //   })
    // },
    // 状态条数
    getStatisticsStatus() {
      statisticsStatus({ ...this.searchData, listingStatus: Number(this.auditTabActiveNum) }, 'walmart').then(res => {
        const data = res.data
        this.tabActiveList = tabActiveList()
        Object.keys(data).forEach(item => {
          this.tabActiveList[Number(item) - 1].auditTabActiveTotal = data[item]
        })
      })
    },
    select(checkedList = [], row) {
      if (row) { // 单选
        if (checkedList.includes(row)) {
          this.checked.push(row.id)
        } else {
          this.checked = this.checked.filter(item => item.id !== row.id)
        }
      } else { // 全选
        const rest = []
        if (checkedList.length > 0) {
          rest.push(...checkedList.map(item => item.id))
        }
        this.checked = rest
      }
    },
    setClassName({ row, index }) {
      return ''
    },
    getData() {
      const params = {
        ...this.searchData,
        listingStatus: Number(this.auditTabActiveNum)
      }
      this.$refs.table && this.$refs.table.load(1, params)
      // this.getStatisticsStatus()
    },
    search() {
      this.getData()
    },
    // batchDetails() {
    //   this.checkItems.forEach(item => {
    //     this.$newPage({
    //       path: 'lms/lmsWalmart/view/listing' + item.id,
    //       title: '查看listing',
    //       data: {
    //         id: item.id,
    //         itemId: item.itemId,
    //         isNewPage: true
    //       },
    //       callback() {
    //         console.log(arguments)
    //       }
    //     })
    //   })
    // },
    selectData(row) {
    },
    // 上传
    getUpdateListing() {},
    handleEdit(row) {
      this.createListing(row)
    },
    createListing(row) {
      this.$newTab({
        path: row ? '/lms/walmart/edit/listing' + row.id : '/lms/walmart/add/listing' + generateRandomNum(),
        title: row ? '编辑Listing' : '创建Listing',
        component: AddListing,
        clearCache: true,
        data: {
          id: row?.id,
          itemId: row?.itemId
        },
        callback: refresh => {
          refresh && this.search()
        }
      })
    },
    // 标题点击详情
    handleTitleCell(item) {
      this.$newTab({
        path: '/lms/lmsWalmart/view/listing' + item.id,
        title: '查看Listing详情',
        component: walmartDetail,
        clearCache: true,
        data: {
          id: item.id,
          itemId: item.itemId
        }
      })
    },
    // 接收子组件勾选的ids
    changeCheckIds(ids) {
      this.checkIds = ids
    },
    // 批量更新价格/库存弹窗
    batchUpdate() {
      // this.$modal({
      //   title: '批量更新价格/库存',
      //   component: batchUpdateModal,
      //   width: '600px',
      //   minHeight: '300px',
      //   padding: '20px',
      //   data: {
      //     selectedIds: this.checkIds,
      //     productStatus: this.auditTabActiveNum
      //   },
      //   callback: refresh => {
      //     refresh && this.getAmazonTableList()
      //   }
      // })
    },
    getOptionsWithPlatformCode(resolve) { // 获取店铺列表
      optionsWithPlatformCode({ platformCode: 'WM' }).then(res => {
        resolve(res.data)
      })
    },
    toggleListingType(val) {
      this.searchData.listingType = val
      this.search()
    },
    fetch({ current, size }, params) {
      params.size = size
      params.current = current

      return walmartlisting({ ...params }).then(res => {
        this.changeTotal(res.data.total)
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    expandChange(row, expandedRows) {
      if (row.children) return
      listVariant({ spuId: row.id }).then(res => {
        this.$set(row, 'childrens', res.data)
      })
    },
    // 查询速卖通的listing
    searchSmtListing(current = 1) {

      // this.$refs.lazadaTable && this.$refs.lazadaTable.listLazadaListing(current)
    },
    // 切换状态
    handleTabClick(item) {
      this.auditTabActiveNum = Number(item.index) + 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    changeTotal(val) {
      for (const p in this.tabActiveList) {
        const item = this.tabActiveList[p]
        if (item.label === this.auditTabActiveName) {
          item.auditTabActiveTotal = val
        } else {
          item.auditTabActiveTotal = 0
        }
      }
    },
    // 清空
    clearSearch(formName) {
      this.$refs[formName].resetSearch()
      this.searchData.searchContent = []
      this.searchData.listingType = ''
      this.$nextTick(() => {
        this.searchSmtListing(1)
      })
    },
    handleRecord(row) {
      this.$newTab({
        path: '/walmartList/logListing',
        title: '刊登管理/操作日志',
        component: logListing,
        data: {
          walmartListId: row.id,
          sellerSku: row.sellerSku
        },
        callback: refresh => {
          console.log(refresh)
        },
        clearCache: true
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
.head{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
