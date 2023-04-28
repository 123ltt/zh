<!-- 线上发货配置 新增/编辑-->
<template>
  <div v-loading="loading" class="modal-box">
    <el-row>
      <div class="title">请填写导入账单所属账号</div>
      <el-input v-model="transactionAccount" size="mini" clearable />
    </el-row>
    <el-row :gutter="20" class="mt-20">
      <el-upload ref="upload"
                 class="upload-demo"
                 :http-request="httpRequest"
                 :file-list="fileList"
                 :on-change="handleChange"
                 :auto-upload="false"
                 :limit="2"
                 drag
                 action=""
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>
        <div
          slot="tip"
          class="el-upload__tip"
        >提示：一次只能上传一个xls/xlsx格式文件</div>
      </el-upload>
      <el-row type="flex" class="row-bg" justify="end">
        <el-button class="ms-1" size="mini" type="primary" @click="submitUpload()">导入</el-button>
        <el-button class="ms-1" size="mini" @click="close()">取消</el-button>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import { importInfo } from '@/api/transactionDetails'
export default {
  name: 'OrderSynchronization',
  props: {
  },
  data() {
    return {
      loading: false,
      file: '',
      transactionAccount: '',
      fileList: [],
      obj: {}
    }
  },
  created() {

  },

  methods: {
    // 弹框取消按钮
    close(val) {
      this.$parent.$emit('close', val)
    },
    // 弹框 导入
    submitUpload(val) {
      if (!this.file) {
        return this.$message.error('请选择要上传的文件')
      } else if (!this.transactionAccount) {
        return this.$message.error('请填写导入账单所属账号')
      }
      this.$message.success('导入成功~')
      this.$refs.upload.submit()
      this.$parent.$emit('close', val)
    },
    httpRequest() {
      importInfo({ file: this.file, transactionAccount: this.transactionAccount }).then(res => {
      })
    },
    handleChange(file, fileList) {
      const templateType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
      if (!(templateType === 'xlsx' || templateType === 'xls')) {
        this.$message.error('只能上传.xls/.xlsx文件')
        fileList.length = 0
        this.file = ''
        return false
      } else {
        if (fileList.length > 1) fileList.splice(0, 1)
        this.file = file.raw
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-box{
  padding: 0 20px;
  .title{
    margin-bottom: 15px;
    font-size: bold;
  }
}
.mt-20{
  margin-top: 20px;
}
.file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .file-type {
    width: 60%;
  }
}
::v-deep .el-upload.el-upload--text,
::v-deep .el-upload-dragger {
  width: 100%;
  height: 160px;
}
</style>
