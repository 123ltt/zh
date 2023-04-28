<template>
  <basic-container>
    <div v-loading="loading" class="openBox">
      <div class="fubox">
        <header class="header">
          <p class="title">{{ isAdd?'新增':'编辑' }}访厂记录</p>
          <div
            class="closeBtn"
            @click="doclose()"
          >
            <el-button
              size="mini"
              type="primary"
            >返回</el-button>
          </div>
        </header>
        <main class="main">
          <el-card>
            <el-form ref="rulesForm" :model="openData" label-width="120px" size="mini">
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="supplierId" label="供应商名称" :rules="{ required: true, message: '供应商名称不能为空', trigger: 'change' }">
                    <g-select v-model="openData.supplierId" :disabled="!isAdd || isChick" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" style="width:100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="auditors">
                    <span slot="label">
                      <span class="biaozhi">*</span>
                      稽查人员</span>
                    <g-select v-model="auditors" :disabled="isChick" :items="userList" key-field="id" label-field="name" value-field="id" style="width:100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="visitTime" label="访厂日期" :rules="{ required: true, message: '访厂日期不能为空', trigger: 'change' }">
                    <el-date-picker
                      v-model="openData.visitTime"
                      :disabled="isChick"
                      style="width:100%"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item>
                    <span slot="label">
                      <span class="biaozhi">*</span>
                      陪同人员</span>
                    <g-select v-model="accompanying" :disabled="isChick" :items="userList" key-field="id" label-field="name" value-field="id" multiple style="width:100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item>
                    <span slot="label">
                      <span class="biaozhi">*</span>
                      供应商评分</span>
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-download"
                      @click="downloadTemp"
                    >下载供应商评分模板</el-button>
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-upload2"
                      @click="importBtn()"
                    >上传供应商评分表</el-button>
                    <span v-if="fileName" class="space">
                      <a :href="fileLink" style="color:blue;">{{ fileName }}</a>
                      <span class="space" @click="clearLink">
                        <i class="el-icon-delete" style="cursor: pointer;" />
                      </span>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="score" label="最终得分" :rules="{ required: true, message: '最终得分不能为空', trigger: 'blur' }">
                    <el-input
                      v-model="openData.score"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="grade" label="供应商等级" :rules="{ required: true, message: '供应商等级不能为空', trigger: 'blur' }">
                    <el-input
                      v-model="openData.grade"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="访厂图片" class="is-required">
                    <upload-image v-if="getScc" :images.sync="imageList" :primary="false" :http-request="httpRequest" :uploading.sync="imageUploading" :limit="7" :size="5242880" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </main>
        <footer class="footer">
          <el-button
            size="mini"
            icon="el-icon-circle-close"
            @click="doclose()"
          >取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="todefine()"
          >保存</el-button>
        </footer>

        <!-- 导入-dialog -->
        <el-dialog
          :visible.sync="uploadVisible"
          :append-to-body="true"
          title="上传供应商评分表"
          width="450px"
          top="50px"
          style="overflow:hidden;"
          @close="importClose"
        >
          <div style="height: 246px;">
            <div class="file">
              <el-button type="primary" size="mini" @click.stop="importExc">导入</el-button>
            </div>
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :on-exceed="handleExceed"
              :before-upload="beforeFileUpload"
              :on-change="handleChange"
              :limit="1"
              :multiple="false"
              :http-request="httpRequestFn"
              accept=".xls,.xlsx"
              action="#"
              class="upload-demo"
              drag
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text"><em>点击选择文件</em></div>
              <div slot="tip" class="el-upload__tip">提示：一次只能上传一个.xls/.xlsx文件</div>
            </el-upload>
          </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

      </div>
    </div>
  </basic-container>
</template>

<script>
import { supplier } from '@/api/commonApi/common.js'
import { dowloadExc, debounce } from '@/util/util'
import { UploadImage } from 'global-components'
import { downloadTemplate, importTable, secondaryImport, save, update, getDetail, getUserList } from '@/api/factoryVisitManagement/factoryVisitRecord.js'
import httpRequest from '@/api/common/upload'

