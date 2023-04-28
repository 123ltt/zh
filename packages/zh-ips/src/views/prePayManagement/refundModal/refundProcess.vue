<template>
  <div v-loading="loading">
    <el-form ref="rulesForm" label-width="140px" size="mini" :model="childData">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item prop="purchCode" label="采购编码" :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input v-model.trim="childData.purchCode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="outsideCode" label="第三方单号">
            <el-input v-model.trim="childData.outsideCode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="name" label="采购方名称">
            <el-input v-model.trim="childData.orgName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="supplierName" label="供应商名称">
            <el-input v-model.trim="childData.supplierName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="purTotalMoney" label="采购金额">
            <el-input v-model.trim="childData.purTotalMoney" disabled>
              <template slot="append">RMB</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="prepayTotalMoney" label="预付金额">
            <el-input v-model.trim="childData.prepayTotalMoney" disabled>
              <template slot="append">RMB</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="returnMoney" label="退款金额" :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input v-model.trim="childData.returnMoney">
              <template slot="append">RMB</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="退款凭证" class="is-required">
            <upload-image :images.sync="imageList" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="imageUploading" :avatar="true" :size="5242880" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item prop="remark" label="备注">
            <el-input v-model.trim="childData.remark" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item style="text-align: right;padding-right: 20px;">
            <el-button size="mini" @click="$parent.$emit('close')">关闭</el-button>
            <el-button size="mini" type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getList } from '@/api/advanceManagement/info'
import { submit } from '@/api/advanceManagement/refund'
import { throttle } from '@/util/util'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'

export default {
  name: 'RefundProcess',
  components: { UploadImage },
  props: {
    type: String,
    openData: Object
  },
  data() {
    return {
      loading: false,
      childData: {},
      records: [],
      isShow: false,
      httpRequest,
      imageUploading: false, // 上传状态
      imageList: []
    }
  },
  watch: {
    'childData.purchCode': {
      handler: function(val) {
        this.fetch(val)
      }
    }
  },
  mounted() {
    this.getEdit()
  },
  methods: {
    fetch: throttle(function(val) {
      if (/^CG\d{6,}/.test(val)) { this.getChase(val) }
    }, 500),
    getEdit() {
      if (this.type === 'edit') {
        this.getChase(this.openData.purCode)
        this.$set(this.childData, 'returnMoney', this.openData.returnMoney)
        this.$set(this.childData, 'remark', this.openData.remark)
        this.imageList.push({
          url: this.openData.returnCredence,
          name: '退款凭证'
        }
        )
      } else {
        this.childData = {}
      }
    },
    getChase(purchCode) {
      getList(1, 10, { purCode: purchCode }).then(res => {
        this.records = res.data.records
        if (this.records.length === 1) {
          const { outsideCode, purDemander: { orgName }, supplierInfo: { supplierName }, purTotalMoney, prepayTotalMoney, id } = this.records[0]
          this.childData = Object.assign({}, this.childData, {
            outsideCode,
            orgName,
            supplierName,
            purTotalMoney,
            prepayTotalMoney,
            purOrderPrepayId: id
          })
        } else this.childData = {}
        this.$set(this.childData, 'purchCode', purchCode)
      })
    },
    submit() {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          if (this.imageUploading) {
            this.$message.error('图片正在上传，请稍等！')
          } else if (!this.imageList.length) {
            this.$message.error('请上传图片！')
          } else {
            this.childData.returnCredence = this.imageList[0].url
            submit(this.childData).then(res => {
              this.$message({
                type: 'success',
                message: res.msg + '!'
              })
              this.$parent.$emit('close')
              this.childData = {}
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
.footer{
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
</style>
