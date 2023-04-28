<template>
  <!-- 币种维护-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form size="small">
          <el-row :gutter="18" class="searchBox">
            <el-col :span="6">
              <el-form-item label-width="60px" prop="warehouseId" label="币种名称">
                <el-select v-model="submit.currName" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in currencyList" :key="item.currCode" :label="item.currName" :value="item.currName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="60px" prop="warehouseId" label="币种代码">
                <el-select v-model="submit.currCode" clearable placeholder="请选择" style="width: 100%" filterable>
                  <el-option v-for="item in currencyList" :key="item.currCode" :label="item.currCode" :value="item.currCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" size="small" @click="search()">查询</el-button>
                <el-button size="small" icon="el-icon-reset" @click="reset()">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="small" @click="addBtn()">新增</el-button>
                <el-button type="primary" icon="el-icon-upload2" plain size="small" @click="importBtn()">导入</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" min-width="90">
        <template v-slot="scope">
          <el-button type="text" @click="editBtn(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </g-table>

    <!-- 导入-dialog -->
    <el-dialog
      :visible.sync="uploadVisible"
      :append-to-body="true"
      title="上传币种"
      top="50px"
      width="400px"
      style="overflow:hidden;"
      @close="importClose"
    >
      <div style="height: 246px;width:100%">
        <div class="file">
          <el-button type="primary" size="mini" @click.stop="importExc">导入</el-button>
          <el-button type="primary" class="btn" size="small" @click="download()">下载模板</el-button>
        </div>
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :before-upload="beforeFileUpload"
          :limit="1"
          width="100%"
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
import { getList, importTable, downloadTemplate } from '@/api/currency.js'
import { getCurrencyList } from '@/api/commonApi.js'
import currencyAdd from '@/views/components/currencyAdd.vue'
import currencyEdit from '@/views/components/currencyEdit.vue'
import { dowloadExc, debounce, deepClone } from '@/util/util'

export default {
  name: 'ErsCurrency',
  data() {
    return {
      // 搜索参数
      submit: {
        currName: '',
        currCode: ''
      },
      searchData: [],
      // 币种
      currencyList: [],
      acceptType: "['.xls', '.xlsx']",
      uploadVisible: false, // 导入
      // 表格数据
      loading: false,
      // //   提示弹框的状态
      // isShow: false,
      title: '',
      enable: {},
      information: '',
      //   新增，修改
      isOpen: false,
      isAdd: false,
      addData: {
        currName: '',
        currCode: ''
      },
      openData: '',
      isDetail: false,
      // 表格数据
      headers: [
        {
          label: '币种名称',
          prop: 'currName',
          minWidth: '130px'
        },
        {
          label: '币种代码',
          prop: 'currCode',
          minWidth: '130px'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: '130px'
        },
        {
          label: '创建时间',
          prop: 'updateTime',
          minWidth: '130px'
        },
        {
          slot: true,
          slotName: 'handler'
        }]
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
      getCurrencyList().then(res => {
        this.currencyList = res.data
      })
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
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.searchData = deepClone(this.submit)
      this.initialization()
    },
    //   重置
    reset() {
      this.submit.currName = ''
      this.submit.currCode = ''
      this.searchData = []
      this.initialization()
    },
    // 新增
    addBtn() {
      this.$modal({
        title: ('新增币种'),
        component: currencyAdd,
        width: '916px',
        data: {},
        callback: (bool) => {
          if (bool) this.reset()
        }
      })
    },
    // 编辑
    editBtn(val) {
      this.openData = deepClone(val)
      this.$modal({
        title: '编辑币种',
        component: currencyEdit,
        width: '385px',
        data: {
          openData: this.openData
        },
        callback: (bool) => {
          if (bool) this.initialization()
        }
      })
    },
    // 模板下载
    download: debounce(function() {
      downloadTemplate().then(res => {
        const name = '币种导入通用模板.xlsx'
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
        text: '请求中...',
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
    }
  }
}

</script>

<style lang="scss" scoped>
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::v-deep input[type="number"] {
    -moz-appearance: textfield;
  }
.el-col{
  margin: 0;
  padding-bottom: 14px;
}
.el-select {
  width: 100%;
}
// ::v-deep .el-input--mini .el-input__inner {
//   height: 32px;
// }
// .el-button--mini {
//   height: 32px;
// }
.el-form-item__content{
  height: 32px !important;
}
.el-form{
  padding: 10px 10px 0 6px;
}
.el-button--text{
  color: #1890ff;
}
  .btnBox {
    // ::v-deep .el-form-item__content {
    //   margin-left: 20px !important;
    // }

    .btn {
      width: 30%;
    }
  }
 ::v-deep .el-dialog__body{
   padding-top: 0;
   .file{
     margin-bottom: 10px;
   }
 }

  .searchBox {
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }

</style>
