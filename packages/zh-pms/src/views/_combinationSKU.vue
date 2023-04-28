<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <el-form slot="header" :model="formObj" size="mini" class="form-col no-message" label-width="70px" @submit.native.prevent="search">
        <el-row type="flex" justify>
          <el-col>
            <el-form-item label="开发人">
              <v-organization ref="organizationRef" v-model="dever" class="w-100" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="组合SKU编码" label-width="100px">
              <el-input v-model="formObj.productSku" clearable placeholder="组合SKU编码" class="w-100" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="状态">
              <el-select v-model="formObj.status" clearable placeholder="请选择" class="w-100">
                <el-option v-for="(val,key) in statusMapping" :key="val" :label="val" :value="key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label-width="10px">
              <el-button type="primary" native-type="submit">搜索</el-button>
              <el-button @click="reset">重置</el-button>
              <el-button type="success" @click="addCombSku(false)">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table-column slot="productSku" label="编码" width="120">
        <template #default="{row}">
          <g-link color="primary" @click="info(row)">{{ row.productSku }}</g-link>
        </template>
      </el-table-column>
      <el-table-column slot="productName" label="SKU名称">
        <template #default="{row}">
          <g-link @click="info(row)">
            <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column slot="combineSkuDetail" label="SKU组合详情">
        <template #default="{row}">
          <g-text-ellipsis>{{ row.combineSkuDetail }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="140">
        <template slot-scope="scope">
          <el-button class="p-1" type="text" size="mini" @click="editCombSku(scope.row)">修改</el-button>
          <el-button class="p-1" type="text" size="mini" @click="config(scope.row)">配置属性</el-button><br>
          <el-button class="p-1" type="text" size="mini" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getCombSkuList, delCombSku } from '@/api/combSku'
import VCombinationSkuSave from './combinationSkuSave.vue'
import VConfigureProps from './configureProps.vue'
import VOrganization from '@/components/organization/index.vue'
import { getDict } from '@/api/common/dict'

export default {
  name: 'PmsCombinationSKU',
  components: { VOrganization },
  data() {
    return {
      loading: true,
      formObj: this.getFormField(),
      dever: {},
      headers: [
        { slot: true, slotName: 'productSku' },
        { slot: true, slotName: 'productName' },
        { slot: true, slotName: 'combineSkuDetail' },
        { label: '状态', prop: 'status', width: '120px', formatter: (row, column, cellValue) => this.statusMapping[cellValue] },
        { label: '录入时间', prop: 'createTime', width: '140px' },
        { slot: true, slotName: 'handler' }
      ],
      list: [],
      statusMapping: {}
    }
  },
  watch: {
    dever(val) {
      this.formObj.createUser = val.id
    }
  },
  mounted() {
    this.getDict().then(() => {
      this.$refs.table.load(1, this.formObj)
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
    getFormField() {
      return {
        createUser: '',
        productSku: '',
        status: ''
      }
    },
    fetch(page, params) {
      return getCombSkuList(Object.assign(page, params)).then(res => res.data)
    },
    search() {
      this.$refs.table.load(1, this.formObj)
    },
    addCombSku(isEdit = false, data = {}) {
      this.$modal({
        title: (isEdit ? '修改' : '新增') + '组合SKU',
        component: VCombinationSkuSave,
        data,
        callback: (isNeedRefresh = false) => {
          if (isNeedRefresh) {
            // 添加 或 修改 成功后刷新数据
            if (isEdit) {
              this.$refs.table.load(0)
            } else {
              this.$refs.table.load(1, null)
            }
          }
        }
      })
    },
    dropdownHandler([command, $data]) {
      this[command]($data)
    },
    editCombSku($data) {
      this.addCombSku(true, { oldData: $data })
    },
    info(data = {}) {
      this.$newPage({
        path: '/pms/product/edit',
        data: { code: data.productSku },
        callback: refresh => {
          refresh && this.$refs.table.load(0)
        }
      })
    },
    config($data) {
      this.$modal({
        title: '配置组合SKU属性',
        width: '900px',
        component: VConfigureProps,
        data: { type: 3, myData: $data }
      })
    },
    del($data) {
      this.$confirm(`确定要删除组合编码 【${$data.productSku}】吗？`, '操作确认').then(() => {
        delCombSku($data.id).then(res => {
          if (res.success) this.$refs.table.load(0)
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
        })
      }).catch(console.info)
    },
    reset() {
      this.$refs.organizationRef.inputText = ''
      Object.assign(this.formObj, this.getFormField())
    }
  }
}
</script>
