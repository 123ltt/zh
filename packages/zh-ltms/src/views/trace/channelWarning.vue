<template>
  <basic-container>
    <el-form ref="formRef" :model="form" size="mini" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="物流商" prop="diId">
            <el-select
              v-model="form.diId"
              filterable
              clearable
              placeholder="请选择物流商"
              style="width:100%;"
            >
              <el-option
                v-for="item in logisticsList"
                :key="item.id"
                :label="item.lpAbbreviation"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发货方式" prop="dgId">
            <el-select
              v-model="form.dgId"
              filterable
              clearable
              placeholder="请选择发货方式"
              style="width:100%;"
            >
              <el-option
                v-for="item in deliveryList"
                :key="item.exWarehouseLpId"
                :label="item.deliveryGroupName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查 询</el-button>
            <el-button type="primary" @click="onReset">重 置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-btp
      v-loading="loading"
      :buttons="buttons"
      :data="tableData"
      :columns="columns"
      :defaultcolumnconfig="defaultColumnConfig"
      :max-height="maxHeight"
      :haspage="true"
      :page="page"
      border
      stripe
      class="mainTable"
    />
    <el-dialog
      :visible.sync="isShowDialog"
      :append-to-body="true"
      :title="dialogTitle"
      width="60vw"
      top="40px"
      @close="dialogClose"
    >
      <div class="scrollDiv">
        <el-form
          ref="formRef"
          :rules="rules"
          :inline="true"
          :model="form"
          size="mini"
        >
          <el-form-item label="物 流 商：" prop="diId">
            <el-select
              v-model="form.diId"
              :disabled="isSelect"
              filterable
              clearable
              placeholder="请选择物流商"
            >
              <el-option
                v-for="item in logisticsList"
                :key="item.id"
                :label="item.lpAbbreviation"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发货方式：" prop="dgId">
            <el-select
              v-model="form.dgId"
              :multiple="isMultiple"
              :disabled="isSelect"
              class="dgIdSelect"
              max-height="50px"
              filterable
              clearable
              collapse-tags
              placeholder="请选择发货方式"
            >
              <!-- @change="fahuo" -->
              <el-option
                v-for="item in deliveryList"
                :key="item.exWarehouseLpId"
                :label="item.deliveryGroupName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px;">匹配关键词</div>
        <el-btp
          :data="dialogTable"
          :defaultcolumnconfig="defaultColumnConfig"
          :columns="dialogCoulumn"
          size="mini"
          border
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"
                   size="mini"
                   @click="isShowDialog = false"
        >取 消</el-button>
        <el-button type="primary" size="mini" @click="update">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>
