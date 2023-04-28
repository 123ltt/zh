<template>
  <!-- 浮动汇率-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form size="small">
          <el-row :gutter="18" class="searchBox">
            <el-col :span="6">
              <el-form-item label-width="50px" prop="warehouseId" label="原币种">
                <el-select v-model="submit.origCurrCode" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in currencyList"
                             :key="item.currCode"
                             :label="item.currName+item.currCode"
                             :value="item.currCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-reset" @click="reset()">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" @click="addBtn()">新增</el-button>
                <el-button type="primary" plain icon="el-icon-upload2" @click="importBtn()">导入</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right">
        <template v-slot="scope">
          <el-button v-if="scope.row.status === 2" type="text" @click="addBtn(scope.row, false)">编辑</el-button>
          <el-button v-if="scope.row.status === 1" type="text" @click="addBtn(scope.row, true)">调整</el-button>
          <el-button type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="origCurrName" label="原币种" min-width="100">
        <template v-slot="{row}">
          <span>{{ row.origCurrName+row.origCurrCode }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="trgtCurrName" label="目标币" min-width="100">
        <template v-slot="{row}">
          <span>{{ row.trgtCurrName+row.trgtCurrCode }}</span>
        </template>
      </el-table-column>
      <!-- 涨跌 -->
      <el-table-column slot="upDownFlag" label="涨跌" min-width="100">
        <template v-slot="{row}">
          <span v-if="row.upDown > 0">
            <i class="el-icon-top" style="color: red;font-size: 13px;font-weight:bold;transform: translateY(2px)" />
            {{ row.upDown }}
          </span>
          <span v-if="row.upDown < 0">
            <i class="el-icon-bottom" style="color: #19BF40;font-size: 13px;font-weight:bold;transform: translateY(2px)" />
            {{ row.upDown }}
          </span>
          <span v-if="row.upDown == 0 ">
            0
          </span>
        </template>
      </el-table-column>

    </g-table>

    <!-- 导入-dialog -->
    <el-dialog
      :visible.sync="uploadVisible"
      :append-to-body="true"
      title="上传浮动汇率"
      top="50px"
      width="450px"
      style="overflow:hidden;"
      @close="importClose"
    >
      <div style="height: 246px;width:100%">
        <div class="file">
          <el-button type="primary" size="small" @click.stop="importExc">导入</el-button>
          <el-button type="primary" class="btn" size="small" @click="download()">下载模板</el-button>
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
import { getList, importTable, downloadTemplate } from '@/api/floatRate.js'
import { getCurrencyList, getMyDictBiz } from '@/api/commonApi.js'
import floatRateDetails from '@/views/components/floatRateDetails.vue'
import floatRateAdd from '@/views/components/floatRateAdd.vue'
import { dowloadExc, debounce, deepClone } from '@/util/util'

export default {
  name: 'ErsFloatRate',
  data() {
    return {
      // 搜索参数
      submit: {
        origCurrCode: ''
      },
      searchData: [],
      // 币种
      currencyList: [],
      effectiveTypeList: [],
      acceptType: "['.xls', '.xlsx']",
      uploadVisible: false, // 导入
      addData: {
        origCurrCode: '',
        trgtCurrCode: '',
        latestRate: '',
        effectiveType: '',
        effectiveDate: ''
      },
      isDetail: false,
      // oldValue: '',
      // 表格数据
      headers: [
        { slot: true, slotName: 'origCurrName' },
        { slot: true, slotName: 'trgtCurrName' },
        {
          label: '最新汇率',
          prop: 'latestRate',
          width: '110px'
        },
        {
          slot: true,
          slotName: 'upDownFlag'
        },
        {
          label: '生效时间',
          prop: 'effectiveDate',
          width: '130px'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          width: '110px'
        },
        {
          label: '最近修改时间',
          prop: 'updateTime',
          width: '150px'
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
      getMyDictBiz('float_effective_type').then(res => {
        this.effectiveTypeList = res.data
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
      this.submit.origCurrCode = ''
      this.searchData = []
      this.initialization()
    },
    // 新增
    addBtn(val, val2) {
      this.isOpen = true
      if (val) {
        if (val2) {
          this.isAdjust = true
        } else {
          this.isAdjust = false
        }
        this.isAdd = false
        this.openData = deepClone(val)
      } else {
        this.isAdd = true
        this.openData = deepClone(this.addData)
      }
      this.$modal({
        title: (this.isAdd ? '新增浮动汇率' : this.isAdjust ? '调整浮动汇率' : '编辑浮动汇率'),
        component: floatRateAdd,
        data: {
          openData: this.isAdd ? this.openData : val,
          isAdd: this.isAdd,
          isAdjust: this.isAdjust,
          currencyList: this.currencyList,
          effectiveTypeList: this.effectiveTypeList
        },
        width: '698px',
        callback: (flag) => {
          flag ? this.reset() : this.initialization()
        }
      })
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '浮动汇率详情',
        component: floatRateDetails,
        data: {
          detailData: val
        },
        callback: () => {
        }
      })
    },
    // 模板下载
    download: debounce(function() {
      downloadTemplate().then(res => {
        const name = '浮动汇率导入通用模板.xlsx'
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
  .el-select {
    width: 100%
  }
  .el-col {
    margin-bottom: 14px;
  }
  .el-form{
    padding: 10px 10px 0 6px;
  }
  .btn-default{
    width: 60px;
  }
  .el-button--text{
    color: #1890ff;
  }
  ::v-deep input[type="number"] {
    -moz-appearance: textfield;
  }

  .btnBox {
    // ::v-deep .el-form-item__content {
    //   margin-left: 20px !important;
    // }

    .btn {
      width: 30%;
    }
  }

  .searchBox {
    ::v-deep .el-form-item {
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

        ::v-deep .el-select {
          width: 100%;
        }

        ::v-deep .el-form-item__content {
          width: 60%;

          ::v-deep .el-input-group__prepend {
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
