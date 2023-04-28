<template>
  <div>
    <div class="head">
      <el-button type="danger" size="mini" :disabled="!checkIds.length && !variantIds.length" @click="batchDetails">批量打开详情页</el-button>
      <!-- 父sku 勾选就勾上全部子 sku 只传 ids 传listingStatus
          子sku 全部勾上之后，删掉其中一个，就去掉父sku勾选 传listingStatus  variantIds disabledBatchDel
          单个删除子sku 才需要传 variantIds-->
      <skuCompImport v-if="auditTabActiveName === 'Match Failed'" :check-ids="checkIds" source="amazon" text="sku对照表导入" @refreshList="getListingData()" />
      <el-button v-if="showDel" type="success" size="mini" :disabled="!checkIds.length && !variantIds.length" @click="batchDel">删除</el-button>
      <el-button v-if="auditTabActiveName === 'Draft'" type="warning" size="mini" :disabled="!checkIds.length" @click="getAmazonlistingAudit">提交审核</el-button>
      <el-button v-if="auditTabActiveName==='Draft' || auditTabActiveName==='Approving'" type="warning" size="mini" :disabled="!checkIds.length" @click="getUpdateAmazonListing">上传</el-button>
      <el-button size="mini" @click="handlerAllImport">批量导入UPC</el-button>
    </div>
    <!-- Amazon刊登列表 Variation 多属性 -->
    <el-table ref="table"
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
      <el-table-column v-loading.fullscreen.lock="loading" type="expand">
        <template slot-scope="{ row }">
          <AmazonListChild :ref="`amazonListChild${row.id}`"
                           :amazon-listing-item="row.amazonListingItem"
                           :show-table-btn-status="showTableBtnStatus"
                           :audit-tab-active-num="auditTabActiveNum"
                           :audit-tab-active-name="auditTabActiveName"
                           :domain-list="domainList"
                           :table-data-child-ren="tableDataChildRen"
                           :is-child-indeterminate.sync="isChildIndeterminate"
                           @updateIsSelect="updateIsSelect"
                           @delChildHandle="delChildHandle"
                           @getAmazonlistingListVariant="getAmazonlistingListVariant"
          />
        </template>
      </el-table-column>

      <el-table-column label="SKU" width="160px" align="left">
        <template slot-scope="{row,$index}">
          <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSku,row.name)">{{ row.productSku }}
            <template v-if="row.listingType === 'Variation'">(子 {{ row.childNum }}）</template></g-link>
          </span>
          <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
          <CopyItemId :type-name="'asin'" :row="row" :index="$index" @handleItemIdCell="handleAsinCell(row)" />
          <!-- <g-link v-if="row.asin" @click="handleAsinCell(row)">
            <span class="d-block">ASIN：{{ row.asin }}</span>
          </g-link>
          <span v-else class="d-block">ASIN：{{ row.asin }}</span> -->
          <span class="d-block">ListingID：{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主图" width="76px">
        <template slot-scope="{ row }">
          <g-thumb :url="row.asin?row.mainImage||row.thumbnail:row.mainImage" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title">
        <template slot-scope="{ row }">
          <template v-if="showTableBtnStatus">
            <g-link @click="handleTitleCell(row)">
              <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
            </g-link>
          </template>
          <template v-else>
            <!-- 有 asin  单个title click -->
            <g-link v-if="row.listingType !== 'Variation'" @click="handleTitleCell(row)">
              <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
            </g-link>
            <!-- online之后，单属性也能点击进入详情 -->
            <template v-else>
              <g-link v-if="auditTabActiveName === 'Canceled' && !row.asin" @click="handleTitleCell(row)">
                <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
              </g-link>
              <g-text-ellipsis v-else>{{ row.title }}</g-text-ellipsis>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="销售信息" prop="account" width="110px">
        <template v-if="row.listingType !== 'Variation'" slot-scope="{row}">
          <span class="d-block">成本：{{ row.costPrice }}</span>
          <span class="d-block">售价：{{ row.price }}</span>
          <span class="d-block">库存：{{ row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="account" width="100px" />
      <el-table-column label="后台刊登" prop="isAmazonUpload" width="70px">
        <template slot-scope="{row}">
          {{ row.isAmazonUpload?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="createTime" width="158px">
        <template slot-scope="{row}">
          <span class="d-block">创建:{{ row.createTime }}</span>
          <span v-if="!showTableBtnStatus && row.upOnlineTime" class="d-block">上架:{{ row.upOnlineTime }}</span>
          <template v-if="auditTabActiveName === 'Approving'">
            <span class="d-block">审核:{{ row.updateTime }}</span>
            <span class="d-block">定时刊登:{{ row.timedUploadTime }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="人员信息" prop="developUser" width="130px">
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
            <g-text-ellipsis>{{ row.resultMsg }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60px">
        <template slot-scope="{row}">
          <template v-if="showTableBtnStatus">
            <!-- 1和4 有del edit
            del 没有变体 只有父sku 的[{id,sellerSku}] -->
            <template v-if="['Draft','Upload Failed'].includes(auditTabActiveName)">
              <el-button type="text" size="mini" class="ms-0" @click="handleEdit(row)">编辑</el-button>
              <el-button type="text" size="mini" class="ms-0" @click="handleDel(row)">删除</el-button>
            </template>
          </template>
          <template v-else>
            <!-- 5-10  没有变体：日志;
            有变体：父sku：578  del
            del 有变体ids,[{id,sellerSku}]-->
            <template v-if="row.listingType !=='Variation'&&['Online','Update Failed'].includes(auditTabActiveName)">
              <el-button type="text" size="mini" class="ms-0" @click="handleEdit(row)">编辑</el-button>
            </template>
            <template v-if="['Online','Update Failed'].includes(auditTabActiveName)">
              <el-button type="text" size="mini" class="ms-0" @click="handleVariationDel(row)">删除</el-button>
            </template>
            <template v-if="auditTabActiveName === 'Match Failed'">
              <el-button type="text" size="mini" class="ms-0" @click="handleVariationDel(row)">删除</el-button>
            </template>
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
import {
  amazonlisting,
  amazonListDel,
  updateAmazonListing,
  getVariantNum,
  amazonlistingListVariant,
  getByAmazonListingId,
  getBatchDraftDetail,
  getBatchOnlineDetail,
  amazonlistingAudit
} from '@/api/amazon/amazon'
import AmazonListChild from './amazonListChild.vue'
import logListing from '../../components/logListing.vue'
import DialogListingAudit from '@/views/components/dialogListingAudit.vue'
import AddListing from '../addListing.vue'
import ListingDetail from './../~listingDetail.vue'
import AddVaryListing from '../addVaryListing.vue'
import improveBatch from '@/views/components/improveBatch.vue'
import skuCompImport from '@/views/components/skuCompImport/skuCompImportBtn.vue'
import UpcImport from './upcImport'
import { openSpuSkuDetail } from '@/views/components/utils.js'
import CopyItemId from '@/views/components/copyItemId/copyItemId.vue'
const domainList = [
  { label: '', value: 'com' },
  { label: 'US', value: 'com' },
  { label: 'CA', value: 'ca' },
  { label: 'NL', value: 'nl' },
  { label: 'UK', value: 'co.uk' },
  { label: 'DE', value: 'de' },
  { label: 'FR', value: 'fr' },
  { label: 'ES', value: 'es' },
  { label: 'IT', value: 'it' },
  { label: 'AE', value: 'ae' },
  { label: 'MX', value: 'com.mx' },
  { label: 'BR', value: 'com.br' },
  { label: 'IN', value: 'in' },
  { label: 'AU', value: 'au' },
  { label: 'TR', value: 'com.tr' },
  { label: 'SA', value: 'sa' },
  { label: 'JP', value: 'co.jp' },
  { label: 'SE', value: 'se' },
  { label: 'SG', value: 'sg' },
  { label: 'EG', value: 'eg' }
]
export default {
  name: 'AmazonTable',
  components: {
    AmazonListChild,
    skuCompImport,
    CopyItemId
  },
  props: {
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
      tableData: [],
      domainList: domainList,
      tableDataChildRen: [], // 子sku列表数据
      loading: false,
      checkItems: [], // 勾选的数组对象
      checkIds: [], // 勾选处理的ids
      multipleSelection: [], // 勾选的值
      getRowKeys(row) {
        return row.id
      },
      isCheck: false, // 是否检测 默认false
      amazonListingItem: {}, // 父sku List
      checked: false,
      isIndeterminate: false,
      isChildIndeterminate: false, // 子sku半选效果
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
    // 上架时间 5-9
    showUpOnlineTime() {
      return ['Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling'].includes(this.auditTabActiveName)
    },
    // Online 之前 只有父sku 有三个操作按钮 ，子sku 没有操作按钮
    // 无变体， 父sku 跳转单个listing
    // 有变体，父sku 跳转多个vary listing
    showTableBtnStatus() {
      return ['Draft', 'Approving', 'Uploading', 'Upload Failed'].includes(this.auditTabActiveName)
    }

  },
  watch: {
    // 监听切换table 父全选置false
    auditTabActiveNum: function() {
      this.checkIds = []
      this.checked = false
      this.expands = []
      this.tableDataChildRen = []
    }
  },
  created() {
    if (this.auditTabActiveNum) {
      this.getListingData()
    }
  },
  methods: {
    linkChange() { // 跳转链接

    },
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
      this.checkIds = []
      this.checkItems = this.tableData.filter(item => item.isSelect === true)
      this.checkIds = this.tableData.filter(item => item.isSelect === true).map(acc => acc.id)
      this.$emit('update:checkIds', this.checkIds)
    },
    // 父sku 单选
    oneCheck(row) {
      if (row.isSelect) {
        this.isIndeterminate = true
      }
      if (row.listingType === 'Variation') {
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
          row.amazonListingItem = row
          this.changeExpand(row, [row])
        }
        if (this.$refs['amazonListChild' + row.id]) {
          this.$refs['amazonListChild' + row.id].yy(row.isSelect)
        }
      }
      this.checkIds = this.tableData.filter(item => item.isSelect === true).map(acc => acc.id)
      this.checkItems = this.tableData.filter(item => item.isSelect === true)
      this.$emit('update:checkIds', this.checkIds)
    },
    // 获取子sku 的数据
    // Listing列表-变体(本地数据) online之前
    getByAmazonListingId() {
      getByAmazonListingId({ id: this.amazonListingItem.id }).then(res => {
        const data = res.data
        data.records.forEach(item => {
          item.isSelect = false
          item.title = this.amazonListingItem.title
        })
        this.tableDataChildRen = data.records
        if (this.expands.length) {
          if (this.amazonListingItem.isSelect) {
          // 全选
            this.multipleSelection = data.records
            this.tableDataChildRen.forEach(item => {
              if (item.listingStatus !== 10) {
                item.isSelect = true
              }
            })
            this.$refs[`amazonListChild${this.amazonListingItem.id}`].allCheck(true)
          }
        }
      })
    },
    // Listing列表-变体(线上数据) online 之后 包含online
    amazonlistingListVariant() {
      amazonlistingListVariant({ id: this.amazonListingItem.id, listingStatus: this.auditTabActiveNum }).then(res => {
        const data = res.data
        data.records.forEach(item => {
          item.isSelect = false
        })
        this.tableDataChildRen = data.records
        if (this.expands.length) {
          if (this.amazonListingItem.isSelect) {
          // 全选
            this.multipleSelection = data.records
            this.tableDataChildRen.forEach(item => {
              if (item.listingStatus !== 10) {
                item.isSelect = true
              }
            })
            this.$refs[`amazonListChild${this.amazonListingItem.id}`].allCheck(true)
          }
        }
      })
    },
    // 子 sku
    getAmazonlistingListVariant() {
      this.isChildIndeterminate = false
      if (this.auditTabActiveNum <= 4) { // Listing列表-变体(本地数据) online之前
        this.getByAmazonListingId()
      } else { // Listing列表-变体(线上数据) online 之后 包含online
        if (this.auditTabActiveNum === 10) {
          if (this.amazonListingItem.asin) { // 状态10 并且有asin 调用线上数据
            this.amazonlistingListVariant()
          } else { // 没有asin 调用本地数据
            this.getByAmazonListingId()
          }
        } else {
          this.amazonlistingListVariant()
        }
      }
    },
    // 点击asin 跳转到不同的平台
    handleAsinCell(row) {
      const obj = domainList.find(item => item.label === row.amazonSite)
      const url = `//www.amazon.${obj.value}/dp/${row.asin}`
      window.open(url, '_blank')
    },
    // 展开
    changeExpand(row, expandedRows) {
      if (expandedRows.length) { // 此时展开
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
        this.amazonListingItem = row // 父sku item
        this.getAmazonlistingListVariant()
      } else { // 折叠
        this.expands = []
      }
      row.isExpand = !row.isExpand
    },
    // listing 列表
    getAmazonlisting(current, size) {
      this.checkIds = []
      this.checked = false
      this.isIndeterminate = false
      if (current) {
        this.page.current = current
      }
      current = current || this.page.current
      size = size || this.page.size
      // let searchContent = []
      if (this.searchData.accounts && !this.searchData.accounts.length) {
        delete this.searchData.accounts
      }
      // if (this.searchData.upOnlineTime) {
      //   [this.searchData.upOnlineTimeStart, this.searchData.upOnlineTimeEnd] = [this.searchData.upOnlineTime[0], this.searchData.upOnlineTime[1]]
      //   delete this.searchData.upOnlineTime
      // }
      // if (this.searchData.searchContentNum !== '') {
      //   if (this.searchData.searchType !== 1 && this.searchData.searchType !== '') { // 多行文本
      //     searchContent = this.searchData.searchContentNum.split(/,|，|\r|\n|\r\n|\s+/)
      //   } else {
      //     searchContent = [this.searchData.searchContentNum]
      //   }
      //   if (searchContent.length) {
      //     this.searchData.searchContent = searchContent
      //   }
      // }
      amazonlisting({ current, size }, { ...this.searchData, listingStatus: Number(this.auditTabActiveNum) }).then(res => {
        const data = res.data
        data.records.forEach(item => {
          item.amazonListChildModel = []
          item.isExpand = false
          item.isSelect = false
          item.amazonListingItem = JSON.parse(JSON.stringify(item))
          item.checkAmazonListingAllIds = false
        })
        this.tableData = data.records
        this.page.total = data.total
        if (this.tableData.length) {
          this.getVariantNum()
        }
      })
    },
    // 获取子sku数量
    getVariantNum() {
      const ids = []
      this.tableData.filter(item => {
        if (item.listingType === 'Variation') {
          ids.push(item.id)
        }
      })
      if (ids.length) {
        getVariantNum({ ids: ids, listingStatus: this.auditTabActiveNum }).then(res => {
          const list = res.data.records
          this.tableData.forEach(item => {
            list.forEach(acc => {
              if (item.id === acc.amazonListingId) {
                item.childNum = acc.num
              }
            })
          })
          this.$set(this.tableData)
        })
      }
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
        if (item.id === val.id) {
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
      this.$emit('update:variantIds', this.tableDataChildRen.filter(item => item.isSelect))
    },
    setClassName({ row, index }) {
      row.listingType = row.listingType && row.listingType.substring(0, 1).toUpperCase() + row.listingType.substring(1)
      return row.listingType !== 'Variation' ? 'expand' : ''
    },
    // 上传
    getUpdateAmazonListing() {
      updateAmazonListing({ ids: this.checkIds, isCheck: false }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getListingData()
        } else if (res.code === 201) {
          this.$modal({
            title: '警告',
            component: improveBatch,
            data: {
              tableList: JSON.parse(res.msg),
              params: { ids: this.checkIds, isCheck: true },
              keyName: 'ids',
              // header: ['SKU', '违禁词'],
              requestApi: updateAmazonListing
            },
            callback: (refresh) => {
              if (refresh) {
                this.checked = []
                this.getListingData()
              }
            }
          })
        } else {
          this.$message.error(res.msg || '未知错误')
        }
      }).catch()
    },
    // 提交审核
    getAmazonlistingAudit() {
      this.$modal({
        title: '提交审核',
        component: DialogListingAudit,
        width: '500px',
        data: {
          spuIds: this.checkIds,
          audit: amazonlistingAudit,
          keyName: 'ids'
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
      delete item.amazonListingItem
      this.$newTab({
        path: item.listingType === 'Variation' ? '/lms/amazon/view/varylisting' + item.id : '/lms/amazon/view/listing' + item.id,
        title: item.listingType === 'Variation' ? '查看单个vary listing' : '查看单个普通listing',
        component: ListingDetail,
        clearCache: true,
        data: {
          asin: item.asin,
          id: item.id,
          variationId: item.listingType === 'Variation' ? item.id : '',
          listingStatus: item.listingStatus
        }
      })
    },
    // 批量打开详情页 多属性只能打开子sku
    batchDetails() {
      if (this.showTableBtnStatus) { // 1-4
        this.getBatchDraftDetail(this.checkIds)
      } else if (this.showUpOnlineTime) { // 5-9
        const amazonVariantIds = this.tableDataChildRen.filter(item => item.isSelect).map(acc => acc.id)
        this.getBatchOnlineDetail(this.checkIds, amazonVariantIds)
      } else { // 10
        const amazonAsinIds = []
        const amazonUnAsinIds = []
        const amazonVariantAsinIds = []
        const amazonVariantUnAsinIds = []
        this.checkItems.forEach(item => {
          if (item.asin) {
            amazonAsinIds.push(item.id)
          } else {
            amazonUnAsinIds.push(item.id)
          }
        })
        this.tableDataChildRen.forEach(item => {
          if (item.asin) {
            amazonVariantAsinIds.push(item.id)
          } else {
            amazonVariantUnAsinIds.push(item.id)
          }
        })
        if (amazonAsinIds.length || amazonVariantAsinIds.length) {
          this.getBatchOnlineDetail(amazonAsinIds, amazonVariantAsinIds)
        }
        if (amazonUnAsinIds.length) {
          this.getBatchDraftDetail(amazonUnAsinIds)
        }
      }
    },
    // Listing批量打开详情-草稿
    getBatchDraftDetail(amazonListingIds) {
      getBatchDraftDetail({ amazonListingIds: amazonListingIds }).then(res => {
        const data = res.data
        if (!data.length) return
        this.getBatchDetail(data)
      })
    },
    // 批量打开详情页-线上
    getBatchOnlineDetail(amazonListingIds, amazonVariantIds) {
      getBatchOnlineDetail({ amazonListingIds, amazonVariantIds }).then(res => {
        const data = res.data
        if (!data.length) return
        this.getBatchDetail(data)
      })
    },
    // 批量打开详情页 循环
    getBatchDetail(list) {
      list.forEach(item => {
        let id = ''
        if ((item.listingStatus >= 1 && item.listingStatus <= 4) || (item.listingStatus === 10 && item.asin === null)) { // 草稿
          id = item.id
        } else {
          id = item.amazonListingId
        }
        this.$newPage({
          path: item.listingType === 'Variation' ? 'lms/lmsAmazon/amazon/varylisting' : 'lms/lmsAmazon/amazon/listingDetail',
          title: item.listingType === 'Variation' ? '查看单个vary listing' : '查看单个普通listing',
          data: {
            id: id,
            asin: !item.asin ? '' : item.asin,
            listingStatus: item.listingStatus,
            variationId: item.asin ? item.id : '',
            isNewPage: ''
          },
          callback() {
            console.log(arguments)
          }
        })
      })
    },

    handleEdit(row) {
      delete row.amazonListingItem
      if (row.listingType === 'Variation') {
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
        path: row ? '/lms/amazon/edit/listing' + row.id : '/lms/amazon/add/listing',
        title: row ? '编辑单个普通Listing' : '创建单个普通Listing',
        component: AddListing,
        data: {
          id: row.id,
          asin: row.asin,
          listingStatus: row.listingStatus
        },
        clearCache: true,
        callback: refresh => {
          refresh && this.getAmazonlisting()
        }
      })
    },
    // vary listing
    createVaryListing(row) {
      this.$newTab({
        path: row ? '/lms/amazon/edit/varylisting' + row.id : '/lms/amazon/add/varylisting',
        title: row ? '编辑Listing' : '创建Listing',
        component: AddVaryListing,
        clearCache: true,
        data: {
          id: row.id,
          asin: row.asin,
          variationId: row.id,
          listingStatus: row.listingStatus
        },
        callback: refresh => {
          if (refresh) {
            this.getAmazonlisting()
            this.changeExpand({}, [])
          }
        }
      })
    },
    // 变体子sku 删除 只需要传 variantIds 和listingStatus
    delChildHandle(childItem) {
      if (childItem.listingStatus === 6 || childItem.listingStatus === 9) {
        return this.$message.error('子sku正在更新中，不允许删除！')
      } else {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.amazonListDel([], childItem.id, 2)
        })
      }
    },
    // 父sku 变体删除 判断子sku 状态是否6 9  variantIds = ''
    handleVariationDel(row) {
      this.amazonListingItem = row
      this.getAmazonlistingListVariant()
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = [{ id: row.id, sellerSku: row.sellerSku }]
        const item = this.tableDataChildRen.filter(item => item.listingStatus === 6 || item.listingStatus === 9).map(acc => acc.id)
        if (item.length) {
          return this.$message.error('子sku正在更新中，不允许删除！')
        } else {
          this.amazonListDel(list, '', 1)
        }
      })
    },
    // 批量del
    batchDel() {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = []
        this.tableData.filter(item => {
          if (item.isSelect === true) {
            const obj = {
              id: item.id,
              sellerSku: item.sellerSku
            }
            list.push(obj)
          }
        })
        this.handlevariantIds(list, 2)
      }).catch(() => {})
    },
    // 处理变体数据 1 父sku删除标示
    handlevariantIds(list, variantIdsStatus) {
      const childVariantIds = this.tableDataChildRen.filter(item => item.isSelect)
      if (childVariantIds.length) { // 有子sku 被勾选
        const variantIds = childVariantIds.filter(item => item.listingStatus !== 10).map(acc => acc.id)
        const item = childVariantIds.filter(item => item.listingStatus === 6 || item.listingStatus === 9).map(acc => acc.id)
        if (item.length) {
          return this.$message.error('子sku正在更新中，不允许删除！')
        } else {
          const params = variantIdsStatus !== 1 && variantIds.length ? variantIds.join(',') : ''
          const parameter = this.tableDataChildRen.length === variantIds.length ? '' : params // 子sku全选，子sku置空
          this.amazonListDel(list, parameter, 1)
        }
      } else { // 全选
        this.amazonListDel(list, '', 1)
      }
    },
    // 1-4 父sku删除 没有变体id
    handleDel(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = {
          id: row.id,
          sellerSku: row.sellerSku
        }
        this.amazonListDel([list], '', 1)
      }).catch(() => {})
    },
    amazonListDel(list, variantIds, typeStatus) {
      const params = list
      amazonListDel({ params, listingStatus: this.auditTabActiveNum, variantIds: variantIds }).then(res => {
        this.$message.success(res.msg)
        if (typeStatus === 2) { // 单个删除子
          this.getAmazonlistingListVariant(1)
        } else {
          this.getAmazonlisting()
          this.changeExpand({}, [])
        }
      })
    },
    handleRecord(row) {
      this.$newTab({
        path: '/amazonList/logListing',
        title: '刊登管理/操作日志',
        component: logListing,
        data: {

          amazonListId: row.id
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
