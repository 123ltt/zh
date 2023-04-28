<template>
  <basic-container>
    <g-table ref="table"
             :headers="headers"
             :fetch="fetch"
    >
      <el-form slot="header" size="mini" class="form-col no-message" label-width="80px" @submit.native.prevent="search">
        <el-row>
          <el-col :span="5">
            <el-form-item label="开发人员">
              <v-organization v-model="form.developerIds" multiple class="w-100">
                <el-input readonly :value="developers" placeholder="请选择" />
              </v-organization>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="销售人员">
              <v-organization v-model="form.salesmanIds" multiple class="w-100">
                <el-input readonly :value="salers" placeholder="请选择" />
              </v-organization>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="平台">
              <el-select v-model="form.platformCode" filterable clearable @change="platformHandler">
                <el-option label="全部" value="" />
                <el-option v-for="item in platforms" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="店铺">
              <el-select v-model="form.accounts" multiple :disabled="form.platformCode===''" collapse-tags filterable clearable>
                <el-option v-for="item in stores" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="10px" label="">
              <g-auth code="publishedConstraints_add">
                <el-button type="success" @click="newtab(0)">新增</el-button>
              </g-auth>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="form.status" class="w-100">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="规则名称">
              <el-input v-model="form.ruleName" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="SPU编码">
              <g-multiple-input v-model="form.spuCodes" return-type="array" placeholder="多个可换行或空格隔开" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="SKU编码">
              <g-multiple-input v-model="form.skuCodes" return-type="array" placeholder="多个可换行或空格隔开" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="10px" label="">
              <el-button type="primary" native-type="submit">搜索</el-button>
              <el-button type="secondary" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table-column slot="ruleName" label="规则名称">
        <template slot-scope="{row}">
          <g-text-ellipsis>
            <g-link @click="newtab(2,row)">{{ row.ruleName }}</g-link>
          </g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="status" label="状态" width="60">
        <template slot-scope="{row}">
          {{ getStatus(row.status) }}
        </template>
      </el-table-column>
      <el-table-column slot="spuCodes" label="SPU" width="80">
        <template slot-scope="{row}">
          <g-text-ellipsis>{{ (row.spuCodes||[]).join(',') }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="skuCodes" label="SKU" width="80">
        <template slot-scope="{row}">
          <g-text-ellipsis>{{ (row.skuCodes||[]).join(',') }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="createUser" label="添加人" width="100">
        <template slot-scope="{row}">
          <g-text-ellipsis>{{ row.createUser }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <g-auth slot="handler" code="publishedConstraints_edit">
        <el-table-column label="操作" width="65">
          <template slot-scope="{row}">
            <el-button type="text" @click="newtab(1, row)">修改</el-button>
          </template>
        </el-table-column>
      </g-auth>
    </g-table>
  </basic-container>
</template>

<script>
import { getList } from '@/api/publishedConstraints'
import vOrganization from '@/components/organization/index.vue'
import VAdd from './publishedConstraints/add.vue'
import { getPlatforms, getStoresByPlatformAndKeyword } from '@/api/sams'

export default {
  name: 'PmsPublishedConstraints',
  components: { vOrganization },
  data() {
    return {
      form: this.getForm(),
      platforms: [],
      stores: [],
      cacheStores: {},
      headers: [
        { slot: true, slotName: 'ruleName' },
        { label: '开发人员', prop: 'developers', width: 80 },
        { label: '允许销售人员', prop: 'salesmans', width: 100 },
        { label: '允许平台', prop: 'platformCodes', width: 80 },
        { label: '允许店铺', prop: 'accounts', width: 80 },
        { slot: true, slotName: 'spuCodes' },
        { slot: true, slotName: 'skuCodes' },
        { slot: true, slotName: 'createUser' },
        { label: '添加时间', prop: 'createTime', width: 140 },
        { label: '更新时间', prop: 'updateTime', width: 140 },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'handler' }
      ],
      statusOptions: [
        { label: '全部', value: 0 },
        { label: '有效', value: 1 },
        { label: '无效', value: 2 }
      ]
    }
  },
  computed: {
    developers() {
      return this.form.developerIds.map(item => item.name).join(', ')
    },
    salers() {
      return this.form.salesmanIds.map(item => item.name).join(', ')
    }
  },
  created() {
    this.getOptions(0)
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    getStatus(value) {
      const one = this.statusOptions.find(item => item.value === value)
      return one ? one.label : ''
    },
    getForm() {
      return {
        ruleName: '',
        developerIds: [],
        salesmanIds: [],
        platformCode: '',
        accounts: [],
        status: 0,
        spuCodes: [],
        skuCodes: []
      }
    },
    fetch({ current, size }, params) {
      return getList(params, { current, size }).then(res => res.data)
    },
    newtab(type = 0, $data = {}) {
      const arr = [
        ['添加', 'add'],
        ['修改', 'edit'],
        ['查看', 'detail']
      ][type]
      this.$newTab({
        title: arr[0] + '刊登约束',
        path: `publishedConstraints/${arr[1]}`,
        component: VAdd,
        data: {
          id: $data.id,
          type: arr[1]
        },
        clearCache: true,
        callback: (reload) => {
          reload && this.$refs.table.load(0)
        }
      })
    },
    // type 0平台，1店铺
    getOptions(type = 0, platformCode) {
      if (type === 0) {
        getPlatforms().then(list => {
          this.platforms = list
        })
      } else if (type === 1) {
        if (platformCode === '') {
          this.stores = []
          this.form.accounts = []
        } else {
          if (this.cacheStores[platformCode]) {
            this.stores = this.cacheStores[platformCode]
          } else {
            getStoresByPlatformAndKeyword(platformCode).then(list => {
              this.cacheStores[platformCode] = list
              this.stores = list
            })
          }
        }
      }
    },
    platformHandler(code) {
      this.getOptions(1, code)
    },
    search() {
      const params = Object.assign({}, this.form)
      params.developerIds = params.developerIds.map(item => item.id)
      params.salesmanIds = params.salesmanIds.map(item => item.id)
      if (params.status === 0) params.status = undefined
      this.$refs.table.load(1, Object.assign({}, params))
    },
    reset() {
      this.form = this.getForm()
    }
  }
}
</script>
