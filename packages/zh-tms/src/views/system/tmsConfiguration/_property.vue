<template>
  <!-- 属性配置 -->
  <basic-container>
    <el-form size="mini" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="属性名称：" prop="getProperty">
            <el-input v-model="formData.getProperty" placeholder="请输入完整属性" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="getCategorAll">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tree />
    <div class="treeDiv">
      <el-tree
        :data="treeData"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data}" class="custom-tree-node">
          <span>{{ data.propertyName }}</span>
          <div class="buttonStyle">
            <el-button type="text" size="mini" @click="() => append(data)">新增子属性</el-button>
            <el-button v-if="data.id!==0" type="text" size="mini" @click="()=>edit(node,data)">编辑</el-button>
            <!-- <el-button v-if="data.id!==0" type="text" size="mini" @click="() => remove(node, data)">删除</el-button> -->
          </div>
        </span>
      </el-tree>
    </div>
  </basic-container>
</template>
<script>
import { getProperty, AddProperty, UpdateProperty, DeleProperty } from '@/api/property'
import viewPort from './configurationModal/viewPort'
export default {

  data() {
    return {
      id: ~~((Math.random() * ~~(new Date())) / 1000),
      formData: {
      },
      treeData: [{ id: 0, propertyName: '属性类目' }],
      defaultExpandedKeys: [0]
    }
  },
  mounted() {
    this.getCategorAll()
  },
  methods: {
    getCategorAll() {
      this.treeLoading = true
      getProperty(this.formData.getProperty).then(res => {
        const { code, data } = res
        if (code === 200) {
          this.treeData = [{ id: 0, children: data, propertyName: '属性类目' }]
        }
      }).finally(() => { this.treeLoading = false })
    },
    append(data) {
      this.$modal({
        title: '新增子属性',
        width: '400px',
        component: viewPort,
        data: {
          data,
          type: 'add'
        },
        callback: (flag, { propertyName }) => {
          flag && AddProperty(data.id, propertyName).then(res => {
            const newChild = { id: res.data, propertyName, children: [] }
            if (!data.children) {
              this.$set(data, 'children', [])
            }
            data.children.push(newChild)
            this.defaultExpandedKeys.splice(1, 1, data.id)
            this.$message.success(res.msg)
          })
        }
      })
    },
    edit(node, data) {
      const { id } = data
      this.$modal({
        title: '修改属性名称',
        width: '400px',
        component: viewPort,
        data: {
          data
        },
        callback: (flag, { propertyName }) => {
          flag && UpdateProperty(id, node.parent.key, propertyName).then(res => {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const getFind = children.find(d => d.id === data.id)
            this.$set(getFind, 'propertyName', propertyName)
          })
        }
      })
    },
    remove(node, data) {
      this.$confirm(`确定要删除该属性：${data.propertyName} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'appendClass'
      }).then(() => {
        if (data.children.length > 0) return this.$message.error('请先删除子节点')
        DeleProperty(data.id, data.parentId, data.propertyName).then(res => {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
          this.$message.success(res.msg)
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tree__empty-text {
  display: none;
}
// .treeDiv {
//   position: relative;
//   left: 100px;
//   top: -50px;
//   .buttonStyle{
//     margin-left: 200px;
//     display: inline-block;
//   }
// }
::v-deep .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
::v-deep .appendClass > .el-message-box__content {
  color: red !important;
  display: flex;
  align-items: center;
  .el-message-box__input {
    margin-top: 0;
  }
}
.buttonStyle{
  width:136px
}
.bottom-btn {
  text-align: right;
  margin-top: 10px;
  // margin-bottom: 20px;
}
::v-deep .el-dialog__body {
  padding: 0 20px 10px;
}
::v-deep .el-tree{
  height: 0;
}
</style>
