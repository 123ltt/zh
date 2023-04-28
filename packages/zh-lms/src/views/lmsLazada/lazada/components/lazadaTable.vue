<template>
  <div v-loading="loading">
    <div class="head">
      <el-button v-if="permission.lz_batch_open_detail" type="success" size="mini" :disabled="!checkIds.length" @click="batchDetails">批量打开详情页</el-button>
      <skuCompImport
        v-if="['Online', 'Out Of Stock','Update Failed', 'Match Failed', 'Canceled'].includes(auditTabActiveName) && permission.lz_sku_import"
        :check-ids="checkIds"
        source="lazada"
        text="SKU对照表导入"
        @refreshList="getListingData()"
      />
      <syncFromPlatformBtn
        v-if="['Online', 'Update Failed', 'Match Failed', 'Out Of Stock'].includes(auditTabActiveName) && permission.lz_sync_listing"
        :check-ids="checkIds"
        :check-item-ids="checkItemIds"
        source="lazada"
        text="从后台同步"
        @refreshList="getListingData()"
      />
      <el-button v-if="auditTabActiveName === 'Canceled'" type="danger" size="mini" :disabled="!checkIds.length" @click="reShelve()">重新上架</el-button>
      <el-button v-if="showDel" type="success" size="mini" :disabled="!checkIds.length" @click="batchDel()">删除</el-button>
      <el-button v-if="showUnShelve" type="success" size="mini" :disabled="!checkIds.length" @click="unShelve()">下架</el-button>
      <el-button v-if="auditTabActiveName === 'Draft' && permission.lz_audit" type="warning" size="mini" :disabled="!checkIds.length" @click="listingAudit()">提交审核</el-button>
      <el-button v-if="['Draft', 'Approving'].includes(auditTabActiveName) && permission.lz_upload" type="warning" size="mini" :disabled="!checkIds.length" @click="getUpdateListing">上传</el-button>
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
      <el-table-column :fixed="isShowDesc ? 'left' : undefined" width="50">
        <template slot="header" slot-scope="scope">
          <el-checkbox v-model="checked" :indeterminate="isIndeterminate" :disabled="!scope" @change="allCheck" />
        </template>
        <template slot-scope="{row}">
          <el-checkbox v-model="row.isSelect" :indeterminate="row.isIndeterminate" @change="oneCheck(row)" />
        </template>
      </el-table-column>
      <el-table-column v-loading.fullscreen.lock="loading" :fixed="isShowDesc ? 'left' : undefined" type="expand">
        <template slot-scope="{ row }">
          <lazadaListChild :ref="`lazadaListChild${row.id}`" v-bind="{ tableDataChildRen, lazadaListingItem, auditTabActiveName }" @unShelveChild="unShelveChild" />
        </template>
      </el-table-column>
      <el-table-column :fixed="isShowDesc ? 'left' : undefined" label="SKU" width="170px" align="left">
        <template slot-scope="{row,$index}">
          <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.spu, row.name)">{{ row.spu }}</g-link>
            <template v-if="row.listingType === 'Variation'">(子 {{ row.variantCount }}）</template>
          </span>
          <span v-if="row.listingType !== 'Variation'" class="d-block">平台SKU：{{ row.sellerSku }}</span>
          <CopyItemId :type-name="'itemId'" :row="row" :index="$index" @handleItemIdCell="handleItemIdCell(row)" />
          <span>ListingID：{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主图" width="76px">
        <template slot-scope="{ row }">
          <g-thumb :url="row.masterImage" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="name">
        <template slot-scope="{ row }">
          <g-link @click="handleTitleCell(row)">
            <g-text-ellipsis>{{ row.name }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column label="销售信息" width="100px">
        <template v-if="row.listingType !== 'Variation'" slot-scope="{row}">
          <span class="d-block">成本：{{ row.productCost }}</span>
          <span class="d-block">售价：{{ row.price }}</span>
          <span class="d-block">促销价：{{ row.specialPrice }}</span>
          <span class="d-block">库存：{{ row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="storeName" width="100px" />
      <el-table-column :label="[1,2,3,4].includes(auditTabActiveNum) ? '已选站点' : '站点'" prop="site" width="100px">
        <template slot-scope="{row}">{{ row.site }}</template>
      </el-table-column>
      <el-table-column label="后台刊登" prop="isAmazonUpload" width="70px">
        <template slot-scope="{row}"> {{ row.isLazadaUpload?'是':'否' }} </template>
      </el-table-column>
      <el-table-column label="时间" prop="createTime" width="158px">
        <template slot-scope="{row}">
          <span class="d-block">创建:{{ row.createTime }}</span>
          <span v-if="row.itemId" class="d-block">上架:{{ row.upOnlineTime }}</span>
          <span v-if="auditTabActiveName === 'Approving'" class="d-block">定时刊登:{{ row.timedUploadTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人员信息" prop="createUserName" width="130px">
        <template slot-scope="{row}">
          <span class="d-block">创建人:{{ row.createUserName }}</span>
          <span class="d-block">负责人:{{ row.saleUserName }}</span>
          <!-- <span class="d-block">开发:{{ row.developerName }}</span> -->
        </template>
      </el-table-column>
      <el-table-column v-if="isShowDesc" label="报错信息" width="110px">
        <template v-slot="{ row }">
          <g-link @click="handleRecord(row)">
            <g-text-ellipsis>{{ row.errorMsg }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" :fixed="isShowDesc ? 'right' : undefined" :width="auditTabActiveName === 'Canceled' ? '65px' : '60px'">
        <template slot-scope="{row}">
          <el-button v-if="showEdit" type="text" size="mini" class="ms-0" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="showUnShelve" type="text" size="mini" class="ms-0" @click="unShelve(row)">下架</el-button>
          <el-button v-if="auditTabActiveName === 'Canceled' && permission.lz_reShelve" type="text" size="mini" class="ms-0" @click="reShelve(row)">重新上架</el-button>
          <el-button v-if="showDel" type="text" size="mini" class="ms-0" @click="batchDel(row)">删除</el-button>
          <el-button v-if="permission.lz_log" type="text" size="mini" class="ms-0" @click="handleRecord(row)">日志</el-button>
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
import { mapGetters } from 'vuex'
import * as lzdApi from '@/api/lazada/lazadaList.js'
import { siteList } from './addListing.handle.js'
import UpcImport from '@/views/lmsAmazon/amazon/components/upcImport'
import skuCompImport from '@/views/components/skuCompImport/skuCompImportBtn.vue'
import syncFromPlatformBtn from '@/views/components/syncFromPlatformBtn.vue'
import lazadaListChild from './lazadaListChild.vue'
import logListing from '../../components/logListing.vue'
import DialogListingAudit from '@/views/components/dialogListingAudit.vue'
import ImproveBatch from '@/views/components/improveBatch.vue'
import ListingDetail from '../~listingDetail.vue'
import AddListing from '../addListing.vue'
import { openSpuSkuDetail } from '@/views/components/utils.js'
import CopyItemId from '@/views/components/copyItemId/copyItemId.vue'
export default {
  name: 'LazadaTable',
  components: {
    lazadaListChild,
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
      lazadaListingItem: {},
      tableDataChildRen: [] // 子sku列表数据
    }
  },
  computed: {
    ...mapGetters(['permission']),
    showDel() {
      // 显示删除
      const status = ['Draft', 'Upload Failed', 'Online', 'Update Failed', 'Pending QC', 'Out Of Stock', 'Match Failed', 'Canceled', 'Suspend'].includes(this.auditTabActiveName)
      return status && this.permission.lz_delete
    },
    showUnShelve() { // 显示下架
      const status = ['Online', 'Out Of Stock', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
      return status && this.permission.lz_unShelve
    },
    showEdit() { // 显示编辑
      const status = ['Draft', 'Upload Failed', 'Update Failed', 'Online', 'Out Of Stock', 'Canceled'].includes(this.auditTabActiveName)
      return status && this.permission.lz_update
      // return true
    },
    isShowDesc() { // 显示报错信息
      return ['Upload Failed', 'Update Failed'].includes(this.auditTabActiveName)
    }
  },
  created() {
    this.getListingData()
  },
  methods: {
    getListingData() {
      this.listLazadaListing(1)
      this.$emit('changeStatus')
    },
    handleEdit(row) {
      this.createListing(row)
    },
    createListing(row) {
      this.$newTab({
        path: row ? '/lms/lazada/edit/varylisting' + row.id : '/lms/lazada/add/varylisting',
        title: row ? '编辑listing' : '创建listing',
        component: AddListing,
        clearCache: true,
        data: {
          id: row.id,
          itemId: row.itemId
        },
        callback: refresh => {
          if (refresh) {
            this.getListingData()
            this.expands = []
          }
        }
      })
    },
    // 上传
    getUpdateListing() {
      this.dealRequest(lzdApi.upload, { spuIds: this.checkIds, isCheck: true }, 'spuIds')
    },
    // 审核
    listingAudit() {
      this.$modal({
        title: '提交审核',
        component: DialogListingAudit,
        width: '500px',
        data: {
          spuIds: this.checkIds,
          isCheck: true,
          audit: lzdApi.audit,
          keyName: 'spuIds'
        },
        callback: (refersh) => {
          if (refersh) {
            this.checkIds = []
            this.getListingData()
          }
        }
      })
    },
    // 提交类请求，有二次验证提示
    dealRequest(request, params, keyName) {
      request(params).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getListingData()
        } else if (res.code === 201) {
          this.defaultErr(res.msg, request, { ...params, isCheck: false }, keyName)
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
          params,
          keyName,
          isCheck: params.isCheck,
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
        lzdApi.remove({ ids }).then(res => {
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
        const ids = row ? row.id : this.checkIds.join(',')
        lzdApi.unShelve({ ids }).then(res => {
          this.$message.success('操作成功')
          this.getListingData()
        })
      })
    },
    // 重新上架
    reShelve(row) {
      const ids = row ? [row.id] : this.checkIds
      this.dealRequest(lzdApi.reShelve, { ids, isCheck: true }, 'ids')
    },
    handlerAllImport() {
      this.$modal({
        title: '批量导入UPC',
        width: '560px',
        component: UpcImport,
        callback: (refresh) => {
        }
      })
    },
    // 控制多属性是否展示箭头
    setClassName({ row, index }) {
      return row.listingType !== 'Variation' ? 'expand' : ''
    },
    // 展开
    changeExpand(row, expandedRows) {
      if (expandedRows.length) { // 此时展开
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
        this.lazadaListingItem = row // 父sku item
        this.getListingListVariant()
      } else { // 折叠
        this.expands = []
      }
      row.isExpand = !row.isExpand
    },
    getListingListVariant() {
      const spuId = this.lazadaListingItem.id
      lzdApi.listVariant({ spuId }).then(res => {
        const data = res.data
        data.forEach(item => {
          item.isSelect = false
        })
        this.tableDataChildRen = data
        if (this.expands.length) {
          if (this.lazadaListingItem.isSelect) {
            // 全选
            this.tableDataChildRen.forEach(item => {
              item.isSelect = true
            })
            // this.$refs[`lazadaListChild${this.lazadaListingItem.id}`].changeCheckStatusIfParentChange(true)
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
        // if (item.isExpand) {
        //   this.$refs['lazadaListChild' + item.id].changeCheckStatusIfParentChange(item.isSelect)
        // }
        if (item.isSelect) {
          this.checkItems.push(item)
          this.checkIds.push(item.id)
          this.checkItemIds.push(item.itemId)
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
        // if (this.$refs['lazadaListChild' + row.id]) {
        //   this.$refs['lazadaListChild' + row.id].changeCheckStatusIfParentChange(row.isSelect)
        // }
      }
      this.$emit('changeCheckIds', this.checkIds)
    },
    // 点击itemID 跳转到不同的平台
    handleItemIdCell(row) {
      const url = `//pdp.lazada.${siteList[row.site].domain}/products/i${row.itemId}.html`
      window.open(url, '_blank')
    },
    // 标题点击详情
    handleTitleCell(item) {
      this.$newTab({
        path: '/lms/lmsLazada/view/listing' + item.id,
        title: '查看Listing详情',
        component: ListingDetail,
        clearCache: true,
        data: {
          id: item.id,
          itemId: item.itemId
        }
      })
    },
    // 批量打开详情页
    batchDetails() {
      this.checkItems.forEach(item => {
        this.$newPage({
          path: 'lms/lmsLazada/lazada/listingDetail',
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
    handleRecord(row) {
      this.$newTab({
        path: '/listing/logListing',
        title: '操作日志',
        component: logListing,
        data: { listingId: row.id },
        callback: refresh => {
          // console.log(refresh)
        },
        clearCache: true
      })
    },
    listLazadaListing(current, size) {
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
        listingStatus: Number(this.auditTabActiveNum),
        pageSize: this.page.size,
        pageNumber: this.page.current
      }
      let searchContent = []
      if (params.searchContent) {
        if (params.searchType === '1') {
          searchContent = [params.searchContent]
        } else {
          searchContent = params.searchContent.split(/,|，|\r|\n|\r\n|\s+/)
        }
      }
      // 处理创建时间和上架时间
      if (params.createTime && params.createTime.length) {
        params.createStartTime = params.createTime[0]
        params.createEndTime = params.createTime[1]
        delete params.createTime
      }
      if (params.upOnlineTime && params.upOnlineTime.length) {
        params.upOnlineStartTime = params.upOnlineTime[0]
        params.upOnlineEndTime = params.upOnlineTime[1]
        delete params.upOnlineTime
      }
      this.loading = true
      lzdApi.getLazadaListing({ ...params, searchContent }).then(res => {
        const data = res.data
        data.records.forEach(item => {
          item.isExpand = false
          item.isSelect = false
          // 父sku的信息
          item.lazadaListingItem = JSON.parse(JSON.stringify(item))
          item.checkAliExpressListingAllIds = false
        })
        this.tableData = data.records
        this.page.total = data.total
      }).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.listLazadaListing()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.listLazadaListing()
    },
    // 子sku下架
    unShelveChild() {
      this.expands = []
      this.getListingData()
      this.getListingListVariant()
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
