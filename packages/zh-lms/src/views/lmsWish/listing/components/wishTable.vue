<template>
  <div v-loading="loading">
    <div class="head">
      <g-auth code="wish_batch_open_detail">
        <el-button type="success" size="mini" :disabled="!checkIds.length" @click="batchDetails">批量打开详情页</el-button>
      </g-auth>
      <g-auth code="wish_sku_import">
        <skuCompImport
          v-if="['Online','Update Failed','Match Failed', 'Disabled'].includes(auditTabActiveName)"
          :check-ids="checkIds"
          text="sku对照表导入"
          source="wish"
          @refreshList="getListingData()"
        />
      </g-auth>
      <g-auth code="wish_sync_listing">
        <syncFromPlatformBtn
          v-if="['Online', 'Update Failed', 'Match Failed'].includes(auditTabActiveName)"
          :check-ids="checkIds"
          :check-item-ids="checkItemIds"
          source="wish"
          text="从后台同步"
          @refreshList="getListingData()"
        />
      </g-auth>
      <g-auth code="wish_offline">
        <el-button v-if="showOffShelves" type="warning" size="mini" :disabled="!checkIds.length" @click="handleDisableProducts('')">下架</el-button>
      </g-auth>
      <template v-if="auditTabActiveName !== 'Disabled'">
        <g-auth code="wish_delete">
          <el-button v-if="showBatchDel" type="success" size="mini" :disabled="!checkIds.length " @click="batchDel('')">删除</el-button>
        </g-auth>
      </template>
      <g-auth code="wish_audit">
        <el-button v-if="auditTabActiveName === 'Draft'" type="warning" size="mini" :disabled="!checkIds.length" @click="getWishlistingAudit">提交审核</el-button>
      </g-auth>
      <g-auth code="wish_upload">
        <el-button v-if="['Draft','Approving'].includes(auditTabActiveName)" type="warning" size="mini" :disabled="!checkIds.length" @click="getUpdateWishListing">上传</el-button>
      </g-auth>
      <g-auth code="wish_online">
        <el-button v-if="auditTabActiveName==='Disabled'" type="success" size="mini" :disabled="!checkIds.length" @click="handleEnableProducts(checkIds)">重新上架</el-button>
      </g-auth>
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
          <WishListChild :ref="`wishListChild${row.id}`" :wish-listing-item="row.wishListingItem" :show-table-btn-status="showTableBtnStatus" :audit-tab-active-name="auditTabActiveName" :table-data-child-ren="tableDataChildRen" :show-off-shelves="showOffShelves" :tab-active-list="tabActiveList" @delChildHandle="delChildHandle" @getEnableSku="getEnableSku" @handleDisableSku="handleDisableSku" />
        </template>
      </el-table-column>
      <el-table-column label="SKU" width="160px" align="left">
        <template slot-scope="{row,$index}">
          <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSpu, row.name)">{{ row.productSpu }}</g-link>
            <template v-if="row.listingType === 'Variation'">(子 {{ row.variantNum }}）</template>
          </span>
          <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
          <CopyItemId :type-name="'itemId'" :row="row" :index="$index" @handleItemIdCell="handleItemIdCell(row)" />
          <span class="d-block">ListingID：{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主图" width="76px">
        <template slot-scope="{ row }">
          <g-thumb :url="row.mainImage" />
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
            <template v-else>
              <!-- v-if="auditTabActiveName === 'Canceled' && !row.itemId" -->
              <g-link @click="handleTitleCell(row)">
                <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
              </g-link>
              <!-- <g-text-ellipsis v-else>{{ row.title }}</g-text-ellipsis> -->
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="销售信息" prop="account" width="90px">
        <template v-if="row.listingType !== 'Variation'" slot-scope="{row}">
          <span class="d-block">成本：{{ row.costPrice }}</span>
          <span class="d-block">售价：{{ row.localizedPrice }}</span>
          <span class="d-block">库存：{{ row.inventory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="account" width="100px" />
      <el-table-column label="刊登方式" prop="publishMethod" width="70px">
        <template slot-scope="{row}">
          {{ row.publishMethod===1?'后台刊登':row.publishMethod===2?'蝌蚪刊登':'新系统刊登' }}
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
          <template v-if="!showRecord">
            <g-auth code="wish_update">
              <el-button v-if="!['Match Failed'].includes(auditTabActiveName)" type="text" size="mini" class="ms-0" @click="handleEdit(row)">编辑</el-button>
            </g-auth>
            <template v-if="auditTabActiveName === 'Disabled'">
              <g-auth code="wish_online">
                <el-button type="text" size="mini" class="ms-0" @click="handleEnableProducts([row.id])">重新上架</el-button>
              </g-auth>
            </template>
            <g-auth code="wish_offline">
              <el-button v-if="showOffShelves" type="text" size="mini" class="ms-0" @click="handleDisableProducts(row.id)">下架</el-button>
            </g-auth>
            <g-auth code="wish_delete">
              <el-button v-if="!['Disabled','Updating'].includes(auditTabActiveName)" type="text" size="mini" class="ms-0" @click="batchDel(row.id)">删除</el-button>
            </g-auth>
          </template>
          <g-auth code="wish_log">
            <el-button type="text" size="mini" class="ms-0" @click="handleRecord(row)">日志</el-button>
          </g-auth>
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
import { wishListing, listVariant, wishUpload, disableSku, enableProducts, disableProducts, enableSku, wishlistingDel } from '@/api/wish/wish'
import WishListChild from './wishListChild.vue'
// import UpcImport from '@/views/lms/lmsAmazon/amazon/components/upcImport.vue'
import skuCompImport from '@/views/components/skuCompImport/skuCompImportBtn.vue'
import logListing from '../../components/logListing.vue'
import listingDetail from '../~listingDetail'
import DialogListingAudit from '@/views/components/dialogListingAudit.vue'

import ImproveBatch from '@/views/components/improveBatch.vue'
import AddListing from '../addListing.vue'
import syncFromPlatformBtn from '@/views/components/syncFromPlatformBtn.vue'
import { openSpuSkuDetail } from '@/views/components/utils.js'
import { wishAudit } from '@/api/wish/wish.js'
import CopyItemId from '@/views/components/copyItemId/copyItemId.vue'
export default {
  name: 'WishTable',
  components: {
    WishListChild,
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
    },
    tabActiveList: {
      type: Array
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
      tableData: [],
      expands: [],
      isIndeterminate: false,
      checked: false,
      loading: false,
      wishListingItem: {}, // 父sku List
      //   分页参数,
      page: {
        current: 1,
        total: 1,
        size: 10
      },
      tableDataChildRen: [] // 子sku列表数据
    }
  },
  computed: {
    // 下架
    showOffShelves() {
      return ['Online', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    },
    // 只显示日志
    showRecord() {
      return ['Approving', 'Uploading', 'Auditing', 'Updating', 'Canceling', 'Canceled'].includes(this.auditTabActiveName)
    },
    showBatchDel() {
      return ['Draft', 'Upload Failed', 'Online', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    },
    // 删除按钮
    showTableBtnStatus() {
      return ['Draft', 'Approving', 'Uploading', 'Upload Failed'].includes(this.auditTabActiveName)
    },
    showDesc() {
      return ['Upload Failed', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    }
  },
  created() {
    if (this.auditTabActiveNum) {
      this.getListingData()
    }
  },
  methods: {
    getListingData() {
      this.listWishListing(1)
      this.$emit('changeStatus')
    },
    // 子sku 下架
    handleDisableSku(id) {
      this.$confirm('请确认是否下架该SKU', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disableSku(id).then(res => {
          this.$message.success('下架成功')
          this.getListingData()
        })
      }).catch((e) => {
        console.log(e, '下架')
      })
    },
    // 下架listing
    handleDisableProducts(id) {
      const ids = id || this.checkIds.join()
      this.$confirm('请确认是否下架该SKU', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disableProducts(ids).then(res => {
          this.$message.success('下架成功')
          this.getListingData()
        })
      }).catch((e) => {
        console.log(e, '下架')
      })
    },
    // 子sku 重新上架
    getEnableSku(id) {
      enableSku(id).then(res => {
        this.$message.success('重新上架成功')
        this.getListingData()
      })
    },
    // 重新上架
    handleEnableProducts(ids, isCheck = false) {
      enableProducts({ ids, isCheck: false }).then(res => {
        if (res.code === 200) {
          this.$message.success('重新上架成功')
          this.getListingData()
        } else if (res.code === 201) {
          this.$modal({
            title: '警告',
            component: ImproveBatch,
            data: {
              tableList: JSON.parse(res.msg),
              params: { ids, isCheck: true },
              keyName: 'ids',
              requestApi: enableProducts
            },
            callback: (refresh) => {
              if (refresh) {
                this.checked = []
                this.getListingData()
              }
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.$message.success('未知错误')
      })
    },
    // 批量打开详情页
    batchDetails() {
      this.checkItems?.length && this.checkItems.forEach(item => {
        this.$newPage({
          path: 'lms/lmsWish/listing/listingDetail',
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
    // 批量del
    batchDel(id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = id || this.checkIds.join()
        wishlistingDel(ids).then(res => {
          this.$message.success('删除成功')
          this.getListingData()
        })
      })
    },
    getWishlistingAudit() {
      this.$modal({
        title: '提交审核',
        component: DialogListingAudit,
        width: '500px',
        data: {
          spuIds: this.checkIds,
          audit: wishAudit,
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
    getUpdateWishListing() {
      wishUpload({ ids: this.checkIds, isCheck: false }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getListingData()
        } else if (res.code === 201) {
          this.$modal({
            title: '警告',
            component: ImproveBatch,
            data: {
              tableList: JSON.parse(res.msg),
              params: { ids: this.checkIds, isCheck: true },
              // header: ['SKU', '违禁词'],
              keyName: 'ids',
              isType: 'update',
              requestApi: wishUpload
            },
            callback: (refresh) => {
              if (refresh) {
                this.checked = []
                this.getListingData()
              }
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.$message.error('未知错误')
      })
    },
    // handlerAllImport() {
    //   this.$modal({
    //     title: '批量导入UPC',
    //     width: '560px',
    //     component: UpcImport,
    //     callback: (refresh) => {
    //       refresh && this.listWishListing()
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
        this.wishListingItem = row // 父sku item
        this.getWishListingListVariant()
      } else { // 折叠
        this.expands = []
      }
      row.isExpand = !row.isExpand
    },
    getWishListingListVariant() {
      listVariant({ id: this.wishListingItem.id }).then(res => {
        const data = res.data
        data.forEach(item => {
          item.isSelect = false
        })
        this.tableDataChildRen = data
        if (this.expands.length) {
          if (this.wishListingItem.isSelect) {
            // 全选
            this.tableDataChildRen.forEach(item => {
              item.isSelect = true
            })
            this.$refs[`wishListChild${this.wishListingItem.id}`].changeCheckStatusIfParentChange(true)
          }
        }
      })
    },
    // 父 sku 全选
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
          this.$refs['wishListChild' + item.id].changeCheckStatusIfParentChange(item.isSelect)
        }
        if (item.isSelect) {
          this.checkItems.push(item)
          this.checkIds.push(item.id)
          this.checkItemIds.push(item.itemId)
        }
      })
      this.$emit('changeCheckIds', this.checkIds)
    },
    // 父sku 单选
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
      this.$emit('changeCheckIds', this.checkIds)
    },
    // 点击asin 跳转到不同的平台
    handleItemIdCell(row) {
      const url = 'http://www.wish.com/c/' + row.itemId
      window.open(url, '_blank')
    },
    // 标题点击详情
    handleTitleCell(item) {
      // TODO mjf
      this.$newTab({
        path: '/lms/lmsWish/listing/listingDetail' + item.id,
        title: '刊登列表详情',
        component: listingDetail,
        data: {
          id: item.id,
          itemId: item.id
        },
        clearCache: true,
        callback: refresh => {
          refresh && console.log(refresh)
        }
      })
    },
    handleRecord(row) {
      this.$newTab({
        path: '/listing/logListing',
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
    },
    handleEdit(row) {
      this.$newTab({
        path: '/lms/wish/edit/listing' + row.id,
        title: '编辑单个Listing',
        component: AddListing,
        data: {
          id: row.id,
          itemId: row.itemId,
          auditTabActiveName: this.auditTabActiveName
        },
        clearCache: true,
        callback: refresh => {
          refresh && this.listWishListing()
        }
      })
    },
    listWishListing(current, size) {
      this.loading = true
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
      wishListing({ ...this.searchData, listingStatus: Number(this.auditTabActiveNum) },
        { size: this.page.size, current: this.page.current }).then(res => {
        const data = res.data
        if (data) {
          data.records.forEach(item => {
            item.wishListChildModel = []
            item.isExpand = false
            item.isSelect = false
            // 父sku的信息
            item.wishListingItem = JSON.parse(JSON.stringify(item))
            item.checkWishListingAllIds = false
          })
          this.tableData = data.records
          this.page.total = data.total
        } else {
          this.tableData = []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.listWishListing()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.listWishListing()
    },
    delChildHandle() {
      // TODO mjf
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
