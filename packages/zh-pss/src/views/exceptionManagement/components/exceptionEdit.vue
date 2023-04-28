<template>
  <basic-container>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form :model="openData" label-width="140px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="物流运单号">
              <el-input :value="openData.logisticsWaybillNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购编码">
              <el-input :value="openData.purchaseCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量">
              <el-input :value="openData.purchaseNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货人">
              <el-input :value="openData.consignor" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货时间">
              <el-input :value="openData.deliveryTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货数量">
              <el-input :value="openData.deliveryNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不良品数量">
              <el-input :value="openData.abnormalNumber " disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检人">
              <el-input :value="openData.qualityInspector" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检时间">
              <el-input :value="openData.inspectTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检结果">
              <el-input :value="openData.inspectResult" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改人">
              <el-input :value="openData.updateUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改时间">
              <el-input :value="openData.updateTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input :value="openData.createTime" disabled />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">质检明细</span>
      </div>
      <el-table :data="openData.supplierInspectDetailVOList" class="g-table" max-height="400px" stripe style="width: 100%" size="mini" border>
        <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="100" />
        <el-table-column prop="goodsName" label="商品名称" align="center" min-width="100" />
        <el-table-column prop="abnormalImage" label="不良品图片" align="center">
          <template slot-scope="scope">
            <g-thumb :url="scope.row.abnormalImage" />
          </template>
        </el-table-column>
        <el-table-column prop="purchaseNumber" label="采购数量" align="center" min-width="100" />
        <el-table-column prop="deliveryNumber" label="发货数量" align="center" min-width="100" />
        <el-table-column prop="abnormalNumber" label="不良品数量" align="center" min-width="100" />
      </el-table>
    </el-card>

    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">质检结果确认</span>
      </div>
      <el-form size="mini" label-width="140px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="verifyResult">
              <span slot="label">
                <span class="biaozhi">*</span>
                处理结果</span>
              <el-radio v-model="submit.verifyResult" label="1">认同质检结果</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="supplyWay">
              <span slot="label">
                <span class="biaozhi">*</span>
                货物处理</span>
              <el-radio v-model="submit.cargoHandling" label="1">退货寄回</el-radio>
              <el-radio v-model="submit.cargoHandling" label="2">自行取回</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="undertaker">
              <span slot="label">
                <span class="biaozhi">*</span>
                运费承担方</span>
              <el-radio v-model="submit.undertaker" label="1">发货方</el-radio>
              <el-radio v-model="submit.undertaker" label="2">收货方</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item>
              <span slot="label"><span class="biaozhi">*</span>备注</span>
              <el-input v-model="submit.inspectComment" clearable type="textarea" maxlength="500" placeholder="请输入内容,最多500个字符" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="footer">
          <el-button size="mini" icon="el-icon-circle-close" @click="$emit('close')">关闭</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="todefine()">确认</el-button>
        </div>
      </el-form>
    </el-card>

  </basic-container>
</template>

<script>
import { getDetail, handle } from '@/api/exceptionManagement/exceptionManagement.js'

export default {
  name: 'OpenBox',
  props: {
    id: String
  },
  data() {
    return {
      submit: {
        cargoHandling: '1',
        verifyResult: '1',
        undertaker: '1',
        inspectComment: ''
      },
      openData: {}
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    // 详情
    getData(val) {
      getDetail(val).then(res => {
        this.openData = res.data
        if (this.openData.abnormalNumber === -1) {
          this.openData.abnormalNumber = ''
        }
        this.openData.supplierInspectDetailVOList.forEach(item => {
          if (item.abnormalNumber === -1) {
            item.abnormalNumber = ''
          }
        })
      })
    },
    todefine() {
      if (this.submit.inspectComment === '') {
        this.$message.error('请填写备注！')
      } else {
        this.openData.supplierInspectVerifyVO = this.submit
        this.loading = true
        handle(this.openData).then(() => {
          this.$emit('close', true)
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }, error => {
          window.console.log(error)
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
.footer {
            text-align: center;
            //   margin-top: 30px;
            padding-bottom: 40px;
            }
</style>