<script>
import { debounce, deepClone, getMaxTableHei } from '@/util/util'
import {
  getList,
  update,
  getListTimeNode,
  updateStatus
} from '@/api/trace/deliveryWarning'
// import { getTraceCodeList } from '@/api/trace/findTrajectory'
// import { } from '@/util/util'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'TraceDeliveryWarning',
  data() {
    return {
      id: '', // 修改的id
      isMultiple: false, // 是否可用多选
      listTimeNode: [], // 时间节点
      // 弹窗下拉选框是否可用
      isSelect: false,
      // 轨迹状态列表
      // traceCodeList: [],
      // 弹窗表格数据
      dialogTable: [],
      dialogCoulumn: [
        {
          type: 'index',
          width: 60,
          renderH: (h, scope) => {
            return (
              <el-button
                type='primary'
                icon='el-icon-plus'
                size='mini'
                circle
                onClick={() => {
                  this.$nextTick(() => {
                    this.dialogTable.push({ traceCode: undefined, keyWord: undefined, timeNode: undefined, threshold: undefined })
                  })
                }}
              />)
          }
        },
        {
          prop: 'status',
          'min-width': '180',
          renderH() {
            return <span><span style='color:red;'>* </span>轨迹状态</span>
          },
          // 'render-header': (h, { column, $index }) => {
          //   return <span><span style='color:red;'>* </span>轨迹状态</span>
          // },
          renderC: (h, scope) => {
            const list = deepClone(this.traceCodeList)
            for (let i = 0; i < list.length; i++) {
              if (list[i].traceCode === 107 && list[i].traceDesc === '退件') {
                list.splice(i, 1)
                break
              }
            }
            return (
              <el-select value={scope.row.traceCode}
                onInput={val => (scope.row.traceCode = val)}
                size='mini'>
                {
                  list.map(item => {
                    return <el-option key={item.traceCode} label={item.traceDesc} value={item.traceCode}/>
                  })
                }
              </el-select>
            )
          }
        },
        {
          prop: 'keyWord',
          'min-width': 160,
          // renderH(h, scope) {
          //   return <span><span style='color:red;'>* </span>关键词</span>
          // },
          'render-header': (h, { column, $index }) => {
            return <span><span style='color:red;'>* </span>关键词</span>
          },
          renderC: (h, scope) => {
            return (
              <el-input
                type='textarea'
                size='mini'
                rows={1}
                value={scope.row.keyWord}
                onInput={val => (scope.row.keyWord = val)}
                placeholder='多个词用英文分号隔开'
              />
            )
          }
        },
        {
          prop: 'timeNode',
          label: '时间节点',
          width: '160',
          renderC: (h, scope) => {
            const list = deepClone(this.listTimeNode)
            return (
              <el-select value={scope.row.timeNode}
                onInput={val => (scope.row.timeNode = val)} size='mini' filterable>
                {
                  list.map(item => {
                    return <el-option key={item.timeNode} label={item.timeNodeDesc} value={item.timeNode}/>
                  })
                }
              </el-select>
            )
          }
        },
        {
          prop: 'threshold',
          label: '时间阀值（天）',
          width: '160',
          renderC: (h, scope) => {
            return (
              <el-input
                size='mini'
                value={scope.row.threshold}
                onInput={val => (scope.row.threshold = val)}
                placeholder='请输入时间阀值'
              />
            )
          }
        },
        {
          label: '操作',
          width: '60',
          renderC: (h, scope) => {
            return (
              <el-button
                type='danger'
                icon='el-icon-delete'
                size='mini'
                style='margin: 4px 0;'
                circle
                onClick={() => this.delRow(scope.row, scope.$index)}
              />
            )
          }
        }
      ],
      dialogTitle: '新 增',
      isShowDialog: false, // 新增和编辑的弹框
      form: {
        diId: '', // 物流商 id
        dgId: '' // 发货方式 id
      },
      lastForm: {
        // 上一次搜索的条件
        diId: '',
        dgId: ''
      },
      deliveryList: [], // 发货方式
      maxHeight: 'atuo',
      buttons: [
        {
          type: 'primary',
          icon: 'el-icon-plus',
          size: 'mini',
          text: '新增',
          click: this.addBtn
        }
      ],
      loading: false, // 表格数据请求中
      tableData: [], // 表格数据
      defaultColumnConfig: {
        align: 'center'
      },
      columns: [
        {
          label: '序号',
          width: '60',
          type: 'index'
        },
        {
          prop: 'diId',
          label: '物流商',
          minWidth: '180',
          fixed: 'right',
          formatter: this.formatterLogistics
        },
        {
          prop: 'shipId',
          label: '发货方式',
          minWidth: '180',
          fixed: 'right',
          formatter: this.formatterDelivery
        },
        {
          prop: 'createTime',
          label: '匹配关键词',
          minWidth: '200',
          fixed: 'right',
          renderC(h, scope) {
            const details = JSON.parse(JSON.stringify(scope.row.details))
            return (
              <div>
                {details.map((item, index) => {
                  return (
                    <span key={index} class='spanBlock'>
                      <span>{item.traceName}：</span>
                      {item.keyWord}
                    </span>
                  )
                })}
              </div>
            )
          }
        },
        {
          prop: 'status',
          label: '启用状态',
          fixed: 'right',
          renderC: (h, scope) => {
            return (
              <el-switch
                value={scope.row.status}
                on-input={val => {
                  scope.row.status = val
                }}
                disabled={!this.permission.delivery_warning_edit}
                active-value={1}
                inactive-value={0}
                active-text='开'
                inactive-text='关'
                onChange={() => this.switchStatus(scope.row)}
              />
            )
          }
        },
        {
          hidden: false,
          label: '操作',
          width: '120',
          fixed: 'right',
          renderC: (h, scope) => (
            <el-button type='text' onClick={() => this.editBtn(scope.row)}>
        编 辑
            </el-button>
          )
        }
      ],
      page: {
        // 分页
        'page-sizes': [10, 40, 50, 80],
        'page-size': 10,
        'current-page': 1,
        total: 0,
        'size-change': this.sizeChange,
        'current-change': this.currentChange
      },
      rules: {
        diId: [{ required: true, message: '请选择物流商', trigger: 'change' }],
        dgId: [{ required: true, message: '请选择发货方式', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      logisticsList: state => state.trace.logisticsList,
      traceCodeList: state => state.trace.traceCodeList
    }),
    ...mapGetters(['permission'])
  },
  watch: {
    'form.diId'(newVal, oldVal) {
      this.form.dgId = ''
      if (newVal === '') {
        this.deliveryList = []
      } else if (newVal !== oldVal) {
        this.deliveryList = this.getListOrData(newVal)
      }
    }
  },

  created() {
    this.queryTableData()
    this.getListTimeNode()
    this.buttons[0].disabled = !this.permission.delivery_warning_add
    this.columns[4].hidden = !this.permission.delivery_warning_edit
  },
  mounted() {
    // this.getTraceCodeList()
    const tableMaxHeight = getMaxTableHei(this, [], 274)
    this.$nextTick(() => {
      // this.deliveryList = this.logisticsList
      this.maxHeight = tableMaxHeight
    })
  },
  methods: {
    // diId物流商ID、flag：true返回物流商名称；false返回发货方式列表
    getListOrData(diId, flag = false) {
      const list = this.logisticsList
      if (list.length) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.id === diId) {
            if (flag) return item.lpAbbreviation
            return item.groups
          }
        }
      }
    },
    // 格式化物流商
    formatterLogistics(row, column, cellValue, index) {
      return this.getListOrData(cellValue, true)
    },
    // 格式化发货方式
    formatterDelivery(row, column, cellValue, index) {
      const deliveryList = this.getListOrData(row.diId) || []
      if (!deliveryList.length) return cellValue
      for (let i = 0; i < deliveryList.length; i++) {
        const delivery = deliveryList[i]
        if (delivery.id === cellValue) {
          // console.log('%cdelivery: ', 'color:green;font-size:16px;', cellValue, delivery)
          return delivery.deliveryGroupName
        }
      }
    },
    // 获取时间节点
    getListTimeNode() {
      getListTimeNode().then(res => {
        const { code, data } = res
        if (code === 200) {
          this.listTimeNode = data
        }
      })
    },
    onSubmit: debounce(function() {
      this.page.currentPage = 1
      this.queryTableData(true)
    }, 1000, true),
    dialogClose() {
      this.isMultiple = false
      this.dialogTable = []
      this.onReset()
    },
    onReset() {
      this.form.diId = ''
      this.form.dgId = ''
      this.id = ''
    },
    addTabelData() {
      // const { diId } = this.form
      let { dgId: shipId } = this.form
      if (!Array.isArray(shipId)) {
        shipId = [this.form.dgId]
      }
      const details = this.dialogTable
      // console.log('%cdetails: ', 'color:red;font-size:16px;;', details)
      if (!details.length) {
        this.$message.error('请先添加配置项！')
        return
      }
      for (let i = 0; i < details.length; i++) {
        if (!details[i].keyWord || !details[i].traceCode) {
          this.$message.error('轨迹状态和关键词不允许为空！')
          return
        }
      }
      const data = {
        diId: this.form.diId,
        shipId,
        details
      }
      if (this.id) data.id = this.id
      update(JSON.stringify(data)).then(res => {
        this.$message.success('成功')
        this.isShowDialog = false
        // this.onReset()
        // console.log('%cadd-res: ', 'color:green;font-size:16px;', res)
        this.queryTableData()
      })
    },
    // 搜索表格数据
    queryTableData(isSearchForm) {
      const { diId, dgId: shipId } = this.form
      isSearchForm && (this.lastForm = { diId, shipId })
      this.loading = true //  diId, shipId, current, size
      const { 'current-page': current, 'page-size': size } = this.page
      // if (!this.traceCodeList.length) this.getTraceCodeList()
      getList({ current, size, ...this.lastForm })
        .then(res => {
          // console.log('%cres: ', 'color:green;font-size:16px;', res.data)
          const list = this.traceCodeList
          const { records, total } = res // traceCode
          records.forEach(record => {
            record.details.forEach(detail => {
              for (let i = 0; i < list.length; i++) {
                if (detail.traceCode === list[i].traceCode) {
                  detail.traceName = list[i].traceDesc
                  break
                }
              }
            })
          })
          this.page.total = total
          this.tableData = records
        })
        .finally(() => {
          this.loading = false
        })
    },
    currentChange(currentPage) {
      // this.page.currentPage = currentPage
      this.queryTableData()
    },
    sizeChange(pageSize) {
      // this.page.pageSize = pageSize
      this.queryTableData()
    },
    // 改变是否启用的状态
    switchStatus: debounce(function(row) {
      updateStatus(row.id, row.status).then(res => {
        const { code, msg } = res
        code === 200 && this.$message.success(msg)
      })
    }, 500),
    // 新增回调
    addBtn() {
      this.onReset()
      this.dialogTitle = '新 增'
      this.isSelect = false
      this.$nextTick(() => {
        this.isMultiple = true
        this.isShowDialog = true
        setTimeout(() => this.$refs.formRef && this.$refs.formRef.clearValidate(), 0)
      })
    },
    // 编辑回调
    editBtn(row) {
      // this.dialogTable = row.details
      this.dialogTable = []
      this.dialogTitle = '编 辑'
      this.isMultiple = false
      this.isShowDialog = true
      this.isSelect = true
      this.form.diId = row.diId
      this.$nextTick(() => {
        this.form.dgId = row.shipId
        this.id = row.id
        row.details.length &&
          row.details.forEach(item => {
            this.dialogTable.push({
              traceCode: item.traceCode,
              keyWord: item.keyWord,
              timeNode: item.timeNode === -1 ? '' : item.timeNode,
              threshold: item.threshold === -1 ? '' : item.threshold
            })
          })
      })
      // console.log('%crowrow: ', 'color:green;font-size:16px;', row)
    },
    // 弹窗确定新增或编辑修改
    update: debounce(function() {
      this.$refs.formRef.validate((bool, obj) => {
        if (!bool) return
        // console.log('%cvalidate: ', 'color:red;font-size:16px;;', bool, obj)
        this.addTabelData()
      })
    }, 1000, true),
    // 弹窗新增或编辑的 表格删除新增一行
    delRow(row, index) {
      this.dialogTable.splice(index, 1)
      // console.log('%crow: ', 'color:green;font-size:16px;', row, index)
    }
  }
}
</script>

<style scoped lang="scss">
.scrollDiv {
  max-height: 70vh;
  overflow: auto;
  ::v-deep .el-form.el-form--inline .el-input__inner {
    width: 20vw;
    overflow: hidden;
  }
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
.mainTable {
  width: 100%;
  ::v-deep .el-table__row td {
    padding: 0;
    &:nth-child(3) {
      padding: 8px 0;
    }
  }
}
::v-deep .spanBlock {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #67c23a;
  span {
    color: #409eff;
    user-select: none;
  }
}
::v-deep .el-row .el-col {
  height: 28px;
}
</style>
