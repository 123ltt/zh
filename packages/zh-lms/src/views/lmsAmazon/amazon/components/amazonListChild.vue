<template>
  <el-table :ref="`tableChild${amazonListingItem.id}`" tooltip-effect="dark" border stripe highlight-current-row :data="tableDataChildRen" class="g-table g-table-dense">
    <!-- online 之前子sku 没有复选框 -->
    <el-table-column v-if="!showTableBtnStatus" width="55">
      <template slot="header" slot-scope="scope">
        <el-checkbox v-model="checked" :indeterminate="isChildIndeterminate" :disabled="!scope" @change="allCheck" />
      </template>
      <template slot-scope="{row}">
        <el-checkbox v-model="row.isSelect" :disabled="row.listingStatus===10" @change="oneCheck" />
      </template>
    </el-table-column>
    <el-table-column label="子SKU" prop="name" width="210px">
      <template slot-scope="{row}">
        <span class="d-block">SKU：{{ row.productSku }}</span>
        <span class="d-block">平台SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.sellerSku, row.sellerSku)">{{ row.sellerSku }}</g-link></span>
        <g-link v-if="row.asin" @click="handleAsinCell(row)">
          <span class="d-block">ASIN：{{ row.asin }}</span>
        </g-link>
        <span v-else class="d-block">ASIN：{{ row.asin }}</span>
        <span class="d-block">ListingID：{{ row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="主图" width="76px">
      <template slot-scope="{ row }">
        <g-thumb :url="row.asin?row.mainImage||row.thumbnail:row.mainImage" />
      </template>
    </el-table-column>
    <el-table-column label="标题" prop="title">
      <template slot-scope="{row}">
        <g-link v-if="row.asin" @click="handleTitleCell(row)">
          <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
        </g-link>
        <g-text-ellipsis v-else>{{ row.title }}</g-text-ellipsis>
      </template>
    </el-table-column>
    <el-table-column v-if="auditTabActiveNum >4" prop="productSku" label="状态" width="76px">
      <template slot-scope="{row}">{{ listingStatusName[row.listingStatus-1] || '-' }}</template>
    </el-table-column>
    <el-table-column label="库存" prop="quantity" width="80" />
    <el-table-column label="成本" prop="costPrice" width="80" />
    <template v-if="auditTabActiveNum > 4">
      <el-table-column label="售价" prop="price" width="80" />
    </template>
    <template v-else>
      <el-table-column label="售价" prop="standardPrice" width="80" />
    </template>
    <el-table-column label="时间" prop="name" width="168">
      <template slot-scope="{row}">
        <span class="d-block">创建:{{ amazonListingItem.createTime }}</span>
        <span v-if="!showTableBtnStatus&&row.upOnlineTime" class="d-block">上架:{{ row.upOnlineTime }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="!showTableBtnStatus" label="操作" width="60">
      <template slot-scope="{row}">
        <template v-if="auditTabActiveNum === 5">
          <!--父 5  子57 edit  del -->
          <template v-if="['Online','Update Failed'].includes(listingStatusName[row.listingStatus-1])">
            <el-button v-if="row.productSku" type="text" size="mini" class="ms-0" @click="createListing(row)">编辑</el-button>
            <el-button type="text" size="mini" class="ms-0" @click="handleDel(row)">删除</el-button>
          </template>
        </template>
        <template v-else>
          <template v-if="['Online','Update Failed'].includes(listingStatusName[row.listingStatus-1])">
            <el-button type="text" size="mini" class="ms-0" @click="createListing(row)">编辑</el-button>
            <el-button type="text" size="mini" class="ms-0" @click="handleDel(row)">删除</el-button>
          </template>
          <el-button v-if="listingStatusName[row.listingStatus-1] === 'Match Failed'" type="text" size="mini" class="ms-0" @click="handleDel(row)">删除</el-button>
        </template>
        <el-button type="text" size="mini" class="ms-0" @click="handleRecord(row)">日志</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import AddListing from '../addListing.vue'
// import { amazonlistingListVariant, getByAmazonListingId } from '@/api/amazon/amazon'
import logListing from '../../components/logListing'
import ListingDetail from './../~listingDetail.vue'
import { openSpuSkuDetail } from '@/views/components/utils.js'
export default {
  name: 'LmsAmazonAmazonAmazonListChild',
  props: {
    amazonListingItem: { // 父sku obj
      type: Object,
      default: () => { return {} }
    },
    // oline 之前，子sku 没有操作按钮
    // 之后，子sku有操作按钮，父只有删除按钮 子sku 有三个按钮
    showTableBtnStatus: {
      type: Boolean,
      default: false
    },
    auditTabActiveNum: { // 产品状态
      type: Number
    },
    auditTabActiveName: {
      type: String
    },
    domainList: { // 根据站点跳到对应后缀域名
      type: Array
    },
    tableDataChildRen: { // 子sku 列表数据
      type: Array
    },
    isChildIndeterminate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openSpuSkuDetail,
      listingStatusName: ['Draft', 'Approving', 'Uploading', 'Upload Failed', 'Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling', 'Canceled'],
      multipleSelection: [],
      tableDataId: '', // 子sku 取消某一项勾选，父级sku 去掉勾选
      checked: false, // head 勾选
      flag: true,
      checkChildIds: []

    }
  },
  computed: {
    // 上架时间 5-9
    showUpOnlineTime() {
      return this.auditTabActiveName === 'Online' || this.auditTabActiveName === 'Updating' || this.auditTabActiveName === 'Update Failed' || this.auditTabActiveName === 'Match Failed' || this.auditTabActiveName === 'Canceling'
    }
  },
  watch: {
    'amazonListingItem.isSelect'() {
      this.yy(this.amazonListingItem.isSelect)
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
        this.$emit('updateIsSelect', { id: this.amazonListingItem.id, flag: true, checkChildIds: list, tableDataChildRen: this.tableDataChildRen })
        this.flag = false
      } else {
        this.$emit('updateIsSelect', { id: this.amazonListingItem.id, flag: false, checkChildIds: list, tableDataChildRen: this.tableDataChildRen })
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
          this.$emit('updateIsSelect', { id: this.amazonListingItem.id, flag: true, checkChildIds: list, tableDataChildRen: this.tableDataChildRen })
        }
      } else { // 半选，
        this.$emit('update:isChildIndeterminate', true)
        this.checked = false
      }
      // if (!val) {
      const isBoolean = this.tableDataChildRen.length === list.length
      this.$emit('updateIsSelect', { id: this.amazonListingItem.id, flag: isBoolean, checkChildIds: list, tableDataChildRen: this.tableDataChildRen })
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
      const obj = this.domainList.find(item => item.label === row.amazonSite)
      const url = `//www.amazon.${obj.value}/dp/${row.asin}`
      window.open(url, '_blank')
    },
    handleRecord(row) {
      this.$newTab({
        path: '/amazonList/logListing',
        title: '刊登管理/操作日志',
        component: logListing,
        data: {
          amazonListId: this.amazonListingItem.id,
          sellerSku: row.sellerSku
        },
        callback: refresh => {
          console.log(refresh)
        },
        clearCache: true
      })
    },
    // 单个listing
    createListing(row) {
      this.$newTab({
        path: row ? '/lms/amazon/add/listing' : '/lms/amazon/add/listing',
        title: row ? '编辑单个普通Listing' : '创建单个普通Listing',
        component: AddListing,
        clearCache: true,
        data: {
          id: this.amazonListingItem.id,
          asin: row.asin,
          variationId: row.id,
          listingStatus: row.listingStatus
        },
        callback: refresh => {
          console.log(refresh)
          refresh && this.$emit('getAmazonlistingListVariant')
        }
      })
    },
    // 标题点击详情
    handleTitleCell(row) {
      this.$newTab({
        path: '/lms/amazon/view/listing',
        title: '查看单个vary listing',
        component: ListingDetail,
        clearCache: true,
        data: {
          id: this.amazonListingItem.id,
          asin: row.asin,
          variationId: row.id,
          listingStatus: row.listingStatus
        }
      })
    },
    handleDel(row) {
      this.$emit('delChildHandle', row)
    }
  }

}
</script>
