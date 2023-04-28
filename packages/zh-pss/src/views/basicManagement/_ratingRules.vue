<template>
  <!-- 基础管理/评级规则-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="status" label="等级名称">
                <el-select
                  ref="input"
                  v-model="submit.name"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="(item,index) in nameList"
                    :key="index"
                    :label="item"
                    :value="item"
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
              <el-form-item>
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
      <el-table-column slot="gradeCode" label="等级编码" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status == 1" @click="detailBtn(row)">{{ row.gradeCode }}</g-link>
          <span v-else>{{ row.gradeCode }}</span>
        </template>
      </el-table-column>

      <!-- 分值区间 -->
      <el-table-column slot="score" label="分值区间" align="center" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.beginScore }} ~ {{ scope.row.endScore }} </span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">草稿</span>
          <span v-if="scope.row.status == 1">启用</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="enableBtn(scope.row)">启用</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="addBtn(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="removeBtn(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="addBtn(scope.row)">调整</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, update, remove, getGrade } from '@/api/basicManagement/ratingRules.js'
import { getMyDictBiz } from '@/api/commonApi/common.js'
import ratingDetails from './components/ratingDetails.vue'
import ratingAdd from './components/ratingAdd.vue'

export default {
  name: 'SupplierBasicManagementRatingRules',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        name: '',
        status: ''
      },
      nameList: [],
      searchData: {},
      statusList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'gradeCode'
        },
        {
          label: '等级名称',
          prop: 'name',
          minWidth: '95px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'score'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '110px',
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
      remove: {},
      information: '',
      // 新增，修改
      isOpen: false,
      isAdd: false,
      addData: {
        name: '',
        beginScore: '',
        endScore: '',
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
    //   获取信息
    getData() {
      getMyDictBiz('pss_grade_rule_status').then(res => {
        if (res.code === 200) {
          const data = res.data
          this.statusList = data
          this.statusList.unshift({ dictKey: '', dictValue: '全部' })
        } else {
          this.$message.error('状态获取失败')
        }
      })
      getGrade().then(res => {
        if (res.code === 200) {
          const data = res.data
          this.nameList = data
        } else {
          this.$message.error('等级获取失败')
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
      this.isOpen = true
      if (val) {
        this.isAdd = false
        this.openData = JSON.parse(JSON.stringify(val))
      } else {
        this.isAdd = true
        this.openData = JSON.parse(JSON.stringify(this.addData))
      }
      this.$modal({
        title: (this.isAdd ? '新增评级规则' : '编辑评级规则'),
        component: ratingAdd,
        width: '400px',
        data: {
          isAdd: this.isAdd,
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
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '评级规则详情',
        component: ratingDetails,
        data: {
          detailData: val
        },
        callback: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0;
    }
}
.btnBox{
    ::v-deep .el-form-item__content{
        margin-left: 20px!important;
    }
    .btn{
        width: 30%;
    }
}
</style>
