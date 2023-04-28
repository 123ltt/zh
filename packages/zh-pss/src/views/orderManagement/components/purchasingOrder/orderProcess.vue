<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-card>
          <el-form ref="formRef" :model="params" label-width="120px" size="mini" class="no-message">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="采购编码：">
                  <el-input :value="params.purchaseCode" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购方名称：">
                  <el-input :value="params.purchaseSquareName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商名称：">
                  <el-input :value="params.supplierName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购数量：">
                  <el-input :value="params.purchaseNumber" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购人：">
                  <el-input :value="params.purchasePeople" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物流运费：">
                  <el-input :value="params.logisticsFreight" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品金额：">
                  <el-input :value="params.goodsAmount" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购金额：">
                  <el-input :value="params.purchaseAmount" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购时间：">
                  <el-input :value="params.purchaseTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="期望到货时间：">
                  <el-input :value="params.expectArrivalTime" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="采购明细" name="2">
        <el-card>
          <el-table :data="params.purchaseDetails" border stripe class="g-table" max-height="400px">
            <el-table-column prop="productSku" label="产品编码" align="center" />
            <el-table-column prop="productName" label="产品名称" align="center" show-overflow-tooltip />
            <el-table-column prop="goodsCode" label="商品编码" align="center" />
            <el-table-column prop="goodsName" label="商品名称" align="center" show-overflow-tooltip />
            <el-table-column prop="purchaseNumber" label="采购数量" align="center" />
            <el-table-column prop="purchasePrice" label="采购单价" align="center" />
            <el-table-column prop="purchaseAmount" label="商品金额" align="center" />
          </el-table>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="收货人信息" name="3">
        <el-card>
          <el-form ref="formRef" :model="params" label-width="120px" size="mini" class="no-message">
            <el-row>
              <el-col :span="8">
                <el-form-item label="收件人：">
                  <el-input :value="params.receiptPeople" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="固定电话：">
                  <el-input :value="params.phone" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="移动电话：">
                  <el-input :value="params.mobile" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收货地址：">
                  <el-input :value="params.shippingAddress" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="采购处理" name="4" disabled>
        <el-card>
          <el-form ref="formRef" :model="params" label-width="120px" size="mini">
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="supplyIntention" style="width:46%;display:inline-block" label="供货意愿：">
              <el-select v-model="params.supplyIntention" placeholder="请选择" clearable style="width:100%">
                <el-option v-for="(item,index) in supplyIntentionList" :key="index" :value="item.dictKey" :label="item.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="supplyWay" style="width:46%;display:inline-block" label="供货方式：">
              <el-select v-model="params.supplyWay" placeholder="请选择" clearable style="width:100%">
                <el-option v-for="item in supplyWayList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="estimatedDeliveryTime" style="width:46%;display:inline-block" label="预计发货时间：">
              <el-date-picker v-model="params.estimatedDeliveryTime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
            </el-form-item>
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="estimatedArrivalTime" style="width:46%;display:inline-block" label="预计到货时间：">
              <el-date-picker v-model="params.estimatedArrivalTime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
            </el-form-item>
            <el-form-item :rules="{ required:true, message:'不能为空', trigger:'blur' }" prop="platformCode" label="平台单号：" style="width:46%">
              <el-input v-model="params.platformCode" style="width:100%" />
            </el-form-item>
            <el-form-item class="is-required" prop="dealImg" label="成交截图：">
              <upload-image :images.sync="imageList" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="imageUploading" :avatar="true" :size="5242880" />
            </el-form-item>
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'blur' }" prop="supplyRemarks" style="width:92%" label="供货备注：">
              <el-input v-model="params.supplyRemarks" type="textarea" style="width:100%" />
            </el-form-item>
            <!-- 供货备注 -->
            <el-form-item prop="pdfLink">
              <el-checkbox v-model="checked" />
              <el-link type="primary" :href="pdfLink">{{ content }}</el-link>
            </el-form-item>
            <div style="text-align:right;margin:10px">
              <el-button size="mini" @click="$emit('close')">取 消</el-button>
              <el-button type="primary" size="mini" @click="saves">确 定</el-button>
            </div>
          </el-form>
        </el-card>
      </el-collapse-item>
    </el-collapse>

  </basic-container>
