// 复制spu/sku
<template>
  <div class="spu-copy">
    <el-form size="mini" label-width="120px" class="form-col no-message" @submit.native.prevent="getList">
      <el-form-item label="SPU编码">
        <div class="d-flex">
          <el-input v-model="spuCode" placeholder="请输入SPU编码进行查询" />
          <el-button type="primary" native-type="submit" class="ms-1">查询</el-button>
        </div>
      </el-form-item>
      <el-form-item label="SPU名称">
        <el-input v-model="spuName" readonly type="textarea" resize="none" :autosize="{ minRows: 1, maxRows: 6 }" />
      </el-form-item>
    </el-form>
    <el-row type="flex">
      <el-col :span="12">
        <el-card>
          <div slot="header">可复制SKU列表</div>
          <div style="height:387px">
            <g-table ref="table"
                     v-loading="loading"
                     :headers="headers"
                     :fetch="fetch"
                     :page-size="8"
                     page-layout="total, prev, pager, next, jumper"
                     @rendered="toggleRowSelection"
                     @select="select"
                     @select-all="select"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="ms-1">
        <el-card>
          <div slot="header">待复制SKU列表 （已勾选{{ checked.length }}个）</div>
          <el-table :data="checked" border stripe size="small" height="345px" class="g-table">
            <el-table-column v-for="item in getHeaders().slice(1)" :key="item.label" v-bind="item" />
            <el-table-column label="操作" width="56px">
              <template slot-scope="scope">
                <el-button type="text" size="mini" class="py-0" @click="removeChecked(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="text-end mt-2">
            <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
            <el-button type="success" size="mini" :loading="submitting" :disabled="checked.length===0" @click="submit">保存</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { saveCopySpu, getCanCopySpuAndSku } from '@/api/sku'
import { getDict } from '@/api/common/dict'

export default {
  props: {
    // spu编码
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      submitting: false,
      spuCode: this.code.trim(),
      cacheCode: '', // 缓存搜索的spu code，避免删除搜索条件再分页时出错
      spuName: '',
      allSkuList: [], // 所有的sku列表(sku列表是一次性加载出来的)
      checked: [], // 勾选列表
      statusList: [], // 状态列表
      headers: this.getHeaders()
    }
  },
  created() {
    this.getData().then(() => {
      if (this.code) {
        this.getList()
      }
    })
  },
  methods: {
    getHeaders() {
      return [
        { type: 'selection' },
        { label: 'SKU编码', prop: 'productSku', width: '90px' },
        { label: 'SKU名称', prop: 'productName', showOverflowTooltip: true },
        { label: 'SKU状态', prop: 'statusName', width: '74px' }
      ]
    },
    getList() {
      if (this.loading) return
      const code = this.spuCode.trim()

      if (code === '') return this.$message.error('请输入SPU编码')

      this.loading = true
      // this.$parent.$emit('loading', true)
      getCanCopySpuAndSku({ productSpu: code }).then(({ data }) => {
        this.checked = []
        this.cacheCode = data.productSpu
        this.spuName = data.productName
        this.allSkuList = data.lstCanCpSku.map(item => {
          const status = this.statusList.find(el => el.value === String(item.status))
          item.statusName = status?.label
          item.id = item.productSku // 勾选需要用到id（具有唯一性即可）
          return item
        })
        this.$refs.table.load(1)
      }).finally(() => {
        this.loading = false
      })
    },
    fetch({ current, size }) {
      return Promise.resolve({
        records: this.allSkuList.slice((current - 1) * size, current * size),
        total: this.allSkuList.length
      })
    },
    // 获取状态字典
    getData() {
      return getDict('sku_status', 'pms').then(list => {
        this.statusList = list
      })
    },
    // 勾选
    select(checkedList = [], row) {
      // 单个勾选
      if (row) {
        if (checkedList.includes(row)) {
          this.checked.push(row)
        } else {
          this.checked = this.checked.filter(item => {
            return item.id !== row.id
          })
        }
      } else {
        // 不管全选还是反选，都将skuList中的项全部从checked中移除
        const rest = this.checked.filter(item => {
          // 过滤掉所有在 checked 中的 list
          return this.$refs.table.tableList.findIndex(el => el.id === item.id) === -1
        })

        // 如果是全选，则将list中的项全部插入checked中
        if (checkedList.length > 0) {
          rest.push(...checkedList)
        }

        this.checked = rest
      }
    },
    // 处理勾选（根据已勾选的记录处理list列表勾选状态）
    toggleRowSelection(skuList) {
      this.checked.forEach(el => {
        const d = skuList.find(item => item.id === el.id)
        d && this.$refs.table.tableRef.toggleRowSelection(d, true)
      })
    },
    // 移除勾选项
    removeChecked({ $index, row }) {
      const $this = this.$refs.table
      const i = $this.tableList.findIndex(item => item.id === row.id)
      if (i > -1) {
        $this.tableRef.toggleRowSelection($this.tableList[i], false)
      }
      this.checked.splice($index, 1)
    },
    submit() {
      // 没有获取到spu则阻止保存数据
      if (!this.cacheCode) {
        return this.$message.error('没有可复制的SPU')
      }

      if (this.submitting) return

      this.submitting = true
      saveCopySpu({
        productSpu: this.cacheCode,
        lstProductSku: this.checked.map(item => item.productSku)
      }).then(res => {
        this.$message.success(res.msg)
        this.$parent.$emit('close', true)
      }).finally(() => {
        this.submitting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.spu-copy ::v-deep {
  .el-card__body {
    padding: 0.25rem;
  }
  .el-row--flex {
    .el-col {
      margin-bottom: 0px;
    }
  }
}
</style>
