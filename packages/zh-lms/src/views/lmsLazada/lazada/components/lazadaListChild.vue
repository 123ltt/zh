<template>
  <div>
    <el-table :ref="`tableChild${lazadaListingItem.id}`" tooltip-effect="dark" border stripe highlight-current-row :data="tableDataChildRen" class="g-table g-table-dense">
      <el-table-column label="子SKU" min-width="120" prop="name">
        <template slot-scope="{row}">
          <!-- <span class="d-block">状态：{{ tabActiveList[row.productStatus] && tabActiveList[row.productStatus].label }}</span> -->
          <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSku, row.productSku)">{{ row.productSku }}</g-link></span>
          <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主图">
        <template slot-scope="{ row }">
          <g-thumb :url="row.masterImage" />
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          {{ ['Draft', 'Online','Canceled'][row.productStatus] }}
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="quantity" />
      <el-table-column label="成本" prop="productCost" />
      <el-table-column label="售价" prop="price" />
      <el-table-column label="促销价" prop="specialPrice" />
      <el-table-column v-if="isShowDesc" label="操作" width="180px">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" class="ms-0" @click="unShelve(row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { openSpuSkuDetail } from '@/views/components/utils.js'
import { mapGetters } from 'vuex'
import { unShelveSku } from '@/api/lazada/lazadaList.js'
export default {
  name: 'LmsLazadaListChild',
  props: {
    lazadaListingItem: Object,
    tableDataChildRen: { // 子sku 列表数据
      type: Array,
      default: () => []
    },
    auditTabActiveName: String
  },
  data() {
    return {
      openSpuSkuDetail
    }
  },
  computed: {
    ...mapGetters(['permission']),
    isShowDesc() {
      const status = ['Online', 'Out Of Stock', 'Update Failed', 'Match Failed'].includes(this.auditTabActiveName)
      return status && this.permission.lz_unShelveSku
    }
  },
  methods: {
    // 下架
    unShelve(row) {
      this.$confirm('确定下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          spuId: this.lazadaListingItem.id,
          skuId: row.id
        }
        unShelveSku(params).then(res => {
          this.$message.success('操作成功')
          this.$emit('unShelveChild')
        })
      }).catch(() => {})
    }
  }
}
</script>
