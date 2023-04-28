<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
    <el-form ref="formRef"
             slot="header"
             :model="form"
             size="mini"
             label-width="100px"
             class="search-form no-message"
             @submit.native.prevent="search"
    >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item :label="type === 'securityRules' ? '安全审核人' : '产品线'" prop="name">
            <el-input v-if="type === 'productLine'" v-model="form.name" type="text" placeholder="请输入名称进行模糊查询" />
            <v-organization v-else ref="organizationRef" v-model="form.name" style="width:100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="50px" label="类目" prop="categoryIdList">
            <category-cascader v-model="form.categoryIdList" lazy-multiple width="100%" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="50px" label="状态" prop="status">
            <el-select
              v-model="form.status"
              clearable
              placeholder="请选择状态"
              style="width:100%;"
            >
              <el-option
                v-for="item in lineStatusOptions"
                :key="item.value"
                :value="+item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-button type="primary" native-type="submit">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <g-auth :code="type==='productLine'?'productLineConfig_add':'securityRulesConfig_add'">
              <el-button type="primary" @click="addBtn">新增</el-button>
            </g-auth>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template v-if="type==='productLine'">
      <el-table-column slot="lineName" label="产品线名称" prop="lineName" />
      <el-table-column slot="statusSlot" label="状态" width="100px">
        <template #default="{row}">
          <span :style="{color:row.lineStatus === 1?'#42CE42':'#EC2D2D'}">{{ row.lineStatus === 1? '有效' : '失效' }}</span>
        </template>
      </el-table-column>
    </template>
    <template v-if="type==='securityRules'">
      <el-table-column slot="safetyAuditName" label="安全审核人" prop="safetyAuditName" />
      <el-table-column slot="statusSlot" label="状态" width="100px">
        <template #default="{row}">
          <span :style="{color: row.safeStatus === 1?'#42CE42':'#EC2D2D'}">{{ row.safeStatus === 1? '有效' : '失效' }}</span>
        </template>
      </el-table-column>
    </template>

    <el-table-column slot="categoryListSlot" label="关联类目列表">
      <template #default="{row}">
        <g-text-ellipsis>
          {{ row.categoryList }}
        </g-text-ellipsis>
      </template>
    </el-table-column>

    <template v-if="type === 'securityRules'">
      <g-auth slot="handler" :code="['securityRulesConfig_edit','securityRulesConfig_del']">
        <el-table-column label="操作" width="110px">
          <template #default="{row}">
            <g-auth code="securityRulesConfig_edit">
              <el-button size="mini" type="text" @click="modifyBtn(row.id)">修改</el-button>
            </g-auth>
            <g-auth code="securityRulesConfig_del">
              <el-button size="mini" type="text" @click="delBtn(row.id)">删除</el-button>
            </g-auth>
          </template>
        </el-table-column>
      </g-auth>
    </template>
    <template v-else>
      <g-auth slot="handler" code="productLineConfig_edit">
        <el-table-column label="操作" width="60px">
          <template #default="{row}">
            <el-button size="mini" type="text" @click="modifyBtn(row.id)">修改</el-button>
          </template>
        </el-table-column>
      </g-auth>
    </template>
  </g-table>
</template>

<script>
import ProductModal from './productModal'
import CategoryCascader from '@/components/category-cascader'
import VOrganization from '@/components/organization/index.vue'
import { getDict } from '@/api/common/dict'

export default {
  name: '',
  components: { CategoryCascader, VOrganization },
  props: {
    type: String
  },
  data() {
    return {
      props: {
        multiple: true,
        expandTrigger: 'click',
        label: 'name',
        value: 'id',
        lazy: true,
        lazyLoad(node, resolve) {
          // const { level } = node
          resolve()
        }
      },
      form: {
        status: '',
        categoryIdList: [],
        name: ''
      },
      myData: undefined,
      lineStatusOptions: [],
      defaultColumnConfig: {
        align: 'center'
      },
      tableData: [],
      headers: [
        { slot: true, slotName: 'lineName' },
        { slot: true, slotName: 'safetyAuditName' },
        { slot: true, slotName: 'categoryListSlot' },
        { slot: true, slotName: 'statusSlot' },
        { label: '添加人', prop: 'addName', width: 130 },
        { label: '添加时间', prop: 'createTime', width: 150 },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  computed: {
    update() {
      return this.$listeners.update
    },
    queryById() {
      return this.$listeners.queryById
    },
    delSafety() {
      return this.$listeners.delSafety
    }
  },
  mounted() {
    this.$refs.table.load(1, {})
  },
  created() {
    // 获取产品线状态 - 字典
    getDict('product_line_status', 'pms').then(list => {
      this.lineStatusOptions = list
    })
  },
  methods: {
    fetch({ current, size }, params) {
      const { name = '', status = 0, categoryIdList: ids = '' } = params
      const categoryIdList = ids.toString()
      let data = null
      if (this.type === 'securityRules') {
        const safetyAuditName = typeof name === 'string' ? name : name.name
        data = { safeStatus: status, safetyAuditName, categoryIdList, current, size }
      } else {
        data = { lineStatus: status, lineName: name, categoryIdList, current, size }
      }
      this.myData = data
      return this.$listeners.query({ current, size, ...data }).then(res => {
        return {
          records: res.data, // 列表数据
          total: res.total, // 总记录数
          size: res.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    addBtn() {
      const { type } = this
      const title = type === 'securityRules' ? '新增安全审核人员审核类目' : '新增产品线'
      this.$modal({
        title,
        component: ProductModal,
        data: { type, fnUpdate: this.update },
        callback: this.search
      })
    },
    modifyBtn(id) {
      const { type } = this
      const title = type === 'securityRules' ? '修改安全审核人员审核类目' : '修改产品线'
      this.$modal({
        title,
        component: ProductModal,
        data: { type, id, fnUpdate: this.update, queryById: this.queryById },
        callback: (flag) => {
          if (flag) this.search()
        }
      })
    },
    delBtn(id) {
      this.$confirm('确认要删除该条安全审核数据？', '删除：', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const isOk = await this.delSafety(id)
        if (isOk) {
          this.$message.success('删除成功')
          this.search()
        }
      }).catch(() => { })
    },
    reset() {
      this.type === 'securityRules' && (this.$refs.organizationRef.inputText = '')
      this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-popper.el-cascader__dropdown>.el-cascader-panel{
  width: 100vw!important;
  flex-wrap: wrap!important;
}
// ::v-deep .el-cascader .el-input .el-input__inner{
  // height: 28px!important;
// }
</style>
