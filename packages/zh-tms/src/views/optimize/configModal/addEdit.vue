<!-- 线上发货配置 新增/编辑-->
<template>
  <basic-container v-loading="loading" class="configurationAddEdit">
    <el-form ref="rulesForm" :rules="rules" size="mini" :model="configurationInfo" label-width="150px">
      <el-row :gutter="10">
        <el-form-item label="平台" prop="platformCode">
          <g-select v-if="isAdd" v-model="configurationInfo.platformCode" :items="platformList" key-field="platformCode" label-field="platformName" value-field="platformCode" clearable :item-title="itemTitle" />
          <span v-else>{{ configurationInfo.platformName }}</span>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="onlineServiceCode" label="渠道代码">
          <el-input v-if="isAdd" v-model="configurationInfo.onlineServiceCode" clearable maxlength="50" />
          <span v-else>{{ configurationInfo.onlineServiceCode }}</span>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="onlineServiceNameEn" label="线上服务英文名">
          <el-input v-if="isAdd" v-model="configurationInfo.onlineServiceNameEn" clearable maxlength="50" />
          <span v-else>{{ configurationInfo.onlineServiceNameEn }}</span>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="onlineServiceNameCn" label="线上服务中文名">
          <el-input v-model="configurationInfo.onlineServiceNameCn" clearable maxlength="50" />
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="hasFilter" label="筛选线下渠道">
          <el-radio-group v-model="configurationInfo.hasFilter" style="width:100%">
            <el-radio v-for="item in onlineChannelList" :key="item.dictKey" :label="item.dictKey" style="margin-left:10px;width:40%">{{ item.dictValue }}</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-row>
      <el-row>
        <div class="float-end me-1">
          <el-button size="mini" type="primary" @click="close()">取消</el-button>
          <el-button size="mini" type="primary" @click="define()">确认</el-button>
        </div>

      </el-row></el-form>

  </basic-container>
</template>
<script>
import { dictionary } from '@/api/common'
import { onlineServiceSave, onlineServiceDetail } from '@/api/serviceConfiguration'
export default {
  name: 'ConfigurationAddEdit',
  props: {
    isAdd: Boolean,
    id: String,
    platformList: Array
  },
  data() {
    return {
      loading: false,
      itemTitle: true,
      onlineChannelList: [], //  继续筛选线下渠道列表
      configurationInfo: {
        platformId: '', // 平台
        platformCode: '',
        platformName: '',
        hasFilter: '', // 筛选线下渠道
        onlineServiceCode: '', // 渠道代码
        onlineServiceNameEn: '', // 线上服务英文名
        onlineServiceNameCn: '' // 线上服务中文名
      },

      rules: {
        platformCode: [{ required: this.isAdd, message: '请选择平台', trigger: 'change' }],
        hasFilter: [{ required: true, message: '请选择筛选线下渠道', trigger: 'change' }],
        onlineServiceCode: [{ required: this.isAdd, message: '请输入渠道代码', trigger: 'blur' }],
        onlineServiceNameEn: [{ required: this.isAdd, message: '请输入线上服务英文名', trigger: 'blur' }],
        onlineServiceNameCn: [{ required: true, message: '请输入线上服务中文名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getData()
  },

  methods: {
    getData() {
      dictionary('online_channel').then(res => {
        this.onlineChannelList = res.data
      })
      !this.isAdd && this.init()
    },

    init() {
      this.loading = true
      onlineServiceDetail({ id: this.id }).then(res => {
        Object.assign(this.configurationInfo, res.data)
        this.configurationInfo.hasFilter += ''
        this.loading = false
      })
    },
    close(val) {
      this.$parent.$emit('close', val)
    },
    define() {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          this.loading = true
          onlineServiceSave({ ...this.configurationInfo }).finally(() => {
            this.loading = false
          }).then(res => {
            this.close(1)
            this.$message.success({ message: '操作成功!' })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.configurationAddEdit{
  &.basic-container{
    min-width:600px!important;
    .el-input{
      width:90%
    }
    .g-select{
      width:90%
    }
  }
}
</style>
