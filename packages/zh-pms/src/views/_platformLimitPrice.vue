<template>
  <basic-container v-loading="loading">
    <g-table ref="table" :headers="columns" :fetch="fetch" @selection-change="selectionChange">
      <el-form slot="header"
               ref="formRef"
               :model="form"
               size="mini"
               label-width="50px"
               class="form-col no-message"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="平台" prop="platformCode">
              <el-select v-model="form.platformCode" filterable clearable class="w-100">
                <el-option label="全部" value="" />
                <el-option v-for="item in platformList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU" prop="productSkus" class="w-100">
              <g-multiple-input v-model="form.productSkus" placeholder="请输入SKU，多个使用空格或换行隔开" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label-width="10px">
              <el-button type="primary" @click="search()">搜索</el-button>
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" @click="updateData()">新增</el-button>
              <el-button type="primary" @click="importFile">批量导入</el-button>
              <el-button type="primary" :disabled="checkedIds.length===0" @click="deleteData()">批量删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table-column slot="productSku" label="SKU">
        <template #default="{row}">
          <g-text-ellipsis>{{ row.productSku }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="nwSku" label="牛蛙SKU">
        <template #default="{row}">
          <g-text-ellipsis>{{ row.nwSku }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="100px">
        <template #default="{row}">
          <el-button type="text" size="small" class="p-1" @click="updateData(row)">修改</el-button>
          <el-button type="text" size="small" class="p-1" @click="deleteData(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getList, delItem } from '@/api/platformLimitPrice'
import { getPlatforms } from '@/api/sams'
import platformLimitPriceModal from './modal/platformLimitPriceModal.vue'
import importFileModal from './modal/importFile.vue'

export default {
  name: 'PmsPlatformLimitPrice',
  data() {
    return {
      checkedIds: [],
      platformList: [],
      form: {
        platformCode: '',
        productSkus: []
      },
      tableData: [],
      columns: [
        { type: 'selection' },
        { label: '限价平台', prop: 'platformName' },
        { slot: true, slotName: 'productSku' },
        { slot: true, slotName: 'nwSku' },
        { label: '最低销售价(USD)', prop: 'lowestSellingPrice', width: '120px' },
        { label: '创建人', prop: 'createUserName' },
        { label: '创建时间', prop: 'createTime' },
        { slot: true, slotName: 'handler' }
      ],
      loading: true
    }
  },
  mounted() {
    this.getPlatforms().finally(() => {
      this.loading = false
      this.search()
    })
  },
  methods: {
    // 获取平台列表
    getPlatforms() {
      return getPlatforms().then(res => {
        this.platformList = res || []
      })
    },
    fetch({ current, size }, params) {
      return getList({ pageParam: { current, size }, ...params }).then(res => res.data)
    },
    search(page = 1) {
      this.$refs.table.load(page, this.form)
    },
    // 新增、修改数据
    updateData(row = {}) {
      const { platformCode, productSku = '', lowestSellingPrice } = row
      const platformList = this.platformList
      this.$modal({
        title: platformCode ? '修改' : '新增',
        width: '500px',
        component: platformLimitPriceModal,
        data: {
          isEdit: !!platformCode,
          formData: { platformCode, productSku, lowestSellingPrice },
          platformList
        },
        callback: bool => {
          if (bool) this.search(-1)
        }
      })
    },
    //  删除数据
    deleteData(id) {
      const data = id ? [id] : this.checkedIds
      const title = id ? '删除' : '批量删除'
      this.$confirm('确定要删除?', title, { type: 'warning' }).then(() => {
        delItem(data).then(res => {
          this.$message.success(res.msg)
          this.search(-1)
        })
      }).catch()
    },
    // 选择ids
    selectionChange(selection) {
      this.checkedIds = []
      selection.forEach(item => {
        this.checkedIds.push(item.id)
      })
    },
    importFile() {
      this.$modal({
        width: '500px',
        title: '批量导入',
        component: importFileModal,
        callback: bool => {
          if (bool) this.search(-1)
        }
      })
    },
    reset() {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>
