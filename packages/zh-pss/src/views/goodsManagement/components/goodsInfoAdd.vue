<template>
  <basic-container>
    <div class="openBox">
      <div class="fubox">
        <header class="header">
          <p class="title">{{ isAdd?'新增':'编辑' }}商品信息</p>
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
        <main v-loading="loading" class="main">
          <el-card>
            <el-form ref="rulesForm" :model="openData" label-width="120px" size="mini">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="supplierId" label="供应商名称:" :rules="{ required: true, message: '供应商名称不能为空', trigger: 'change' }">
                    <g-select v-model="openData.supplierId" :disabled="!isAdd || oneClick" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" @input="getSupId" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="categoryId" label="商品类目:" :rules="{ required: true, message: '商品类目不能为空', trigger: 'change' }">
                    <category-cascader v-model="openData.categoryId" check-strictly :multiple="false" style="width:100%;" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="goodsName" label="商品名称:" :rules="{ required: true, message: '商品名称不能为空', trigger: 'blur' }">
                    <el-input
                      v-model="openData.goodsName"
                      :disabled="isAdjust"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isAdd">
                <el-col :span="18">
                  <el-form-item prop="goodsUrl" label="商品链接:" :rules="{ required: true, message: '商品链接不能为空', trigger: 'blur' }">
                    <el-input
                      ref="infoUrl"
                      v-model="openData.goodsUrl"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="isAdd" :span="6">
                  <el-button
                    :disabled="hasUrl"
                    size="mini"
                    type="primary"
                    style="margin-left: 20px"
                    @click="getInfo()"
                  >获取商品信息</el-button>
                </el-col>
              </el-row>
              <el-row v-else>
                <el-col :span="24">
                  <el-form-item prop="goodsUrl" label="商品链接:" :rules="{ required: true, message: '商品链接不能为空', trigger: 'blur' }">
                    <el-input
                      ref="infoUrl"
                      v-model="openData.goodsUrl"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="goodsCode" label="商品编码:" :rules="{ required: true, message: '商品编码不能为空', trigger: 'blur' }">
                    <div style="display:flex;">
                      <el-input
                        v-model="openData.goodsCode"
                        :disabled="!isAdd"
                        clearable
                        style="margin-right:10px;"
                        placeholder="请输入"
                      />
                      <el-tooltip effect="dark" content="若无商品编码，请点击手动生成编码" placement="top">
                        <el-button
                          v-if="isAdd"
                          :disabled="oneClick"
                          size="mini"
                          type="primary"
                          @click="getCode()"
                        >手动生成编码</el-button>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="goodsBrandId">
                    <span slot="label">
                      商品品牌:</span>
                    <el-select
                      ref="input"
                      v-model="openData.goodsBrandId"
                      clearable
                      placeholder="请搜索选择"
                      filterable
                    >
                      <el-option
                        v-for="item in brandList"
                        :key="item.id"
                        :label="item.goodsBrand"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="goodsWeight" label="商品毛重(kg):" :rules="{ required: true, message: '商品毛重不能为空', trigger: 'blur' }">
                    <el-input
                      v-model="openData.goodsWeight"
                      v-input.positive
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="goodsPlace" label="商品产地:" :rules="{ required: true, message: '商品产地不能为空', trigger: 'blur' }">
                    <el-input
                      v-model="openData.goodsPlace"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item prop="goodsHeight" label="尺寸(CM):" :rules="{ required: true, message: '尺寸不能为空', trigger: 'blur' }">
                    <span class="title">长:</span>
                    <el-input
                      v-model="openData.goodsLength"
                      v-input.positive
                      clearable
                      class="small"
                      placeholder="长"
                    />
                    <span class="title">宽:</span>
                    <el-input
                      v-model="openData.goodsWidth"
                      v-input.positive
                      clearable
                      class="small"
                      placeholder="宽"
                    />
                    <span class="title">高:</span>
                    <el-input
                      v-model="openData.goodsHeight"
                      v-input.positive
                      clearable
                      class="small"
                      placeholder="高"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <span slot="label">
                      <span class="biaozhi">*</span>
                      是否带包装:</span>
                    <el-radio v-model="openData.isPackaged" label="1">是</el-radio>
                    <el-radio v-model="openData.isPackaged" label="2">否</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item>
                    <span slot="label">
                      <span class="biaozhi">*</span>
                      商品图片:</span>
                    <upload-image v-if="getScc" :images.sync="imageList" :http-request="httpRequest" :uploading.sync="imageUploading" :limit="12" :size="5242880" />
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
      </div>

      <!-- 提示信息 -->
      <el-dialog
        :visible.sync="isShow"
        :append-to-body="true"
        title="提示"
        width="20%"
        center
      >
        <p style="text-align: center;">确定由系统生成编码？</p>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="isShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirm()">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </basic-container>
</template>

<script>
import { getBrand, getGoodsCode, getDetail, update, save, productInfo } from '@/api/goodsManagement/goodsInfo.js'
import { supplier } from '@/api/commonApi/common.js'
import { debounce } from '@/util/util'
import CategoryCascader from '@/components/category-cascader/index.vue'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'

