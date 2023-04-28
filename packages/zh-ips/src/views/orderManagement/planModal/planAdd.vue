<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row>
          <el-col :span="8">
            <el-form-item label="计划编码">
              <el-input :value="purData.planCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求编码">
              <el-input :value="purData.rqmtCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购方名称">
              <el-input :value="purData.demander" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <el-input :value="purData.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目的仓库">
              <el-input :value="purData.destWarehouse" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划数量">
              <el-input :value="purData.planQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input :value="purData.createUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-input :value="purData.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划金额">
              <el-input :value="purData.planAmount" disabled>
                <template slot="append"> RMB</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后修改人">
              <el-input :value="purData.updateUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改时间">
              <el-input :value="purData.updateTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span>采购订单</span>
      </div>
      <el-table :data="purData.planDetailVOList" max-height="400" stripe style="width:100%;margin-bottom:20px;" border class="g-table" :summary-method="getSummaries" show-summary>
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="120" show-overflow-tooltip />
        <el-table-column prop="picture" label="产品图片" align="center" width="70">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.productImg" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.productName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" label="采购单价" align="center" min-width="120" />
        <el-table-column prop="planQty" label="计划数量" align="center" min-width="120" />
        <el-table-column prop="purchasedQty" label="已采数量" align="center" min-width="90" />
        <el-table-column prop="toPurQty" label="待采数量" align="center" min-width="90" />
        <el-table-column prop="purQty" label="采购数量" align="center" min-width="120">
          <template slot-scope="slot">
            <el-input v-model.trim="slot.row.purQty" v-input.numeric.positive maxlength="8" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="productTotalAmount" label="产品金额" align="center" min-width="120">
          <template slot-scope="slot">
            <el-input :value="(+slot.row.purQty)*((+slot.row.purchasePrice)*1000)/1000" size="mini" disabled />
          </template>
        </el-table-column>
        <el-table-column label="链接" align="center" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="getUrl(scope.row)">商品链接</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form ref="refRules" size="mini" label-width="120px" :model="addList">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item prop="purType" label="采购类型">
              <el-select v-model="addList.purType" style="width:100%" clearable>
                <el-option v-for="item in purTypeList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="isStraight" label="直发仓库" :rules="{required:true,message:'不能为空',trigger:'blur'}">
              <el-radio-group v-model="addList.isStraight" @change="changeStraight">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="transitWarehouseId" label="中转仓库" :rules="addList.isStraight===1?{required:false}:{required:true,message:'不能为空',trigger:'blur'}">
              <el-select v-model="addList.transitWarehouseId" style="width:100%" :disabled="addList.isStraight===1">
                <el-option v-for="item in warehouseList" :key="item.id" :value="item.id" :label="item.warehouseName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="isTax" label="是否含税" :rules="{required:true,message:'不能为空',trigger:'blur'}">
              <el-radio-group v-model="addList.isTax">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="mainBody" label="公司主体">
              <el-select v-model="addList.mainBody" style="width:100%">
                <el-option v-for="item in entityList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item prop="isFreeShipping" label="是否包邮" :rules="{required:true,message:'不能为空',trigger:'blur'}">
              <el-radio-group v-model="addList.isFreeShipping" @change="changeFree">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="logisticsFreight" label="物流运费" :rules="addList.isFreeShipping===1?{required:false}:{required:true,message:'不能为空',trigger:'blur'}">
              <el-input v-model.trim="addList.logisticsFreight" :disabled="addList.isFreeShipping===1">
                <template slot="append">RMB</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="goodsAmount" label="产品金额" :rules="{required:true,message:'不能为空',trigger:'blur'}">
              <el-input v-model.trim="addList.goodsAmount" disabled>
                <template slot="append">RMB</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="purAmount" label="采购金额">
              <el-input v-model.trim="caimoeny" disabled>
                <template slot="append">RMB</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="discountAmount" label="优惠金额">
              <el-input v-model.trim="addList.discountAmount" v-input.positive placeholder="请输入金额" />
              <template slot="append">RMB</template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="payableAmount" label="应付金额">
              <el-input v-model.trim="payableAmount" v-input.positive disabled>
                <template slot="append">RMB</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="paymentMethod" label="付款方式" :rules="{required:true,message:'不能为空',trigger:'change'}">
              <el-select v-model="addList.paymentMethod" style="width:100%" clearable>
                <el-option v-for="item in methodList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="paymentCondition" label="付款条件" :rules="{required:true,message:'不能为空',trigger:'change'}">
              <el-select v-model="addList.paymentCondition" style="width:100%" clearable @change="getPayment">
                <el-option v-for="item in paymentConditionList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="prePayAmount" label="预付金额" :rules="noPre?{required:false}:{required:true,message:'不能为空',trigger:'blur'}">
              <el-input v-model.trim="addList.prePayAmount" :disabled="noPre">
                <template slot="append">RMB</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="purPlatform" label="采购平台" :rules="{required:true,message:'不能为空',trigger:'change'}">
              <g-select v-model="addList.purPlatform" style="width:100%;" :items="purPlatformList" key-field="dictKey" label-field="dictValue" value-field="dictKey" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="expectArrivalTime" label="期望到货时间" :rules="{required:true,message:'不能为空',trigger:'blur'}">
              <el-date-picker v-model="addList.expectArrivalTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="remarks" label="计划备注">
              <el-input v-model.trim="addList.remarks" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="footer">
        <el-button size="mini" @click="$emit('close')">返回</el-button>
        <el-button size="mini" type="primary" @click="checkChase">确认采购</el-button>
      </div>
    </el-card>

  </basic-container>
