<template>
  <basic-container>
    <!-- 任务详情 -->
    <div class="task-details">
      <el-form
        ref="taskFormRef"
        :model="taskForm"
        :rules="taskRules"
        size="mini"
        label-width="130px"
        class="form-col"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskTypeId">
              <el-select
                v-model.trim="taskForm.taskTypeId"
                placeholder="请选择"
                size="mini"
                style="width: 100%"
                clearable
                @change="handleTaskType"
                @clear="handleClearTaskTypeId('taskTypeId')"
              >
                <el-option
                  v-for="item in taskTypeList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格等级" prop="priceLevelId">
              <el-select
                v-model="taskForm.priceLevelId"
                :disabled="disabledPriceLevelId"
                placeholder="请选择"
                size="mini"
                style="width: 100%"
              >
                <el-option
                  v-for="item in findForm.priceLevelId"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数量" prop="number">
              <el-input
                v-model="taskForm.number"
                placeholder="请输入数字"
                clearable
                size="mini"
                @input="regIntNumber('number')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="要求完成时间" prop="requireFinishedTime">
              <el-date-picker
                v-model="taskForm.requireFinishedTime"
                style="width: 100%"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="处理人" prop="handler">
              <el-row>
                <el-col :span="17">
                  <el-select
                    v-model="taskForm.handler"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    placeholder="请选择"
                    clearable
                    filterable
                    remote
                    size="mini"
                    style="width:100%;"
                  >
                    <el-option
                      v-for="item in findForm.handler"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-col>
                <el-col :span="3" class="ms-2">
                  <el-button @click="selectArtTask">查看美工的排班计划</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任务描述" prop="taskDesc">
              <el-input
                v-model.trim="taskForm.taskDesc"
                :maxlength="LIMIT.content"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="附件信息">
              <upload-file :files.sync="files"
                           :http-request="httpRequest"
                           :uploading.sync="uploading"
                           :size="maxFileSize"
                           multiple
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item class="text-end">
            <el-button type="primary" @click="saveTask('taskFormRef')">创建任务</el-button>
            <el-button @click="reactTask">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </basic-container>
</template>

<script>
import { optionForPriceLevel, getOptionForHandler, optionForTaskType, createTask } from '@/api/artTask'
import ArtRoster from './artRoster.vue'
import { LIMIT_FILE_SIZE, LIMIT } from '@/config/form'
import { UploadFile } from 'global-components'
import httpRequest from '@/api/common/upload'

export default {
  name: 'CommonArtTaskCreate',
  components: { UploadFile },
  props: {
    findFormProp: {
      // 下拉传值
      type: Object,
      default: () => ({})
    },
    // 产品id
    productId: [String, Number]
  },
  data() {
    return {
      maxFileSize: LIMIT_FILE_SIZE.attachment,
      LIMIT,
      httpRequest,
      disabledPriceLevelId: true,
      loading: false,
      files: [],
      taskForm: {
        taskTypeId: '',
        priceLevelId: '',
        taskTitle: '',
        number: null,
        requireFinishedTime: '',
        handler: '',
        taskDesc: '',
        attachments: []
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      findForm: {
        priceLevelId: [],
        handler: []
      },
      taskRules: {
        taskTypeId: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        priceLevelId: [
          { required: true, message: '请选择价格等级', trigger: 'change' }
        ],
        taskTitle: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        requireFinishedTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        handler: [
          { required: true, message: '请选择处理人', trigger: 'change' }
        ]
      },
      taskTypeList: this.findFormProp.taskTypeId || [],
      uploading: false
    }
  },
  created() {
    this.getTaskTypeList()
  },
  methods: {
    // 只能输入正整数 首位不能为u0，最多输入6位正整数
    regIntNumber(prop) {
      this.taskForm[prop] = (this.taskForm[prop].match(/^[1-9]\d{0,5}/) || [''])[0]
    },
    // 任务类型 清除
    handleClearTaskTypeId(id) {
      this.disabledPriceLevelId = true
    },
    // 重置
    reactTask() {
      this.$refs.taskFormRef.resetFields()
      this.files = []
      this.disabledPriceLevelId = true
    },
    // 创建
    saveTask(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.uploading) return this.$message.error('附件正在上传中，请稍后')

          this.taskForm.attachments = this.files.map(file => file.url + '#' + escape(file.name))
          createTask({ data: [{ ...this.taskForm, productId: this.productId }] }).then((res) => {
            const { code } = res
            if (code === 200) {
              this.$message.success('创建任务成功')
              this.$refs.taskFormRef.resetFields()
              this.files = []
              this.$emit('close', true)
            }
          })
        } else {
          return false
        }
      })
    },
    // 处理人搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        getOptionForHandler({ keyword: query, current: 1, size: 2000 }).then(res => {
          this.loading = false
          const data = res.data.records
          this.findForm.handler = data
        })
      }
    },
    // 任务类型 下拉选择
    handleTaskType(id) {
      this.optionForPriceLevel(id)
      this.taskForm.priceLevelId = ''
      this.disabledPriceLevelId = false
    },
    // 价格等级下拉列表
    optionForPriceLevel(taskTypeId) {
      optionForPriceLevel({ taskTypeId }).then((res) => {
        const data = res.data
        this.findForm.priceLevelId = data
      })
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
    // 任务类型下拉列表
    getTaskTypeList() {
      // 如果任务类型列表没用从 props 传递过来，则通过接口获取
      if (this.taskTypeList.length === 0) {
        optionForTaskType().then(res => {
          this.taskTypeList = res.data
        })
      }
    }
  }
}
</script>
