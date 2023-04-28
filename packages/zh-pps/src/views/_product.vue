<template>
  <basic-container>
    <!-- 产品成本-->
    <!-- 顶部搜索 -->
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="warehouseId" label="仓库名称:">
                <el-select v-model="submit.warehouseId" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in warehouseList" :key="item.id" :label="item.warehouseName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="productSkuList" label="产品编码:">
                <el-input v-model="submit.productSkuList" style="width:80%" clearable placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="initialization()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
                <el-button type="primary" icon="el-icon-upload2" size="mini" @click="importBtn()">导入</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <el-table-column slot="purCost" label="采购成本" align="center" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.purCost }}{{ scope.row.purCostCurrencyName }}</span>
        </template>
      </el-table-column>

      <el-table-column slot="'packCost" label="包装费" align="center" min-width="90">
        <template slot-scope="scope">
          <span v-if="1==scope.row.packCostType">{{ scope.row.packCost }}{{ scope.row.packCostCurrencyName }}</span>
          <span v-else>{{ scope.row.packCost }}%</span>
        </template>
      </el-table-column>

      <el-table-column slot="'storageCost" label="仓储操作费" align="center" min-width="90">
        <template slot-scope="scope">
          <span v-if="1==scope.row.storageOpType">{{ scope.row.storageCost }}{{ scope.row.storageCostCurrencyName }}</span>
          <span v-else>{{ scope.row.storageCost }}%</span>
        </template>
      </el-table-column>

      <el-table-column slot="status" label="状态" align="center" min-width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-text="开" :active-value="1" :inactive-value="2" inactive-text="关" @change="switchStatus(scope.row)" />
        </template>
      </el-table-column>

      <el-table-column slot="handler" label="操作" align="center" fixed="right" min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailBtn(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="addBtn(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="removeBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </g-table>

    <!-- 导入-dialog -->
    <el-dialog
      :visible.sync="uploadVisible"
      :append-to-body="true"
      title="上传产品成本"
      top="50px"
      width="450px"
      style="overflow:hidden;"
      @close="importClose"
    >
      <div style="height: 246px;width:100%">
        <div class="file">
          <el-button type="primary" size="mini" @click.stop="importExc">导入</el-button>
          <el-button type="primary" class="btn" size="mini" @click="download()">下载模板</el-button>
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
          :accept="acceptType"
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
import { getList, remove, downloadTemplate, importTable, updateStatus } from '@/api/product/productcost.js'
import { getWarehouse, getSkuInfoBySku } from '@/api/commonApi.js'
import productCostAdd from './components/productCost/productCostAdd.vue'
import productCostDetail from './components/productCost/productCostDetail.vue'
import { dowloadExc, debounce } from '@/util/util'
export default {
  name: 'Basic',
  data() {
    return {
      // 搜索参数
      submit: {
        warehouseId: '',
        productSkuList: ''
      },

      // 仓库名称
      warehouseList: [],
      statusList: [],
      currencyList: [],
      costTypeList: [],
      acceptType: "['.xls', '.xlsx']",
      uploadVisible: false, // 导入
      // 表格数据
      headers: [
        {
          label: '仓库名称',
          prop: 'warehouseName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '产品编码',
          prop: 'productSku',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '产品名称',
          prop: 'productName',
          minWidth: '130px',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          label: '产品类目',
          prop: 'categoryName',
          minWidth: '100px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'purCost'
        },
        {
          slot: true,
          slotName: 'packCost'
        },
        {
          slot: true,
          slotName: 'storageCost'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          width: '90px',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }],
      //   提示弹框的状态
      isShow: false,
      title: '',
      enable: {},
      information: '',
      //   新增，修改
      isOpen: false,
      isAdd: false,
      openData: '',
      productName: '',
      categoryName: '',
      addData: {
        // 仓库ID
        warehouseId: '',
        // 产品编码
        productSku: '',
        // 产品名称

        // 采购成本
        purCost: '',
        // 采购币种
        purCostCurrency: '1',
        // 包装费类型
        packCostType: '1',
        // 包装币种
        packCostCurrency: '1',
        // 包装费
        packCost: '',
        // 仓储操作费
        storageCost: '',
        // 仓储操作费币种
        storageOpCurrency: '1',
        // 仓储操作费类型
        storageOpType: '1'

      },
      //   详情
      detailData: '',
      isDetail: false,
      oldValue: ''
    }
  },
  mounted() {
    this.initialization()
  },
  created() {
    this.getData()
  },
  methods: {
    //   获取数据
    getData() {
      getWarehouse().then(res => {
        const data = res.data
        this.warehouseList = data
      }
      )
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1, this.submit)
    },
    //   重置
    reset() {
      this.submit.warehouseId = ''
      this.submit.productSkuList = ''
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
      } else {
        this.isAdd = true
        this.addData.packCost = ''
        this.addData.productSku = ''
        this.addData.purCost = ''
        this.addData.packCost = ''
        this.addData.storageCost = ''
        this.addData.warehouseId = ''
      }
      this.$modal({
        title: (this.isAdd ? '新增产品成本' : '编辑产品成本'),
        component: productCostAdd,
        data: {
          isAdd: this.isAdd,
          openData: (this.isAdd ? this.addData : val),
          warehouseList: this.warehouseList
        },
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 信息确认
    confirm(title, obj, fn) {
      this.$confirm(`确定要${title}该条记录吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn(obj).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        })
      })
    },

    // 删除
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 切换状态
    switchStatus: debounce(function(row) {
      updateStatus(row.id, row.status).then(res => {
        const { code, msg } = res
        code === 200 && this.$message.success(msg)
      })
    }, 500),
    // 详情
    detailBtn(val) {
      this.openData = JSON.parse(JSON.stringify(val))
      this.$newTab({
        title: '产品成本详情',
        component: productCostDetail,
        data: {
          detailData: this.openData
        },
        callback: () => {}
      })
    },
    // 模板下载
    download: debounce(function() {
      downloadTemplate().then(res => {
        const name = '产品成本导入通用模板.xlsx'
        if (res.size) {
          dowloadExc(res, name)
        }
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    }),

    // 导入模板
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
    handleChange(file, fileList) {
      fileList.length = 1
      this.file = file.raw
    },
    toget(val) {
      getSkuInfoBySku(val).then(res => {
        const data = res.data
        if (data) {
          this.flg = true
          this.categoryName = data.categoryName
          this.productName = data.productName
        } else {
          this.flg = false
          this.categoryName = ''
          this.productName = ''
        }
      })
    },

    changePurCost(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.openData.purCost = this.oldValue
      } else {
        this.oldValue = val
      }
    },
    changePackCost(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.openData.packCost = this.oldValue
      } else {
        this.oldValue = val
      }
    },

    changeStorageCost(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.openData.storageCost = this.oldValue
      } else {
        this.oldValue = val
      }
    }

  }
}

</script>

<style lang="scss" scoped>
  ::v-deep {
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }
  ::v-deep input[type="number"]{
    -moz-appearance: textfield;
  }
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
    // margin-top: 10px;
    padding: 0 10px;
    .addBox {
      width: 100%;
      height: 30px;
      margin-bottom: 10px;
    }
  }
  .openBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    translate: all 1s;
    background: rgba($color: #000000, $alpha: 0.5);
    .addBox {
      box-sizing: border-box;
      width: 450px;
      height: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 5px;
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
          i {
            size: 16px;
          }
        }
      }
      .main {
        width: 100%;
        padding-top: 20px;
        ::v-deep .el-select{
          width: 100%;
        }
        ::v-deep .el-form-item__content{
          width: 60%;
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
      }
      .footer {
        text-align: center;
        //   margin-top: 30px;
        padding-bottom: 20px;
      }
    }
  }
</style>
