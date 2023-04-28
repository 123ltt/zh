<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    title="自定义组织数据"
    top="80px"
    custom-class="my-dialog my-tree"
    @close="handleClose"
  >
    <el-tree
      ref="tree"
      :data="data"
      :check-on-click-node="true"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
      show-checkbox
      default-expand-all
      node-key="id"
    />
    <div style="padding: 20px 0;text-align: right">
      <el-button
        size="small"
        @click="handleClose"
      >取 消</el-button>
      <el-button
        :disabled="data.length == 0"
        size="small"
        type="primary"
        @click="submitDialog"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Tree',
  props: ['isShow', 'dialogForm', 'isMultiple', 'tenantId', 'data'],
  data() {
    return {
      visible: this.isShow,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      defaultExpandedKeys: [],
      defaultCheckedKeys: this.dialogForm
    }
  },
  methods: {
    // 取消
    handleClose() {
      this.$emit('closeView', true)
    },
    // 确定
    submitDialog() {
      if (this.isMultiple) {
        this.$emit('multipleHandle', true)
      }
      this.$emit('orgIds', this.$refs.tree.getCheckedKeys())
      this.$emit('closeView', true)
    }
  }
}
</script>

<style lang="scss">
@import "../../index.scss";
.my-tree {
  // width: 400px;
  width: 30vw;
  .el-tree {
    min-height: 300px;
    max-height: 60vh;
    overflow: auto;
  }
}
</style>
