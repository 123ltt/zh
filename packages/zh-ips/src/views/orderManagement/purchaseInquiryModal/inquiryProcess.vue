<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form size="mini" label-width="100px" class="no-message">
        <el-row :gutter="30">
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
        <span style="font-weight: 600;">产品询价</span>
      </div>
      <el-table class="g-table" :data="recordData" max-height="400" stripe style="width:100%" border>
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.productSku }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productImg" label="产品图片" align="center" width="70">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.productImg" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center" min-width="100">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.productName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="产品类目" align="center" min-width="100">
          <template slot-scope="scope">
            <g-text-ellipsis :class="scope.row.show?'text-danger':''">{{ scope.row.category }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseQty" label="采购数量" align="center" min-width="80">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.purchaseQty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="70">
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
        <el-table-column prop="supplierScore" label="供应商评分" align="center" min-width="90">
          <template slot-scope="scope">
            <span :class="scope.row.show?'text-danger':''">{{ scope.row.supplierScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="manageModel" label="经营模式" align="center" min-width="90">
          <template slot-scope="scope">
            <div v-for="item in manageModelList" :key="item.dictKey">
              <span v-if="scope.row.manageModel == item.dictKey" :class="scope.row.show?'text-danger':''">{{ item.dictValue }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="90" fixed="right">
          <template slot-scope="slot">
            <el-button v-if="slot.row.status===1" type="text" @click="AddEditShow(slot.row,'add')">询价</el-button>
            <el-button v-if="slot.row.status===2" :disabled="!slot.row.id" type="text" @click="AddEditShow(slot.row,'edit')">编辑</el-button>
            <el-button v-if="slot.row.status===4" type="text" @click="AddEditShow(slot.row,'edit')">调整</el-button>
            <el-button v-if="slot.row.status===3" type="text" @click="processDetail(slot.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button size="mini" type="primary" :disabled="recordData.some(item => item.status === 1)" @click="checkInquiry">确认询价</el-button>
      </div>
    </el-card>

  </basic-container>
</template>
<script>
import { process, confirm } from '@/api/ordermanagement/chaseInquiry'
import productDetail from './productDetail'
import inquiryAddEdit from './inquiryAddEdit'
export default {
  name: 'ChanseInquiryInquiryProcess',
  props: {
    rows: Object,
    id: String,
    manageModelList: Array
  },
  data() {
    return {
      isProduct: false,
      isAddEdit: false,
      loading: false,
      recordData: [],
      detail: {},
      newmanageModelList: []
    }
  },
  mounted() {
    this.newmanageModelList = this.manageModelList
    this.getProcess(this.id)
  },
  methods: {
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
    checkInquiry() {
      this.$confirm('确认生成采购询价单?', '采购询价单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        confirm(this.recordData).then(res => {
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
    },
    getProcess() {
      this.loading = true
      process(this.id).then(res => {
        this.recordData = res.data.map(item => {
          for (const key in item) {
            if (item[key] === -1) item[key] = ''
          }
          item.ali = this.getPrice(item)
          if (+item.ali < +item.purchasePrice && item.ali) {
            item.show = true
          } else {
            item.show = false
          }
          return item
        })
        this.loading = false
      })
    },
    processDetail(row) { // 处理详情展示
      this.$modal({
        title: '采购询价详情',
        component: productDetail,
        data: {
          rows: row
        },
        callback: () => {
        }
      })
    },
    productCancel() { // 处理详情关闭
      this.isProduct = false
    },
    AddEditShow(row, type) { // 处理配置显示
      this.$modal({
        title: '配置产品供应商',
        component: inquiryAddEdit,
        data: {
          newmanageModelList: this.newmanageModelList,
          openData: row,
          idestWarehouseId: this.rows.destWarehouseId,
          type: type
        },
        callback: (bool) => {
          if (bool) {
            this.getProcess()
          }
        }
      })
    },
    AddEditCancel() { // 处理配置关闭
      this.isAddEdit = false
    },
    cancel() {
      this.$emit('close')
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
::v-deep .el-form-item{
   margin-bottom: 10px;
}
*{
  box-sizing: border-box;
}
.footer {
        text-align: right;
        //   margin-top: 30px;
        padding-top: 20px;
        }

</style>
