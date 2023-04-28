<template>
  <!-- 访厂管理/访厂记录-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="grade" label="供应商等级">
                <el-select
                  ref="input"
                  v-model="submit.grade"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="(item,index) in gradeList"
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
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button
                  class="btn"
                  size="mini"
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                >搜索</el-button>
                <el-button
                  class="btn"
                  size="mini"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
                <el-button
                  class="btn"
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
      <el-table-column slot="recordCode" label="访厂编号" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status == 1" @click="detailBtn(row)">{{ row.recordCode }}</g-link>
          <span v-else>{{ row.recordCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">草稿</span>
          <span v-if="scope.row.status == 1">已提交</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="enableBtn(scope.row)"
          >提交</el-button>
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
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, getGrade, update, remove } from '@/api/factoryVisitManagement/factoryVisitRecord'
import { getMyDictBiz, supplier } from '@/api/commonApi/common.js'
import visitRecordAdd from './components/visitRecordAdd.vue'
import visitRecordDetails from './components/visitRecordDetails.vue'
export default {
  name: 'SupplierFactoryVisitManagementFactoryVisitRecord',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierId: '',
        grade: '',
        status: ''
      },
      gradeList: [],
      supplierList: [],
      userList: [],
      searchData: {},
      statusList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'recordCode'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          showOverflowTooltip: true,
          minWidth: '170px',
          align: 'center'
        },
        {
          label: '稽核人员',
          prop: 'auditors',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '访厂日期',
          prop: 'visitTime',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '陪同人员',
          prop: 'accompanying',
          minWidth: '160px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '最终得分',
          prop: 'score',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '供应商等级',
          prop: 'grade',
          minWidth: '90px',
          align: 'center'
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
      information: '',
      //   新增，修改
      isAdd: false,
      oldData: {
        supplierId: '',
        visitTime: '',
        score: '',
        grade: '',
        files: [],
        users: []
      },
      addData: '',
      //   详情
      detailData: ''
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
        this.supplierList = res.data
      })
      getGrade().then(res => {
        this.gradeList = res.data
      })
      getMyDictBiz('pss_visit_factory_record_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        const data = JSON.parse(JSON.stringify(res.data.records))
        for (let i = 0; i < res.data.records.length; i++) {
          const arr = []
          res.data.records[i].users.forEach(item => {
            if (item.type === 'auditor') {
              data[i].auditors = item.userRealName
            } else if (item.type === 'entourage') {
              arr.push(item.userRealName)
            }
          })
          data[i].accompanying = arr.join(',')
        }
        return {
          records: data, // 列表数据
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
      this.submit.grade = ''
      this.submit.status = ''
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.addData = JSON.parse(JSON.stringify(val))
      } else {
        this.isAdd = true
        this.addData = JSON.parse(JSON.stringify(this.oldData))
      }
      this.$newTab({
        path: '/pss/factoryVisitRecord/' + (this.isAdd ? 'add' : 'edit'),
        title: (this.isAdd ? '新增' : '编辑'),
        component: visitRecordAdd,
        data: {
          isAdd: this.isAdd,
          addData: this.addData
        },
        clearCache: true,
        callback: (flg) => {
          if (flg) {
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
      this.confirm('提交', this.enable, update)
    },
    // 删除
    removeBtn(val1) {
      this.confirm('删除', val1.id, remove)
    },
    // 详情
    detailBtn(val) {
      this.detailData = val
      this.$newTab({
        path: '/pss/factoryVisitRecord/Detail',
        title: '访厂记录详情',
        component: visitRecordDetails,
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
::v-deep .el-dialog--center .el-dialog__body{
    padding: 0;
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
</style>
