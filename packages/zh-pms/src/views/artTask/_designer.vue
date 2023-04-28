<template>
  <basic-container>
    <div class="d-flex flex-column h-100">
      <el-tabs v-if="!createArtTaskType" v-model="activeName" @tab-click="openTag">
        <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label" :name="item.value" />
      </el-tabs>
      <div class="overflow-hidden flex-grow-1">
        <designer-table ref="designerTable" :tasktype.sync="tasktype" :submit-form="submitForm" :create-art-task-type="createArtTaskType">
          <!-- 搜索区 -->
          <el-form ref="submitRef"
                   slot="header"
                   :model="submitForm"
                   size="mini"
                   label-width="90px"
                   class="no-message form-col"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item label="任务状态" prop="bizStatusNo">
                  <el-select
                    v-model="submitForm.bizStatusNo"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width:100%;"
                  >
                    <el-option v-for="item in findForm.bizStatusNo" :key="item.id" :label="item.value" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="任务类型" prop="taskTypeId">
                  <el-select
                    v-model="submitForm.taskTypeId"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width:100%;"
                    @change="handleTaskType"
                    @clear="handleClearTaskTypeId('taskTypeId')"
                  >
                    <el-option v-for="item in findForm.taskTypeId" :key="item.id" :label="item.value" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="价格等级" prop="priceLevelId">
                  <el-select
                    v-model="submitForm.priceLevelId"
                    :disabled="disabledPriceLevelId"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width:100%;"
                  >
                    <el-option v-for="item in findForm.priceLevelId" :key="item.id" :label="item.value" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数量" prop="numberRange">
                  <el-select
                    v-model="submitForm.numberRange"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width:100%;"
                  >
                    <el-option v-for="item in findForm.numberRange" :key="item.id" :label="item.value" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="要求完成时间" prop="requireFinishedTimes">
                  <el-date-picker
                    v-model="submitForm.requireFinishedTimes"
                    :picker-options="pickerOptions"
                    :default-time="['00:00:00', '23:59:59']"
                    type="datetimerange"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="任务标题" prop="taskTitle">
                  <el-input v-model="submitForm.taskTitle" placeholder="请输入关键词进行模糊查询" clearable filterable style="width:100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="10px">
                  <el-button type="primary" size="mini" class="mx-1" @click="search()">搜索</el-button>
                  <el-button type="secondary" size="mini" class="mx-1" @click="onReset('submitRef')">重置</el-button>
                  <template v-if="createArtTaskType === 'createDesigner'">
                    <el-button type="primary" size="mini" class="mx-1" @click="createNewTask">创建新任务</el-button>
                    <el-button type="primary" size="mini" class="mx-1" @click="batchCreate">批量创建</el-button>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </designer-table>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { artTaskStatus, optionForTaskType, optionForPriceLevel, optionForNumber } from '@/api/artTask'
import BatchCreateTask from './components/batchCreateTask.vue'
import CreateTask from './components/createTask'
import DesignerTable from './components/designerTable'
export default {
  name: 'PmsArtTaskDesigner',
  components: { DesignerTable },
  props: {
    // 1 美工任务， 3 创建美工任务
    createArtTaskType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'myTask',
      disabledPriceLevelId: true,
      tabList: [
        { label: '我的任务', value: 'myTask' },
        { label: '任务池', value: 'taskPool' }
      ],
      submitForm: {
        bizStatusNo: '',
        taskTypeId: '',
        priceLevelId: '',
        numberRange: '',
        requireFinishedTimes: [],
        taskTitle: ''
      },
      // 搜索条件
      findForm: {
        bizStatusNo: [],
        taskTypeId: [],
        priceLevelId: [],
        numberRange: []
      },
      // 日期控件
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tasktype: 1 // 列表类型
    }
  },
  created() {
    this.tasktype = this.createArtTaskType === 'createDesigner' ? 3 : 1
    this.artTaskStatus()
    this.optionForTaskType()
    this.optionForNumber()
  },
  mounted() {
    this.getDesignerTableList(1)
  },
  methods: {
    // 获取Table List
    getDesignerTableList(pageIndex = 1) {
      this.$refs.designerTable.load(pageIndex)
    },
    // 搜索
    search() {
      this.getDesignerTableList()
    },
    // 任务类型 清除
    handleClearTaskTypeId(id) {
      this.disabledPriceLevelId = true
      this.submitForm.priceLevelId = ''
    },
    // 清空
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.$nextTick(() => {
        this.getDesignerTableList()
      })
      this.disabledPriceLevelId = true
    },
    // 标签页切换
    openTag(item) {
      this.$refs.submitRef.resetFields()
      this.tasktype = item.name === 'myTask' ? 1 : 2
      this.$nextTick(() => {
        this.getDesignerTableList()
      })
      this.activeName = item.name
    },
    // 创建新任务
    createNewTask() {
      this.$newTab({
        path: '/art-task/create',
        title: '创建任务',
        component: CreateTask,
        data: {
          taskStatus: '新增',
          findFormProp: this.findForm // 从美工列表页带值过去，免的重复请求数据
        },
        clearCache: true,
        callback: refresh => {
          this.tasktype = refresh && this.createArtTaskType === 'createDesigner' ? 3 : 1
          if (refresh) this.getDesignerTableList(0)
        }
      })
    },
    // 批量创建
    batchCreate() {
      this.$newTab({
        path: '/art-task/batch-create',
        title: '批量创建任务',
        component: BatchCreateTask,
        data: {
          findFormProp: this.findForm
        },
        clearCache: true,
        callback: reload => {
          if (reload) {
            this.getDesignerTableList(0)
          }
        }
      })
    },
    // 美工任务状态下拉列表
    artTaskStatus() {
      artTaskStatus().then(res => {
        const data = res.data
        this.findForm.bizStatusNo = data
      })
    },
    // 类型下拉列表
    optionForTaskType() {
      optionForTaskType().then(res => {
        const data = res.data
        this.findForm.taskTypeId = data
      })
    },
    // 任务类型切换
    handleTaskType(id) {
      this.optionForPriceLevel(id)
      this.disabledPriceLevelId = false
      this.submitForm.priceLevelId = ''
    },
    // 价格等级下拉列表
    optionForPriceLevel(taskTypeId) {
      optionForPriceLevel({ taskTypeId }).then(res => {
        const data = res.data
        this.findForm.priceLevelId = data
      })
    },
    // 数量下拉列表
    optionForNumber() {
      optionForNumber().then(res => {
        const data = res.data
        this.findForm.numberRange = data
      })
    }

  }
}
</script>
