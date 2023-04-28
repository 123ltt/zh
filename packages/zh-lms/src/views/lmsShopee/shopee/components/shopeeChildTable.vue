<template>
  <div>
    <el-table :ref="`tableChild${tableListingItem.id}`" tooltip-effect="dark" border stripe highlight-current-row :data="tableDataChildRen" class="g-table g-table-dense">
      <el-table-column label="子SKU" prop="name">
        <template slot-scope="{row}">
          <span class="d-block">SKU：{{ row.productSku }}</span>
          <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主图">
        <template slot-scope="{ row }">
          <g-thumb :url="row.skuDisplayImg" />
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stock" />
      <el-table-column label="成本" prop="costPrice" />
      <el-table-column label="售价" prop="price" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ShopeeChildTable',
  props: {
    tableListingItem: { // 父sku obj
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
    }
  },
  data() {
    return {
      productStatusName: ['Draft', 'Approving', 'Uploading', 'Upload Failed', 'Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling', 'Canceled'],
      checked: false, // head 勾选
      isIndeterminate: false
    }
  },
  methods: {
    changeCheckStatusIfParentChange(isSelect) {
      // 全选 半选效果就为假
      this.isIndeterminate = false
      this.checked = isSelect
      this.tableDataChildRen.forEach(item => {
        if (item.isSelect !== isSelect) {
          item.isSelect = isSelect
        }
      })
    }
  }
}
</script>