export default {
  name: 'CommonPssFactoryVisitRecordAdd',
  components: { UploadImage },
  props: {
    isAdd: Boolean,
    addData: Object // 父传子的表格参数
  },
  data() {
    return {
      res: '',
      disabled: false,
      auditors: '',
      accompanying: [],
      uploadVisible: false, // 导入
      fileLink: '',
      fileName: '',
      entourageNames: [],
      verifyName: '',
      isDisable: true,
      isChick: false,
      dialogImageUrl: '',
      dialogVisible: false,
      oldLink: [],
      openData: {},
      userList: [],
      supplierList: [],
      getScc: true,
      imageList: [],
      httpRequest,
      imageUploading: false, // 上传状态
      loading: false
    }
  },
  created() {
    this.chuli()
    this.getData()
  },
  methods: {
    getData() {
      supplier().then(res => {
        this.supplierList = res.data
      })
      getUserList().then(res => {
        this.userList = res.data.records
      })
    },
    // 导入，导出
    importBtn() {
      this.uploadVisible = true
    },
    importClose() {
      this.$refs.uploadRef.clearFiles()// 清除文件
    },
    handleExceed(files, fileList) {
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.$refs.uploadRef.handleStart(files[0])// 选择文件后的赋值方法
      this.file = fileList[0].raw
    },
    handleChange(file, fileList) {
      fileList.length = 1
      this.file = file.raw
    },
    beforeFileUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let isOk = true
      if (testmsg !== 'xls' && testmsg !== 'xlsx') {
        isOk = false
        this.$message.error('上传的文件只能是xls,xlsx格式!')
      }
      return isOk
    },
    // 导入模板
    downloadTemp: debounce(function() {
      if (this.openData.visitTime === '' || this.auditors === '' || this.accompanying.length === 0 || this.openData.supplierId === '') {
        this.$message.error('供应商名称、稽核人员、陪同人员、访厂时间为必要参数，请填写!')
      } else {
        const visitTime = this.openData.visitTime
        let verifyName = ''
        let supplierName = ''
        const entourageNames = []
        this.userList.forEach(item => {
          if (item.id === this.auditors) {
            verifyName = item.name
          }
          this.accompanying.forEach(item2 => {
            if (item.id === item2) {
              entourageNames.push(item.name)
            }
          })
        })
        this.supplierList.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.supplierId == this.openData.supplierId) {
            supplierName = item.supplierName
          }
        })
        this.$message.success('正在下载，请稍等片刻...')
        const name = '供应商评分导入模板.xlsx'
        downloadTemplate({ supplierName, visitTime, verifyName, entourageNames }).then(res => {
          if (res.size) {
            dowloadExc(res, name)
          }
        }).catch(() => {
          this.$message.error('请求异常，导出失败！')
        })
      }
    }),
    importExc() {
      this.$refs.uploadRef.submit()
    },
    // 上传
    httpRequestFn(event) {
      const loading = this.$loading({
        lock: true,
        text: '正在拼了老命的请求中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$message.success('正在上传中，请稍等...')
      importTable({ file: this.file }).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.openData.score = data.finallyScore
          this.openData.grade = data.level
          secondaryImport({ file: this.file }).then(res2 => {
            if (res2.code === 200) {
              this.fileLink = res2.data.link
              this.fileName = res2.data.originalName
              this.isChick = true
              this.$message.success('上传成功')
              this.uploadVisible = false
            }
          })
        }
        loading.close()
      }).catch(() => {
        loading.close()
        this.$message.error('上传失败')
      })
    },
    clearLink() {
      this.fileLink = ''
      this.fileName = ''
      this.openData.score = ''
      this.openData.grade = ''
      this.isChick = false
    },
    doclose() {
      this.fileLink = ''
      this.fileName = ''
      this.$emit('close')
    },
    // 封装判断函数
    bool(val) {
      if (val == null || val === '') {
        return true
      }
      return false
    },
    todefine: debounce(function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.imageUploading) {
            return this.$message.error('文件正在上传中，请稍后')
          } else if (this.auditors === '') {
            this.$message.error('稽查人员不能为空!')
          } else if (this.accompanying.length === 0) {
            this.$message.error('陪同人员不能为空!')
          } else if (!this.imageList.length) {
            this.$message.error('请上传访厂图片!')
          } else if (this.openData.score === '' || this.openData.grade === '') {
            this.$message.error('最终得分和供应商等级不能为空！请重新上传供应商评分表!')
          } else {
            this.loading = true
            const filesarr = []
            filesarr.push({ fileType: 'excel', link: this.fileLink })
            this.imageList.forEach(item => {
              const obj = {
                id: '' || item.id,
                link: typeof item.url === 'object' ? item.url.link : item.url,
                fileType: 'image'
              }
              filesarr.push(obj)
            })
            filesarr.forEach(item => {
              // eslint-disable-next-line no-unused-vars
              let isOk = true
              this.oldLink.forEach(olditem => {
                if (olditem.link === item.link) {
                  isOk = false
                }
              })
              if (isOk) {
                this.openData.files.push(item)
              }
            })
            if (this.openData.files.length === 0) {
              this.openData.files = null
            }
            this.userList.forEach(item => {
              // eslint-disable-next-line eqeqeq
              if (item.id == this.auditors) {
                this.openData.users.push({ type: 'auditor', userId: item.id, userRealName: item.name })
              }
              this.accompanying.forEach(item2 => {
                // eslint-disable-next-line eqeqeq
                if (item.id == item2) {
                  this.openData.users.push({ type: 'entourage', userId: item.id, userRealName: item.name })
                }
              })
            })
            if (this.isAdd) {
              save(this.openData).then(() => {
                this.loading = false
                this.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            } else {
              update(this.openData).then(() => {
                this.loading = false
                this.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          }
        } else {
          this.loading = false
        }
      })
    }),
    chuli() {
      if (!this.isAdd) {
        this.loading = true
        this.getScc = false
        getDetail(this.addData.id).then(res => {
          const data = res.data
          this.openData = data
          this.openData.users.forEach(item => {
            if (item.type === 'auditor') {
              this.auditors = item.userId + ''
            } else if (item.type === 'entourage') {
              item.userId = item.userId + ''
              this.accompanying.push(item.userId)
            }
          })
          this.openData.files.forEach(item => {
            if (item.fileType === 'excel') {
              this.fileName = '供应商评分表'
              this.fileLink = item.link
            } else if (item.fileType === 'image') {
              this.imageList.push({
                id: item.id,
                url: item.link,
                name: 'image' + item.id
              })
            }
          })
          this.oldLink = this.openData.files
          this.openData.users = []
          this.openData.files = []
          this.getScc = true
          this.loading = false
        })
      } else {
        this.openData = JSON.parse(JSON.stringify(this.addData))
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
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
    box-sizing: border-box;
}
.openBox{
    width: 100%;
    // height: 600px;
    overflow: auto;
    .fubox{
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
        font-size: 14px;
      }
    }
    .main {
      width: 100%;
      padding-top: 20px;
      padding-right: 20px;
      ::v-deep .el-select{
          width: 100%;
      }
      ::v-deep .el-form-item{
          margin-bottom: 10px!important;
      }
      ::v-deep .el-form-item__content{
        //   width: 100%;
          ::v-deep .el-input-group__prepend{
              width: 25%;
              padding: 0;
              text-align: center;
          }
      }
      .biaozhi {
            color: red;
            font-size: 12px;
          }
        .idcard{
            display: flex;
            justify-content: space-between;
        }
        ::v-deep .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        ::v-deep .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        ::v-deep .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 300px;
            height: 200px;
            line-height: 200px;
            text-align: center;
        }
        ::v-deep .avatar {
            width: 300px;
            height: 200px;
            display: block;
        }
    }
    .footer {
      text-align: center;
    //   margin-top: 30px;
      padding-bottom: 40px;
    }
    }
}
::v-deep .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 40px;
}
.file{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.space{
  display: inline-block;
  margin-left: 20px;
}
</style>
