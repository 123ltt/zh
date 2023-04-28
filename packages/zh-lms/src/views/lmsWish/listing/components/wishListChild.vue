<template>
  <el-table :ref="`tableChild${wishListingItem.id}`" tooltip-effect="dark" border stripe highlight-current-row :data="tableDataChildRen" class="g-table g-table-dense">
    <el-table-column label="子SKU" prop="name">
      <template slot-scope="{row}">
        <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSku, row.productSku)">{{ row.productSku }}</g-link></span>
        <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="showIsEnabled" label="是否下架">
      <template slot-scope="{ row }">
        {{ row.isEnabled?'否':'是' }}
      </template>
    </el-table-column>
    <el-table-column label="库存" prop="inventory" />
    <el-table-column label="成本" prop="costPrice" />
    <el-table-column label="售价" prop="localizedPrice" />
    <el-table-column v-if="!showTableBtnStatus" label="操作">
      <template slot-scope="{row}">
        <template>
          <!-- 四个状态可以重新上下架 -->
          <template v-if="row.isEnabled">
            <g-auth code="wish_disableSku">
              <el-button v-if="showOffShelves" type="text" size="mini" class="ms-0" @click="handleDisableSku(row.id)">下架</el-button>
            </g-auth>
          </template>
          <template v-if="!row.isEnabled">
            <g-auth code="wish_enableSku">
              <el-button v-if="[5,7,8,11].includes(wishListingItem.listingStatus)" type="text" size="mini" class="ms-0" @click="getEnableSku(row.id)">重新上架</el-button>
            </g-auth>
          </template>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { openSpuSkuDetail } from '@/views/components/utils.js'
export default {
  name: 'LmsWishListChild',
  props: {
    wishListingItem: { // 父sku obj
      type: Object,
      default: () => { return {} }
    },
    // oline 之前，子sku 没有操作按钮
    // 之后，子sku有操作按钮，父只有删除按钮 子sku 有三个按钮
    showTableBtnStatus: {
      type: Boolean,
      default: false
    },
    auditTabActiveName: {
      type: String
    },
    tableDataChildRen: { // 子sku 列表数据
      type: Array
    },
    showOffShelves: { // 下架
      type: Boolean,
      require: true
    },
    tabActiveList: {
      type: Array
    }
  },
  data() {
    return {
      openSpuSkuDetail,
      multipleSelection: [],
      tableDataId: '', // 子sku 取消某一项勾选，父级sku 去掉勾选
      checked: false, // head 勾选
      isIndeterminate: false,
      flag: true,
      checkChildIds: []
    }
  },
  computed: {
    showIsEnabled() {
      return ['Online', 'Updating', 'Update Failed', 'Match Failed', 'Disabled', 'Canceling', 'Canceled'].includes(this.auditTabActiveName)
    }
  },
  methods: {
    handleDisableSku(id) {
      this.$emit('handleDisableSku', id)
    },
    // 重新上架
    getEnableSku(id) {
      this.$emit('getEnableSku', id)
    }
  }
}
</script>
