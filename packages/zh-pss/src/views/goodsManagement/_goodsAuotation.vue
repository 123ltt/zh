<template>
  <!-- 商品管理/商品报价-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" @select="selectRow" @select-all="selectAll">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="9">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:60%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="goodsName" label="商品名称">
                <el-input
                  v-model="submit.goodsName"
                  style="width:60%;"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="goodsCode" label="商品编码">
                <el-input
                  v-model="submit.goodsCode"
                  style="width:60%;"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4" class="status">
              <el-form-item prop="status" label="状态">
                <el-select
                  v-model="submit.status"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                >查询</el-button>
                <el-button
                  class="btn"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-download"
                  size="mini"
                  @click="downloadTemp()"
                >下载模板</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-upload2"
                  size="mini"
                  @click="importBtn()"
                >批量上传</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="supplierCode" label="供应商编码" min-width="85" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status == 2" @click="detailBtn(row)">{{ row.supplierCode }}</g-link>
          <span v-else>{{ row.supplierCode }}</span>
        </template>
      </el-table-column>

      <!-- 商品图片 -->
      <el-table-column
        slot="mainPictureUrl"
        label="商品图片"
        align="center"
      >
        <template slot-scope="scope">
          <g-thumb :url="scope.row.mainPictureUrl" />
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            size="mini"
            @click="addBtn(scope.row,'add')"
          >报价</el-button>
          <el-button
            v-if="scope.row.status == 2"
            type="text"
            size="mini"
            @click="addBtn(scope.row,'edit')"
          >调价</el-button>
          <el-button
            v-if="scope.row.status == 2"
            type="text"
            size="mini"
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

    <!-- 导入-dialog -->
    <el-dialog
      :visible.sync="uploadVisible"
      :append-to-body="true"
      title="导入商品报价表"
      width="450px"
      top="50px"
      style="overflow:hidden;"
      @close="importClose"
    >
      <div style="height: 246px;">
        <div class="file">
          <el-button
            type="primary"
            size="mini"
            @click.stop="importExc"
          >导入</el-button>
        </div>
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :before-upload="beforeFileUpload"
          :limit="1"
          :multiple="false"
          :http-request="httpRequest"
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

  </basic-container>
</template>

<script>
import { dowloadExc } from '@/util/util'
import { getList, importTable, downloadTemplate } from '@/api/goodsManagement/goodsAuotation.js'
import { supplier, getMyDictBiz } from '@/api/commonApi/common.js'
import goodsAuotationAdd from './components/goodsAuotationAdd.vue'
import goodsAuotationDetail from './components/goodsAuotationDetail.vue'
export default {
  name: 'SupplierGoodsManagementGoodsAuotation',
  data() {
    return {
      loading: false,
      isMain: true,
      // 搜索参数
      submit: {
        supplierId: '',
        goodsCode: '',
        goodsName: '',
        status: ''
      },
      supplierList: [],
      searchData: {},
      statusList: [],
      // 表格数据
      headers: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        {
          slot: true,
          slotName: 'supplierCode'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '商品品牌',
          prop: 'goodsBrand',
          minWidth: '100px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '商品类目',
          prop: 'category',
          showOverflowTooltip: true,
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'mainPictureUrl'
        },
        {
          label: '商品编码',
          prop: 'goodsCode',
          minWidth: '85px',
          align: 'center'
        },
        {
          label: '状态',
          prop: 'statusDesc',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '商品报价',
          prop: 'price',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '币种',
          prop: 'currencyDesc',
          minWidth: '60px',
          align: 'center'
        },
        {
          label: '是否含税',
          prop: 'taxDesc',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          minWidth: '150px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      //   提示弹框的状态
      isShow: false,
      title: '',
      enable: {},
      information: '',
      //   新增，修改
      isOpen: false,
      isAdd: false,
      openData: '',
      uploadVisible: false, // 导入
      //   详情
      detailData: '',
      isDetail: false,
      selectionList: []
    }
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    //   获取数据
    getData() {
      supplier().then(res => {
        if (res.code === 200) {
          const data = res.data
          this.supplierList = data
        } else {
          this.$message.error('加载失败!')
        }
      })
      getMyDictBiz('pss_product_price_status').then(res => {
        if (res.code === 200) {
          const data = res.data
          this.statusList = data
          this.statusList.unshift({ dictKey: '', dictValue: '全部' })
        } else {
          this.$message.error('状态获取失败')
        }
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        res.data.records.forEach(item => {
          if (item.price === -1) {
            item.price = ''
          }
        })
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.submit.supplierId = ''
      this.submit.goodsCode = ''
      this.submit.goodsName = ''
      this.submit.status = ''
      this.selectionList = []
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val1, val2) {
      if (val2 === 'add') {
        this.isAdd = true
      } else if (val2 === 'edit') {
        this.isAdd = false
      }
      this.openData = JSON.parse(JSON.stringify(val1))
      this.$modal({
        path: '/pss/goodsAuotation/' + (this.isAdd ? 'add' : 'edit'),
        title: (this.isAdd ? '报价' : '调价'),
        component: goodsAuotationAdd,
        data: {
          isAdd: this.isAdd,
          define: this.define,
          close: this.close,
          openData: this.openData
        },
        clearCache: true,
        callback: (flag) => {
          if (flag) {
            this.initialization()
          }
        }
      })
    },
    // 关闭
    close() {
      this.openData = ''
      this.isMain = true
      this.isOpen = false
      this.isDetail = false
    },
    selectRow(selection, row) {
      this.selectionList = selection
    },
    selectAll(selection) {
      this.selectionList = selection
    },
    // 导入模板
    downloadTemp() {
      if (this.selectionList.length === 0) {
        this.$message.error('请勾选需导出的数据')
      } else {
        this.$message.success('正在下载，请稍等片刻...')
        const name = '商品报价导入模板.xlsx'
        downloadTemplate(this.selectionList).then(res => {
          if (res.size) {
            dowloadExc(res, name)
            this.reset()
          }
        }).catch(() => {
          this.$message.error('请求异常，导出失败！')
        })
      }
    },
    // 导入，导出
    beforeFileUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let isOk = true
      if (testmsg !== 'xls' && testmsg !== 'xlsx') {
        isOk = false
        this.$message.error('上传文件只能是xls,xlsx格式!')
      }
      return isOk
    },
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
    importExc() {
      this.$refs.uploadRef.submit()
    },
    // 上传
    httpRequest(event) {
      const loading = this.$loading({
        lock: true,
        text: '正在拼了老命的请求中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$message.success('正在上传中，请稍等...')
      importTable({ file: this.file }).then(res => {
        if (res.code === 200) {
          this.$message.success('上传成功')
          this.uploadVisible = false
          this.reset()
        }
        loading.close()
      }).catch(() => {
        loading.close()
        this.$message.error('上传失败')
      })
    },
    // 详情
    detailBtn(val) {
      this.detailData = val
      this.$newTab({
        path: '/pss/goodsAuotation/Detail',
        title: '商品报价详情',
        component: goodsAuotationDetail,
        data: {
          close: this.close,
          detailData: this.detailData
        },
        clearCache: true,
        callback: () => {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btnBox{
    ::v-deep .el-form-item__content{
        margin-left: 20px!important;
    }
    .btn{
        width: 30%;
    }
}
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0;
    }
}
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.tableData {
    margin-top: 15px;
  padding: 0 10px;
  .addBox {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
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
.hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
.status{
    ::v-deep .el-form-item__content{
        width: 60%;
    }
}
</style>