</template>
<script>
import { change, getGoodsDetail } from '@/api/ordermanagement/orderPlan'
import { dictionary } from '@/api/commonApi'
export default {
  name: 'PurchasePlanPlanAdd',
  props: {
    purData: Object,
    warehouseList: Array
  },
  data() {
    return {
      loading: false,
      addList: {
        purType: '',
        isStraight: '',
        isTax: '',
        mainBody: '',
        goodsAmount: '0',
        purAmount: '',
        transitWarehouseId: '',
        isFreeShipping: '',
        logisticsFreight: '0',
        discountAmount: '',
        payableAmount: '',
        purPlatform: '',
        paymentMethod: '',
        paymentCondition: '',
        expectArrivalTime: '',
        prePayAmount: '',
        remarks: ''
      },
      noPre: false,
      total: '',
      paymentMethodList: [],
      purTypeList: [],
      entityList: [],
      paymentConditionList: [],
      purPlatformList: [],
      methodList: []
    }
  },
  computed: {
    caimoeny() {
      return (+this.addList.goodsAmount) + (+this.addList.logisticsFreight)
    },
    payableAmount() {
      const num = (this.caimoeny) - (+this.addList.discountAmount)
      return num > 0 ? num : 0
    }
  },
  watch: {
    'addList.prePayAmount'(newVal, oldVal) {
      if (newVal) {
        newVal = newVal + ''
        if (newVal.indexOf('.') === -1) {
          if (newVal.length > 8) {
            this.addList.prePayAmount = oldVal
          }
        } else {
          if (newVal.split('.')[1].length > 2 || newVal.split('.')[0].length > 8) {
            this.addList.prePayAmount = oldVal
          }
        }
      }
    },
    'addList.logisticsFreight'(newVal, oldVal) {
      newVal = newVal + ''
      if (newVal) {
        if (newVal.indexOf('.') === -1) {
          if (newVal.length > 8) {
            this.addList.logisticsFreight = oldVal
          }
        } else {
          if (newVal.split('.')[1].length > 2 || newVal.split('.')[0].length > 8) {
            this.addList.logisticsFreight = oldVal
          }
        }
      }
    },
    'addList.discountAmount'(newVal, oldVal) {
      newVal = newVal + ''
      if (newVal) {
        if (newVal.indexOf('.') === -1) {
          if (newVal.length > 8) {
            this.addList.discountAmount = oldVal
          }
        } else {
          if (newVal.split('.')[1].length > 2 || newVal.split('.')[0].length > 8) {
            this.addList.discountAmount = oldVal
          }
        }
      }
    }
  },
  mounted() {
    this.getDictionary()
  },
  methods: {
    getDictionary(code) {
      dictionary('ips_payment_condition').then(res => {
        this.paymentConditionList = res.data
      })
      dictionary('ips_payment_method').then(res => {
        this.methodList = res.data
      })
      dictionary('ips_pur_platform').then(res => {
        this.purPlatformList = res.data
      })
      dictionary('ips_pur_type').then(res => {
        this.purTypeList = res.data
      })
      dictionary('ips_procuring_entity').then(res => {
        this.entityList = res.data
      })
      this.addList.paymentCondition = this.purData.payCondition + ''
      this.addList.paymentMethod = this.purData.payType + ''
      this.getPayment(this.addList.paymentCondition)
    },
    // 切换是否包邮
    changeFree(val) {
      if (val === 1) {
        this.addList.logisticsFreight = 0
      }
    },
    // 切换直发仓库
    changeStraight(val) {
      if (val === 1) {
        this.addList.transitWarehouseId = ''
      }
    },
    checkChase() {
      Object.keys(this.purData).forEach(item => {
        if (item !== 'planDetailVOList') {
          this.addList[item] = this.purData[item]
        }
      })
      this.addList.payableAmount = this.payableAmount
      this.addList.planDetailDTOList = this.purData.planDetailVOList
      let isOk = true
      this.addList.planDetailDTOList.forEach(item => {
        if (item.purQty === '') {
          isOk = false
        }
      })
      this.$confirm('确认提交采购订单?', '采购订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$refs.refRules.validate(valid => {
          if (valid) {
            if (isOk) {
              change(this.addList).then(res => {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                })
                this.$emit('close', true)
              })
            } else {
              this.$message.error('表格里的数量不能为空！')
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'warn',
          message: '取消'
        })
      })
    },
    getUrl(val) {
      getGoodsDetail(val.goodsId).then(res => {
        if (res.data.goodsUrl) {
          window.open(res.data.goodsUrl)
        } else {
          this.$message.error('商品链接失效！')
        }
      })
    },
    getPayment(val) {
      if (val === '4' || val === '5') {
        this.noPre = true
        this.addList.prePayAmount = ''
      } else {
        this.noPre = false
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      let values = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        if (column.property === 'productTotalAmount') {
          values = data.map((item, index) => {
            this.$set(this.purData.planDetailVOList[index], 'productTotalAmount', Number((item.purchasePrice * 1000) * item.purQty / 1000))
            return Number((item.purchasePrice * 1000) * item.purQty / 1000)
          })
        } else {
          values = data.map(item => {
            return Number(item[column.property])
          })
        }
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return (prev * 1000 + curr * 1000) / 1000
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      this.addList.goodsAmount = sums[sums.length - 2]
      return sums
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
::v-deep .el-card__body{
  padding-bottom: 0!important;
}
*{
  box-sizing: border-box;
}
.footer {
        text-align: center;
        //   margin-top: 30px;
        padding-bottom: 40px;
        }
</style>
