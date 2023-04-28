<template>
  <div>
    <div class="head">
      <el-button v-if="$auth('ali_batch_open_detail')" type="success" size="mini" :disabled="!checkIds.length" @click="batchDetails">批量打开详情页</el-button>
      <skuCompImport v-if="['Online', 'Update Failed', 'Match Failed','Canceled'].includes(auditTabActiveName) && $auth('ali_sku_bind')"
                     :check-ids="checkIds"
                     source="aliExpress"
                     text="sku对照表导入"
                     @refreshList="getListingData()"
      />
      <syncFromPlatformBtn
        v-if="['Online', 'Update Failed', 'Match Failed'].includes(auditTabActiveName) && $auth('ali_sync')"
        :check-ids="checkIds"
        :check-item-ids="checkItemIds"
        source="aliExpress"
        text="从后台同步"
        @refreshList="getListingData()"
      />
      <el-button v-if="showReShelve && $auth('ali_batch_online_offline')" type="warning" size="mini" :disabled="!checkIds.length" @click="reShelve()">重新上架</el-button>
      <el-button v-if="showDel && $auth('ali_remove')" type="success" size="mini" :disabled="!checkIds.length" @click="batchDel()">删除</el-button>
      <el-button v-if="showUnShelve && $auth('ali_batch_online_offline')" type="success" size="mini" :disabled="!checkIds.length" @click="unShelve()">下架</el-button>
      <el-button v-if="auditTabActiveName === 'Draft' && $auth('ali_audit')" type="warning" size="mini" :disabled="!checkIds.length" @click="listingAudit()">提交审核</el-button>
      <el-button v-if="['Draft','Approving'].includes(auditTabActiveName) && $auth('ali_upload')" type="warning" size="mini" :disabled="!checkIds.length" @click="getUpdateListing()">上传</el-button>
    </div>
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
      <el-table-column v-loading.fullscreen.lock="varLoading" type="expand">
        <template slot-scope="{ row }">
          <AliExpressListChild
            :ref="`aliExpressListChild${row.id}`"
            :ali-express-listing-item="row.aliExpressListingItem"
            :audit-tab-active-num="auditTabActiveNum"
            :audit-tab-active-name="auditTabActiveName"
            :table-data-child-ren="tableDataChildRen"
            @updateIsSelect="updateIsSelect"
            @delChildHandle="delChildHandle"
            @getAliExpressListingListVariant="getAliExpressListingListVariant"
          />
        </template>
      </el-table-column>
      <el-table-column label="SKU" width="175px" align="left">
        <template slot-scope="{row,$index}">
          <span class="d-block">
            SKU:<g-link class="text-primary" @click="openSpuSkuDetail(row.productSpu, row.subject)">{{ row.productSpu }}</g-link>
            <template v-if="row.listingType === 'Variation'">(子 {{ row.variantNum }}）</template>
          </span>
          <CopyItemId :row="row" :index="$index" @handleItemIdCell="handleItemIdCell(row)" />
          <span class="d-block">ListingID：{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主图" width="76px">
        <template slot-scope="{ row }">
          <g-thumb :url="row.images[0]" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="subject">
        <template slot-scope="{ row }">
          <g-link @click="handleTitleCell(row)">
            <g-text-ellipsis lines="3">{{ row.subject }}</g-text-ellipsis>
          </g-link>
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
          <span v-if="!showTableBtnStatus && row.upOnlineTime" class="d-block">上架:{{ row.upOnlineTime }}</span>
          <template v-if="auditTabActiveName === 'Approving'">
            <span class="d-block">审核:{{ row.auditTime }}</span>
            <span class="d-block">定时刊登:{{ row.timedUploadTime }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="人员信息" prop="developUser" width="130px">
        <template slot-scope="{row}">
          <span class="d-block">创建人:{{ row.createUserName }}</span>
          <span class="d-block">负责人:{{ row.saleUserName }}</span>
          <!-- <span class="d-block">开发:{{ row.developUserName }}</span> -->
        </template>
      </el-table-column>
      <el-table-column v-if="showDesc" label="报错信息" width="110px">
        <template slot-scope="{ row }">
          <g-link @click="handleRecord(row)">
            <g-text-ellipsis>{{ row.errorMsg }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="66px">
        <template slot-scope="{row}">
          <el-button v-if="showEdit && $auth('ali_update')" type="text" size="mini" class="ms-0" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="showUnShelve && $auth('ali_batch_online_offline')" type="text" size="mini" class="ms-0" @click="unShelve(row)">下架</el-button>
          <el-button v-if="showReShelve && $auth('ali_batch_online_offline')" type="text" size="mini" class="ms-0" @click="reShelve(row)">重新上架</el-button>
          <el-button v-if="showDel && $auth('ali_remove')" type="text" size="mini" class="ms-0" @click="batchDel(row)">删除</el-button>
          <el-button v-if="$auth('ali_log')" type="text" size="mini" class="ms-0" @click="handleRecord(row)">日志</el-button>
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
import * as Api from '@/api/aliExpress/list.js'
import skuCompImport from '@/views/components/skuCompImport/skuCompImportBtn.vue'
import syncFromPlatformBtn from '@/views/components/syncFromPlatformBtn.vue'
import DialogListingAudit from '@/views/components/dialogListingAudit.vue'
import ImproveBatch from '@/views/components/improveBatch.vue'
import AliExpressListChild from './aliExpressListChild.vue'
import logListing from '../../components/logListing.vue'
import ListingDetail from '@/views/lmsAliExpress/aliExpress/~listingDetail.vue'
import AddListing from './../addListing.vue'
import { openSpuSkuDetail } from '@/views/components/utils.js'
import CopyItemId from '@/views/components/copyItemId/copyItemId.vue'
export default {
  name: 'AliExpressTable',
  components: {
    AliExpressListChild,
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
  data() {
    return {
      checkIds: [], // 勾选处理的ids
      checkItemIds: [],
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
      openSpuSkuDetail,
      loading: false,
      varLoading: false,
      aliExpressListingItem: {},
      tableDataChildRen: [] // 子sku列表数据
    }
  },
  computed: {
    // Online 之前 只有父sku 有三个操作按钮 ，子sku 没有操作按钮
    // 无变体， 父sku 跳转单个listing
    // 有变体，父sku 跳转多个vary listing
    showTableBtnStatus() {
      return ['Draft', 'Approving', 'Uploading', 'Upload Failed'].includes(this.auditTabActiveName)
    },
    showEdit() { // 显示编辑
      return ['Draft', 'Upload Failed', 'Update Failed', 'Online'].includes(this.auditTabActiveName)
    },
    showDel() { // 显示删除
      return ['Draft', 'Upload Failed'].includes(this.auditTabActiveName)
    },
    showUnShelve() { // 显示下架
      const status = ['Online', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
      return status
    },
    showReShelve() { // 重新上架
      return this.auditTabActiveName === 'Canceled'
    },
    // 报错信息
    showDesc() {
      return ['Upload Failed', 'Update Failed', 'Refuse', 'Match Failed'].includes(this.auditTabActiveName)
    }
  },
  created() {
    this.getListingData()
  },
  methods: {
    getListingData() {
      this.listSmtListing(1)
      this.$emit('changeStatus')
    },
    handleEdit(row) {
      this.createListing(row)
    },

    createListing(row) {
      this.$newTab({
        path: row ? '/lms/aliexpress/edit/varylisting' + row.id : '/lms/aliexpress/add/varylisting',
        title: row ? '编辑listing' : '创建listing',
        component: AddListing,
        clearCache: true,
        data: {
          id: row.id,
          itemId: row.itemId
        },
        callback: refresh => {
          refresh && this.getListingData()
        }
      })
    },
    // 批量打开详情页
    batchDetails() {
      this.checkItems.forEach(item => {
        this.$newPage({
          path: 'lms/lmsAliExpress/aliExpress/listingDetail',
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
    // 提交类请求，有二次验证提示
    dealRequest(request, params, keyName) {
      request(params).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getListingData()
        } else if (res.code === 201) {
          this.defaultErr(res.msg, request, { ...params, isCheck: true }, keyName)
        } else {
          this.$message.error(res.msg || '未知错误')
        }
      }).catch(() => {
        this.$message.error('未知错误')
      })
    },
    // 二次提交
    defaultErr(msg, request, params, keyName) {
      this.$modal({
        title: '警告',
        component: ImproveBatch,
        data: {
          tableList: JSON.parse(msg),
          params: { ...params, isCheck: true },
          keyName,
          requestApi: request
        },
        callback: (refresh) => {
          if (refresh) {
            this.checked = []
            this.getListingData()
          }
        }
      })
    },
    // 批量删除
    batchDel(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = row ? row.id : this.checkIds.join(',')
        Api.remove({ ids }).then(res => {
          this.$message.success('操作成功')
          this.getListingData()
        })
      })
    },
    // 下架
    unShelve(row) {
      this.$confirm('确定下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const listingIds = row ? [row.id] : this.checkIds
        Api.unShelve({ listingIds, isCheck: false, type: 2 }).then(res => {
          this.$message.success('操作成功')
          this.getListingData()
        })
      })
    },
    // 重新上架
    reShelve(row) {
      const listingIds = row ? [row.id] : this.checkIds
      this.dealRequest(Api.reShelve, { listingIds, isCheck: false, type: 1 }, 'listingIds')
    },
    // 上传
    getUpdateListing() {
      this.dealRequest(Api.upload, { ids: this.checkIds, isCheck: false }, 'ids')
    },
    // 审核
    listingAudit() {
      this.$modal({
        title: '提交审核',
        component: DialogListingAudit,
        width: '500px',
        data: {
          spuIds: this.checkIds,
          keyName: 'ids',
          audit: Api.audit
        },
        callback: (refersh) => {
          if (refersh) {
            this.checkIds = []
            this.getListingData()
          }
        }
      })
    },
    // 控制多属性是否展示箭头
    setClassName({ row, index }) {
      // row.listingType = row.listingType && row.listingType.substring(0, 1).toUpperCase() + row.listingType.substring(1)
      // return row.listingType !== 'Variation' ? 'expand' : ''
      return ''
    },
    // 展开
    changeExpand(row, expandedRows) {
      if (expandedRows.length) { // 此时展开
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
        this.aliExpressListingItem = row // 父sku item
        this.getAliExpressListingListVariant()
      } else { // 折叠
        this.expands = []
      }
      row.isExpand = !row.isExpand
    },
    getAliExpressListingListVariant() {
      this.varLoading = true
      Api.listVariant({ id: this.aliExpressListingItem.id }).then(res => {
        const data = res.data
        data.forEach(item => {
          item.isSelect = false
        })
        this.tableDataChildRen = data
        if (this.expands.length) {
          if (this.aliExpressListingItem.isSelect) {
            // 全选
            this.tableDataChildRen.forEach(item => {
              item.isSelect = true
            })
            this.$refs[`aliExpressListChild${this.aliExpressListingItem.id}`].changeCheckStatusIfParentChange(true)
          }
        }
      }).finally(() => {
        this.varLoading = false
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
      this.tableData.forEach(item => {
        if (item.isExpand) {
          this.$refs['aliExpressListChild' + item.id].changeCheckStatusIfParentChange(item.isSelect)
        }
        if (item.isSelect) {
          this.checkItems.push(item)
          this.checkIds.push(item.id)
        }
      })
      this.$emit('changeCheckIds', this.checkIds)
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
        if (this.$refs['aliExpressListChild' + row.id]) {
          this.$refs['aliExpressListChild' + row.id].changeCheckStatusIfParentChange(row.isSelect)
        }
      }
      this.$emit('changeCheckIds', this.checkIds)
    },
    // 点击itemID 跳转到不同的平台
    handleItemIdCell(row) {
      const url = '//www.aliexpress.com/item/' + row.itemId + '.html'
      window.open(url, '_blank')
    },
    // 标题点击详情
    handleTitleCell(item) {
      // TODO mjf
      this.$newTab({
        path: '/lms/aliExpress/view/listing' + item.id,
        title: item.listingType === 'Combo' ? '查看SPU Listing详情' : '查看SKU Listing详情',
        component: ListingDetail,
        clearCache: true,
        data: {
          id: item.id
        }
      })
    },
    handleRecord(row) {
      this.$newTab({
        title: '日志',
        component: logListing,
        data: { listingId: row.id }
      })
    },
    listSmtListing(current = 1, size) {
      this.checkIds = []
      this.checked = false
      this.isIndeterminate = false
      if (current) {
        this.page.current = current
      }
      current = current || this.page.current
      size = size || this.page.size
      const params = {
        ...this.searchData,
        upOnlineTime: undefined,
        listingStatus: Number(this.auditTabActiveNum)
      }
      this.loading = true
      Api.aliExpressListing({ size, current }, { ...params }).then(res => {
        const data = res.data
        data.records.forEach(item => {
          item.images = item.imageUrls?.split(';') || []
          item.aliExpressListChildModel = []
          item.isExpand = false
          item.isSelect = false
          // 父sku的信息
          item.aliExpressListingItem = JSON.parse(JSON.stringify(item))
          item.checkAliExpressListingAllIds = false
        })
        this.tableData = data.records
        this.page.total = data.total
      }).finally(() => {
        this.loading = false
      })
    },
    delChildHandle() {
      // TODO mjf
    },
    updateIsSelect(val) {
      // this.variantIds = []
      // val.tableDataChildRen.forEach(item => {
      //   if (item.isSelect) {
      //     this.variantIds.push(item) // 子sku 勾选的ids
      //   }
      // })
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
      this.listSmtListing(1)
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.listSmtListing(val)
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
