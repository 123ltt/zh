<template>
  <el-form label-width="100px" size="mini" class="no-message">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">采购产品</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="产品编码">
            <el-input :value="rows.productSku" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品名称">
            <el-input :value="rows.productName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品类目">
            <el-input :value="rows.category" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="需求数量">
            <el-input :value="rows.purchaseQty" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购单价">
            <el-input :value="rows.purchasePrice" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input :value="rows.inqueryComment" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">供应商产品</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="供应商名称">
            <el-input :value="rows.supplierName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品编码">
            <el-input :value="rows.goodsCode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品名称">
            <el-input :value="rows.goodsName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品价格">
            <el-input :value="rows.purchasePrice" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

  </el-form>

</template>
<script>
export default {
  props: {
    rows: Object
  },
  data() {
    return {
    }
  },
  mounted: {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>
