<template>
  <!-- 新品录入 -->
  <basic-container>
    <!-- <ProductInfo :is-audit="false"/> -->
    <el-form ref="formRef" :model="form" :rules="rules" size="mini" label-width="125px" class="search-form" @submit.prevent>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="产品中文名称" prop="productName">
            <el-input v-model="form.productName" type="text" placeholder="请输入产品名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="idCategory" label="类目">
            <category-cascader ref="categoryRef" v-model="form.idCategory" :multiple="false" check-strictly width="100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品来源" prop="sourceType">
            <el-select v-model="form.sourceType" filterable clearable placeholder="请选择产品来源" style="width:100%;">
              <el-option v-for="item in sampleSpuCodeOptions" :key="item.value" :value="+item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="平台参考链接" prop="platformLink">
            <el-input v-model="form.platformLink" type="text" placeholder="请输入平台参考链接" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="supplierInfo" label="供应商名称">
            <v-check-supplier v-model="form.supplierInfo" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商链接" prop="vendorLink">
            <el-input v-model="form.vendorLink" type="text" placeholder="请输入供应商链接" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="供应商产品编码" prop="vendorProductCode">
            <el-input v-model="form.vendorProductCode" type="text" placeholder="请输入供应商产品编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="priceSupply" label="供货价格（RMB）">
            <el-input v-model="form.priceSupply" v-input.number.positive type="text" placeholder="请输入供货价格" style="width:100%;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="产品重量（g）" prop="productWeight">
            <el-input v-model="form.productWeight" v-input.positive.numeric type="text" placeholder="请输入产品重量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="d-flex">
            <el-form-item label="尺寸（CM）" />
            <el-form-item label-width="40px" label="长" prop="sizeLong">
              <el-input v-model="form.sizeLong" v-input.number.positive type="text" placeholder="长" />
            </el-form-item>
            <el-form-item label-width="40px" label="宽" prop="sizeWidth">
              <el-input v-model="form.sizeWidth" v-input.number.positive type="text" placeholder="宽" />
            </el-form-item>
            <el-form-item label-width="40px" label="高" prop="sizeHeight">
              <el-input v-model="form.sizeHeight" v-input.number.positive type="text" placeholder="高" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="开发模式" prop="devType">
            <el-radio v-model="form.devType" :label="1">精品</el-radio>
            <el-radio v-model="form.devType" :label="0">精铺</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最小起订量" prop="minimumOrder">
            <el-input v-model="form.minimumOrder" v-input.positive.numeric.!0 type="text" placeholder="请输入最小起订量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交期（天）" prop="deliveryDay">
            <el-input v-model="form.deliveryDay" v-input.positive.numeric.!0 type="text" placeholder="请输入交期天数" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="是否采样" prop="isSampling">
            <el-select v-model="form.isSampling" clearable placeholder="请选择是否采样" style="width:100%;">
              <el-option v-for="item in isSamplingOptions" :key="item.value" :value="+item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样品SPU编码" prop="spuCode">
            <el-input v-model="form.spuCode" :disabled="true" type="text" placeholder="需要采样时，系统自动生成" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="描述信息" prop="comment">
            <el-input v-model="form.comment" :rows="3" :maxlength="LIMIT.content" type="textarea" resize="none" placeholder="请输入描述信息" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col>
          <el-form-item label="图片信息" prop="imageList">
            <upload-image :images.sync="form.imageList"
                          :http-request="httpRequest"
                          :uploading.sync="imageUploading"
                          :limit="LIMIT.maxUploadImages"
                          :size="maxImageSize"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col>
          <el-form-item label="附件信息">
            <upload-file :files.sync="form.attachments"
                         :http-request="httpRequest"
                         :uploading.sync="attachmentUploading"
                         :size="maxFileSize"
            />
          </el-form-item>
        </el-col>
      </el-row>
    <!-- 从供应商导入产品列表中导入结束 -->
    </el-form>
    <div class="text-end mb-2">
      <el-button type="primary" size="mini" @click="supplierUploadBtn">从供应商产品列表中导入</el-button>
      <el-button type="primary" size="mini" @click="batchImport">批量导入</el-button>
      <el-button type="primary" size="mini" :loading="submitting" @click="onSubmit">提交</el-button>
      <el-button size="mini" @click="onReset">重置</el-button>
    </div>

    <el-dialog :visible.sync="supplierUploadVisible" :append-to-body="true" title="供应商产品列表中导入" width="80vw" top="40px" class="custom-modal">
      <el-form :model="dialogForm" size="mini" label-width="100px" class="search-form mt-2 no-message" @submit.native.prevent>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="供应商名称 " prop="vendorName">
              <el-input v-model="dialogForm.vendorName" type="text" placeholder="请输入供应商名称" @keyup.13.native="queryGoodsBtn" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="0">
              <el-button type="primary" @click="queryGoodsBtn">查询供应商未开发的产品</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-btp v-loading="loading"
              :data="tableData"
              :columns="columns"
              :defaultcolumnconfig="defaultColumnConfig"
              :haspage="true"
              :page="page"
              max-height="450px"
              border
              stripe
              @select="selectRow"
              @select-all="selectAll"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="importing" @click.stop="devNewProduct">开发新品</el-button>
        <el-button type="primary" size="mini" @click="supplierUploadVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 从供应商导入产品列表中导入开始 -->
  </basic-container>
