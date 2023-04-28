<template>
  <!-- 质检不合格-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="120px" size="mini" class="searchBox">
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item>
                <span slot="label">物流运单号</span>
                <el-input v-model="submit.logisticsWaybillNumber" placeholder="请填写" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item>
                <span slot="label">采购编码</span>
                <el-input v-model="submit.purchaseCode" placeholder="请填写" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="status" label="状态">
                <el-select ref="input" v-model="submit.status" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" @click="search()">查询</el-button>
              <el-button size="mini" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="wmsAbnormalCode" label="不良编码" min-width="150" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 1" @click="detailBtn(row)">{{ row.wmsAbnormalCode }}</g-link>
          <span v-else>{{ row.wmsAbnormalCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">待处理</span>
          <span v-if="scope.row.status == 2">待退货</span>
          <span v-if="scope.row.status == 3">已退货</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" width="90">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="text" @click="addBox(scope.row)">处理</el-button>
          <el-button v-if="scope.row.status != 1" type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>

import exceptionDetail from './components/exceptionDetail.vue'
import addBox from './components/exceptionEdit.vue'
import { getList } from '@/api/exceptionManagement/exceptionManagement.js'
import { getDictBiz } from '@/api/commonApi/common'
export default {
  name: 'SupplierExceptionManagementCheckUnqualified',
  data() {
    return {
      // 搜索参数
      submit: {
        logisticsWaybillNumber: '',
        purchaseCode: '',
        status: ''
      },
      //   状态
      statusList: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'wmsAbnormalCode'
        },
        {
          label: '物流运单号',
          prop: 'logisticsWaybillNumber',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '采购编码',
          prop: 'purchaseCode',
          width: '130px',
          align: 'center'
        },
        {
          label: '采购数量',
          prop: 'purchaseNumber',
          width: '80px',
          align: 'center'
        },
        {
          label: '发货人',
          prop: 'consignor',
          width: '90px',
          align: 'center'
        },
        {
          label: '发货数量',
          prop: 'deliveryNumber',
          width: '80px',
          align: 'center'
        },
        {
          label: '不良数量',
          prop: 'abnormalNumber',
          width: '80px',
          align: 'center'
        },
        {
          label: '质检人',
          prop: 'qualityInspector',
          width: '90px',
          align: 'center'
        },
        {
          label: '质检时间',
          prop: 'inspectTime',
          width: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      id: '',
      isAdd: false,
      title: '',
      enable: {},
      information: '',
      addData: {
        name: '',
        type: '',
        score: '',
        description: ''
      },
      openData: '',
      //   详情
      detailData: '',
      isDetail: false,
      tableMaxHeight: 'auto'
    }
  },
  mounted() {
    this.initialization()
    this.getStatus()
  },
  methods: {
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        res.data.records.forEach(item => {
          if (item.abnormalNumber === -1) {
            item.abnormalNumber = ''
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
    getStatus() {
      getDictBiz('pss_abnormal_status').then(res => {
        this.statusList = res.data
      })
    },

    // 新增处理操作
    addBox(val) {
      this.$newTab({
        path: '/pss/checkUnqualified/dealWith',
        title: '处理质检不合格',
        component: addBox,
        data: {
          id: val.id
        },
        clearCache: true,
        callback: (flg) => {
          if (flg) this.initialization()
        }
      })
    },
    // 关闭
    close() {
      this.isDetail = false
    },
    //   重置
    reset() {
      this.submit.logisticsWaybillNumber = ''
      this.submit.purchaseCode = ''
      this.submit.status = ''
      this.searchData = {}
      this.initialization()
    },
    // 详情
    detailBtn(val) {
      this.detailData = JSON.parse(JSON.stringify(val))
      this.$newTab({
        path: '/pss/checkUnqualified/detail',
        title: '质检不合格详情',
        component: exceptionDetail,
        data: {
          id: val.id,
          close: this.close,
          openData: this.detailData
        },
        clearCache: true,
        callback: (flg) => {
          if (flg) this.initialization()
        }
      })
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
.btnBox {
  ::v-deep .el-form-item__content {
    margin-left: 20px !important;
  }
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
  // margin-top: 15px;
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
    }
    .footer {
      text-align: center;
      //   margin-top: 30px;
      padding-bottom: 20px;
    }
  }
}
</style>
