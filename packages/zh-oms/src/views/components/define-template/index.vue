<template>
  <div v-loading="loading">
    <div class="header">选择你的模板</div>
    <div v-for="(item,i) in tempList" :key="i" class="d-flex align-items-center justify-content-between hover-item">
      <el-radio v-model="exportTemId" class="flex-grow-1" :label="item.id">{{ item.name }}</el-radio>
      <div style="width: 180px;" class="my-1">
        <el-button type="text" size="mini" @click="updateTemp(item.id)">配置字段</el-button>
        <el-button type="text" size="mini" @click="delTemp(item.id)">删除模板</el-button>
        <el-button v-if="!item.ifDefault" type="text" size="mini" @click="setDefaultTemp(item.id)">设置默认</el-button>
      </div>
    </div>
    <div class="text-end">
      <el-button size="mini" @click="close()">取消</el-button>
      <el-button :disabled="exportTemId===''||tempList.length===0" type="primary" size="mini" @click="exportTemp">导出</el-button>
      <el-button :disabled="tempList.length===5" type="primary" size="mini" @click="updateTemp()">新增模板</el-button>
    </div>
  </div>
</template>

<script>
import { getTempList, delTemp, setDefaultTemp, exportTemp } from '@/api/defineTemp.js'
export default {
  name: 'DefineTemplate',
  props: {
    status: {
      type: Number,
      default: 0
    },
    modular: {
      type: String,
      default: 'DIY_EXPORT'
    },
    /** @type {ZHKJ.VueProps<0|1>} 0订单、1包裹 */
    type: {
      type: Number,
      default: 0
    },
    /** 查询参数 json string */
    params: Object
  },
  data() {
    return {
      exportTemId: '',
      tempList: [],
      loading: false
    }
  },
  mounted() {
    this.getTempList()
  },
  methods: {
    close(bool = false) {
      this.$parent.$emit('close', bool)
    },
    getFileName(id) {
      const time = new Date().getTime()
      return this.tempList.find(item => item.id === id).name + time
    },
    exportTemp() {
      if (this.loading) return
      this.loading = true
      const { status: processingStatus, modular, type: paramType, params, exportTemId } = this
      const tp = { paramType, exportTemId }
      const fileName = this.getFileName(exportTemId)
      tp[paramType ? 'packageMain' : 'omOrderQueryDTO'] = params
      exportTemp({
        processingStatus,
        modular,
        taskParameters: JSON.stringify(tp),
        fileName
      }).then(res => {
        this.$message.success(res.msg)
        this.close(true)
      }).finally(() => { this.loading = false })
    },
    getTempList() {
      if (this.loading) return
      this.loading = true
      getTempList().then(res => {
        for (const obj of res.data) {
          if (obj.ifDefault) this.exportTemId = obj.id
        }
        this.tempList = res.data
      }).finally(() => { this.loading = false })
    },
    updateTemp(id) {
      const data = id ? { id } : undefined
      this.$newPage({
        path: 'oms/components/define-template/updateTemp',
        data,
        callback: bool => bool && this.getTempList()
      })
    },
    delTemp(id) {
      delTemp(id).then(res => {
        this.$message.success(res.msg)
        this.tempList = this.tempList.filter(item => item.id !== id)
        if (id === this.exportTemId) this.exportTemId = ''
      })
    },
    setDefaultTemp(id) {
      setDefaultTemp(id).then(res => {
        this.$message.success(res.msg)
        this.tempList = this.tempList.map(item => {
          item.ifDefault = item.id === id
          return item
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.hover-item:hover{
  background-color: #eee;
}
</style>