</template>

<script>
import { LIMIT, LIMIT_FILE_SIZE } from '@/config/form'
import { required, customRule } from '@/util/formRules'
import { addData, queryGoods, importVendor } from '@/api/newProductEntry'
import { mapState } from 'vuex'
import { UploadImage, UploadFile } from 'global-components'
import httpRequest from '@/api/common/upload'
import CategoryCascader from '@/components/category-cascader/index.vue'
import { getDicts } from '@/api/common/dict'
import VCheckSupplier from './components/checkSupplier.vue'
import NewProductBatchImport from './components/newProductBatchImport.vue'

export default {
  name: 'PmsNewProductEntry',
  components: { UploadImage, UploadFile, CategoryCascader, VCheckSupplier },
  props: {},
  data() {
    const idCategoryValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择类目'))
      } else {
        callback()
      }
    }
    return {
      LIMIT,
      maxImageSize: LIMIT_FILE_SIZE.image,
      maxFileSize: LIMIT_FILE_SIZE.attachment,
      httpRequest,
      isSamplingOptions: [],
      checkData: [],
      acceptImgType: '.jpg,.jpeg,.png,.bmp',
      rules: {
        productName: [{ required: true, message: '请输入产品名称', trigger: ['change', 'blur'] }],
        supplierInfo: [{ required: true, message: '请选择供应商名称', trigger: ['change', 'blur'] }],
        idCategory: [{ required: true, validator: idCategoryValidate, trigger: ['change', 'blur'] }],
        devType: [{ required: true, message: '请选择开发模式', trigger: ['change', 'blur'] }],
        isSampling: [{ required: true, message: '请选择是否采样', trigger: ['change', 'blur'] }],
        minimumOrder: [],
        deliveryDay: [],
        imageList: [{ required: true, message: '请至少上传一张图片' }]
      },
      sampleSpuCodeOptions: [],
      form: {
        productName: '', // 产品名称
        platformLink: '', // 平台参考链接
        sourceType: '', // 产品来源
        idCategory: '', // 类目
        vendorCode: '', // 供应商编码(名称)
        priceSupply: '', // 供货价格
        vendorLink: '', // 供应商链接
        productWeight: '', // 产品重量
        sizeLong: '', // 尺寸-长
        sizeWidth: '', // 尺寸-宽
        sizeHeight: '', // 尺寸-高
        vendorProductCode: '', // 供应商产品编码
        // spuCode: '', // 样品SPU编码
        comment: '', // 备注
        imageList: [], // imageSort:图片排序, 从0开始排序;   imageUrl:图片的URL
        /** @type {{name:string;url:string}[]} */
        attachments: [], // 附件信息
        isSampling: 0, // 是否采样
        devType: 1, // 开发模式
        minimumOrder: '', // 最小起订量
        deliveryDay: '', // 交期
        supplierInfo: ''
      },
      loading: false,
      defaultColumnConfig: {
        align: 'center',
        fixed: 'right'
      },
      tableData: [],
      columns: [
        { type: 'selection' },
        {
          label: '缩略图',
          prop: 'thumbnail',
          width: 70,
          renderC: (h, scope) => {
            return <g-thumb url={scope.row.thumbnail} class="d-table-cell" />
          }
        },
        { label: '产品名称', prop: 'productName' },
        {
          label: '状态',
          prop: 'isDeveloped',
          width: 80,
          formatter(row, column, cellValue, index) {
            return cellValue === 'Y' ? '已开发' : '未开发'
          }
        },
        { label: '供应商产品编码', prop: 'vendorProductCode' },
        { label: '类目', prop: 'category' },
        { label: '商品链接', prop: 'platformLink' }
      ],
      page: this.getPageInfo(),
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      file: '',
      supplierUploadVisible: false,
      dialogForm: {
        vendorName: ''
      },
      // 是否正在提交 导入供应商
      importing: false,
      submitting: false,
      imageUploading: false, // 图片是否正在上传中
      attachmentUploading: false // 附件是否在上传中
    }
  },
  computed: {
    ...mapState({
      categoryLeve1: state => state.pms.categoryLeve1
    })
  },
  watch: {
    tableData(newVal, oldVal) {
      if (newVal !== oldVal) {
        newVal.forEach((row, index) => {
          // 切换表格页码时回显勾选状态
          if (this.findCheckDataIndex(row.id) !== -1) {
            this.$nextTick(() => {
              this.$refs.tableRef.toggleRowSelection(row, true)
            })
          }
        })
      }
    },
    'form.devType': {
      handler(val) {
        if (val === 1) {
        // const minimumOrder = required().concat(customRule(value => value === '', '请输入最小起定量'))
        // const deliveryDay = required().concat(customRule(value => value === '', '请输入交期天数'))
          const minimumOrder = [{ required: true, message: '请输入最小起定量', trigger: 'blur' }]
          const deliveryDay = required().concat(customRule(value => value === '', '请输入交期天数'))

          this.rules.minimumOrder = minimumOrder
          this.rules.deliveryDay = deliveryDay
        // this.$set(this.rules, 'minimumOrder', [{ required: true, message: '请输入最小起定量', trigger: ['change', 'blur'] }])
        // this.$set(this.rules, 'deliveryDay', [{ required: true, message: '请输入交期天数', trigger: ['change', 'blur'] }])
        } else {
          this.$nextTick(() => { this.$refs.formRef.clearValidate(['minimumOrder', 'deliveryDay']) })
          this.$set(this.rules, 'minimumOrder', undefined)
          this.$set(this.rules, 'deliveryDay', undefined)
        }
      },
      immediate: true
    }
  },
  created() {
    // 产品来源, 是否采样
    getDicts(['sample_spu_code', 'is_sampling'], 'pms').then(mapping => {
      this.sampleSpuCodeOptions = mapping.sample_spu_code
      this.isSamplingOptions = mapping.is_sampling
    })
  },
  methods: {
    // 分页
    getPageInfo() {
      return {
        'page-sizes': [10, 20, 30, 40, 50],
        'page-size': 10,
        'current-page': 1,
        total: 0,
        'size-change': this.queryGoods,
        'current-change': this.queryGoods
      }
    },
    single(arr) {
      arr.forEach((item, index) => {
        if (item.children && item.children.length) {
          this.single(item.children)
        } else {
          delete item.children
        }
      })
    },
    // 供应商名称聚焦时，滚动到底部
    scrollToBottom() {
      let rafId
      let initHeight = document.querySelector('#container').clientHeight
      const totalHeight = this.$el.scrollHeight
      const STEP = 3
      const scroll = () => {
        if (totalHeight > initHeight) {
          initHeight += STEP
          document.querySelector('#container').scrollTop = initHeight
          rafId = window.requestAnimationFrame(scroll)
        } else window.cancelAnimationFrame(rafId)
      }
      rafId = window.requestAnimationFrame(scroll)
    },
    onSubmit() {
      if (this.submitting) return
      if (this.imageUploading || this.attachmentUploading) return this.$message.error('文件正在上传中，请稍后')
      this.$refs.formRef.validate((bool) => {
        if (bool) {
          const { supplierName, supplierCode } = this.form.supplierInfo
          const data = Object.assign({}, this.form, { vendorName: supplierName, vendorCode: supplierCode })
          data.supplierInfo = undefined
          delete data.supplierInfo

          data.imageList = data.imageList.map(item => {
            return {
              isPrime: Number(item.primary),
              imageName: item.name,
              imageUrl: item.url
            }
          })

          data.attachments = data.attachments.map(item => {
            return { name: item.name, url: item.url }
          })

          this.submitting = true
          addData(data).then(res => {
            this.$message.success('提交成功')
            this.onReset()
            this.submitting = false
            this.$router.push('/pms/myAudit', true)
          }).catch(err => {
            this.$message.error(err.message)
            this.submitting = false
          })
        }
      })
    },
    onReset() {
      this.$refs.categoryRef.$refs.cascader.checkedValue = []
      this.$refs.formRef.resetFields()
    },
    supplierUploadBtn() {
      this.page = this.getPageInfo()
      this.dialogForm.vendorName = ''
      this.checkData = []
      this.queryGoods()
      this.supplierUploadVisible = true
      this.importing = false
    },
    queryGoodsBtn() {
      this.page['current-page'] = 1
      this.checkData = []
      this.queryGoods()
    },
    queryGoods() {
      this.loading = true
      // 查询表格数据
      const { 'current-page': current, 'page-size': size } = this.page
      const { vendorName: supplierName } = this.dialogForm
      queryGoods({ supplierName, current, size }).then(res => {
        const { code, data: { records, total } } = res
        if (code === 200) {
          // thumbnail\productName\status\vendorProductCode\idCategory\platformLink
          const tableData = []
          records.forEach(item => {
            const imageList = []
            if (item.supplierFileVO.length) {
              item.supplierFileVO.forEach(item => {
                imageList.push({ isPrime: item.isMain === 'Y' ? 1 : 0, imageUrl: item.link })
              })
            }
            tableData.push({
              id: item.id,
              thumbnail: item.mainPictureUrl,
              productName: item.goodsName,
              status: item.status,
              vendorProductCode: item.goodsCode,
              category: item.category,
              idCategory: item.categoryId,
              platformLink: item.goodsUrl,
              vendorCode: item.supplierCode,
              vendorName: item.supplierName,
              imageList,
              priceSupply: parseFloat(item.goodsPrice), // 供货价格
              productWeight: item.goodsWeight,
              sizeHeight: item.goodsHeight,
              sizeLong: item.goodsLength,
              sizeWidth: item.goodsWidth,
              vendorLink: item.supplierWebSite // 供应商链接

            })
          })
          this.tableData = tableData
          this.page.total = total
        }
      }).finally(() => { this.loading = false })
    },
    findImgIndex(uid) {
      const { fileList } = this
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].uid === uid) return i
      }
    },
    devNewProduct() {
      if (this.importing) return
      const { checkData } = this
      if (!checkData.length) {
        this.$message.error('请先勾选表格数据')
        return
      }
      this.importing = true
      importVendor(checkData).then(res => {
        if (res.code === 200) {
          this.$message.success('开发新品成功')
          this.supplierUploadVisible = false
          this.$router.push('/pms/myAudit', true)
        }
      }).catch(() => {
        this.importing = false
      })
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    selectRow(selection, row) {
      // 勾选则去掉，没有则勾选上
      const index = this.findCheckDataIndex(row.id)
      if (index === -1) {
        this.checkData.push(row)
      } else {
        this.checkData.splice(index, 1)
      }
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    selectAll(selection) {
      if (!selection.length) {
        this.tableData.forEach((item) => {
          // 去掉已有的勾选
          const index = this.findCheckDataIndex(item.id)
          index !== -1 && this.checkData.splice(index, 1)
        })
        return
      }
      selection.forEach((item, index) => {
        // 勾选数据的id、追踪码、出库时间
        if (this.findCheckDataIndex(item.id) === -1) {
          this.checkData.push(item)
        }
      })
    },
    // 查找勾选数据中是否有某个id，返回index
    findCheckDataIndex(id) {
      const { checkData } = this
      for (let i = 0; i < checkData.length; i++) {
        if (checkData[i].id === id) return i
      }
      return -1
    },
    batchImport() {
      this.$modal({
        title: '批量导入',
        component: NewProductBatchImport,
        width: '540px'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.search-form {
  .el-col {
    margin-bottom: 0;
  }
  // .el-row:last-child {
  //   margin-bottom: -10px;
  // }
  p {
    margin-top: 0;
    color: #606266;
    font-size: 14px;
    span {
      color: #f56c6c;
      &.imgTips {
        display: none;
      }
    }
  }
}

::v-deep .el-dialog__body {
  padding: 0 20px;
}
.img-dialog {
  ::v-deep .el-dialog__header {
    padding: 10px;
    .el-dialog__headerbtn {
      right: 10px;
      top: 10px;
    }
  }
  ::v-deep .el-dialog__body {
    padding: 10px;
  }
  ::v-deep .el-dialog__footer{
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
.fileTips > .el-button {
  font-size: 14px;
}
</style>
