<template>
  <!-- 批量创建美工任务 -->
  <basic-container>
    <div class="batch-box">
      <label>任务类型：</label>
      <el-button
        v-for="(item, index) in taskTypeList"
        :key="index"
        size="mini"
        @click="handleTaskTypeId(item, index)"
      >{{ item.value }}</el-button>
    </div>
    <el-form
      ref="taskFormRef"
      :model="batchTask"
      label-position="top"
      size="mini"
      label-width="130px"
    >
      <div v-for="(item, index) in batchTask.taskList" :key="index" class="position-relative mb-2">
        <fieldset class="border border-1 rounded-1">
          <legend class="unit-title">
            {{ `任务-${index + 1} 任务类型-${item.taskTypeName}` }}
          </legend>
          <el-button
            icon="el-icon-delete"
            type="text"
            class="del-icon"
            @click="handleDelTask(item, index)"
          />
          <el-row :gutter="4">
            <el-col :span="4">
              <el-form-item
                :prop="'taskList.' + index + '.priceLevelId'"
                :rules="[{required: true,message: '价格等级不能为空',trigger:'change'}]"
                label="价格等级："
              >
                <el-select
                  v-model="item.priceLevelId"
                  placeholder="请选择"
                  clearable
                  filterable
                  size="mini"
                  style="width: 100%"
                >
                  <el-option
                    v-for="el in item.priceLevelIdList"
                    :key="el.id"
                    :label="el.value"
                    :value="el.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                :prop="'taskList.' + index + '.taskTitle'"
                :rules="[{ required: true, message: '任务标题不能为空', trigger: 'blur'}]"
                label="任务标题："
              >
                <el-input
                  v-model.trim="item.taskTitle"
                  :maxlength="LIMIT.title"
                  placeholder="请输入任务标题"
                  clearable=""
                  size="mini"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item
                :prop="'taskList.' + index + '.number'"
                :rules="[{ required: true, message: '数量不能为空', trigger: 'blur' }]"
                label="数量："
              >
                <el-input
                  v-model="item.number"
                  placeholder="请输入正整数"
                  clearable
                  size="mini"
                  @input="regIntNumber(index)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                :prop="'taskList.' + index + '.requireFinishedTime'"
                :rules="[{ required: true, message: '时间不能为空', trigger: 'blur' }]"
                label="要求完成时间："
              >
                <el-date-picker
                  v-model="item.requireFinishedTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                :prop="'taskList.' + index + '.handler'"
                :rules="[{required: true,message: '处理人不能为空',trigger: 'change'}]"
                label="处理人："
              >
                <el-select
                  v-model="item.handler"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  placeholder="请选择"
                  clearable
                  filterable
                  remote
                  size="mini"
                  style="width: 100%"
                >
                  <el-option
                    v-for="el in findForm.handler"
                    :key="el.id"
                    :label="el.name"
                    :value="el.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="附件信息：">
                <div style="margin-top:-13px">
                  <upload-file :files.sync="item.files"
                               :http-request="httpRequest"
                               :uploading.sync="item.uploading"
                               :size="maxFileSize"
                               button-size="mini"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
      </div>
    </el-form>
    <div v-if="batchTask.taskList && batchTask.taskList.length > 0" class="my-1 text-end">
      <el-button size="mini" type="primary" @click="saveTask">提交</el-button>
      <el-button size="mini" @click="resetBatchTask">重置</el-button>
    </div>
  </basic-container>
</template>

<script>
import { optionForPriceLevel, createTask, getOptionForHandler, optionForTaskType } from '@/api/artTask'
import { LIMIT_FILE_SIZE, LIMIT } from '@/config/form'
import { UploadFile } from 'global-components'
import httpRequest from '@/api/common/upload'

export default {
  name: 'CommonArtTaskBatchCreate',
  components: { UploadFile },
  props: {
    findFormProp: {
      type: Object,
      default: () => ({})
    },
    // 产品id
    productId: [String, Number]
  },
  data() {
    return {
      httpRequest,
      maxFileSize: LIMIT_FILE_SIZE.attachment,
      LIMIT,
      loading: false,
      batchTask: {
        taskList: []
      },
      findForm: {
        handler: []
      },
      taskTypeList: this.findFormProp.taskTypeId || []
    }
  },
  created() {
    this.getTaskTypeList()
  },
  methods: {
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
    handleTaskTypeId(item, index) {
      // this.optionForPriceLevel(item.id, index)
      this.handlCreateTast(item, index)
    },
    // 价格等级下拉列表
    optionForPriceLevel(taskTypeId, index) {
      optionForPriceLevel({ taskTypeId }).then((res) => {
        const data = res.data
        this.$nextTick(() => {
          this.batchTask.taskList &&
            this.batchTask.taskList[
              this.batchTask.taskList.length - 1
            ].priceLevelIdList.push(...data)
        })
      })
    },
    // 删除
    handleDelTask(item, index) {
      this.batchTask.taskList.splice(index, 1)
    },
    // 提交
    saveTask() {
      this.$refs.taskFormRef.validate((valid) => {
        if (valid) {
          let uploadingCount = 0
          const data = this.batchTask.taskList.map((acc) => {
            if (acc.uploading) uploadingCount++
            if (this.productId) {
              acc.productId = this.productId
            }
            acc.attachments = acc.files.map(file => {
              return file.url + '#' + escape(file.name)
            })
            const { taskTypeId, priceLevelId, taskTitle, number, requireFinishedTime, handler, attachments } = acc
            return { taskTypeId, priceLevelId, taskTitle, number, requireFinishedTime, handler, attachments }
          })
          if (uploadingCount === 0) {
            createTask({ data }).then((res) => {
              const { code } = res
              if (code === 200) {
                this.$message.success('创建任务成功')
                this.$emit('close', true)
              }
            })
          } else {
            this.$message.error('当前有附件正在上传中，请稍后')
          }
        } else {
          return false
        }
      })
    },
    // 重置
    resetBatchTask() {
      this.$refs.taskFormRef.resetFields()
      this.batchTask.taskList.forEach((acc) => {
        acc.files = []
        acc.uploading = false
      })
    },
    // 只能输入正整数 首位不能为u0，最多输入6位正整数
    regIntNumber(index) {
      this.batchTask.taskList[index].number = (this.batchTask.taskList[index].number.match(/^[1-9]\d{0,5}/) || [''])[0]
    },
    // 新建任务
    handlCreateTast(item, index) {
      this.batchTask.taskList.push({
        ckey: index + 1,
        taskTypeId: item.id,
        taskTypeName: item.value,
        priceLevelId: '',
        priceLevelIdList: [],
        number: null,
        taskTitle: '',
        requireFinishedTime: '',
        handler: '',
        attachments: [],
        files: [],
        uploading: false
      })
      this.optionForPriceLevel(item.id, index)
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

<style lang='scss' scoped>
.batch-box {
  margin-bottom: 14px;
}
.del-icon {
  position: absolute;
  right: 0px;
  top: 0;
  background: #fff;
}
::v-deep.el-upload--picture-card {
  width: 100px !important;
  height: 100px !important;
  position: relative;
}
::v-deep .scopeClass {
  height: inherit;
  img {
    height: inherit;
    position: absolute;
    top: 0;
    right: 0;
  }
}
::v-deep .el-icon-plus {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -14px 0 0 -14px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 100px !important;
  height: 100px !important;
  position: relative;
}
</style>
