<template>
  <!-- 渠道对接配置新增页 -->
  <basic-container v-loading="loading" class="apiAddEdit">
    <el-form ref="table" label-width="100px" size="mini" :rules="rules" :model="formData">
      <el-row>
        <el-form-item label="物流商：" prop="lpId">
          <g-select v-if="isAdd"
                    v-model.trim="formData.lpId"
                    :items="showProviderList"
                    key-field="id"
                    label-field="lpAbbreviation"
                    value-field="id"
                    placeholder="请选择"
                    @change="changeChannel"
          />
          <span v-else>{{ getProviderName }}</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="渠道名称：" prop="channelCode">
          <g-select v-if="isAdd"
                    v-model.trim="formData.channelCode"
                    :items="showChannelList"
                    key-field="channelCode"
                    :label-field="getLabel"
                    value-field="channelCode"
                    multiple
                    placeholder="请选择"
                    @change="changeProvider"
          />
          <span v-else>{{ getChannelName }}</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="策略名：" prop="strategyName">
          <el-select v-model="formData.strategyName" clearable placeholder="请选择" @change="changeStrategy">
            <el-option v-for="item in apiList" :key="item.strategyName" :label="`${item.strategyDesc}(${item.strategyName})`" :value="item.strategyName" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="授权信息：" prop="paramJson">
          <el-input v-model="formData.paramJson" type="textarea" :rows="4" placeholder="选择策略名可自动匹配格式，按照json格式填写" />
        </el-form-item>
      </el-row>
      <el-row>
        <div div class="float-end me-1">
          <el-button type="primary" size="mini" @click="cancel(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="saveBtn">保存</el-button>
        </div>
      </el-row>
    </el-form>
  </basic-container>
</template>
<script>
import { addData, upData, getApiList } from '@/api/forecast/apiConfiguration'
export default {
  props: {
    isAdd: Boolean,
    rows: Object,
    channelList: Array,
    providerList: Array
  },
  data() {
    return {
      loading: false,
      formData: {
        paramJson: ''
      },
      showProviderList: [],
      showChannelList: [],
      apiList: [],
      rules: {
        lpId: [{ required: this.isAdd, message: '物流商名称不能为空', trigger: 'change' }],
        channelCode: [{ required: this.isAdd, message: '渠道名称不能为空', trigger: 'change' }],
        strategyName: [{ required: true, message: '策略名称不能为空', trigger: 'blur' }]

      }
    }
  },
  computed: {
    getProviderName() {
      return this.providerList.find(i => i.id + '' === this.rows.lpId + '')?.lpAbbreviation
    },
    getChannelName() {
      const item = this.channelList.find(i => i.channelCode === this.rows.channelCode)
      return item ? `${item.name} (${item.channelCode})` : ''
    }
  },
  created() {
    this.getData()
    this.showProviderList = this.providerList
    this.showChannelList = this.channelList
  },
  methods: {
    getData() {
      getApiList().then(res => {
        this.apiList = res.data
        this.init()
      })
    },
    init() {
      this.formData = {
        strategyName: '',
        paramJson: ''
      }
      Object.assign(this.formData, this.rows)
    },
    changeChannel(val) {
      this.showChannelList = val ? this.channelList.filter(item => item.exWarehouseLpId + '' === val.id + '') : this.channelList
    },
    changeProvider(val) {
      if (!this.formData.lpId) {
        const item = this.channelList.find(item => val.channelCode === item.channelCode)
        this.formData.lpId = this.providerList.find(i => i.id === item.exWarehouseLpId).id
        this.showChannelList = this.channelList.filter(item => this.formData.lpId === item.exWarehouseLpId)
      }
    },
    changeStrategy(val) {
      this.formData.paramJson = this.apiList.find(item => item.strategyName === val)?.paramJson
    },
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },
    cancel(flag) {
      this.$parent.$emit('close', flag)
    },
    saveBtn() {
      this.$refs.table.validate(valid => {
        if (valid) {
          let params = {}
          let ct = null
          if (this.isAdd) {
            const channelCode = this.formData.channelCode.join(',')
            params = { ...this.formData, channelCode }
            ct = addData(params)
          } else {
            ct = upData(this.formData)
          }
          this.loading = true
          ct.finally(() => {
            this.loading = false
          }).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.apiAddEdit{
  &.basic-container{
    min-width:600px!important;
    .el-select{
      width:95%
    }
    .g-select{
      width:95%
    }
    .el-textarea{
      width:95%
    }
  }
}
</style>
