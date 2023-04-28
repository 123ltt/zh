<template>
  <basic-container>
    <g-table ref="table" :headers="columns" :fetch="fetch">
      <el-form ref="formRef" slot="header" :model="form" size="mini" label-width="94px" class="form-col no-message" @submit.native.prevent="search">
        <el-row>
          <el-col :span="9">
            <el-form-item label="类目">
              <category-cascader v-model="form.categoryIds" lazy-multiple width="100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SPU编码">
              <g-multiple-input v-model="form.productSpuList" placeholder="SPU编码" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="牛蛙SPU编码">
              <g-multiple-input v-model="form.nwSpuList" placeholder="牛蛙SPU编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="form.status" clearable placeholder="请选择">
                <el-option v-for="item in statusOptions" :key="item.value" :value="+item.value" :label="item.label" />
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
          <el-col :span="8">
            <el-form-item label="SPU名称">
              <el-input v-model="form.productNameSpu" type="text" placeholder="请输入关键词进行模糊查询" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="10px">
              <el-button type="primary" native-type="submit">搜索</el-button>
              <el-button type="secondary" @click="reset">重置</el-button>
              <el-button type="success" @click="saveSpuHandler()">新增</el-button>
              <el-button type="success" @click="copySpu()">复制SPU/SKU</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table-column slot="imageUrl" label="缩略图" width="70">
        <template #default="{row}">
          <g-thumb :url="row.imageUrl" class="d-table-cell" />
        </template>
      </el-table-column>
      <el-table-column slot="productName" label="SPU名称">
        <template #default="{row}">
          <g-link @click="saveSpuHandler(row)">
            <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column slot="productSpu" label="编码" width="120">
        <template #default="{row}">
          <g-link color="primary" @click="saveSpuHandler(row)">{{ row.productSpu }}</g-link>
        </template>
      </el-table-column>
      <el-table-column slot="skuCount" label="SKU数量" width="90">
        <template #default="{row}">
          <el-button type="text" :disabled="!row.skuCount" @click="querySkuList(row)">{{ row.skuCount || 0 }}</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="sync" label="是否同步" width="75" align="center">
        <template #default="{row}">
          <i v-if="row.syncing" class="el-icon-loading" />
          <el-switch v-show="!row.syncing" v-model="row.isSyncNw" :active-value="1" :inactive-value="0" @change="val=>changeSyncStatus(row,val)" />
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" class="p-1" @click="generateSku(scope.row)">生成SKU</el-button>
          <el-button size="mini" type="text" class="p-1" @click="copySpu(scope.row)">复制SPU</el-button><br>
          <el-button size="mini" type="text" class="p-1" @click="configSpuAttr(scope.row)">配置属性</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getList, updateNWSyncStatus } from '@/api/sku'
import { mapGetters } from 'vuex'
import CategoryCascader from '@/components/category-cascader/index.vue'
import VConfigureProps from './configureProps.vue'
import VSkuGenerate from './skuGenerate.vue'
import VSpuCopy from './spuCopy.vue'
import { getDict } from '@/api/common/dict'

export default {
  name: 'PmsSpu',
  components: { CategoryCascader },
  data() {
    return {
      form: this.getForm(),
      statusOptions: [],
      columns: [
        { slot: true, slotName: 'imageUrl' },
        { slot: true, slotName: 'productName' },
        { slot: true, slotName: 'productSpu' },
        { slot: true, slotName: 'skuCount' },
        { label: '牛蛙SPU编码', prop: 'nwProductCode', width: 120 },
        {
          label: '状态',
          prop: 'status',
          width: 120,
          formatter: (row, column, cellValue, index) => this.findName(this.statusOptions, cellValue)
        },
        { slot: true, slotName: 'sync' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.getAllDictionary()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    getForm() {
      return {
        type: 1,
        categoryIds: [],
        productNameSpu: null,
        productSpuList: [],
        nwSpuList: [],
        status: null,
        isSyncNw: null
      }
    },
    getAllDictionary() {
      // 字典-审批状态
      getDict('sku_status', 'pms').then(list => {
        this.statusOptions = list
      })
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
      this.form = this.getForm()
    },
    // 新增与修改spu
    saveSpuHandler(data = {}) {
      const code = data.productSku
      const isEdit = code !== undefined && code !== null
      this.$newPage({
        path: '/pms/product/' + (isEdit ? 'edit' : 'add'),
        data: isEdit ? { code } : undefined,
        callback: refresh => {
          if (refresh) {
            if (isEdit) {
              this.$refs.table.load(0)
            } else {
              // 如果是新增，则清空条件并跳到第一页
              this.reset()
              this.$refs.table.load(1, this.form)
            }
          }
        }
      })
    },
    changeSyncStatus(data = {}, val) {
      data.syncing = true
      updateNWSyncStatus({ type: 1, productSpu: data.productSpu, isSyncNw: val })
        .catch(() => {
          data.isSyncNw = val === 1 ? 0 : 1
        })
        .finally(() => {
          data.syncing = false
        })
    },
    querySkuList(data) {
      this.$router.push({
        name: 'PmsSku',
        params: {
          condition: {
            productSpu: data.productSpu
          }
        }
      }, true)
    },
    configSpuAttr(data) {
      this.$modal({
        title: '配置SPU属性',
        width: '900px',
        component: VConfigureProps,
        data: { myData: data, type: 1 }
      })
    },
    generateSku(data) {
      this.$modal({
        title: `生成SKU - <span class="text-primary fs-6 fw-normal">${data.productName}</span>`,
        component: VSkuGenerate,
        width: '80%',
        data: { myData: data },
        callback: reload => {
          reload && this.$refs.table.load(0)
        }
      })
    },
    copySpu(data) {
      this.$modal({
        title: '复制SPU/SKU',
        component: VSpuCopy,
        data: { code: data ? data.productSpu : '' },
        width: '860px',
        callback: reload => {
          if (reload) {
            this.reset()
            this.$refs.table.load(1, this.form)
          }
        }
      })
    }
  }
}
</script>
