<template>
  <basic-container v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">产品调价</span>
      </div>
      <el-form ref="rulesForm" :model="adjustData" label-width="120px" size="mini">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item>
              <el-radio-group v-model="adjustData.adjustType" @change="changeType">
                <el-radio :label="1">升价</el-radio>
                <el-radio :label="2">降价</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调价原因" prop="adjustReason" :rules="[ { required: true, message: '请选择调价原因！', trigger: 'change' } ]">
              <el-select v-model="adjustData.adjustReason" clearable style="width:100%">
                <el-option v-for="item in reasonList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table :data="AdjustData" size="mini" max-height="400px" stripe border class="g-table">
              <el-table-column prop="productSku" label="产品编码" align="center" min-width="120" />
              <el-table-column prop="productName" label="产品名称" align="center" min-width="120" show-overflow-tooltip />
              <el-table-column prop="preAdjustSupplierName" label="调前供应商" align="center" min-width="150" show-overflow-tooltip />
              <el-table-column prop="preAdjustPurchasePrice" label="调前单价" align="center" min-width="100" />
              <el-table-column prop="opRecord" label="调后单价" align="center" min-width="100">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.purchasePrice" v-input.positive size="mini" @input="getPrice(scope.row)" @blur="checkPrice(scope.row)" />
                </template>
              </el-table-column>
              <el-table-column prop="supplierName" label="调后供应商" align="center" min-width="150">
                <template slot-scope="scope">
                  <div @click="checkSupplier(scope.row)">
                    <el-input v-model.trim="scope.row.supplierName" size="mini" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="adjustComment" label="调价备注" :rules="[ { required: true, message: '请填写调价备注！', trigger: 'blur' } ]">
              <el-input v-model="adjustData.adjustComment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调价截图">
              <upload-image :images.sync="imageList" action="/oss/endpoint/put-file?fileType=common" :primary="false" :is-remove="true" :response-handler="getNewData" :avatar="true" :http-request="httpRequest" :uploading.sync="imageUploading" :size="5242880" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="text-align: right;padding-right: 20px;">
              <el-button size="mini" icon="el-icon-circle-close" @click="$emit('close')">取消</el-button>
              <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </basic-container>

</template>
<script>
import httpRequest from '@/api/common/upload'
import { dictionary } from '@/api/commonApi'
import { getAdjustDetail, adjust } from '@/api/ordermanagement/price'
import { UploadImage } from 'global-components'
import showSupplier from './showSupplier.vue'
import { deepClone } from '@/util/util'

export default {
  name: 'PriceAdjust',
  components: { UploadImage },
  props: {
    adjustArr: Array
  },
  data() {
    return {
      adjustData: {
        adjustComment: '',
        adjustType: 1,
        adjustReason: '',
        adjustImage: '',
        subPriceAdjusts: []
      },
      AdjustData: [],
      upReasonList: [],
      downReasonList: [],
      reasonList: [],
      loading: false,
      imageList: [],
      httpRequest,
      imageUploading: false // 上传状态
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getNewData(val) {
      return { data: val.data.link }
    },
    getData() {
      this.loading = true
      dictionary('ips_raise_price_reason').then(res => {
        this.upReasonList = res.data
        this.reasonList = deepClone(this.upReasonList)
      })
      dictionary('ips_reduce_price_reason').then(res => {
        this.downReasonList = res.data
      })
      getAdjustDetail(this.adjustArr).then(res => {
        res.data.forEach(item => {
          const obj = {
            id: item.id || '',
            priceListId: item.priceListId,
            productSku: item.productSku,
            productName: item.productName,
            preAdjustSupplierId: item.preAdjustSupplierId,
            preAdjustSupplierName: item.preAdjustSupplierName,
            preAdjustPurchasePrice: item.preAdjustPurchasePrice,
            purchasePrice: '',
            oldPrice: '',
            supplierId: '',
            supplierName: ''
          }
          this.AdjustData.push(obj)
          this.loading = false
        })
      })
    },
    changeType(val) {
      this.adjustData.adjustReason = ''
      this.AdjustData.forEach(item => {
        item.purchasePrice = item.oldPrice = ''
      })
      if (val === 1) {
        this.reasonList = deepClone(this.upReasonList)
      } else if (val === 2) {
        this.reasonList = deepClone(this.downReasonList)
      }
    },
    checkSupplier(val) {
      this.$modal({
        title: '供应商信息',
        component: showSupplier,
        width: '80%',
        data: {
          id: val.productSku
        },
        callback: (bool) => {
          if (bool) {
            val = Object.assign(val, bool)
          }
        }
      })
    },
    getPrice(val) {
      if (val.purchasePrice) {
        const arr = val.purchasePrice.split('.')
        if (arr[1] && arr[1].length > 2) {
          val.purchasePrice = val.oldPrice
        } else {
          val.oldPrice = val.purchasePrice
        }
      }
    },
    checkPrice(val) {
      if (val.purchasePrice) {
        if (this.adjustData.adjustType === 1) {
          if (+val.purchasePrice < +val.preAdjustPurchasePrice) {
            this.$message.error('升价的调整后价格要比调整前的高！')
            val.purchasePrice = ''
            val.oldPrice = ''
          }
        } else if (this.adjustData.adjustType === 2) {
          if (+val.purchasePrice > +val.preAdjustPurchasePrice) {
            this.$message.error('降价的调整后价格要比调整前的低！')
            val.purchasePrice = ''
            val.oldPrice = ''
          }
        }
      }
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.imageUploading) return this.$message.error('文件正在上传中，请稍后')
          let isOk = true
          this.AdjustData.forEach(item => {
            if (!item.purchasePrice || !item.supplierName) {
              isOk = false
            }
          })
          if (isOk) {
            this.adjustData.subPriceAdjusts = this.AdjustData
            if (this.imageList.length) {
              this.adjustData.adjustImage = typeof this.imageList[0].url === 'object' ? this.imageList[0].url.link : this.imageList[0].url
            }
            adjust(this.adjustData).then(res => {
              this.$emit('close', true)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
          } else {
            this.$message.error('请完成表格中的选项！')
          }
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>

</style>
