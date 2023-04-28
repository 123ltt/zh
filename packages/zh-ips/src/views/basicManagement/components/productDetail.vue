<template>
  <div v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form class="no-message" size="mini" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input :value="detail.productSku" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品类目">
              <el-input :value="detail.categoryName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input :value="detail.productName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" />
          <el-col :span="12">
            <el-form-item label="创建人">
              <el-input :value="detail.createUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input :value="detail.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改人">
              <el-input :value="detail.updateUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改时间">
              <el-input :value="detail.updateTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span style="font-weight: 600;">供应商商品</span>
      </div>
      <el-table :data="recordData" size="mini" max-height="400px" stripe style="width: 100%" class="g-table" border :span-method="cellMerge">
        <el-table-column label="主供应商" align="center" min-width="70">
          <template slot-scope="scope">
            <el-radio v-model="mainSupplier" disabled :label="scope.row.supplierCode"><i /></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编码" align="center" min-width="100" />
        <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="商品类目" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column prop="goodsName" label="商品名称" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script>

import { getDetail } from '@/api/basicManagement/product.js'
export default {
  name: 'ProductDetail',
  props: {
    detailData: Object
  },
  data() {
    return {
      detail: {},
      recordData: [],
      loading: false,
      mainSupplier: '',
      spanArr: [],
      pos: ''
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        const data = res.data
        this.detail = data
        this.mainSupplier = data.mainSupplierCode
        this.recordData = data.goodsList
        this.getSpanArr(this.recordData)
        this.loading = false
      })
    },
    getSpanArr(data) {
      this.spanArr = []
      this.pos = ''
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].supplierCode === data[i - 1].supplierCode) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) { // 设置需要合并的列（索引）
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
.cardBox{
  ::v-deep .el-card__body{
    padding-bottom: 0;
  }
}
.caozuo{
  ::v-deep .el-table td, .el-table th{
    padding: 5px 0;
  }
}
.hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
</style>
