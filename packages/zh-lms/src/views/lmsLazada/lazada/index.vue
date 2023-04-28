<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" :expand-row-keys="expandIds" row-key="id" :row-class-name="setClassName" @select="select" @expand-change="expandChange">
      <template slot="header">
        <div class="pb-2">
          <el-button type="primary" size="mini" @click="createListing()">创建Listing</el-button>
          <!-- <el-button v-if="[1,5].includes(auditTabActiveNum)" type="primary" size="mini" :disabled="!checkIds.length" @click="batchUpdate()">批量更新价格/库存</el-button> -->
        </div>
        <el-form ref="searchDataRef" size="mini" :model="searchData" class="search-flex no-message form-col">
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item prop="searchType">
                <el-row>
                  <el-col :span="6" class="mb-0">
                    <el-select v-model="searchData.searchType" size="mini" placeholder="请选择" clearable>
                      <el-option v-for="(item,index) in findform.searchTypeOption" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-col>
                  <el-col :span="searchData.searchType === 2?11:18" class="mb-0">
                    <div style="margin-left:10px">
                      <template v-if="searchData.searchType ===1">
                        <el-input v-model="searchData.searchContent" style="width:100%;height:28px" size="mini" placeholder="请输入" clearable />
                      </template>
                      <template v-else>
                        <el-input v-model="searchData.searchContent" resize="none" type="textarea" style="width:100%;height:28px" size="mini" placeholder="请输入" clearable />
                      </template>
                    </div>
                  </el-col>
                  <el-col v-if="searchData.searchType === 2" :span="7" class="mb-0">
                    <div style="margin-left:10px;">
                      <el-radio-group v-model="searchData.searchSort">
                        <el-radio :label="1">子</el-radio>
                        <el-radio :label="2">父</el-radio>
                      </el-radio-group>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="店铺" prop="storeCodes" label-width="40px">
                <el-select v-model="searchData.storeCodes" filterable multiple collapse-tags placeholder="请选择" size="mini" style="width:100%;" clearable>
                  <el-option v-for="item in findform.accountOption" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="创建人" prop="createUser" label-width="50px">
                <g-select v-model="searchData.createUser" :items="findform.createUserOption" key-field="id" label-field="nameJobNumber" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间" prop="createStartTime" label-width="60px">
                <div class="d-flex">
                  <el-date-picker v-model="searchData.createStartTime" type="datetime" default-time="00:00:00" value-format="timestamp" :picker-options="pickerOptionsCreateTimeStart" placeholder="开始时间" /><span class="ms-1 me-1">-</span>
                  <el-date-picker v-model="searchData.createEndTime" type="datetime" default-time="23:59:59" value-format="timestamp" :picker-options="pickerOptionsCreateTimeEnd" placeholder="结束时间" />
                </div>
              </el-form-item>
            </el-col>
            <el-col v-if="auditTabActiveNum>4" :span="7" style="height:47px">
              <el-form-item label="上架时间" prop="upOnlineStartTime" label-width="60px">
                <div class="d-flex">
                  <el-date-picker v-model="searchData.upOnlineStartTime" type="datetime" default-time="00:00:00" value-format="timestamp" :picker-options="pickerOptionsStart" placeholder="选择日期时间" /><span class="ms-1 me-1">-</span>
                  <el-date-picker v-model="searchData.upOnlineEndTime" type="datetime" default-time="23:59:59" value-format="timestamp" :picker-options="pickerOptionsEnd" placeholder="选择日期时间" />
                </div>
              </el-form-item>
            </el-col>
            <el-col v-if="auditTabActiveNum>4" :span="3">
              <el-form-item label="站点" prop="site" label-width="40px">
                <el-select v-model="searchData.site" filterable placeholder="请选择" size="mini" style="width:100%;" clearable>
                  <el-option v-for="item in findform.siteOption" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Listing类型" prop="listingType" label-width="80px">
                <el-button-group v-model="searchData.listingType">
                  <el-button v-for="(item,index) in findform.listingTypeOption" :key="index" :type="item.isActive?'primary':''" :value="item.value" @click="toggleListingType(item)">{{ item.label }}</el-button>
                </el-button-group>
              </el-form-item>
            </el-col>
            <el-col v-if="auditTabActiveNum<5" :span="3">
              <el-form-item label="站点" prop="site" label-width="40px">
                <el-select v-model="searchData.site" filterable placeholder="请选择" size="mini" style="width:100%;" clearable>
                  <el-option v-for="item in findform.siteOption" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否后台刊登" prop="isLazadaUpload" label-width="90px">
                <el-select v-model="searchData.isLazadaUpload" clearable @change="searchSmtListing(1)">
                  <el-option v-for="(item,index) in isAliexpressUploadOption" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <div style="margin-left:10px">
                <el-button type="primary" size="mini" @click="search">搜索</el-button>
                <el-button size="mini" @click="clearSearch">清空</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-tabs v-model="auditTabActiveName" @tab-click="handleTabClick">
          <el-tab-pane v-for="(v, k, index) in tabActiveList"
                       :key="index"
                       :label="`${v.label}${v.auditTabActiveTotal!==0?`(${v.auditTabActiveTotal})`:''}`"
                       :name="v.label"
                       :stretch="true"
          />
        </el-tabs>
        <el-row type="flex" justify="end" class="pb-2">
          <el-button type="success" size="mini" :disabled="!checkIds.length" @click="batchDetails">批量打开详情页</el-button>
          <el-button v-if="auditTabActiveName === 'Canceled'" type="danger" size="mini" :disabled="!checkIds.length" @click="reShelve()">重新上架</el-button>
          <el-button v-if="showDel" type="success" size="mini" :disabled="!checkIds.length" @click="batchDel()">删除</el-button>
          <el-button v-if="showUnShelve" type="success" size="mini" :disabled="!checkIds.length" @click="unShelve()">下架</el-button>
          <el-button v-if="auditTabActiveName === 'Draft'" type="warning" size="mini" :disabled="!checkIds.length" @click="listingAudit()">提交审核</el-button>
          <el-button v-if="['Draft', 'Approving'].includes(auditTabActiveName)" type="warning" size="mini" :disabled="!checkIds.length" @click="getUpdateListing">上传</el-button>
          <!-- <el-button size="mini" @click="handlerAllImport">批量导入UPC</el-button> -->
        </el-row>
      </template>
      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :label-width="item.labelWidth" :arr-key="item.key" :item-data="item.itemData" />
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
import { getLazadaListing, listVariant } from '@/api/lazada/lazadaList.js'
import { optionsWithPlatformCode, getUserList, optionsSiteCode } from '@/api/amazon/amazon.js'
import lazadaTable from './components/lazadaTable.vue'
import AddListing from './addListing.vue'
import batchUpdateModal from './components/batchUpdateModal.vue'
import { tabActiveList } from './components/addListing.handle.js'
export default {

  name: 'LmsLmsAliExpressAliExpressAliExpressList',
  components: {
    lazadaTable
  },
  data() {
    return {
      platItem: platItem,
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
                    {
                      label: '状态',
                      key: 'id',
                      type: 'text'
                    },
                    {
                      label: 'SKU',
                      key: 'id',
                      type: 'text'
                    },
                    {
                      label: '平台SKU',
                      key: 'id',
                      type: 'text'
                    }
                  ]
                },
                {
                  label: '主图',
                  type: 'image',
                  key: 'viewUrl'
                },
                {
                  label: '库存',
                  type: 'text',
                  key: 'quantity'
                },
                {
                  label: '成本',
                  type: 'text',
                  key: 'viewUrl'
                },
                {
                  label: '售价',
                  type: 'text',
                  key: 'sgRetailPrice'
                },
                {
                  label: '促销价',
                  type: 'text',
                  key: 'sgSalesPrice'
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
              key: 'spu',
              type: 'label-text',
              inlineText: 'variantCount',
              inlineType: 'Variation'
            },
            { label: '平台SKU', key: 'sellerSku', type: 'label-text' },
            { label: 'ItemID', key: 'itemId', type: 'label-text' }
          ]
        },
        {
          path: 'MainImage',
          itemData: [
            { key: 'masterImage', type: 'iamge' }
          ]
        },
        {
          path: 'Title',
          labelWidth: '0',
          itemData: [
            { key: 'name', type: 'text' }
          ]
        },
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
          labelWidth: '30',
          itemData: [
            { label: '创建', key: 'createTime', type: 'label-text' }
          ]
        },
        {
          path: 'PersonInfo',
          itemData: [
            { label: '创建人', key: 'createUserName', type: 'label-text' },
            { label: '负责人', key: 'saleUserName', type: 'label-text' },
            { label: '开发', key: 'developerName', type: 'label-text' }
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
        upOnlineStartTime: '',
        isLazadaUpload: null,
        listingType: [],
        createUser: null,
        storeCodes: [],
        site: '',
        searchType: '',
        searchContent: '',
        upOnlineEndTime: '',
        createStartTime: '',
        createEndTime: '',
        isLazadaPublish: null,
        searchSort: 1 // 搜索类别 1-子sku 2-父sku 默认为:1
      },
      findform: {
        createUserOption: [],
        searchTypeOption: [
          { label: '标题', value: 1 },
          { label: 'SKU', value: 2 },
          { label: '平台SKU', value: 3 },
          { label: 'ItemID', value: 4 }
        ],
        accountOption: [],
        siteOption: [],
        listingTypeOption: [
          { label: 'Normal', value: 'Normal', isActive: false },
          { label: 'Variation', value: 'Variation', isActive: false },
          { label: 'Combo', value: 'Combo', isActive: false }
        ]
      },
      expandIds: [],
      loadingUser: false,
      pickerOptionsCreateTimeStart: {
        disabledDate: time => {
          if (this.searchData.createEndTime) {
            return (
              time.getTime() > new Date(this.searchData.createEndTime).getTime()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsCreateTimeEnd: {
        disabledDate: time => {
          if (this.searchData.createStartTime) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() < new Date(this.searchData.createStartTime).getTime()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.searchData.upOnlineEndTime) {
            return (
              time.getTime() > new Date(this.searchData.upOnlineEndTime).getTime()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.searchData.upOnlineStartTime) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() < new Date(this.searchData.upOnlineStartTime).getTime()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,
      tabActiveList: tabActiveList(),
      isAliexpressUploadOption: [{ label: '是', value: true }, { label: '否', value: false }]
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
  mounted() {
    this.getSiteList()
    this.getOptionsWithPlatformCode()
    this.getUserList()
    this.getData()
  },
  methods: {
    setClassName({ row, index }) {
      return ''
    },
    getData() {
      const params = {
        ...this.searchData,
        listingStatus: Number(this.auditTabActiveNum)
      }
      this.$refs.table.load(1, params)
    },
    search() {
      this.getData()
    },
    selectData(row) {
    },
    createListing() {
      this.$newTab({
        path: '/lms/lazada/add/listing',
        title: '创建Listing',
        component: AddListing,
        clearCache: true,
        callback: refresh => {
          refresh && this.searchSmtListing()
        }
      })
    },
    // 接收子组件勾选的ids
    changeCheckIds(ids) {
      this.checkIds = ids
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
          refresh && this.getAmazonTableList()
        }
      })
    },
    getOptionsWithPlatformCode() { // 获取店铺列表
      optionsWithPlatformCode({ platformCode: 'LZ' }).then(res => {
        this.findform.accountOption = res.data
      })
    },
    getSiteList() { // 获取站点列表
      optionsSiteCode({ platformCode: 'LZ' }).then(res => {
        this.findform.siteOption = res.data
      })
    },
    // 创建人列表
    getUserList(query) {
      this.loadingUser = true
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        this.loadingUser = false
        const records = res.data.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}${item.jobNumber}`
        })
        this.findform.createUserOption = records
      }).finally(() => {
        this.loadingUser = false
      })
    },
    toggleListingType(list) {
      this.findform.listingTypeOption.filter(item => {
        if (item.value === list.value && !list.isActive) {
          item.isActive = true
        } else {
          item.isActive = false
        }
        this.searchData.listingType = this.findform.listingTypeOption.filter(item => item.isActive).map(acc => acc.value)[0]
      })
      this.searchSmtListing(1)
    },
    fetch({ current, size }, params) {
      params.pageSize = size
      params.pageNumber = current
      params.searchContent = []
      params.listingType = params.listingType.toString()
      return getLazadaListing(params).then(res => {
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
    // 清空
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.searchData.searchContentNum = ''
      this.searchData.upOnlineEndTime = ''
      this.searchData.createEndTime = ''
      this.searchData.storeCodes = []
      this.findform.createUserOption = []
      this.getUserList()
      this.$nextTick(() => {
        this.searchSmtListing(1)
      })
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
    clearSearch() {
      this.resetForm('searchDataRef')
      this.searchData.searchContent = ''
      this.searchData.listingType = ''
      this.findform.listingTypeOption.forEach(item => {
        item.isActive = false
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
