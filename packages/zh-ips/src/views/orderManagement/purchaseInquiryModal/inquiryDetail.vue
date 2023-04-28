<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form label-width="100px" size="mini" class="no-message">
          <el-row>
            <el-col :span="8">
              <el-form-item label="询价编码">
                <el-input :value="detail.inqueryCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求编码">
                <el-input :value="detail.rqmtCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求方货主">
                <el-input :value="detail.demander" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求人">
                <el-input :value="detail.rqmtUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求数量">
                <el-input :value="detail.purchaseQty" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目的仓库">
                <el-input :value="detail.destWarehouse" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人">
                <el-input :value="detail.createUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">
                <el-input :value="detail.createTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后修改人">
                <el-input :value="detail.updateUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期望到货时间">
                <el-input :value="detail.expectArrivalTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="产品询价" name="2">
        <el-form label-width="100px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="审核人">
                <el-input :value="detail.updateUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核时间">
                <el-input :value="detail.updateTime" disabled />
              </el-form-item>
            </el-col>
            <el-col>
              <el-table :data="recordData" max-height="400" stripe style="width:100%" border class="g-table">
                <el-table-column prop="productSku" label="产品编码" align="center" min-width="100" show-overflow-tooltip>
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
                    <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.category }}</g-text-ellipsis>
                  </template>
                </el-table-column>
                <el-table-column prop="purchaseQty" label="采购数量" align="center" min-width="70">
                  <template slot-scope="scope">
                    <span :class="scope.row.show?'text-danger':''">{{ scope.row.purchaseQty }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" min-width="60">
                  <template slot-scope="scope">
                    <span :class="scope.row.show?'text-danger':''">{{ ['待询价','询价中','已询价','待调整'][scope.row.status-1]||'' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="purchasePrice" label="采购单价" align="center" min-width="70">
                  <template slot-scope="scope">
                    <span :class="scope.row.show?'text-danger':''">{{ scope.row.purchasePrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="purAccountCurrency" label="币种" align="center" min-width="50">
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
                <el-table-column prop="inqueryComment" label="询价备注" align="center" min-width="80">
                  <template slot-scope="scope">
                    <g-text-ellipsis :lines="2" :class="scope.row.show?'text-danger':''">{{ scope.row.inqueryComment }}</g-text-ellipsis>
                  </template>
                </el-table-column>
                <el-table-column prop="verifyStatus" label="审核" align="center" min-width="105" fixed="right">
                  <template slot-scope="slot">
                    <el-select v-model="slot.row.verifyStatus" size="mini" disabled>
                      <el-option v-for="item in itemList" :key="item.value" :value="item.value" :label="item.label" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="verifyComment" label="审核意见" align="center" min-width="120" fixed="right">
                  <template slot-scope="slot">
                    <el-input v-model="slot.row.verifyComment" disabled size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="采购计划" name="3">
        <el-table :data="getListData" max-height="400" stripe style="width:100%" border class="g-table">
          <el-table-column prop="planCode" label="计划编码" align="center" min-width="110" />
          <el-table-column prop="demander" label="采购方名称" align="center" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="120" show-overflow-tooltip />
          <el-table-column prop="destWarehouse" label="目的仓库" align="center" min-width="80" />
          <el-table-column prop="planQty" label="计划数量" align="center" min-width="80" />
          <el-table-column prop="planAmount" label="计划金额" align="center" min-width="80" />
          <el-table-column prop="purAccountCurrency" label="币种" align="center" min-width="70">
            <template slot-scope="scope">
              <span>{{ currencyObj[scope.row.purAccountCurrency] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseQty" label="采购数量" align="center" min-width="80">
            <template slot-scope="{row}">
              <span>{{ row.purchaseQty === -1?'':row.purchaseQty }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" min-width="70">
            <template slot-scope="slot">
              <span>{{ ['待采购','部分已采购','已采购'][slot.row.status-1]||'' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createUserName" label="创建人" align="center" min-width="120" />
          <el-table-column prop="createTime" label="创建时间" align="center" min-width="135" />
        </el-table>
        <div class="block">
          <el-pagination :current-page="page.current" :page-sizes="[10,40,50,80]" :page-size="page.size" :total="page.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-collapse-item>
    </el-collapse>

  </basic-container>

</template>

<script>

import { purchaseDetail } from '@/api/ordermanagement/chaseInquiry'
import { getList } from '@/api/ordermanagement/orderPlan'
import { dictionary } from '@/api/commonApi'

export default {
  props: {
    detail: Object,
    id: String
  },
  data() {
    return {
      loading: false,
      recordData: [],
      getListData: [],
      itemList: [
        { value: 1, label: '同意' },
        { value: 2, label: '不同意' }
      ],
      page: {
        current: 1,
        total: 0,
        size: 10
      },
      currencyObj: {},
      activeNames: ['1', '2', '3']
    }
  },
  mounted() {
    this.getTable()
    this.getData()
  },
  methods: {
    getTable() {
      dictionary('ips_account_currency').then(res => {
        res.data.forEach(item => {
          this.currencyObj[item.dictKey] = item.dictValue
        })
      })
      purchaseDetail(this.id).then(res => {
        this.recordData = res.data
        this.recordData.forEach(item => {
          item.ali = this.getPrice(item)
          if (+item.ali < +item.purchasePrice && item.ali) {
            item.show = true
          } else {
            item.show = false
          }
        })
      })
    },
    getData(current, size) {
      this.loading = true
      getList(current, size, { inquiryId: this.id }).then(res => {
        this.getListData = res.data.records
        this.page.total = res.data.total
        this.loading = false
      })
    },
    turnTo() {
      this.$router.push({
        name: 'PurchaseOrderManagementPlan',
        params: { id: 1, boolean: 1 }
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
    handleCurrentChange(val) {
      this.page.current = val
      this.getData(this.page.current, this.page.size)
    },
    handleSizeChange(val) {
      this.page.size = val
      this.page.current = 1
      this.getData(this.page.current, this.page.size)
    },
    cancel() {
      this.$emit('close')
    }
  }

}
</script>

<style lang="scss" scoped>
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
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
.block{
              text-align: right;
              margin: 10px 10px 0 0;
            }
</style>
