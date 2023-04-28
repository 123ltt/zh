<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form size="mini" label-width="140px" class="no-message">
        <el-row>
          <el-col :span="8">
            <el-form-item label="需求编码">
              <el-input :value="rows.rqmtCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求方货主">
              <el-input :value="rows.demander" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求人">
              <el-input :value="rows.rqmtUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求数量">
              <el-input :value="rows.purchaseQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目的仓库">
              <el-input :value="rows.destWarehouse" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求时间">
              <el-input :value="rows.updateTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期望到货时间">
              <el-input :value="rows.expectArrivalTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span>产品询价</span>
      </div>
      <el-table :data="recordData" class="g-table" max-height="400" stripe style="width:100%" border>
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.productSku }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="productImg" label="产品图片" align="center" width="70">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.productImg" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.productName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="产品类目" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.category }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseQty" label="采购数量" align="center" min-width="80">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.purchaseQty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="80">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ ['待询价','询价中','已询价','待调整'][scope.row.status-1]||'' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" label="采购单价" align="center" min-width="80">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.purchasePrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purAccountCurrency" label="币种" align="center" min-width="70">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.purAccountCurrency === 1 ? 'RMB' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.supplierName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.goodsName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="goodsUrl" label="商品链接" align="center" min-width="80">
          <template slot-scope="scope">
            <g-link v-if="scope.row.goodsUrl" :href="scope.row.goodsUrl" :class="scope.row.show?'text-danger':''">商品链接</g-link>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="商品单价" align="center" min-width="80">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.goodsPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsUrl" label="阿里单价" align="center" min-width="80">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.ali }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseAging" label="采购时效" align="center" min-width="80">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.purchaseAging }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierLevel" label="供应商等级" align="center" min-width="90">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.supplierLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inqueryComment" label="询价备注" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.inqueryComment }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column label="审核" align="center" min-width="105" fixed="right">
          <template slot-scope="slot">
            <el-select v-model="slot.row.verifyStatus" size="mini">
              <el-option v-for="item in itemList" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center" min-width="120" fixed="right">
          <template slot-scope="slot">
            <el-input v-model.trim="slot.row.verifyComment" size="mini" />
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button type="primary" size="mini" @click="open">提交</el-button>
      </div>
    </el-card>
  </basic-container>
</template>

<script>
import { getCheck, checkExamine } from '@/api/ordermanagement/chaseInquiry'
export default {
  name: 'CheckExamine',
  props: {
    rows: Object,
    id: String
  },
  data() {
    return {
      loading: false,
      isProduct: false,
      isAddEdit: false,
      recordData: [],
      detail: {},
      srcList: [],
      itemList: [
        { value: 1, label: '同意' },
        { value: 2, label: '不同意' }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      getCheck(this.id).then(res => {
        this.recordData = res.data
        this.recordData.forEach(item => {
          item.verifyStatus = 1
          item.verifyComment = ''
          item.ali = this.getPrice(item)
          if (+item.ali < +item.purchasePrice && item.ali) {
            item.show = true
          } else {
            item.show = false
          }
        })
        this.loading = false
      })
    },
    // 判断阿里价格
    getPrice(obj) {
      const arr = obj.priceRanges
      const val = obj.purchaseQty
      if (arr.length && val) {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (i === 0) {
            if (+val >= +arr[i].startQuantity) {
              return arr[i].price
            } else {
              return ''
            }
          } else {
            if (+val >= +arr[i].startQuantity) {
              return arr[i].price
            }
          }
        }
      } else {
        return ''
      }
    },
    open() {
      this.$confirm('确认提交采购询价审核单?', '采购审核表', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const one = this.recordData.findIndex(item => item.verifyStatus === 2 && !item.verifyComment) > -1
        if (one) {
          return this.$message.error('审核不同意请填写审核意见')
        }
        checkExamine(this.recordData).then(res => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.$emit('close', true)
        })
      }).catch(() => {
        this.$message({
          type: 'warn',
          message: '取消'
        })
      })
    }
  }

}

</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
  box-sizing: border-box;
}
.footer {
  text-align: center;
  padding-bottom: 40px;
  margin-top: 20px;
}
</style>
