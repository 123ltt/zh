<template>
  <el-table :ref="`tableChild${ebayListingItem.id}`" tooltip-effect="dark" border stripe highlight-current-row :data="tableDataChildRen" class="g-table g-table-dense">
    <!-- online 之前子sku 没有复选框 -->
    <el-table-column v-if="showStatus" width="55">
      <template slot="header" slot-scope="scope">
        <el-checkbox v-model="checked" :indeterminate="isChildIndeterminate" :disabled="!scope" @change="allCheck" />
      </template>
      <template slot-scope="{row}">
        <el-checkbox v-model="row.isSelect" :disabled="row.listingStatus===10" @change="oneCheck" />
      </template>
    </el-table-column>
    <el-table-column label="子SKU" prop="name" width="180">
      <template slot-scope="{row,$index}">
        <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSku, row.productSku)">{{ row.productSku }}</g-link></span>
        <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
        <CopyItemId :type-name="'itemId'" :row="row" :index="$index" @handleItemIdCell="handleAsinCell(row)" />
      </template>
    </el-table-column>
    <el-table-column label="主图" width="76px">
      <template slot-scope="{ row }">
        <g-thumb :url="row.imageUrl" />
      </template>
    </el-table-column>
    <el-table-column label="标题" prop="name">
      <template slot-scope="{ row }">
        <template v-if="showStatus">
          <g-link @click="handleTitleCell(row)">
            <g-text-ellipsis>{{ row.name }}</g-text-ellipsis>
          </g-link>
        </template>
        <g-text-ellipsis v-else>{{ row.name }}</g-text-ellipsis>
      </template>
    </el-table-column>
    <template v-if="showStatus">
      <el-table-column label="状态" prop="name" width="100">
        <template slot-scope="{row}">
          {{ row.status }}
        </template>
      </el-table-column>
      <el-table-column label="Item Status" prop="publishStatus" width="100">
        <template slot-scope="{row}">
          {{ row.publishStatus }}
        </template>
      </el-table-column>
      <el-table-column label="Lift Cycle" prop="lifecycleStatus" width="100">
        <template slot-scope="{row}">
          {{ row.lifecycleStatus }}
        </template>
      </el-table-column>
    </template>
    <el-table-column label="时间" prop="name" width="168">
      <template slot-scope="{row}">
        <span class="d-block">创建:{{ row.createTime }}</span>
        <span v-if="showUpOnlineTime" class="d-block">上架:{{ row.updateTime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="库存" prop="stock" width="80" />
    <el-table-column label="成本" prop="costPrice" width="80" />
    <el-table-column label="售价" prop="price" width="80" />
    <el-table-column v-if="auditTabActiveNum === 10" label="错误信息" prop="statusChangeReason" width="168" />
    <template v-if="showStatus">
      <el-table-column label="操作" width="60px">
        <template slot-scope="{row}">
          <template v-if="showEdit">
            <el-button type="text" size="small" class="ms-0" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" class="ms-0" @click="handleDel(row)">删除</el-button>
          </template>
          <el-button type="text" size="small" class="ms-0" @click="handleRecord(row)">日志</el-button>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
import { openSpuSkuDetail } from '@/views/components/utils.js'
import logListing from './logListing.vue'
import AddListing from '../addListing.vue'
import WalmartDetail from '../~walmartDetail.vue'
import CopyItemId from '@/views/components/copyItemId/copyItemId.vue'
export default {
  name: 'ChildTable',
  components: { CopyItemId },
  props: {
    ebayListingItem: { // 父sku obj
      type: Object,
      default: () => { return {} }
    },
    auditTabActiveNum: { // 产品状态
      type: Number
    },
    auditTabActiveName: {
      type: String
    },
    tableDataChildRen: { // 子sku 列表数据
      type: Array
    },
    showUpOnlineTime: { // 在线状态
      type: Boolean
    },
    isChildIndeterminate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openSpuSkuDetail,
      multipleSelection: [],
      tableDataId: '', // 子sku 取消某一项勾选，父级sku 去掉勾选
      flag: true,
      checkChildIds: [],
      siteList: [],
      checked: false // head 勾选
    }
  },
  computed: {
    showEdit() {
      return ['Online', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
    },
    showStatus() {
      return this.auditTabActiveNum > 4
    }
  },
  watch: {
    'ebayListingItem.isSelect'() {
      this.yy(this.ebayListingItem.isSelect)
    }
  },
  methods: {
    // 全选
    allCheck(val) {
      // 全选 半选效果就为假
      this.$emit('update:isChildIndeterminate', false)
      this.checked = val
      this.tableDataChildRen.forEach(item => {
        if (item.listingStatus !== 10) {
          item.isSelect = val
        }
      })
      const list = []
      this.tableDataChildRen.forEach(item => {
        if (item.listingStatus !== 10 && item.isSelect) {
          list.push(item)
        }
      })
      if (val) {
        this.$emit('updateIsSelect', { id: this.ebayListingItem.id, flag: true, checkChildIds: list, tableDataChildRen: this.tableDataChildRen })
        this.flag = false
      } else {
        this.$emit('updateIsSelect', { id: this.ebayListingItem.id, flag: false, checkChildIds: list, tableDataChildRen: this.tableDataChildRen })
        this.flag = false
      }
    },
    // 子项单选
    oneCheck(val) {
      let isok = true
      this.tableDataChildRen.forEach(item => {
        if (item.isSelect !== val) {
          isok = false
        }
      })
      const list = this.tableDataChildRen.filter(item => item.isSelect === true).map(acc => acc.id)
      // isok true  全选
      if (isok) {
        this.$emit('update:isChildIndeterminate', false)
        this.checked = val
        if (val) {
          this.$emit('updateIsSelect', { id: this.ebayListingItem.id, flag: true, checkChildIds: list, tableDataChildRen: this.tableDataChildRen })
        }
      } else { // 半选，
        this.$emit('update:isChildIndeterminate', true)
        this.checked = false
      }
      // if (!val) {
      const isBoolean = this.tableDataChildRen.length === list.length
      this.$emit('updateIsSelect', { id: this.ebayListingItem.id, flag: isBoolean, checkChildIds: list, tableDataChildRen: this.tableDataChildRen })
      // }
    },
    yy(isSelect) {
      if (this.flag) {
        if (!isSelect) { // false 子sku 清空勾选
          this.allCheck(false)
        } else { // 全选
          this.allCheck(true)
        }
      } else {
        this.flag = true
      }
    },
    // 点击asin 跳转到不同的平台
    handleAsinCell(row) {
      window.open(row.itemPageUrl, '_blank')
    },
    // 标题点击详情
    handleTitleCell(item) {
      this.$newTab({
        path: '/lms/walmart/view/listing' + item.id,
        title: '查看Listing',
        component: WalmartDetail,
        clearCache: true,
        data: {
          id: item.id
        }
      })
    },
    handleEdit(row) {
      this.$newTab({
        path: '/lms/walmart/edit/listing' + row.id,
        title: '编辑Listing',
        component: AddListing,
        data: {
          id: row.id,
          itemId: row.item
        },
        clearCache: true,
        callback: refresh => {
          refresh && this.$emit('getAmazonlistingListVariant')
        }
      })
    },
    handleRecord(row) {
      this.$newTab({
        path: '/walmartList/logListing',
        title: '刊登管理/操作日志',
        component: logListing,
        data: {
          walmartListId: row.id
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
