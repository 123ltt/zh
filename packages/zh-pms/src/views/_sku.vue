<template>
  <basic-container>
    <g-table ref="table" :headers="columns" :fetch="fetch">
      <el-form slot="header"
               :model="form"
               size="mini"
               label-width="94px"
               class="form-col no-message"
               @submit.native.prevent="search"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="类目" label-width="70px">
              <category-cascader v-model="form.categoryIds" lazy-multiple width="100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SPU编码">
              <g-multiple-input v-model="form.productSpuList" type="text" placeholder="SPU编码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="牛蛙SKU编码">
              <g-multiple-input v-model="form.nwSkuList" placeholder="牛蛙SKU编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="状态" label-width="70px">
              <el-select v-model="form.status" clearable placeholder="请选择">
                <el-option v-for="(val,key) in statusMapping" :key="key" :value="+key" :label="val" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否自动同步">
              <el-select v-model="form.isSyncNw" clearable placeholder="请选择">
                <el-option :value="1" label="是" />
                <el-option :value="0" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU编码">
              <g-multiple-input v-model="form.productSkuList" type="text" placeholder="SKU编码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU名称">
              <el-input v-model="form.productNameSku" type="text" placeholder="SKU名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="10px">
              <el-button type="primary" native-type="submit">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table-column slot="imageUrl" label="缩略图" width="70">
        <template #default="{row}">
          <g-thumb :url="row.imageUrl" class="d-table-cell" />
        </template>
      </el-table-column>
      <el-table-column slot="productName" label="SKU名称">
        <template #default="{row}">
          <g-link @click="saveSpuHandler(row)">
            <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column slot="productSku" label="编码" width="120">
        <template #default="{row}">
          <g-link color="primary" @click="saveSpuHandler(row)">{{ row.productSku }}</g-link>
        </template>
      </el-table-column>
      <el-table-column slot="sync" label="是否同步" width="75" align="center">
        <template #default="{row}">
          <i v-if="row.syncing" class="el-icon-loading" />
          <el-switch v-show="!row.syncing" v-model="row.isSyncNw" :active-value="1" :inactive-value="0" @change="val=>changeSyncStatus(row,val)" />
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="120px">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="p-1" @click="configSkuAttr(scope.row)">配置属性</el-button><br>
          <el-button type="text" size="small" class="p-1" @click="duplicate(scope.row)">复制为新SKU</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getList, duplicateSku, updateNWSyncStatus } from '@/api/sku'
import CategoryCascader from '@/components/category-cascader/index.vue'
import VConfigureProps from './configureProps.vue'
import { getDict } from '@/api/common/dict'

export default {
  name: 'PmsSku',
  components: { CategoryCascader },
  data() {
    return {
      form: this.formField(),
      tableData: [],
      columns: [
        { slot: true, slotName: 'imageUrl' },
        { label: 'SPU编码', prop: 'productSpu', width: 120 },
        { slot: true, slotName: 'productName' },
        { slot: true, slotName: 'productSku' },
        { label: '牛蛙SKU编码', prop: 'nwProductCode', width: 120 },
        {
          label: '状态',
          prop: 'status',
          width: '120',
          formatter: (row, column, cellValue, index) => this.statusMapping[cellValue]
        },
        { slot: true, slotName: 'sync' },
        { slot: true, slotName: 'handler' }
      ],
      statusMapping: {}
    }
  },
  created() {
    if (this.$route.params.condition) {
      const { productSpu } = this.$route.params.condition
      this.form.productSpuList.push(productSpu)
    }
  },
  mounted() {
    this.getDict().then(() => {
      this.$refs.table.load(1, this.form)
    })
  },
  methods: {
    getDict() {
      return getDict('sku_status', 'pms').then(list => {
        this.statusMapping = list.reduce((prev, { value, label }) => {
          prev[value] = label
          return prev
        }, {})
      })
    },
    formField() {
      return {
        type: 2,
        productSpuList: [],
        categoryIds: [],
        productNameSku: null,
        productSkuList: [],
        status: null,
        nwSkuList: [],
        isSyncNw: null
      }
    },
    findName(arr, index) {
      if (!arr.length) return index
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value - index === 0) {
          return arr[i].label
        }
      }
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        res.data.records.forEach(item => {
          item.syncing = false
        })
        return res.data
      })
    },
    search() {
      this.$refs.table.load(1, this.form)
    },
    reset() {
      this.form = this.formField()
    },
    changeSyncStatus(data = {}, val) {
      data.syncing = true
      updateNWSyncStatus({ type: 2, productSku: data.productSku, isSyncNw: val })
        .catch(() => {
          data.isSyncNw = val === 1 ? 0 : 1
        })
        .finally(() => {
          data.syncing = false
        })
    },
    configSkuAttr(data) {
      this.$modal({
        title: '配置SKU属性',
        width: '900px',
        component: VConfigureProps,
        data: { myData: data, type: 2 }
      })
    },
    // 修改spu
    saveSpuHandler(data = {}) {
      this.$newPage({
        path: '/pms/product/edit',
        data: { code: data.productSku },
        callback: refresh => {
          refresh && this.$refs.table.load(0)
        }
      })
    },
    // 复制为新的sku
    duplicate(data) {
      this.$confirm(`确定要复制【${data.productName}】吗？`, '操作确认', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          const m = this.$message({
            message: '正在复制中...',
            duration: 0,
            type: 'warning'
          })
          duplicateSku(data.productSku).then(res => {
            if (res.success) this.$refs.table.load(0)
            this.$message({
              type: res.success ? 'success' : 'error',
              message: res.msg
            })
          }).finally(() => {
            m.close()
          })
        })
        .catch(console.info)
    }
  }
}
</script>