</template>
<script>
import { apiProcess, detail, contract } from '@/api/orderManagement/purchasingOrder'
import { getDictBiz } from '@/api/commonApi/common'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'
export default {
  name: 'OrderProcess',
  components: { UploadImage },
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      content: '请仔细阅读<采购合同协议>，并同意合同约定条款',
      checked: false,
      isprocess: false,
      processId: '',
      activeNames: ['1', '2', '3', '4'],
      purchaseContract: '', // PDF-name值
      params: {
        purchaseCode: '', // 采购编码
        purchaseSquareName: '', // 采购方名称
        supplierName: '', // 供应商名称
        purchaseNumber: '', // 采购数量
        purchasePeople: '', // 采购人
        purchaseAmount: '', // 采购金额
        purchaseEffectiveTime: '', // 采购生效时间
        expectArrivalTime: '', // 期望到货时间
        receiptPeople: '', // 收件人
        phone: '', // 固定电话
        mobile: '', // 移动电话
        shippingAddress: '', // 收货地址
        purchaseDetails: [], // 表单值
        supplyIntention: '', // 供货意愿
        supplyWay: '', // 供货方式
        estimatedDeliveryTime: '', // 预计发货时间
        estimatedArrivalTime: '', // 预计到货时间
        supplyRemarks: '' // 供货备注
      },
      imageList: [],
      httpRequest,
      imageUploading: false, // 上传状态
      supplyIntentionList: [],
      supplyWayList: []
    }
  },
  watch: {
    params: {
      handler(val) {
        this.checked = false
      },
      deep: true
    }
  },
  created() {
    this.getSupplyIntertion()
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      this.processId = id
      detail(id).then(res => {
        this.params = res.data
        this.params.supplyIntention = ''
        this.params.supplyWay = ''
        this.loading = false
      })
    },
    getSupplyIntertion() {
      getDictBiz('pss_supply_intention').then(res => {
        this.supplyIntentionList = res.data
        this.supplyIntentionList.map(item => { this.$set(item, 'dictKey', Number(item.dictKey)) })
      })
      getDictBiz('pss_supplier_supply_way').then(res => {
        this.supplyWayList = res.data
        this.supplyWayList.map(item => { this.$set(item, 'dictKey', Number(item.dictKey)) })
      })
      contract().then(res => {
        this.purchaseContract = res.data.name
        this.pdfLink = res.data.link
      })
    },
    cancel() {
      this.checked = false
      this.$emit('close', true)
    },
    saves() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.imageUploading) {
            this.$message.error('图片正在上传，请稍等！')
          } else if (!this.imageList.length) {
            this.$message.error('请上传图片！')
          } else if (this.checked) {
            this.$set(this.params, 'purchaseContract', this.purchaseContract)
            this.$set(this.params, 'dealImg', this.imageList.url)
            this.loading = true
            apiProcess(this.processId, this.params).then(res => { // 调取处理接口
              if (res.code === 200) {
                this.$message({
                  message: '处理成功',
                  type: 'success'
                })
                this.cancel()
                this.loading = false
              }
            })
          } else {
            this.$message({
              message: '请勾选协议',
              type: 'error'
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mainHeader {
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  font-weight: 600;
}
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    width: 20vh;
    height: 20vh;
    .avatar-uploader .el-upload {

    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 20vh;
    height: 20vh;
    line-height: 20vh;
    text-align: center;
  }
  .avatar {
    width: 20vh;
    height: 20vh;
    display: block;
  }
  }

  ::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}

</style>
