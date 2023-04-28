<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <groupShow :incoming-data="incomingData" />
      </el-collapse-item>
      <el-collapse-item title="采购明细" name="2">
        <el-table :data="params.purchaseDetails" class="g-table" border stripe size="mini">
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="120" />
          <el-table-column prop="productImg" label="产品图片" align="center" width="75">
            <template slot-scope="scope">
              <g-thumb class="d-table-cell" :url="scope.row.productImg" />
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" align="center" min-width="200">
            <tmeplate slot-scope="scope">
              <g-text-ellipsis :lines="2">{{ scope.row.productName }}</g-text-ellipsis>
            </tmeplate>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" align="center" min-width="200">
            <tmeplate slot-scope="scope">
              <g-text-ellipsis :lines="2">{{ scope.row.goodsName }}</g-text-ellipsis>
            </tmeplate>
          </el-table-column>
          <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="120" />
          <el-table-column prop="productPrice" label="采购单价" align="center" min-width="100" />
          <el-table-column prop="purQty" label="采购数量" align="center" min-width="100" />
          <el-table-column prop="productTotalAmount" label="产品金额" align="center" min-width="100" />
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="采购处理" name="3" disabled>
        <el-card>
          <el-form ref="formRef" :model="params" label-width="120px" size="mini">
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="supplyIntention" style="width:46%;display:inline-block" label="供货意愿">
              <el-radio v-model="params.supplyIntention" label="1">同意供货</el-radio>
            </el-form-item>
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="supplyWay" style="width:46%;display:inline-block" label="供货方式">
              <el-radio v-model="params.supplyWay" label="2">全部供货</el-radio>
            </el-form-item>
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="estimatedDeliveryTime" style="width:46%;display:inline-block" label="预计发货时间">
              <el-date-picker v-model="params.estimatedDeliveryTime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
            </el-form-item>
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="estimatedArrivalTime" style="width:46%;display:inline-block" label="预计到货时间">
              <el-date-picker v-model="params.estimatedArrivalTime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
            </el-form-item>
            <el-form-item :rules="{ required:true, message:'不能为空', trigger:'blur' }" prop="platformCode" label="平台单号" style="width:46%">
              <el-input v-model.trim="params.platformCode" style="width:100%" />
            </el-form-item>
            <el-form-item prop="dealImg" label="成交截图" class="is-required">
              <upload-image :images.sync="imageList" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="imageUploading" :avatar="true" :size="5242880" />
            </el-form-item>
            <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'blur' }" prop="supplyRemarks" style="width:92%" label="供货备注">
              <el-input v-model.trim="params.supplyRemarks" type="textarea" style="width:100%" />
            </el-form-item>
            <!-- 供货备注 -->
            <el-form-item prop="purchaseContract">
              <el-checkbox v-model="checked" @change="checkboxChange" />
              <a style="color:blue" @click="getPDF">{{ content }}</a>
            </el-form-item>
          </el-form>
          <div class="footer">
            <el-button size="mini" @click="$emit('close')">取 消</el-button>
            <el-button type="primary" size="mini" @click="saves">确 定</el-button>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
import { apiProcess, detail, contract } from '@/api/ordermanagement/purchasingOrder'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'
import groupShow from './groupShow'

export default {
  name: 'OrderProcess',
  components: { UploadImage, groupShow },
  props: {
    id: String
  },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      loading: false,
      content: '请仔细阅读<采购合同协议>，并同意合同约定条款',
      url: '',
      imgSrc: '',
      checked: false,
      isprocess: false,
      processId: '',
      purchaseContract: '', // PDF-name值
      httpRequest,
      imageUploading: false, // 上传状态
      imageList: [],
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
        supplyIntention: '1', // 供货意愿
        supplyWay: '2', // 供货方式
        estimatedDeliveryTime: '', // 预计发货时间
        estimatedArrivalTime: '', // 预计到货时间
        supplyRemarks: '', // 供货备注
        updateUserName: '', // 更新人
        updateDateTime: '', // 更新时间
        purchaseRemarks: '', // 采购备注
        goodsAmount: ''
      },
      incomingData: {}
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
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      this.processId = id
      detail(id).then(res => {
        this.incomingData = res.data
        this.params = res.data
        this.params.supplyIntention = '1'
        this.params.supplyWay = '2'
        this.loading = false
      })
    },
    checkboxChange(val) {
      if (this.checked) {
        contract().then(res => {
          this.purchaseContract = res.data.name
        })
      }
    },
    getPDF() {
      contract().then(res => {
        window.open(res.data.link, '_blank')
      })
    },
    cancel() {
      this.checked = false
      this.$emit('close')
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
            apiProcess(this.processId, this.params).then(res => { // 调取处理接口
              if (res.code === 200) {
                this.$emit('close', true)
                this.$message({
                  message: '处理成功',
                  type: 'success'
                })
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
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
::v-deep .el-collapse-item__content{
  font-size: 12px;
}
.footer {
        text-align: right;
        //   margin-top: 30px;
        padding-top: 20px;
        box-sizing: border-box;
        }
</style>
