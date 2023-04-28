<template>
  <div>
    <el-form ref="formRef" :model="dialogForm" :rules="rules" size="mini" label-width="100px" class="search-form">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item :label="type==='securityRules'?'安全审核人':'产品线名称'" prop="name">
            <el-input v-if="type === 'productLine'" v-model="dialogForm.name" type="text" style="width:100%;" />
            <el-input v-else-if="id" v-model="dialogForm.name" :disabled="true" />
            <v-organization v-else v-model="dialogForm.name" style="width:100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="60px" label="状态" prop="status">
            <el-switch v-model="dialogForm.status" :inactive-value="2" :active-value="1" inactive-text="否" active-text="是" active-color="#1abc9c" inactive-color="#ccc" class="inner-text-switch" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input v-model="dialogForm.description" :maxlength="LIMIT.content" type="textarea" style="width:100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="24" style="height: 400px;overflow:auto;">
          <el-form-item label="类目列表" prop="categoryIdLongList">
            <el-tree ref="tree"
                     key="tree"
                     v-loading="loading"
                     :data="treeData"
                     :load="loadNode"
                     lazy

                     :props="defaultProps"
                     :default-checked-keys="dialogForm.categoryIdLongList"
                     :default-expanded-keys="expandedKeys"
                     :expand-on-click-node="false"
                     show-checkbox
                     node-key="id"
                     accordion
                     class="filter-tree"
                     @check="check"
            >
              <template slot-scope="{data}">
                <g-text-ellipsis style="white-space:normal"> {{ data.fullName }}</g-text-ellipsis>
              </template>
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div class="btn">
      <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
      <el-button type="primary" size="mini" @click="close(false)">取消</el-button>
    </div>
  </div>
</template>

<script>
import { LIMIT } from '@/config/form'
import { getChildren } from '@/api/categoryManagement'
import VOrganization from '@/components/organization/index.vue'
export default {
  name: 'ProductModal',
  components: { VOrganization },
  props: {
    type: String,
    id: String,
    fnUpdate: Function,
    queryById: Function
  },
  data() {
    return {
      LIMIT,
      isInit: true,
      expandedKeys: [],
      fullPath: [],
      defaultKeys: [],
      dialogForm: {
        name: '',
        status: 1,
        categoryIdLongList: [],
        categoryStringList: [],
        description: ''
      },
      loading: false,
      treeData: [],
      noOffspringIds: [],
      defaultProps: {
        children: 'children',
        label: 'fullName',
        multiple: true
      },
      rules: {
        name: {
          required: true,
          message: this.type === 'securityRules' ? '安全审核人不能为空' : '产品线名称不能为空',
          trigger: ['change', 'blur']
        }
      }
    }
  },
  created() {
    const { id, type } = this
    const isSafe = type === 'securityRules'

    id && this.queryById(id).then(res => {
      const { code, data } = res
      const defaultKeys = []
      code === 200 && Object.keys(this.dialogForm).forEach(item => {
        switch (item) {
          case 'name':
            this.dialogForm[item] = isSafe ? data.safetyAuditName : data.lineName
            break
          case 'status':
            this.dialogForm[item] = isSafe ? data.safeStatus : data.lineStatus
            break
          case 'categoryIdLongList':
            this.fullPath = JSON.parse(data.categoryIdList)
            JSON.parse(data.categoryIdList).forEach(item => {
              defaultKeys.push(item[item.length - 1])
            })
            this.defaultKeys = defaultKeys
            break
          case 'categoryStringList':
            this.dialogForm[item] = data.categoryList.split(',')
            break
          default:
            this.dialogForm[item] = data[item]
            break
        }
      })
    })
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate(async(bool, obj) => {
        if (!bool) return
        const msg = await this.updateLine()
        this.$message({
          type: msg.code === 0 ? 'success' : 'error',
          message: msg.msg
        })
        this.close()
      })
    },
    // 新增、修改产品线配置
    async updateLine() {
      const { name, status, ...other } = this.dialogForm
      const { id, type } = this
      let data = null
      if (type === 'securityRules') {
        const safetyAuditName = typeof name === 'string' ? name : name.name
        data = { safeStatus: status, safetyAuditName, ...other }
      } else {
        data = { lineStatus: status, lineName: name, ...other }
      }
      if (id) data.id = id
      const res = await this.fnUpdate(data)
      if (res.code === 200) return { code: 0, msg: id ? '修改成功' : '新增成功' }
      return { code: 1, msg: id ? '修改失败' : '新增失败' }
    },
    close(flag = true) {
      // 关闭弹窗
      this.$parent.$emit('close', flag)
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        this.loading = true
        const res = await getChildren()
        this.loading = false
        this.fullPath.forEach(ids => {
          this.expandedKeys.push(...ids)
        })
        const data = this.mapTree(res.data)
        return resolve(data)
      } else {
        const res = await getChildren(node.key)
        const data = this.mapTree(res.data)
        return resolve(data)
      }
    },
    mapTree(arr) {
      return arr.map(item => {
        if (this.defaultKeys.includes(item.id)) {
          this.dialogForm.categoryIdLongList.unshift(item.id)
        }
        item.fullName = `${item.name} (${item.nameEn})`
        return item
      })
    },
    getNoOffspringIds(data) { // 获取没有后代的tree node id
      const leafIds = []
      const arr = Array.isArray(data) ? data : [data]
      arr.forEach(node => {
        if (node.isLeaf) leafIds.push(node.id)
        else if (node.children && node.children.length) leafIds.push(...this.getNoOffspringIds(node.children))
      })
      return leafIds
    },
    check(data, node) {
      const categoryStringList = []
      const categoryIdLongList = []
      node.checkedNodes.forEach(item => {
        // if (this.noOffspringIds.includes(item.id)) {
        categoryStringList.push(item.name)
        categoryIdLongList.push(item.id)
        // }
      })
      this.dialogForm.categoryStringList = categoryStringList
      this.dialogForm.categoryIdLongList = categoryIdLongList
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  text-align: right;
}
// elementui开关按钮-文字在里面显示
::v-deep .inner-text-switch {
  .el-switch__label--left {
    position: relative;
    left: 45px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__core {
    width: 50px !important;
  }
  .el-switch__label--right {
    position: relative;
    right: 46px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__label--right.is-active {
    z-index: 1111;
    color: #fff !important;
  }
  .el-switch__label--left.is-active {
    z-index: 1111;
    color: #9c9c9c !important;
  }
}
</style>
