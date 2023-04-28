<template>
  <div>
    <div class="head">
      <el-button type="primary" size="mini" :disabled="!checkIds.length && !variantIds.length" @click="batchDetails">批量打开详情页</el-button>
      <skuCompImport
        v-if="['Online', 'Update Failed', 'Match Failed','Canceled'].includes(auditTabActiveName)"
        :check-ids="checkIds"
        source="shopee"
        text="sku对照表导入"
        @refreshList="getListingData"
      />
      <syncFromPlatformBtn
        v-if="['Online', 'Update Failed', 'Match Failed'].includes(auditTabActiveName)"
        :check-ids="checkIds"
        :check-item-ids="checkItemIds"
        source="shopee"
        text="从后台同步"
        @refreshList="getListingData"
      />
      <el-button v-if="auditTabActiveName === 'Canceled'" type="warning" size="mini" :disabled="!checkIds.length && !variantIds.length" @click="batchDel">重新上架</el-button>
      <el-button v-if="showDel" type="success" size="mini" :disabled="!checkIds.length && !variantIds.length" @click="batchDel">下架/删除</el-button>
      <el-button v-if="auditTabActiveName === 'Draft'" type="warning" size="mini" :disabled="!checkIds.length" @click="getSmtListingAudit">提交审核</el-button>
      <el-button v-if="['Draft','Approving'].includes(auditTabActiveName)" type="warning" size="mini" :disabled="!checkIds.length" @click="getUpdateSmtListing">上传</el-button>
      <!-- <el-button size="mini" @click="handlerAllImport">批量导入UPC</el-button> -->
    </div>
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
          <shopeeChildTable :ref="`shopeeChildTable${row.id}`" :table-listing-item="row.tableListingItem" :audit-tab-active-num="auditTabActiveNum" :audit-tab-active-name="auditTabActiveName" :table-data-child-ren="tableDataChildRen" @updateIsSelect="updateIsSelect" @delChildHandle="delChildHandle" @getAliExpressListingListVariant="getAliExpressListingListVariant" />
        </template>
      </el-table-column>
      <el-table-column label="SKU" width="170px" align="left">
        <template slot-scope="{row,$index}">
          <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSpu, row.name)">{{ row.productSpu }}</g-link>
            <template v-if="row.listingType === 'Variation'">(子 {{ row.variantNum }}）</template>
          </span>
          <CopyItemId :type-name="'itemId'" :row="row" :index="$index" @handleItemIdCell="handleItemIdCell(row)" />
          <span class="d-block">ListingID：{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主图" width="76px">
        <template slot-scope="{ row }">
          <g-thumb :url="row.imageUrls" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="name">
        <template slot-scope="{ row }">
          <g-link @click="handleTitleCell(row)">
            <g-text-ellipsis>{{ row.name }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column label="销售信息" prop="account" width="90px">
        <template v-if="row.listingType !== 'Variation'" slot-scope="{row}">
          <span class="d-block">成本：{{ row.costPrice }}</span>
          <span class="d-block">售价：{{ row.productPrice }}</span>
          <span class="d-block">库存：{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="account" width="100px" />
      <el-table-column label="后台刊登" prop="isAmazonUpload" width="70px">
        <template slot-scope="{row}">
          {{ row.isAliexpressUpload?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="createTime" width="158px">
        <template slot-scope="{row}">
          <span class="d-block">创建:{{ row.createTime }}</span>
          <span v-if="row.itemId" class="d-block">上架:{{ row.upOnlineTime }}</span>
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
          <span class="d-block">开发:{{ row.developUserName }}</span>
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
            <el-button v-if="auditTabActiveName !=='Match Failed'" type="text" size="mini" class="ms-0" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="mini" class="ms-0" @click="handleDel(row,changeDelTitle)">{{ changeDelTitle? '下架' : '删除' }}</el-button>
            <el-button type="text" size="mini" class="ms-0" @click="handleRecord(row)">日志</el-button>
          </template>
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
import { shopeeListingPage, shopeeListingListVariant, uploading } from '@/api/shopee/shopee.js'
// import UpcImport from '@/views/lmsAmazon/amazon/components/upcImport'
import skuCompImport from '@/views/components/skuCompImport/skuCompImportBtn.vue'
import syncFromPlatformBtn from '@/views/components/syncFromPlatformBtn.vue'
import shopeeChildTable from './shopeeChildTable.vue'
import ImproveBatch from './improveBatch.vue'
import logListing from '../../components/logListing.vue'
import ListingDetail from '../~listingDetail.vue'
import addListing from '../_addListing.vue'
import CopyItemId from '@/views/components/copyItemId/copyItemId.vue'
import { openSpuSkuDetail, generateRandomNum } from '@/views/components/utils.js'

export default {
  name: 'ShopeeTable',
  components: {
    shopeeChildTable,
    skuCompImport,
    syncFromPlatformBtn,
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
  data: function() {
    return {
      openSpuSkuDetail,
      checkIds: [], // 勾选处理的ids
      checkItemIds: [],
      variantIds: [],
      getRowKeys(row) {
        return row.id
      },
      expands: [],
      tableData: [],
      isIndeterminate: false,
      checked: false,
      // 分页参数,
      page: {
        current: 1,
        total: 1,
        size: 10
      },
      loading: false,
      tableListingItem: {},
      tableDataChildRen: [] // 子sku列表数据
    }
  },
  computed: {
    // 改变删除的文案
    changeDelTitle() {
      return ['Online', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    },
    showDel() {
      return ['Online', 'Update Failed'].includes(this.auditTabActiveName)
    },
    showTableBtnStatus() {
      return ['Draft', 'Upload Failed', 'Online', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    },
    showDesc() {
      return ['Upload Failed', 'Update Failed'].includes(this.auditTabActiveName)
    }
  },
  created() {
    this.auditTabActiveNum && this.getListingData()
  },
  methods: {
    getListingData() {
      this.listSmtListing(1)
      this.$emit('changeStatus')
    },
    // 批量打开详情页
    batchDetails() {
      this.checkItems.forEach(item => {
        this.$newPage({
          path: 'lms/lmsShopee/listing/listingDetail' + item.id,
          title: '查看listing',
          data: {
            id: item.id,
            itemId: item.itemId,
            isNewPage: true
          },
          callback() {
            console.log(arguments)
          }
        })
      })
    },
    handleEdit(row) {
      this.createListing(row)
    },
    createListing(row) {
      this.$newTab({
        path: row ? '/lms/shopee/edit/listing' + row.id : '/lms/shopee/add/listing' + generateRandomNum(),
        title: row ? '编辑单个普通Listing' : '创建单个普通Listing',
        component: addListing,
        data: { id: row.id, auditTabActiveName: this.auditTabActiveName },
        callback: refresh => {
          refresh && this.listSmtListing()
        }
      })
    },
    // 批量del
    batchDel() {
      // TODO mjf
    },
    getSmtListingAudit() {
      // TODO mjf
    },
    getUpdateSmtListing() {
      uploading({ ids: this.checkIds, isCheck: false }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getListingData()
        } else if (res.code === 201) {
          if (res.msg.indexOf('[{') > -1) {
            this.$modal({
              title: '警告',
              component: ImproveBatch,
              data: {
                tableList: JSON.parse(res.msg),
                params: { ids: this.checkIds, isCheck: true },
                header: ['SKU', '违禁词'],
                isType: 'update'
              },
              callback: (refresh) => {
                if (refresh) {
                  this.checked = []
                  this.getListingData()
                }
              }
            })
          }
        } else if (res.code === 400) {
          if (res.msg.indexOf('[{') > -1) {
            const errList = JSON.parse(res.msg)
            const error = []
            errList.forEach(item => {
              const fbWords = item.fbWords.join(',')
              const errmsg = `SKU:${item.sku}，违禁词：${fbWords}`
              error.push(errmsg)
            })
            this.$message.error(error.join(','))
          } else {
            this.$message.error(res.msg)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
      // TODO mjf
    },
    // handlerAllImport() {
    //   this.$modal({
    //     title: '批量导入UPC',
    //     width: '560px',
    //     component: UpcImport,
    //     callback: (refresh) => {
    //     }
    //   })
    // },
    // 控制多属性是否展示箭头
    setClassName({ row, index }) {
      row.listingType = row.listingType && row.listingType.substring(0, 1).toUpperCase() + row.listingType.substring(1)
      return row.listingType !== 'Variation' ? 'expand' : ''
    },
    // 展开
    changeExpand(row, expandedRows) {
      if (expandedRows.length) { // 此时展开
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
        this.tableListingItem = row // 父sku item
        this.getAliExpressListingListVariant()
      } else { // 折叠
        this.expands = []
      }
      row.isExpand = !row.isExpand
    },
    getAliExpressListingListVariant() {
      shopeeListingListVariant(this.tableListingItem.id).then(res => {
        const data = res.data
        data.forEach(item => {
          item.isSelect = false
        })
        this.tableDataChildRen = data
        if (this.expands.length) {
          if (this.tableListingItem.isSelect) {
            // 全选
            this.tableDataChildRen.forEach(item => {
              item.isSelect = true
            })
            this.$refs[`shopeeChildTable${this.tableListingItem.id}`].changeCheckStatusIfParentChange(true)
          }
        }
      })
    },
    allCheck(val) {
      this.isIndeterminate = false
      this.checked = val
      this.tableData.forEach(item => {
        item.isSelect = val
      })
      this.checkIds = []
      this.checkItems = []
      this.checkItemIds = []
      this.tableData.forEach(item => {
        if (item.isExpand) {
          this.$refs['shopeeChildTable' + item.id].changeCheckStatusIfParentChange(item.isSelect)
        }
        if (item.isSelect) {
          this.checkItems.push(item)
          this.checkItemIds.push(item.itemId)
          this.checkIds.push(item.id)
        }
      })
      this.$emit('changeCheckIds', this.checkIds, this.checkItems, this.checkItemIds)
    },
    oneCheck(row) {
      this.checkIds = []
      this.checkItemIds = []
      this.checkItems = []
      this.tableData.filter(item => {
        if (item.isSelect) {
          this.checkIds.push(item.id)
          this.checkItemIds.push(item.itemId)
          this.checkItems.push(item)
        }
      })
      if (this.checkIds.length === 0) {
        this.isIndeterminate = false
        this.checked = false
      } else if (this.checkIds.length < this.tableData.length) {
        this.isIndeterminate = true
        this.checked = false
      } else {
        this.isIndeterminate = false
        this.checked = true
      }
      if (row.listingType === 'Variation') {
        row.wishListingItem = row
        // 设置子组件的复选框的状态,如果父sku是选中的，那么子sku要全部选中，如果子sku是
        if (this.$refs['shopeeChildTable' + row.id]) {
          this.$refs['shopeeChildTable' + row.id].changeCheckStatusIfParentChange(row.isSelect)
        }
      }
      this.$emit('changeCheckIds', this.checkIds, this.checkItems, this.checkItemIds)
    },
    // 点击itemID 跳转到不同的平台
    handleItemIdCell(row) {
      const url = '//www.shopee.com/item/' + row.itemId + '.html'
      window.open(url, '_blank')
    },
    // 标题点击详情
    handleTitleCell(item) {
      this.$newTab({
        path: '/lms/lmsShopee/listing/listingDetail',
        title: item.listingType === 'Combo' ? '查看SPU Listing详情' : '查看SKU Listing详情',
        component: ListingDetail,
        clearCache: true,
        data: {
          id: item.id
        }
      })
    },
    handleRecord(row) {
      // TODO
      this.$newTab({
        title: '日志',
        component: logListing,
        data: {
          listingId: row.id
        }
      })
    },
    listSmtListing(current, size) {
      this.checkIds = []
      this.checked = false
      this.isIndeterminate = false
      if (current) {
        this.page.current = current
      }
      current = current || this.page.current
      size = size || this.page.size
      if (this.searchData.accounts && !this.searchData.accounts.length) {
        delete this.searchData.accounts
      }
      if (this.searchData.upOnlineTime) {
        [this.searchData.upOnlineTimeStart, this.searchData.upOnlineTimeEnd] = [this.searchData.upOnlineTime[0], this.searchData.upOnlineTime[1]]
        delete this.searchData.upOnlineTime
      }
      let searchContent = []
      if (this.searchData.searchContentNum && this.searchData.searchContentNum !== '') {
        if (this.searchData.searchType !== 1 && this.searchData.searchType !== '') { // 多行文本
          searchContent = this.searchData.searchContentNum.split(/,|，|\r|\n|\r\n|\s+/)
        } else {
          searchContent = [this.searchData.searchContentNum]
        }
        if (searchContent.length) {
          this.searchData.searchContent = searchContent
        }
      } else {
        this.searchData.searchContent = searchContent
      }
      shopeeListingPage({ current: this.page.current, size: this.page.size }, { ...this.searchData, listingStatus: Number(this.auditTabActiveNum) }).then(res => {
        const data = res.data
        if (data) {
          data.records.forEach(item => {
            item.aliExpressListChildModel = []
            item.isExpand = false
            item.isSelect = false
            // 父sku的信息
            item.tableListingItem = JSON.parse(JSON.stringify(item))
            item.checkAliExpressListingAllIds = false
          })
          this.tableData = data.records
          this.page.total = data.total
        } else {
          this.tableData = []
        }
      })
    },
    delChildHandle() {
      // TODO mjf
    },
    updateIsSelect(val) {
      this.variantIds = []
      val.tableDataChildRen.forEach(item => {
        if (item.isSelect) {
          this.variantIds.push(item) // 子sku 勾选的ids
        }
      })
      const checkedIdList = []
      this.tableData.forEach(item => {
        if (item.id === val.id) {
          item.isSelect = val.flag
        }
        if (item.isSelect) {
          checkedIdList.push(item.id)
        }
      })
      this.checked = checkedIdList.length === this.tableData.length
      this.isIndeterminate = checkedIdList.length > 0 && checkedIdList.length < this.tableData.length
    },
    handleSizeChange(val) {
      this.page.size = val
      this.listSmtListing()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.listSmtListing()
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
