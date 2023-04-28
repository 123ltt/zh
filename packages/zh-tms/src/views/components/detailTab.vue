<template>
  <div>
    <el-tabs id="tabs" v-model="activeName">
      <slot name="default" />
      <el-tab-pane v-if="!hideHandleRec" label="操作记录" name="handleRecords" lazy>
        <recordsTable ref="recordsTable" :log-type="type" :biz-id="id" />
      </el-tab-pane>
    </el-tabs>
    <slot name="btns" :activeName="activeName" />
  </div>
</template>
<script>
import recordsTable from './recordsTable'
import { debounce, getMaxTableHei } from '@/util/util'
export default {
  components: { recordsTable },
  props: {
    includePane: Array,
    id: String,
    type: String,
    hideHandleRec: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'postCodeInfo'
    }
  },
  watch: {
    'activeName'(newVal) {
      newVal === 'handleRecords' && this.$nextTick(() => {
        this.$refs.recordsTable.init()
      })
      this.updateHeight()
    }
  },
  created() {
    this.activeName = this.includePane?.[0].tabName ?? 'handleRecords'
  },
  mounted() {
    this.updateHeight()
  },
  activated() {
    const fn = debounce(this.updateHeight, 500)
    window.addEventListener('resize', fn)
    this.$once('hook:deactivated', () => {
      window.removeEventListener('resize', fn)
    })
  },
  methods: {
    updateHeight() {
      this.$nextTick(() => {
        const topHeight = this.$parent.$parent.$refs.formRef.$el.clientHeight
        const h = getMaxTableHei(this, [], 150 + topHeight)
        document.querySelector('#tabs>.el-tabs__content>#pane-' + this.activeName).style.height = h + 'px'
        if (this.activeName === 'handleRecords') {
          return this.$refs.recordsTable.$refs.table.updateTableHeight()
        }
        this.$emit('emitUpdate', [this.activeName, h])
      })
    }
  }

}

</script>
<style lang="scss" scoped>
::v-deep .el-tabs__content>div{
    min-height: 200px;
}
.details-tab{
  min-height: 200px;
  position: relative;
  .btns{
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
