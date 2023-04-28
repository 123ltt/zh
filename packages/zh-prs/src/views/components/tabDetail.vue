<template>
  <el-tabs v-model="activeName" class="autoHeight">
    <slot />
  </el-tabs>
</template>

<script>
import { debounce } from '@/util/util.js'

export default {
  name: 'TabDetail',
  data() {
    return {
      activeName: ''
    }
  },
  watch: {
    activeName(val) {
      this.$nextTick(() => {
        this.updateHeight()
      })
    }
  },
  mounted() {
    this.updateHeight()
    var resize = this.updateHeight.bind(this)
    window.addEventListener('resize', debounce(resize, 500, true))
    this.$once('hook:destroyed', () => {
      window.removeEventListener('resize', resize)
    })
  },
  methods: {

    updateHeight() {
      var gTable = this.getGTable(this)
      var that = this
      that.updateHeight = function() {
        that.$nextTick(() => {
          var childHeight = 7// 某些原因计算有误
          var children = that.$el.parentElement.children
          Array.prototype.forEach.call(children, (child, i) => {
            if (children.length - 1 !== i) {
              childHeight += child.offsetHeight
            }
          })
          that.$el.style.height = that.$el.parentElement.offsetHeight - childHeight + 'px'
          gTable && gTable.updateTableHeight()
        })
      }
    },
    getGTable(refs) {
      var gTable = null;
      (function loop(refs) {
        if (refs.$options.name === 'GTable') {
          gTable = refs
        } else {
          refs.$children.forEach(item =>
            loop(item)
          )
        }
      }(refs))
      return gTable
    }
  }
}
// <tab-detail :records="false" default-name="operationRecords2" @updateHeight="updateHeight">
//       <el-tab-pane label="操作记录1" name="operationRecords2" lazy>
//         <operation-records :key="2" ref="operationRecords2" />
//       </el-tab-pane>
// </tab-detail>
//  updateHeight(activeName) {
//       this.$refs[activeName].$refs.tableRef.updateTableHeight()
// this.$refs[activeName].$refs.tableRef.tableRef.doLayout()
//     }

</script>
<style scoped lang="scss">
::v-deep.autoHeight{
display: flex;
 flex-direction: column;
 .el-tabs__content{
   flex: 1;
   .el-tab-pane{
    height: 100%;
   }
 }
}
</style>
