<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="物流运单号">
              <el-input :value="detailData.logisticsWaybillNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购编码">
              <el-input :value="detailData.purchaseCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量">
              <el-input :value="detailData.purchaseNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货人">
              <el-input :value="detailData.consignor" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货时间">
              <el-input :value="detailData.deliveryTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货数量">
              <el-input :value="detailData.deliveryNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不良品数量">
              <el-input :value="detailData.abnormalNumber " disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检人">
              <el-input :value="detailData.qualityInspector" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检时间">
              <el-input :value="detailData.inspectTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检结果">
              <el-input :value="detailData.inspectResult" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改人">
              <el-input :value="detailData.updateUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改时间">
              <el-input :value="detailData.updateTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input :value="detailData.createTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">质检明细</span>
      </div>
      <el-table :data="recordData" max-height="600px" stripe style="width: 100%" border class="g-table" size="mini">
        <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="100" />
        <el-table-column prop="goodsName" label="商品名称" align="center" min-width="130" show-overflow-tooltip />
        <el-table-column prop="abnormalImage" label="不良品图片" align="center" width="85">
          <template slot-scope="scope">
            <g-thumb :url="scope.row.abnormalImage" />
          </template>
        </el-table-column>
        <el-table-column prop="purchaseNumber" label="采购数量" align="center" min-width="80" />
        <el-table-column prop="deliveryNumber" label="发货数量" align="center" min-width="80" />
        <el-table-column prop="abnormalNumber" label="不良品数量" align="center" min-width="90" />
      </el-table>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">质检结果确认</span>
        <el-form label-width="120px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="处理结果">
                <el-input :value="inspectVerify.verifyResult" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物处理">
                <el-input :value="inspectVerify.cargoHandling" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运费承担方">
                <el-input :value="inspectVerify.undertaker" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input :value="inspectVerify.inspectComment" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

  </basic-container>
</template>

<script>
import { getDetail } from '@/api/exceptionManagement/exceptionManagement.js'
export default {
  name: 'ExceptionDetail',
  props: {
    openData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      recordData: [],
      inspectVerify: [],
      detailData: '',
      handleDetail: false,
      loading: false
    }
  },
  mounted() {
    this.getData(this.openData.id)
  },
  methods: {
    // 详情
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        this.detailData = res.data
        this.recordData = res.data.supplierInspectDetailVOList
        this.inspectVerify = res.data.supplierInspectVerifyVO
        if (this.inspectVerify.verifyResult === 1) {
          this.inspectVerify.verifyResult = '认同质检结果'
        } else {
          this.inspectVerify.verifyResult = ''
        }
        if (this.inspectVerify.cargoHandling === 1) {
          this.inspectVerify.cargoHandling = '退货寄回'
        } else if (this.inspectVerify.cargoHandling === 2) {
          this.inspectVerify.cargoHandling = '自行取回'
        } else {
          this.inspectVerify.cargoHandling = ''
        }
        if (this.inspectVerify.undertaker === 1) {
          this.inspectVerify.undertaker = '发货方承担'
        } else if (this.inspectVerify.undertaker === 2) {
          this.inspectVerify.undertaker = '收货方承担'
        } else {
          this.inspectVerify.undertaker = ''
        }
        if (res.data.status === 2 || res.data.status === 3) {
          this.handleDetail = true
        } else {
          this.handleDetail = false
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
* {
  box-sizing: border-box;
}

  .addBox {
    width: 100%;
    .header {
      box-sizing: border-box;
      padding: 0 20px;
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cccccc;
      .title {
        font-size: 18px;
      }
      .closeBtn {
        cursor: pointer;
        &:hover{
            color: #409eff;
        }
        i {
          size: 16px;
        }
      }
    }
    .main {
      width: 100%;
      padding-top: 10px;
      padding-bottom: 10px;
      .mainHeader {
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        // background-color: #409eff;
        // color: #fff;
      }
      .basic {
        width: 100%;
        padding: 20px;
        overflow: hidden;
        span {
          display: inline-block;
        }
        .introduce {
          width: 35%;
          font-size: 14px;
        }
        .content {
          width: 65%;
          font-size: 14px;
        }
      }
      .record {
        padding: 20px;
        ::v-deep .el-table td,
        .el-table th {
          padding: 5px 0;
        }
      }
      .block {
        text-align: right;
        margin: 0 10px 0 0;
      }
    }
    .footer {
      text-align: center;
      //   margin-top: 30px;
      padding-bottom: 20px;
    }
  }
</style>