export default {
  name: 'GoodsInfoAdd',
  components: { CategoryCascader, UploadImage },
  props: {
    isAdd: Boolean,
    addStatue: String,
    openData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    },
    define: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      res: '',
      disabled: false,
      oneClick: false,
      auditors: '',
      brandList: [],
      defaultFile: null,
      treeData: [],
      props: {
        expandTrigger: 'click',
        label: 'name',
        value: 'id'
      },
      //   提示弹框的状态
      isShow: false,
      isAdjust: false,
      hasUrl: true,
      dialogImageUrl: '',
      dialogVisible: false,
      isChick: false,
      // 图片上传
      getScc: true,
      imageList: [],
      httpRequest,
      imageUploading: false, // 上传状态
      supplierList: []
    }
  },
  watch: {
    'openData.goodsUrl'(newVal, oldVal) {
      const reg = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/
      if (!this.isChick) {
        if (reg.test(newVal)) {
          this.hasUrl = false
        } else {
          this.hasUrl = true
        }
      } else {
        this.hasUrl = true
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.chuli()
  },
  methods: {
    getSupId(val) {
      if (val) {
        this.openData.goodsBrandId = ''
        getBrand(val).then(res => {
          if (res.code === 200) {
            this.brandList = res.data.records
          }
        })
      } else {
        this.brandList = []
      }
    },
    getData() {
      supplier().then(res => {
        this.supplierList = res.data
      })
    },
    //   -1转成0
    getNum(val) {
      Object.keys(val).forEach(item => {
        if (val[item] === -1) {
          val[item] = 0
        }
      })
    },
    //   获取商品信息
    getInfo() {
      this.loading = true
      this.getScc = false
      this.isChick = true
      this.hasUrl = true
      if (this.openData.goodsUrl) {
        productInfo(this.openData.goodsUrl).then(res => {
          const data = res.data
          this.getNum(data)
          this.openData.productID = data.productID
          this.openData.goodsHeight = data.height
          this.openData.goodsWidth = data.width
          this.openData.goodsLength = data.length
          this.openData.goodsWeight = data.unitWeight
          this.openData.goodsPlace = data.sendGoodsAddressText
          this.openData.goodsName = data.subject
          data.images.forEach(item => {
            if (this.imageList.length < 13) {
              this.imageList.push({ url: item, name: '商品信息' })
            } else {
              this.$message.error('上传的图片已经达到上限！图片加载失败！')
            }
          })
          if (this.imageList.length) {
            this.imageList[0].primary = true
          }
          this.getScc = true
          this.loading = false
        }, error => {
          this.isChick = false
          this.hasUrl = false
          window.console.log(error)
        })
      }
    },
    doclose() {
      this.oneClick = false
      this.$emit('close')
    },
    // 生成商品编码
    getCode() {
      this.isShow = true
    },
    confirm() {
      if (this.openData.supplierId) {
        getGoodsCode(this.openData.supplierId).then(res => {
          if (res.code === 200) {
            this.openData.goodsCode = res.data
            this.oneClick = true
            this.isShow = false
          } else {
            this.$message.error('请求失败!')
          }
        })
      } else {
        this.$message.error('请先选择供应商!')
      }
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
          if (this.openData.goodsLength === '' || this.openData.goodsWidth === '') {
            this.$message.error('尺寸中的长宽高都不能为空!')
          } else {
            this.openData.supplierFileDTOList = []
            this.imageList.forEach(item => {
              if (item.primary) {
                this.openData.supplierFileDTOList.push({ link: item.url, id: '' || item.id, isMain: 'Y', fileName: item.name })
              } else {
                this.openData.supplierFileDTOList.push({ link: item.url, id: '' || item.uid, fileName: item.name })
              }
            })
            this.loading = true
            if (this.isAdd) {
              save(this.openData).then(() => {
                this.$emit('close', true)
                this.loading = false
                this.imgfileList = []
                this.defaultFile = []
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            } else {
              update(this.openData).then(() => {
                this.$emit('close', true)
                this.loading = false
                this.imgfileList = []
                this.defaultFile = []
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          }
        }
      })
    }),
    chuli() {
      if (!this.isAdd) {
        this.getScc = false
        this.loading = true
        this.openData.isPackaged = this.openData.isPackaged + ''
        this.openData.supplierId = this.openData.supplierId + ''
        if (this.addStatue === 'adjust') {
          this.isAdjust = true
        } else {
          this.isAdjust = false
        }
        if (this.openData.goodsBrandId === -1) {
          this.openData.goodsBrandId = ''
        }
        getBrand(this.openData.supplierId).then(res => {
          if (res.code === 200) {
            this.brandList = res.data.records
          }
        })
        getDetail(this.openData.id).then(res => {
          res.data.supplierFileVO.forEach(item => {
            if (item.isMain === 'Y') {
              this.imageList.unshift({
                id: item.id,
                url: item.link,
                name: item.fileName,
                primary: true
              })
            } else if (item.isMain === 'N') {
              this.imageList.push({
                id: item.id,
                url: item.link,
                name: item.fileName,
                primary: false
              })
            }
          })
          this.getScc = true
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-dialog--center .el-dialog__body{
    padding: 0;
}
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
        .small{
            width: 25%;
            margin:0 10px;
            ::v-deep input{
                padding: 0 10px!important;
            }
        }
        .main-img {
            position: absolute;
            left: 0;
            top: 0;
            line-height: initial;
            color: #000;
            font-size: 24px;
            font-weight: bold;
            border-radius: 6px 0;
            background-color: #fff;
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
</style>
