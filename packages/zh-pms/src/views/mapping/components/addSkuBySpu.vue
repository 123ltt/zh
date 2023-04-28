<template>
  <div style="height:400px;" class="w-100 d-flex align-items-stretch">
    <div class="h-100 flex-grow-1 overflow-hidden">
      <g-table ref="table"
               :fetch="fetch"
               :headers="headers"
               row-key="id"
               page-layout="total, prev, pager, next, jumper"
               :pager-count="5"
               @rendered="toggleRowSelection"
               @select="select"
               @select-all="select"
      >
        <el-form slot="header" size="mini" inline class="no-message" @submit.native.prevent="onSearch">
          <el-form-item label="SPU编码">
            <el-input v-model.trim="spuCode" />
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" :disabled="spuCode.length===0||loading" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table-column slot="productName" label="产品名称">
          <template #default="{row}">
            <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column slot="type" label="类型" width="50px">SKU</el-table-column>
      </g-table>
    </div>
    <div class="ms-1 flex-shrink-0" style="width:320px;">
      <div class="mt-1" style="padding:6px 0">已选择的SKU列表（已选{{ checkedList.length }}个）</div>
      <el-table :data="checkedList" border stripe size="small" class="g-table g-table-dense" height="calc(100% - 73px)">
        <el-table-column label="SKU编码" width="120">
          <template #default="{row}">
            {{ row.skuCode }}
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template #default="{row}">
            <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="py-0" @click="onRemove(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-end mt-1">
        <el-button size="mini" @click="onCancel">取消</el-button>
        <el-button type="success" size="mini" :disabled="checkedList.length===0" @click="onConfirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getSXUList } from '@/api/sku'

export default {
  data() {
    return {
      loading: false,
      spuCode: '',
      statusMapping: {},
      checkedList: [],
      checkedIds: [],
      categoryId: '',
      categoryName: ''
    }
  },
  computed: {
    headers() {
      return [
        { type: 'selection' },
        { slot: true, slotName: 'type' },
        { label: '编码', prop: 'productSku', width: 120 },
        { slot: true, slotName: 'productName' }
      ]
    }
  },
  methods: {
    fetch(page, params) {
      this.loading = true
      return getSXUList(params, page, this).then(res => {
        if (res.data.records.length === 0) return this.$message.info('未查询到数据')
        return res.data
      }).finally(() => {
        this.loading = false
      })
    },
    // 处理勾选（根据已勾选的记录处理list列表勾选状态）
    toggleRowSelection(list) {
      this.checkedList.forEach(el => {
        const d = list.find(item => item.id === el.id)
        d && this.$refs.table.tableRef.toggleRowSelection(d, true)
      })
    },
    // 勾选
    select(checkedList = [], row) {
      // 单个勾选
      if (row) {
        if (checkedList.includes(row)) {
          this.checkedList.push(this.buildItemData(row))
        } else {
          this.checkedList = this.checkedList.filter(item => {
            return item.id !== row.id
          })
        }
      } else {
        // 不管全选还是返回，都将list中的项全部从checked中移除
        const rest = this.checkedList.filter(item => {
          // 过滤掉所有在 checked 中的 list
          return this.$refs.table.tableList.findIndex(el => el.id === item.id) === -1
        })

        // 如果是全选，则将list中的项全部插入checked中
        if (checkedList.length > 0) {
          rest.push(...checkedList.map(item => this.buildItemData(item)))
        }

        this.checkedList = rest
      }

      if (checkedList.length > 0) {
        this.categoryId = checkedList[0].categoryId
        this.categoryName = checkedList[0].categoryPath
      }
    },
    buildItemData(el = {}, idFieldName = 'id') {
      return {
        id: el[idFieldName],
        title: el.productName,
        skuCode: el.productSku,
        spuCode: el.productSpu
      }
    },
    onSearch() {
      if (this.spuCode && !this.loading) {
        this.checkedList = []
        this.checkedIds = []
        this.$refs.table.load(1, { productSpuList: [this.spuCode], type: 2 })
      }
    },
    onRemove({ $index, row }) {
      const $this = this.$refs.table
      const i = $this.tableList.findIndex(item => item.id === row.id)
      if (i > -1) {
        $this.tableRef.toggleRowSelection($this.tableList[i], false)
      }
      this.checkedList.splice($index, 1)
    },
    onCancel() {
      this.$parent.$emit('close')
    },
    onConfirm() {
      if (this.checkedList.length > 0) {
        const data = {
          categoryId: this.categoryId,
          categoryName: this.categoryName,
          spuCode: this.spuCode,
          skuList: [].concat(this.checkedList)
        }
        this.$parent.$emit('close', data)
      }
    }
  }
}
</script>
