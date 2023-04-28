<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form :model="openData" label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="调整编码">
              <el-input :value="openData.purchaseAdjustmentCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购编码">
              <el-input :value="openData.purchaseCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求方">
              <el-input :value="openData.demandSideName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供货方">
              <el-input :value="openData.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整人">
              <el-input :value="openData.moderator" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整前数量">
              <el-input :value="openData.adjustFrontQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整数量">
              <el-input :value="openData.adjustQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整后数量">
              <el-input :value="openData.adjustAfterQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整时间">
              <el-input :value="openData.adjustTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">采购调整明细</span>
      </div>
      <el-table :data="openData.adjustDetail" max-height="600px" stripe style="width: 100%" border class="g-table" size="mini">
        <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="110" />
        <el-table-column prop="goodsName" label="商品名称" align="center" min-width="130" show-overflow-tooltip />
        <el-table-column prop="adjustFrontQty" label="调整前数量" align="center" min-width="80" />
        <el-table-column prop="adjustQty" label="调整数量" align="center" min-width="80" />
        <el-table-column prop="adjustAfterQty" label="调整后数量" align="center" min-width="90" />
      </el-table>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">采购调整处理</span>
      </div>
      <el-form :model="openData" label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="adjustIntention">
              <span slot="label">
                <span class="biaozhi">*</span>
                调整意愿</span>
              <el-select v-model="openData.adjustIntention" clearable placeholder="请选择" filterable style="width:80%">
                <el-option v-for="item in adjustIntention" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="supplyWay">
              <span slot="label">
                <span class="biaozhi">*</span>
                供货方式</span>
              <el-select v-model="openData.supplyWay" clearable placeholder="请选择" filterable style="width:80%">
                <el-option v-for="item in supplyWay" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="score">
              <span slot="label">
                <span class="biaozhi">*</span>
                预计发货时间</span>
              <el-date-picker v-model="openData.estimatedDeliveryTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="score">
              <span slot="label">
                <span class="biaozhi">*</span>
                预计到仓时间</span>
              <el-date-picker v-model="openData.estimatedArrivalTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item>
              <span slot="label">备注</span>
              <el-input v-model="openData.remarks" clearable type="textarea" maxlength="500" placeholder="请输入内容,最多500个字符" show-word-limit />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div class="footer">
        <el-button size="mini" icon="el-icon-circle-close" @click="cancel()">取消</el-button>
        <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="todefine()">确认</el-button>
      </div>
    </el-card>

  </basic-container>
</template>

<script>
import { getDetail, handle } from '@/api/adjManagement/purchaseAdj.js'
import { getMyDictBiz } from '@/api/commonApi/common'

export default {
  name: 'OpenBox',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      handleDetail: false,
      openData: {},
      supplyWay: [],
      adjustIntention: []
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    // 详情
    getData(val) {
      this.loading = true
      getMyDictBiz('pss_supplier_supply_way').then(res => {
        if (res.code === 200) {
          const data = res.data
          this.supplyWay = data
        } else {
          this.$message.error('获取业务字典数据失败')
        }
      })
      getMyDictBiz('pss_supplier_adjust_intention').then(res => {
        if (res.code === 200) {
          const data = res.data
          this.adjustIntention = data
        } else {
          this.$message.error('获取业务字典数据失败')
        }
      })
      getDetail(val).then(res => {
        if (res.code === 200) {
          this.openData = res.data
          this.openData.adjustIntention = ''
          this.openData.supplyWay = ''
          if (this.openData.status === 1) {
            this.handleDetail = true
          } else {
            this.handleDetail = false
          }
          this.loading = false
        } else {
          this.$message.error('加载失败!')
        }
      })
    },
    cancel() {
      this.$emit('close')
    },
    todefine() {
      if (
        this.openData.adjustIntention === '' ||
        this.openData.adjustIntention === 0 ||
        this.openData.supplyWay === '' ||
        this.openData.supplyWay === 0 ||
        this.openData.estimatedDeliveryTime === '' ||
        this.openData.estimatedDeliveryTime == null ||
        this.openData.estimatedArrivalTime === '' ||
        this.openData.estimatedArrivalTime == null
      ) {
        this.$message.error('请填写必填项!')
      } else {
        this.loading = true
        handle(this.openData).then(() => {
          this.$emit('close', true)
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
* {
  box-sizing: border-box;
}
.biaozhi {
      color: red;
      font-size: 12px;
    }
.footer {
      text-align: right;
      //   margin-top: 30px;
      padding: 0 20px 20px 0;
    }
</style>
