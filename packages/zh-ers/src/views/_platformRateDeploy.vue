<template>
  <!-- 平台系数汇率配置-->
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
            <el-col :span="18">
              <el-form-item class="btnBox">
                <el-button icon="el-icon-search" type="primary" @click="search()">查询</el-button>
                <el-button icon="el-icon-reset" @click="reset()">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" @click="addBtn()">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 状态 -->
      <el-table-column
        slot="status"
        label="启用状态"
        width="90"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" min-width="130px">
        <template v-slot="scope">
          <el-button type="text" @click="addBtn(scope.row)">编辑</el-button>
          <el-button type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

      <!-- 调整值 -->
      <el-table-column
        slot="perValue"
        label="调整值"
        min-width="120"
      >
        <template v-slot="{row}">
          <span v-if="row.adjStatus === 1">
            <i class="el-icon-top" style="color: #ff0000;font-size: 13px;font-weight:bold;transform: translateY(2px)" />
            {{ row.percentageValue }}
          </span>
          <span v-if="row.adjStatus === 2">
            <i class="el-icon-bottom" style="color: #19BF40;font-size: 13px;font-weight:bold;transform: translateY(2px)" />
            {{ row.percentageValue }}
          </span>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>

</template>

<script>

import { getList, updateStatus } from '@/api/platformRate.js'
import { listPlatForm } from '@/api/commonApi.js'
import platformCostAdd from '@/views/components/platformRateAdd.vue'
import platformCostDetail from '@/views/components/platformRateDetail.vue'
import { deepClone } from '@/util/util'
export default {
  name: 'ErsPlatformRateDeploy',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        platformCode: ''
      },
      platformList: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          label: '平台',
          prop: 'platformName',
          minWidth: '160px'
        },
        {
          label: '调整类型',
          prop: 'adjTypeName',
          minWidth: '160px'
        },
        {
          slot: true,
          slotName: 'perValue'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          width: '110px'
        },
        {
          label: '最后修改时间',
          prop: 'updateTime',
          width: '170px'
        },
        {
          slot: true,
          slotName: 'handler'
        }],
      // 新增，修改
      isAdd: false,
      addData: {
        platformCode: '',
        adjType: '',
        adjStatus: '',
        adjValue: '',
        status: 1
      },
      openData: '',
      //   详情
      detailData: ''
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization()
  },
  methods: {
    //   获取信息
    getData() {
      listPlatForm().then(res => {
        if (res.code === 200) {
          const data = res.data
          this.platformList = data
        } else {
          this.$message.error('状态获取失败')
        }
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
      this.submit.status = ''
      this.searchData = []
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.openData = deepClone(val)
      } else {
        this.isAdd = true
        this.openData = deepClone(this.addData)
      }
      this.$modal({
        title: (this.isAdd ? '新增平台汇率系数配置' : '编辑平台汇率系数配置'),
        component: platformCostAdd,
        width: '521px',
        data: {
          platformList: this.platformList,
          openData: this.openData,
          isAdd: this.isAdd
        },
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 切换状态
    switchStatus(obj) {
      this.$confirm('确定要开启/禁用该条记录吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(obj.id, obj.status).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        }).catch(() => {
          obj.status === 1 ? obj.status = 2 : obj.status = 1
        })
      }).catch(() => {
        obj.status === 1 ? obj.status = 2 : obj.status = 1
      })
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '平台汇率系数配置详情',
        component: platformCostDetail,
        data: {
          detailData: val
        },
        callback: (bool) => {

        }
      })
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
  .el-col {
    margin-bottom: 14px;
  }
  .el-form{
    padding: 10px 10px 0 6px;
  }
  .el-button--text{
    color: #1890ff;
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
          color: #ff0000;
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
