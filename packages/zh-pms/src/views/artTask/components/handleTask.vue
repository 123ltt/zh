<template>
  <basic-container class="handleTask">
    <div class="handleTask-box">
      <el-tabs v-model="activeName" @tab-click="openTag">
        <el-tab-pane label="任务详情" name="taskDetails" />
        <el-tab-pane label="任务日志" name="taskPool" />
      </el-tabs>
      <!-- 任务详情 -->
      <div v-if="activeName === 'taskDetails'" class="task-details">
        <el-form
          ref="taskFormRef"
          :model="taskForm"
          :disabled="isDisabled"
          :rules="taskRules"
          size="mini"
          label-width="130px"
          class="form-col"
          :class="{'form-readonly':isDisabled}"
        >
          <el-row :gutter="20">
            <el-col v-if="!taskViewType" :span="12">
              <el-form-item label="当前任务状态">
                <span>{{ taskForm.bizStatusName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务类型" prop="taskType">
                <el-select
                  v-model="taskForm.taskType"
                  filterable
                  clearable
                  placeholder="请选择"
                  size="mini"
                  style="width:100%;"
                  @change="handleTaskType"
                  @clear="handleClearTaskTypeId('taskType')"
                >
                  <el-option v-for="item in findForm.taskTypeId" :key="item.id" :label="item.value" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="价格等级" prop="priceLevel">
                <el-select
                  v-model="taskForm.priceLevel"
                  :disabled="taskForm.taskType?false:true"
                  placeholder="请选择"
                  clearable
                  filterable
                  size="mini"
                  style="width:100%;"
                >
                  <el-option v-for="item in findForm.priceLevelId" :key="item.id" :label="item.value" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务标题" prop="taskTitle">
                <el-input
                  v-model.trim="taskForm.taskTitle"
                  :maxlength="LIMIT.title"
                  placeholder="请输入任务标题"
                  clearable=""
                  size="mini"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量" prop="number">
                <el-input
                  v-model.trim="taskForm.number"
                  placeholder="请输入数字"
                  clearable=""
                  size="mini"
                  oninput="value=value.replace(/[^\d]/g,'')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="要求完成时间" prop="requireFinishedTime">
                <el-date-picker
                  v-model="taskForm.requireFinishedTime"
                  type="datetime"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划开始时间" prop="planStartTime">
                <el-date-picker
                  v-model="taskForm.planStartTime"
                  :disabled="true"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划完成时间" prop="planEndTime">
                <el-date-picker
                  v-model="taskForm.planEndTime"
                  :disabled="true"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="处理人" prop="currentUserAccount">
                <el-row>
                  <el-col :span="17">
                    <el-select
                      v-model="taskForm.currentUserAccount"
                      :remote-method="remoteMethod"
                      :loading="handlerLoading"
                      placeholder="请选择"
                      clearable
                      filterable
                      remote
                      size="mini"
                      style="width:100%;"
                    >
                      <el-option
                        v-for="item in findForm.currentUserAccount"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="3" style="margin-left:10px">
                    <span type="button" class="el-button el-button--default el-button--mini" @click="selectArtTask">
                      <span>查看美工的排班计划</span>
                    </span>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务描述" prop="taskDesc">
                <el-input v-model.trim="taskForm.taskDesc" :maxlength="LIMIT.content" :rows="3" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="附件信息" prop="attachments">
                <upload-file :files.sync="files"
                             :http-request="httpRequest"
                             :uploading.sync="uploading"
                             :size="maxFileSize"
                             multiple
                             button-size="mini"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="mb-2">
          <el-col :span="24" class="text-center">
            <template v-if="taskViewType !== 0 && isCanModify">
              <el-button type="primary" size="small" @click="handlerTaskSave('taskFormRef')">保存</el-button>
              <el-button size="small" @click="close('taskFormRef')">取消</el-button>
            </template>
          </el-col>
        </el-row>
      </div>
      <!-- 任务日志 -->
      <div v-else class="task-table">
        <g-table ref="table"
                 v-loading="loading"
                 :headers="columns"
                 :fetch="getLogList"
                 :fixed-height="false"
        />
      </div>
    </div>
    <!-- 处理任务 -->
    <div v-if="taskViewType ===1 && ifCanSubmitFlow" class="handleTask-process">
      <div class="header">
        <p>处理任务</p>
      </div>
      <div class="process-box">
        <el-form
          ref="processTaskRef"
          :model="processTaskForm"
          :rules="processTaskRules"
          :disabled="!ifCanSubmitFlow"
          size="mini"
          label-width="130px"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="当前任务状态">
                <span class="">{{ taskForm.bizStatusName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理" prop="eventNo">
                <el-select
                  v-model="processTaskForm.eventNo"
                  placeholder="请选择"
                  clearable
                  filterable
                  size="mini"
                  style="width:100%;"
                  @change="selectEventNo"
                >
                  <el-option
                    v-for="item in findForm.eventList"
                    :key="item.eventNo"
                    :label="item.eventName"
                    :value="item.eventNo"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <div v-for="(item,index) in mustField" :key="index">
              <el-col v-if="item.fieldCode === 'planStartTime' && item.ifShow" :span="12">
                <el-form-item
                  :rules="item.ifRequired?processTaskRules.planStartTime:[{required: false, message: '请选择', trigger: 'change' }]"
                  label="计划开始时间"
                  prop="planStartTime"
                >
                  <el-date-picker
                    v-model="processTaskForm.planStartTime"
                    type="datetime"
                    placeholder="请选择"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="item.fieldCode === 'planEndTime' && item.ifShow" :span="12">
                <el-form-item
                  :rules="item.ifRequired?processTaskRules.planEndTime:[{required: false, message: '请选择', trigger: 'change' }]"
                  label="计划完成时间"
                  prop="planEndTime"
                >
                  <el-date-picker
                    v-model="processTaskForm.planEndTime"
                    type="datetime"
                    placeholder="请选择"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="item.fieldCode === 'nextUserId' && item.ifShow" :span="12">
                <el-form-item
                  :rules="item.ifRequired?processTaskRules.nextUserId:[{required: false, message: '请选择', trigger: 'change,blur' }]"
                  label="指派"
                  prop="nextUserId"
                >
                  <el-select
                    v-model="processTaskForm.nextUserId"
                    placeholder="请选择"
                    clearable
                    filterable
                    size="mini"
                    style="width:100%;"
                  >
                    <el-option
                      v-for="el in findForm.nextUserList"
                      :key="el.id"
                      :label="el.account"
                      :value="el.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="item.fieldCode === 'remark' && item.ifShow" :span="24">
                <el-form-item
                  :rules="item.ifRequired?processTaskRules.remark:[{required: false, message: '请填写备注', trigger: 'blur' }]"
                  label="备注"
                  prop="remark"
                >
                  <el-input v-model="processTaskForm.remark" :maxlength="LIMIT.content" type="textarea" />
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="24" class="text-end">
            <el-button type="primary" size="small" @click="saveProcess('processTaskRef')">提交</el-button>
            <el-button size="small" @click="close('processTaskRef')">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { optionForTaskType, getArtTaskDetails, optionForPriceLevel, submitFlow, getFlowProcess, updateArtDesignerTask, getOptionForHandler, optionForHandlerByDirectorId } from '@/api/artTask'
import { getLogList } from '@/api/info'
import ArtRoster from './artRoster'
import { LIMIT, LIMIT_FILE_SIZE } from '@/config/form'
import { UploadFile } from 'global-components'
import httpRequest from '@/api/common/upload'

export default {
  name: 'ArtTaskHandler',
  components: { UploadFile },
  props: {
    id: {
      type: String,
      default: ''
    },
    taskViewType: { // 查看 1 操作 0 查看
      type: Number
    }
  },
  data() {
    return {
      LIMIT,
      maxFileSize: LIMIT_FILE_SIZE.attachment,
      httpRequest,
      files: [],
      handlerLoading: false,
      disabledPriceLevelId: true,
      activeName: 'taskDetails', // tab 切换active
      taskForm: {
        taskTypeId: '',
        priceLevelId: '',
        taskTitle: '',
        requireFinishedTime: '',
        currentUserAccount: '',
        taskDesc: '',
        number: 0,
        handler: '',
        currentUserAccountTemp: ''// 处理人备份
      }, // 任务内容
      findForm: {
        taskTypeId: [], // 任务类型
        priceLevelId: [],
        eventList: [], // 根据flowId获取流程事件编号
        currentUserAccount: [],
        nextUserList: [{
          label: '张三',
          value: 1
        }] // 指派下一环节处理人工号
      },
      mustField: [], // 显示 任务处理 /必填字段
      flowId: '', // 流程id
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      processTaskForm: { // 处理任务
        flowId: '',
        eventNo: '',
        nextUserId: '',
        currentBizStatusDesc: '',
        bizData: {
          planStartTime: '',
          planEndTime: ''
        },
        remark: ''
      },
      isCanModify: null, // 任务内容是是否可以修改 0否 1是
      ifCanSubmitFlow: null, // 是否能进行流程操作
      loading: false,
      uploading: false,
      columns: [
        {
          label: '处理人',
          prop: 'createUserName'
        }, {
          label: '操作时间',
          prop: 'createTime'
        }, {
          label: '内容',
          prop: 'msgBrief',
          'show-overflow-tooltip': true // 溢出点点
        }
      ],
      taskRules: {
        taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        priceLevel: [{ required: true, message: '请选择价格等级', trigger: 'change' }],
        taskTitle: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        number: [{ required: true, message: '请输入数量' }],
        requireFinishedTime: [{ required: true, message: '请选择时间', trigger: 'change' }]
        // currentUserAccount: [{ required: true, message: '请选择处理人', trigger: 'change' }]
      },
      processTaskRules: {
        planStartTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
        planEndTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
        eventNo: [{ required: true, message: '请选择', trigger: 'change' }],
        nextUserId: [{ required: true, message: '请选择', trigger: 'change' }],
        remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isDisabled() {
      return this.taskViewType === 0 || !this.isCanModify
    }
  },
  created() {
    this.openTag()
  },
  mounted() {
    this.optionForTaskType()
  },
  methods: {
    // 调用任务详情页
    taskDetailsFn() {
      getArtTaskDetails({ id: this.id }).then(res => {
        const data = res.data
        this.handleTaskType(data.taskTypeId)
        this.taskForm = data
        this.isCanModify = data.isCanModify // 任务内容是否禁用
        this.taskForm.currentUserAccountTemp = this.taskForm.currentUserAccount // 处理人备份
        this.flowId = data.flowId // 流程id
        // 图片回显
        this.files = (data.attachments || []).map(item => {
          const arr = item.split('#')
          let name = ''
          let url = item
          if (arr.length > 1) {
            name = unescape(arr[1])
            url = arr[0]
          } else {
            const m = item.match(/\/([^/]+)$/)
            name = m ? m[1] : item.slice(-10)
          }
          return { name, url }
        })
        this.getFlowProcess()
      })
    },
    // 类型下拉列表
    optionForTaskType() {
      optionForTaskType().then(res => {
        const data = res.data
        this.findForm.taskTypeId = data
      })
    },

    // 修改任务详情
    handlerTaskSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.uploading) return this.$message.error('附件正在上传中，请稍后')

          const postForm = this.taskForm
          postForm.attachments = this.files.map(file => {
            return file.url + '#' + escape(file.name)
          })
          postForm.handler = JSON.stringify(postForm.currentUserAccount) === JSON.stringify(postForm.currentUserAccountTemp) ? postForm.currentUserId : postForm.currentUserAccount
          updateArtDesignerTask(postForm).then(res => {
            this.$message.success('修改成功')
          })
        }
      })
    },
    // 任务类型 清除
    handleClearTaskTypeId(id) {
      this.taskForm.priceLevel = ''
    },
    // 切换Tab
    openTag(item) {
      /*
      切换 日志的时候 赋值给table
      切换 任务详情，就直接拿调用接口的值，就不用多次请求接口了
       */
      this.files = []
      this.activeName = (item && item.name) || this.activeName
      if (this.activeName === 'taskDetails') {
        this.taskDetailsFn()
      } else {
        this.$nextTick(() => {
          this.$refs.table.load(1)
        })
      }
    },

    // 处理人搜索
    remoteMethod(query) {
      if (query !== '') {
        this.handlerLoading = true
        getOptionForHandler({ keyword: query, current: 1, size: 2000 }).then(res => {
          this.handlerLoading = false
          const data = res.data.records
          this.findForm.currentUserAccount = data
          this.findForm.handler = data
        })
      }
    },
    close(formName) {
      this.$refs[formName].resetFields()
      this.$emit('close', false)
    },
    // 查看美工排班
    selectArtTask() {
      this.$modal({
        title: '查询美工计划排期',
        component: ArtRoster,
        width: '80%',
        data: {}
      })
    },
    // 流程的表单提交
    saveProcess(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.processTaskForm = {
            flowId: this.flowId,
            eventNo: this.processTaskForm.eventNo,
            nextUserId: this.processTaskForm.nextUserId, // 下一环节处理人
            remark: this.processTaskForm.remark,
            bizData: {
              planStartTime: this.processTaskForm.planStartTime,
              planEndTime: this.processTaskForm.planEndTime
            }
          }
          submitFlow(this.processTaskForm).then(res => {
            this.$message.success('处理任务成功')
            this.$emit('close', 1)
          })
        } else {
          return false
        }
      })
    },
    // 切换 处理任务
    selectEventNo(val) {
      this.findForm.eventList.forEach(acc => {
        if (acc.eventNo === val) {
          this.mustField = acc.mustField
        }
        if (acc.eventNo === 'ART_DESIGNER_TASK_E_0301') { // 主管指派
          this.optionForHandlerByDirectorId()
        }
      })
    },
    // 获取指派人列表
    optionForHandlerByDirectorId() {
      optionForHandlerByDirectorId().then(res => {
        this.findForm.nextUserList = res.data
      })
    },
    // 获取处理任务流程 根据flowId获取流程事件编号
    getFlowProcess(flowId) {
      getFlowProcess({ flowId: this.flowId }).then(res => {
        const data = res.data
        this.ifCanSubmitFlow = data.ifCanSubmitFlow // false 不展示处理任务模块
        this.findForm.eventList = data.eventList
      })
    },
    // 获取任务日志数据
    getLogList({ current, size }, params) {
      return getLogList({
        bizNo: this.id,
        entityCode: 'ART_DESIGNER_TASK',
        current,
        size
      }).then(res => res.data)
    },
    // 任务类型切换
    handleTaskType(id) {
      this.optionForPriceLevel(id)
      this.taskForm.priceLevel = ''
    },
    // 价格等级下拉列表
    optionForPriceLevel(taskTypeId) {
      optionForPriceLevel({ taskTypeId }).then(res => {
        const data = res.data
        this.findForm.priceLevelId = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.handleTask {
  position: relative;
}
.handleTask-box ::v-deep {
  .el-tabs {
    position: sticky;
    top: -10px;
    z-index: 1;
    background: #fff;
  }
}
.handleTask-process {
  margin-top: 10px;
  background: #fff;
}
.header {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  border-bottom: 1px solid #efefef;
}
.process-box {
  padding: 20px;
}
.logo-img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-col {
  margin-bottom: 0;
}
</style>
