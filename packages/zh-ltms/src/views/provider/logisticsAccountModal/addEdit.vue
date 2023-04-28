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
        <el-form-item label="物流账号:" prop="name">
          <el-input v-if="isAdd" v-model="configurationInfo.name" clearable maxlength="50" />
          <span v-else>{{ configurationInfo.name }}</span>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item label="授权信息：" prop="paramJson">
          <el-input v-model="configurationInfo.paramJson" type="textarea" style="width:90%" :rows="4" placeholder="自动匹配格式，按照json格式填写" />
        </el-form-item>
      </el-row>
      <el-row>
        <div class="float-end me-1">
          <el-button size="mini" type="primary" @click="close(false)">取消</el-button>
          <el-button size="mini" type="primary" @click="define()">确认</el-button>
        </div>
      </el-row></el-form>
  </basic-container>
</template>
<script>
import { add, update } from '@/api/logisticsAccount' // 导入新增接口+更新接口
export default {
  name: 'ConfigurationAddEdit',
  props: {
    isAdd: Boolean,
    id: String,
    platformList: Array,
    row: Object
  },
  data() {
    return {
      loading: false,
      itemTitle: true,
      onlineChannelList: [], //  继续筛选线下渠道列表
      configurationInfo: { // 需要传递的参数
        platformCode: '', // 平台
        name: '', // 物流账号
        paramJson: '', // 授权信息-也就是配置参数
        id: ''// 新增不需要，编辑需要
      },
      rules: {
        platformCode: [{ required: this.isAdd, message: '请选择平台', trigger: 'change' }],
        name: [{ required: this.isAdd, message: '请输入物流账号', trigger: 'blur' }],
        paramJson: [{ required: this.isAdd, message: '请输入授权信息', trigger: 'blur' }]
      }

    }
  },
  created() {
    this.configurationInfo = Object.assign({}, this.row) // 方式1 拷贝对象
  },

  methods: {
    // 弹框取消按钮
    close(val) {
      this.$parent.$emit('close', val)
    },
    // 新增弹框确定按钮
    define() {
      console.log(123)
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          this.loading = true
          const ct = !this.row ? add(this.configurationInfo) : update(this.configurationInfo)
          ct.finally(() => { this.loading = false }).then(res => {
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
