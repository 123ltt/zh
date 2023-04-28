// sku归属
<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" :page-show="false" :diff-height="62">
      <el-form slot="header" inline size="mini" class="no-message" @submit.native.prevent="insert">
        <el-form-item label="SPU编码">
          <g-multiple-input v-model="searchForm.productSpuList" style="width:200px" placeholder="多个使用换行或空格隔开" />
        </el-form-item>
        <el-form-item label="牛蛙SPU编码">
          <g-multiple-input v-model="searchForm.nwSpuList" style="width:200px" placeholder="多个使用换行或空格隔开" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" native-type="submit" :disabled="total===0||submitting">添加</el-button>
        </el-form-item>
      </el-form>

      <el-table-column slot="categoryPath" label="类目名称" width="200">
        <template #default="{row}">
          <g-text-ellipsis lines="2">{{ row.categoryPath }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="productName" label="SPU名称">
        <template slot-scope="{row}">
          <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="slotStatus" label="状态" width="80px">
        <template slot-scope="{row}">
          <span>{{ getStatusLabel(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="80px">
        <template slot-scope="{row}">
          <el-button size="small" type="text" @click="remove(row)">移除</el-button>
        </template>
      </el-table-column>
    </g-table>
    <div class="p-2 pb-0">
      <el-form ref="form" inline size="mini" :rules="rules" :model="form" @submit.native.prevent="submit">
        <el-form-item label="SKU归属" prop="belonging">
          <div style="width:260px">
            <el-cascader v-model="form.belonging"
                         :props="cascaderProps"
                         :options="orgTree"
                         collapse-tags
                         :show-all-levels="false"
                         clearable
                         class="w-100"
            />
          </div>
        </el-form-item>
        <el-form-item prop="count">
          <span>已选择<b class="text-primary mx-1">{{ form.count }}</b>个SPU</span>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :loading="submitting">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </basic-container>
</template>

<script>
import { getDict } from '@/api/common/dict'
import { getSXUList, getTenantOrganizationTree, saveSkuBelonging } from '@/api/sku'
import { customRule } from '@/util/formRules'

export default {
  name: 'PmsSkuBelonging',
  data() {
    return {
      statusList: [],
      searchForm: {
        productSpuList: [],
        nwSpuList: []
      },
      form: {
        belonging: [],
        count: 0
      },
      rules: {
        belonging: [customRule(v => Array.isArray(v) && v.length === 0, '请选择SKU归属', 'change')],
        count: [customRule(v => v === 0, '请添加SPU')]
      },
      list: [],
      cascaderProps: {
        multiple: true,
        label: 'title'
      },
      orgTree: [],
      loading: false,
      submitting: false
    }
  },
  computed: {
    headers() {
      return [
        { slot: true, slotName: 'categoryPath' },
        { slot: true, slotName: 'productName' },
        { label: 'SPU编码', prop: 'productSpu', width: '100px' },
        { label: '牛蛙SPU编码', prop: 'nwProductCode', width: '100px' },
        { slot: true, slotName: 'slotStatus' },
        { slot: true, slotName: 'handler' }
      ]
    },
    total() {
      return this.searchForm.productSpuList.length + this.searchForm.nwSpuList.length
    }
  },
  watch: {
    'form.count'() {
      this.$refs.form.clearValidate(['count'])
    }
  },
  created() {
    this.getData()
  },
  methods: {
    fetch() {
      return Promise.resolve({ records: this.list })
    },
    getData() {
      getDict('sku_status', 'pms').then(res => {
        this.statusList = res
      })
      getTenantOrganizationTree().then(res => {
        this.orgTree = res.data
      })
    },
    getStatusLabel(status) {
      return this.statusList.find(item => item.value === String(status))?.label || ''
    },
    insert() {
      if (this.loading) return
      this.loading = true
      getSXUList(
        {
          type: 1,
          productSpuList: this.searchForm.productSpuList,
          nwSpuList: this.searchForm.nwSpuList
        },
        { current: 1, size: this.total }
      ).then(res => {
        const records = res.data?.records || []
        if (records.length === 0) return this.$message.error('未找到添加的内容')

        records.forEach(item => {
          if (!this.list.some(el => el.id === item.id)) {
            this.list.unshift(item)
          }
        })

        this.form.count = this.list.length
        this.$refs.table.load(1)
      }).finally(() => {
        this.loading = false
      })
    },
    remove(data) {
      this.list.forEach((item, index) => {
        if (item.id === data.id) {
          this.list.splice(index, 1)
        }
      })
      this.form.count = this.list.length
      this.$refs.table.load(1)
    },
    submit() {
      if (this.submitting) return
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          const productSpus = this.list.map(el => el.productSpu)
          const orgIds = this.form.belonging.map(el => el[el.length - 1])
          saveSkuBelonging({ productSpus, orgIds }).then(res => {
            this.reset()
            this.$message.success(res.msg)
          }).finally(() => {
            this.submitting = false
          })
        }
      })
    },
    reset() {
      this.searchForm.productSpuList = []
      this.searchForm.nwSpuList = []
      this.list = []
      this.$refs.table.load(1)
      this.form.belonging = []
      this.form.count = 0
    }
  }
}
</script>
