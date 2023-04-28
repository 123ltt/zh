<template>
  <div>
    <div class="head">
      <el-button type="success" size="mini" :disabled="!checkIds.length" @click="batchDetails">批量打开详情页</el-button>
      <!-- 父sku 勾选就勾上全部子 sku 只传 ids 传productStatus
          子sku 全部勾上之后，删掉其中一个，就去掉父sku勾选 传productStatus  variantIds disabledBatchDel
          单个删除子sku 才需要传 variantIds-->
      <skuCompImport
        v-if="['Online', 'Update Failed', 'Match Failed'].includes(auditTabActiveName)"
        :check-ids="checkIds"
        source="ebay"
        text="sku对照表导入"
        @refreshList="getListingData()"
      />
      <syncFromPlatformBtn
        v-if="['Online', 'Update Failed', 'Match Failed'].includes(auditTabActiveName)"
        :check-ids="checkIds"
        :check-item-ids="checkItemIds"
        :is-batch="true"
        source="ebay"
        text="从后台同步"
        @refreshList="getListingData()"
      />
      <el-button v-if="showDel" type="danger" size="mini" :disabled="!checkIds.length && !variantIds.length" @click="batchDel">下架</el-button>
      <el-button v-if="auditTabActiveName === 'Draft'" type="warning" size="mini" :disabled="!checkIds.length" @click="getAmazonlistingAudit">提交审核</el-button>
      <el-button v-if="['Draft','Approving'].includes(auditTabActiveName)" type="warning" size="mini" :disabled="!checkIds.length" @click="getUpdateListing">上传</el-button>
      <el-button size="mini" @click="handlerAllImport">批量导入UPC</el-button>
    </div>
    <!-- Amazon刊登列表 variantCount != null 多属性 -->
    <el-table ref="table"
              v-loading="loading"
              border
              stripe
              class="g-table g-table-dense"
              highlight-current-row
              :data="tableData"
              :row-key="getRowKeys"
              :row-class-name="setClassName"
              :expand-row-keys="expands"
              @expand-change="changeExpand"
    >
      <el-table-column width="50">
        <template slot="header" slot-scope="scope">
          <el-checkbox v-model="checked" :indeterminate="isIndeterminate" :disabled="!scope" @change="allCheck" />
        </template>
        <template slot-scope="{row}">
          <el-checkbox v-model="row.isSelect" :indeterminate="row.isIndeterminate" @change="oneCheck(row)" />
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <EbayChildTable :ref="`ebayChildTable${row.listingId}`" :ebay-listing-item="row.ebayListingItem" :audit-tab-active-num="auditTabActiveNum" :audit-tab-active-name="auditTabActiveName" :domain-list="domainList" :table-data-child-ren="tableDataChildRen" @updateIsSelect="updateIsSelect" />
        </template>
      </el-table-column>
      <el-table-column label="SKU" width="180px" align="left">
        <template slot-scope="{row,$index}">
          <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSku, row.name,data)">{{ row.productSku }}
            <template v-if="row.variantCount ">(子 {{ row.variantCount }}）</template></g-link>
          </span>
          <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
          <CopyItemId :type-name="'itemId'" :row="row" :index="$index" @handleItemIdCell="handleAsinCell(row)" />
          <span class="d-block">listingID：{{ row.listingId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主图" width="76px">
        <template slot-scope="{ row }">
          <g-thumb :url="row.mainPictureUrl" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title">
        <template slot-scope="{ row }">
          <g-link @click="handleTitleCell(row)">
            <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column label="销售信息" width="100px">
        <template v-if="!row.variantCount" slot-scope="{row}">
          <span class="d-block">成本：{{ row.costPrice }}</span>
          <span class="d-block">售价：{{ row.startPrice }}</span>
          <span class="d-block">库存：{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="storeName" width="80px" />
      <el-table-column label="后台刊登" prop="isBackPublish" width="70px">
        <template slot-scope="{row}">
          {{ row.isBackPublish?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="createTime" width="158px">
        <template slot-scope="{row}">
          <span class="d-block">创建:{{ row.createTime }}</span>
          <span v-if="auditTabActiveName === 'Approving'" class="d-block">定时刊登时间:{{ row.publishTime }}</span>
          <span v-if="row.itemId" class="d-block">上架:{{ row.publishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人员信息" width="130px">
        <template slot-scope="{row}">
          <span class="d-block">创建人:{{ row.createUserName }}</span>
          <span class="d-block">负责人:{{ row.saleUserName }}</span>
          <!-- <span class="d-block">开发:{{ row.developUserName }}</span> -->
          <!-- <span class="d-block">客服:{{ row.customerUserName }}</span> -->
        </template>
      </el-table-column>
      <el-table-column v-if="showDesc" label="报错信息" width="110px">
        <template slot-scope="{ row }">
          <g-link @click="handleRecord(row)">
            <g-text-ellipsis>{{ row.errorMsg }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60px">
        <template slot-scope="{row}">
          <template v-if="showTableBtnStatus">
            <el-button v-if="auditTabActiveName !=='Match Failed'" type="text" size="mini" class="ms-0" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="mini" class="ms-0" @click="handleDel(row,changeDelTitle)">{{ changeDelTitle?'下架':'删除' }}</el-button>
          </template>
          <el-button type="text" size="mini" class="ms-0" @click="handleRecord(row)">日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="footer-box">
      <el-pagination :current-page="page.current" :page-sizes="[10, 40, 50, 80]" :page-size="page.size" :total="page.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { ebayList, ebayVariantList, ebayUpload, remove, audit } from '@/api/ebay/ebay.js'
import EbayChildTable from './ebayChildTable.vue'
import logListing from '../../components/logListing.vue'
import DialogListingAudit from '@/views/components/dialogListingAudit.vue'
import skuCompImport from '@/views/components/skuCompImport/skuCompImportBtn.vue'
import syncFromPlatformBtn from '@/views/components/syncFromPlatformBtn.vue'
import AddListing from '../addListing.vue'
import AddVaryListing from '../addVaryListing.vue'
import ListingDetail from '../~listingDetail.vue'
import UpcImport from './upcImport'
import ImproveBatch from '@/views/components/improveBatch.vue'
import { openSpuSkuDetail } from '@/views/components/utils.js'
import CopyItemId from '@/views/components/copyItemId/copyItemId.vue'
const domainList = [
  { label: 'US', value: 'com' },
  { label: 'CA', value: 'ca' },
  { label: 'UK', value: 'co.uk' },
  { label: 'DE', value: 'de' },
  { label: 'FR', value: 'fr' },
  { label: 'ES', value: 'es' },
  { label: 'IT', value: 'it' },
  { label: 'AU', value: 'com.au' },
  { label: 'eBayMotors', value: 'com' }
]
export default {
  name: 'EbayTable',
  components: {
    EbayChildTable,
    skuCompImport,
    syncFromPlatformBtn,
    CopyItemId
  },
  props: {
    selectedIds: Array, // 勾选的skuId 用于批量更新价格/库存
    auditTabActiveName: { // 状态
      type: String
    },
    auditTabActiveNum: { // 状态 num
      type: Number
    },
    searchData: { // 搜索条件
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      openSpuSkuDetail,
      loading: false,
      tableData: [],
      domainList: domainList,
      tableDataChildRen: [], // 子sku列表数据
      checkItems: [], // 勾选的数组对象
      checkIds: [], // 勾选处理的ids
      checkItemIds: [],
      multipleSelection: [], // 勾选的值
      getRowKeys(row) {
        return row.listingId
      },
      isCheck: true, // 是否检查侵权 默认true
      ebayListingItem: {}, // 父sku List
      checked: false,
      isIndeterminate: false,
      variantIds: [], // 子sku 勾选的数据
      //   分页参数,
      page: {
        current: 1,
        total: 1,
        size: 10
      },
      expands: []
    }
  },
  computed: {
    showDel() {
      return ['Online', 'Update Failed'].includes(this.auditTabActiveName)
    },
    showDesc() {
      return ['Upload Failed', 'Update Failed'].includes(this.auditTabActiveName)
    },
    // 改变删除的文案
    changeDelTitle() {
      return ['Online', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    },
    showTableBtnStatus() {
      return ['Draft', 'Upload Failed', 'Online', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    }

  },
  watch: {
    checkIds() {
      this.$emit('update:selectedIds', this.checkIds)
    },
    // 监听切换table 父全选置false
    auditTabActiveNum: function() {
      this.checkIds = []
      this.checked = false
    }
  },
  created() {
    if (this.auditTabActiveNum) {
      this.getListingData()
    }
  },
  methods: {
    getListingData() {
      this.getAmazonlisting(1)
      this.$emit('changeStatus')
    },
    // 父 sku 全选
    allCheck(val) {
      this.isIndeterminate = false
      this.checked = val
      this.tableData.forEach(item => {
        item.isSelect = val
      })
      // this.checkIds = []
      // this.checkItems = this.tableData.filter(item => item.isSelect === true)
      // this.checkIds = this.tableData.filter(item => item.isSelect === true).map(acc => acc.listingId)
      this.checkIds = []
      this.checkItemIds = []
      this.checkItems = []
      this.tableData.filter(item => {
        if (item.isSelect) {
          this.checkIds.push(item.listingId)
          this.checkItemIds.push(item.itemId)
          this.checkItems.push(item)
        }
      })
    },
    // 父sku 单选
    oneCheck(row) {
      if (row.isSelect) {
        this.isIndeterminate = true
      }
      if (row.variantCount) {
        let isok = true
        this.tableData.forEach(item => {
          if (item.isSelect !== row.isSelect) { // 之前是勾上的
            isok = false
          }
        })

        if (isok) { // 全选
          this.isIndeterminate = false
          this.checked = row.isSelect
        } else { // 半选，
          this.isIndeterminate = true
          this.checked = false
        }
        if (row.isSelect) {
          row.ebayListingItem = row
          // this.changeExpand(row, [row])
        }
      }
      this.checkIds = []
      this.checkItemIds = []
      this.checkItems = []
      this.tableData.filter(item => {
        if (item.isSelect) {
          this.checkIds.push(item.listingId)
          this.checkItemIds.push(item.itemId)
          this.checkItems.push(item)
        }
      })
    },
    // 获取子sku 的数据
    getEbayVariantList() {
      ebayVariantList({ listingId: this.ebayListingItem.listingId }).then(res => {
        const data = res.data
        this.tableDataChildRen = data
      })
    },
    // 点击asin 跳转到不同的平台
    handleAsinCell(row) {
      const obj = domainList.find(item => item.label === row.publishSiteCode)
      const url = `//www.ebay.${obj.value}/itm/${row.itemId}`
      window.open(url, '_blank')
    },
    // 展开
    changeExpand(row, expandedRows) {
      if (expandedRows.length) { // 此时展开
        this.expands = []
        if (row) {
          this.expands.push(row.listingId)
        }
        this.ebayListingItem = row // 父sku item
        this.getEbayVariantList()
      } else { // 折叠
      // 关闭所有的展开行，给expands 设置成空值
        this.expands = []
      }
      row.isExpand = !row.isExpand
    },
    // listing 列表
    getAmazonlisting(current, size) {
      this.checkIds = []
      this.checked = false
      this.isIndeterminate = false
      if ([1, 4, 5].includes(this.searchData.searchType)) {
        delete this.searchData.isParentSku
      }
      if (current) {
        this.page.current = current
      }
      current = current || this.page.current
      size = size || this.page.size
      let searchContent = []
      if (this.searchData.searchContentNum !== '') {
        if (this.searchData.searchType !== 1 && this.searchData.searchType !== '') { // 多行文本
          searchContent = this.searchData.searchContentNum.split(/,|，|\r|\n|\r\n|\s+/)
        } else {
          searchContent = [this.searchData.searchContentNum]
        }
        if (searchContent.length) {
          this.searchData.searchContent = searchContent
        }
      }

      const params = {
        ...this.searchData
      }
      this.loading = true
      ebayList({ ...params, listingStatus: Number(this.auditTabActiveNum), current, size }).then(res => {
        const data = res.data
        if (data) {
          if (data.records && data.records.length) {
            data.records.forEach(item => {
              item.amazonListChildModel = []
              item.isExpand = false
              item.isSelect = false
              item.ebayListingItem = JSON.parse(JSON.stringify(item))
              item.checkAmazonListingAllIds = false
            })
            this.tableData = data.records
            this.page.total = data.total
          }
        } else {
          this.tableData = []
          this.page.total = 0
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 子传父
    updateIsSelect(val) {
      this.variantIds = []
      val.tableDataChildRen.forEach(item => {
        if (item.isSelect) {
          this.variantIds.push(item) // 子sku 勾选的ids
        }
      })
      this.tableData.forEach(item => {
        if (item.listingId === val.listingId) {
          item.isSelect = val.flag
        }
      })
      let trueFlag = true
      let falseFlag = true

      this.tableData.forEach(item => {
        if (item.isSelect) {
          falseFlag = false
        } else {
          trueFlag = false
        }
      })
      if (trueFlag) {
        this.checked = true
        this.isIndeterminate = false
      } else if (falseFlag) {
        this.checked = false
        this.isIndeterminate = false
      } else {
        this.checked = false
        this.isIndeterminate = true
      }
    },
    setClassName({ row, index }) {
      return !row.variantCount ? 'expand' : ''
    },
    // 上传
    getUpdateListing() {
      ebayUpload({ listingIds: this.checkIds, isCheck: true }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getListingData()
        } else if (res.code === 201) {
          this.defaultErr(res.msg)
        } else if (res.code === 400) {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(res => {
            return true
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch()
    },
    defaultErr(msg) {
      this.$modal({
        title: '警告',
        component: ImproveBatch,
        data: {
          tableList: JSON.parse(msg),
          isCheck: false,
          params: { listingIds: this.checkIds, isCheck: false },
          keyName: 'listingIds',
          isType: 'update',
          requestApi: ebayUpload
        },
        callback: (refresh) => {
          if (refresh) {
            this.checked = []
            this.getListingData()
          }
        }
      })
    },
    // 提交审核
    getAmazonlistingAudit() {
      this.$modal({
        title: '提交审核',
        component: DialogListingAudit,
        width: '500px',
        data: {
          listingIds: this.checkIds,
          isCheck: true,
          spuIds: this.checkIds,
          audit,
          keyName: 'listingIds'
        },
        callback: (refersh) => {
          if (refersh) {
            this.checkIds = []
            this.getListingData()
          }
        }
      })
    },
    // 标题点击详情
    handleTitleCell(item) {
      delete item.ebayListingItem
      this.$newTab({
        path: item.variantCount ? '/lms/lmsEbay/ebay/varylisting' + item.listingId : '/lms/lmsEbay/ebay/listing' + item.listingId,
        title: item.variantCount ? '查看单个vary listing' : '查看单个普通listing',
        component: ListingDetail,
        clearCache: true,
        data: {
          id: item.listingId,
          itemId: item.itemId,
          listingType: item.variantCount ? 'Variation' : 'Normal'
          // productStatus: item.listingStatus,
        }
      })
    },
    // 批量打开详情页
    batchDetails() {
      this.checkItems.forEach(item => {
        this.$newPage({
          path: item.variantCount ? 'lms/lmsEbay/ebay/varylisting' : 'lms/lmsEbay/ebay/listingDetail',
          title: item.variantCount ? '查看单个vary listing' : '查看单个普通listing',
          data: {
            id: item.listingId,
            itemId: item.itemId,
            isNewPage: true,
            listingType: item.variantCount ? 'Variation' : 'Normal'
          },
          callback() {
            console.log(arguments)
          }
        })
      })
    },
    handleEdit(row) {
      delete row.ebayListingItem
      if (row.variantCount) {
        this.createVaryListing(row)
      } else {
        this.createListing(row)
      }
    },
    // 批量导入
    handlerAllImport() {
      this.$modal({
        title: '批量导入UPC',
        width: '560px',
        component: UpcImport,
        callback: (refresh) => {
          refresh && this.getListingData()
        }
      })
    },
    // 点击分页
    handleSizeChange(val) {
      this.page.size = val
      this.getAmazonlisting()
    },
    // 点击页码跳转
    handleCurrentChange(val) {
      this.page.current = val
      this.getAmazonlisting()
    },
    // 单个listing
    createListing(row) {
      this.$newTab({
        path: row ? '/lms/ebay/edit/listing' + row.listingId : '/lms/ebay/add/listing',
        title: row ? '编辑单个普通Listing' : '创建单个普通Listing',
        component: AddListing,
        data: {
          id: row.listingId,
          itemId: row.itemId
        },
        clearCache: true,
        callback: refresh => {
          refresh && this.getListingData()
        }
      })
    },
    // vary listing
    createVaryListing(row) {
      this.$newTab({
        path: row ? '/lms/ebay/edit/varylisting' + row.listingId : '/lms/ebay/add/varylisting',
        title: row ? '编辑varyListing' : '创建varyListing',
        component: AddVaryListing,
        clearCache: true,
        data: {
          id: row.listingId,
          itemId: row.itemId,
          type: 'Variation'
        },
        callback: refresh => {
          refresh && this.getListingData()
        }
      })
    },
    // 父sku 变体删除 判断子sku 状态是否6 9  variantIds = ''
    handleVariationDel(row) {
      this.ebayListingItem = row
      this.getEbayVariantList()
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = [{ listingId: row.listingId, variations: [] }]
        const item = this.tableDataChildRen.filter(item => item.listingStatus === 6 || item.listingStatus === 9).map(acc => acc.listingId)
        if (item.length) {
          return this.$message.error('子sku正在更新中，不允许删除！')
        } else {
          this.amazonListDel(list)
        }
      })
    },
    // 批量del
    batchDel() {
      this.$confirm('确定下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = []
        this.tableData.filter(item => {
          if (item.isSelect === true) {
            const obj = {
              listingId: item.listingId,
              variations: []
            }
            list.push(obj)
          }
        })
        this.handlevariantIds(list)
      }).catch(() => {})
    },
    // 处理变体数据 1 父sku删除标示
    handlevariantIds(list) {
      if (this.tableDataChildRen.length) { // 有子sku 被勾选
        const item = this.tableDataChildRen.filter(item => item.listingStatus === 6 || item.listingStatus === 9).map(acc => acc.listingId)
        if (item.length) {
          return this.$message.error('子sku正在更新中，不允许删除！')
        } else {
          this.amazonListDel(list)
        }
      } else { // 全选
        this.amazonListDel(list)
      }
    },
    // 1-4 父sku删除 没有变体id
    handleDel(row, type) {
      const msg = `确定${type ? '下架' : '删除'}?`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = {
          listingId: row.listingId,
          variations: []
        }
        this.amazonListDel([list])
      }).catch(() => {})
    },
    amazonListDel(list) {
      remove({ listings: list, isCheck: false }).then(res => {
        this.$message.success(res.msg)
        this.getListingData()
      })
    },
    handleRecord(row) {
      this.$newTab({
        path: '/ebayList/logListing',
        title: '刊登管理/操作日志',
        component: logListing,
        data: {
          listingId: row.listingId
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

<style scoped>
  .head{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 14px;
  }
  .footer-box{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #fff;
    border-top: 1px #eee solid;
  }
</style>
