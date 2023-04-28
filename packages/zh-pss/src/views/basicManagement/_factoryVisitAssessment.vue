<template>
  <!-- 基础管理/访厂考核项-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="evalType" label="考核项类型">
                <el-select
                  ref="input"
                  v-model="submit.evalType"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in classified"
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
      <el-table-column slot="contentCode" label="考核项编码" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" @click="detailBtn(row)">{{ row.contentCode }}</g-link>
          <span v-else>{{ row.contentCode }}</span>
        </template>
      </el-table-column>

      <!-- 评审内容 -->
      <el-table-column
        slot="evalContent"
        label="评审内容"
        align="center"
        min-width="200"
      >
        <template slot-scope="scope">
          <g-text-ellipsis lines="2">
            {{ scope.row.evalContent }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="80" align="center">
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

    <!-- 新增弹框 -->
    <addBox
      v-if="isAdd"
      :is-edit="isEdit"
      :close="close"
      :classified="classified"
      :define="define"
      :open-data="openData"
    />
    <addNext
      v-if="isaddNext"
      :close="close"
      :is-edit="isEdit"
      :nextdefine="nextdefine"
      :open-data="openData"
      @toVal="toVal"
    />

  </basic-container>
</template>

<script>
import addBox from './components/factoryAdd.vue'
import factoryDetail from './components/factoryDetails.vue'
import addNext from './components//addNext.vue'
import { getList, remove, confirm, save, update } from '@/api/basicManagement/factoryVisitAssessment.js'
import { getMyDictBiz } from '@/api/commonApi/common.js'
import { debounce } from '@/util/util'
export default {
  name: 'Assessment',
  components: { addBox, addNext },
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        evalType: '',
        status: ''
      },
      classified: [],
      searchData: {},
      statusList: [],
      //   表格
      headers: [
        {
          slot: true,
          slotName: 'contentCode'
        },
        {
          label: '考核项类型',
          prop: 'evalTypeDictValue',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '考核项序号',
          prop: 'evalNo',
          minWidth: '100px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'evalContent'
        },
        {
          label: '内容序号',
          prop: 'contentNo',
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
      //   新增
      isAdd: false,
      isEdit: false,
      addData: {
        evalNo: '',
        evalType: '',
        contentNo: '',
        evalContent: ''
      },
      openData: {},
      nextData: {},
      isaddNext: false,
      reviewData: {},
      isDetail: false
    }
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    // 获取考核项归类
    getData() {
      getMyDictBiz('pss_factory_eval_type').then(res => {
        if (res.code === 200) {
          const data = res.data
          this.classified = data
        } else {
          this.$message.error('规则名称获取失败')
        }
      })
      getMyDictBiz('pss_common_status').then(res => {
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
      this.submit.evalType = ''
      this.submit.status = ''
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val) {
      this.isAdd = true
      if (val) {
        this.isEdit = true
        this.openData = JSON.parse(JSON.stringify(val))
      } else {
        this.isEdit = false
        this.openData = JSON.parse(JSON.stringify(this.addData))
      }
    },
    // 确认新增基本信息
    define: debounce(function() {
      if (this.isEdit) {
        update(this.openData).then(() => {
          this.isaddNext = true
          this.isAdd = false
        })
      } else {
        save(this.openData).then((res) => {
          if (res.code === 200) {
            this.openData.id = res.data.id
            this.isaddNext = true
            this.isAdd = false
          }
        })
      }
    }),
    toVal(val) {
      this.nextData = val
    },
    nextdefine() {
      confirm(this.nextData).then(() => {
        if (this.isEdit) {
          this.initialization()
        } else {
          this.reset()
        }
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.close()
      })
    },
    // 关闭
    close() {
      this.openData = {}
      this.isAdd = false
      this.isEdit = false
      this.isDetail = false
      this.nextData = {}
      this.isaddNext = false
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
    enableBtn(val1, val2) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.enable.status = 1
      this.confirm('启用', this.enable, update)
    },
    // 删除
    removeBtn(val1, val2) {
      this.confirm('删除', val1.id, remove)
    },
    // 停用
    disableBtn(val1, val2) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.enable.status = 2
      this.confirm('停用', this.enable, update)
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '访厂考核项详情',
        component: factoryDetail,
        data: {
          detailData: val,
          classified: this.classified
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
    height: 30px;
    margin-bottom: 10px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
  }
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
</style>
