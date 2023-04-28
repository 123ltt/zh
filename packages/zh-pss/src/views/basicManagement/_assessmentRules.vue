<template>
  <!-- 基础管理/考核规则-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="name" label="规则名称">
                <el-select
                  ref="input"
                  v-model="submit.name"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in rulesName"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态" label-width="50px">
                <el-select
                  ref="input"
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
            <el-col :span="12">
              <el-form-item class="btnBox">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="search()"
                >查询</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addBtn()"
                >新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="nameDictValue" label="规则名称" min-width="90" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" @click="detailBtn(row)">{{ row.nameDictValue }}</g-link>
          <span v-else>{{ row.nameDictValue }}</span>
        </template>
      </el-table-column>

      <!-- 规则类型 -->
      <el-table-column
        slot="type"
        label="规则类型"
        align="center"
        min-width="90"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'plus'">加分项</span>
          <span v-if="scope.row.type == 'minus'">扣分项</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="70" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">草稿</span>
          <span v-if="scope.row.status == 1">启用</span>
          <span v-if="scope.row.status == 2">停用</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="enableBtn(scope.row)"
          >启用</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="addBtn(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="removeBtn(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="addBtn(scope.row)"
          >调整</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="disableBtn(scope.row)"
          >停用</el-button>
          <el-button
            v-if="scope.row.status != 0"
            type="text"
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, update, remove } from '@/api/basicManagement/assessmentRules.js'
import { getMyDictBiz } from '@/api/commonApi/common.js'
import assessDetails from './components/assessDetails.vue'
import assessAdd from './components/assessAdd.vue'

export default {
  name: 'SupplierBasicManagementAssessmentRules',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        name: '',
        status: ''
      },
      statusList: [],
      //   规则名称
      rulesName: [],
      //   规则类型
      rulesType: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'nameDictValue'
        },
        {
          slot: true,
          slotName: 'type'
        },
        {
          label: '规则分值',
          prop: 'score',
          minWidth: '95px',
          align: 'center'
        },
        {
          label: '规则说明',
          prop: 'description',
          minWidth: '200px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
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
      addData: {
        name: '',
        type: '',
        score: '',
        description: ''
      },
      openData: '',
      //   详情
      detailData: '',
      isDetail: false
    }
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    // 获取数据
    getData() {
      getMyDictBiz('pss_eval_rule_name').then(res => {
        this.rulesName = res.data
      })
      getMyDictBiz('pss_common_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      getMyDictBiz('pss_eval_rule_type').then(res => {
        this.rulesType = res.data
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
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.submit.name = ''
      this.submit.status = ''
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.openData = JSON.parse(JSON.stringify(val))
      } else {
        this.isAdd = true
        this.openData = JSON.parse(JSON.stringify(this.addData))
      }
      this.$modal({
        title: (this.isAdd ? '新增考核规则' : '编辑考核规则'),
        component: assessAdd,
        width: '400px',
        data: {
          isAdd: this.isAdd,
          rulesName: this.rulesName,
          rulesType: this.rulesType,
          openData: this.openData
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
        this.rulesName.forEach(item => {
        // eslint-disable-next-line eqeqeq
          if (item.dictKey == this.enable.name) {
            this.enable.nameDictValue = item.dictValue
          }
        })
        fn(obj).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        })
      })
    },
    // 启用
    enableBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.enable.status = 1
      this.confirm('启用', this.enable, update)
    },
    // 删除
    removeBtn(val1) {
      this.confirm('删除', val1.id, remove)
    },
    // 停用
    disableBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.enable.status = 2
      this.confirm('停用', this.enable, update)
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '评级规则详情',
        component: assessDetails,
        data: {
          detailData: val,
          rulesType: this.rulesType
        },
        callback: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
  padding: 0 10px;
  margin-top: 15px;
  .addBox {
    width: 100%;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
    height: 30px;
    margin-bottom: 10px;
  }
}
</style>
