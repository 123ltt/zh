<template>
  <!-- 加权平均汇率-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form size="small">
          <el-row :gutter="18" class="searchBox">
            <el-col :span="6">
              <el-form-item label-width="40px" prop="platformCode" label="平台">
                <el-select v-model="submit.platformCode" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in platformList" :key="item.id" :label="item.platformName" :value="item.platformCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label-width="40px" prop="month" label="月份">
                <el-date-picker v-model="submit.month" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-reset" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="origCurrName" label="原币种" min-width="90">
        <template v-slot="{row}">
          <span>{{ row.origCurrName+row.origCurrCode }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="trgtCurrName" label="目标币" min-width="90">
        <template v-slot="{row}">
          <span>{{ row.trgtCurrName+row.trgtCurrCode }}</span>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>

</template>

<script>

import { getList } from '@/api/weightedPlatformRate.js'
import { listPlatForm } from '@/api/commonApi.js'
import { deepClone } from '@/util/util'

export default {
  name: 'ErsWeightedPlatformRate',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        platformCode: '',
        month: ''
      },
      platformList: [],
      searchData: {},
      // 表格数据
      tableMaxHeight: 'auto',
      // 表格数据
      headers: [
        {
          label: '月份',
          prop: 'month',
          minWidth: '90px'
        },
        { slot: true, slotName: 'origCurrName' },
        { slot: true, slotName: 'trgtCurrName' },
        {
          label: '平台',
          prop: 'platformName',
          minWidth: '100px'
        },
        {
          label: '加权平均汇率',
          prop: 'avgResult',
          minWidth: '80px'
        }],
      tableData: [],
      //   分页参数,
      page: {
        current: 1,
        total: 1,
        size: 10
      },
      title: '',
      enable: {},
      remove: {},
      information: '',
      openData: '',
      //   详情
      detailData: '',
      isDetail: false
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.getPreMounth()
    this.initialization()
  },
  methods: {
    //   获取信息
    getData() {
      listPlatForm().then(res => {
        this.platformList = res.data
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
      this.submit.platformCode = ''
      this.submit.month = ''
      this.searchData = []
      this.initialization()
    },
    // 获取当前时间的上个月
    getPreMounth() {
      const date = new Date()
      let year = date.getFullYear()
      let mounth = date.getMonth()
      if (mounth === 0) {
        mounth = 12
        year--
      } else if (mounth < 10) {
        mounth = `0${mounth}`
      }
      this.searchData.month = this.submit.month = `${year}-${mounth}`
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog--center .el-dialog__body {
    padding: 0;
  }

  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::v-deep input[type="number"] {
    -moz-appearance: textfield;
  }

  .el-select {
    width: 100%
  }

  .el-form{
    padding: 10px 10px;
  }
  .el-date-editor{
    width: 100%;
  }

  ::v-deep .el-input--mini .el-input__inner {
    height: 32px;
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
      text-align: right;
      box-sizing: border-box;
      padding-right: 20px;
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
