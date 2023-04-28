<template>
  <basic-container v-loading="preloading">
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <el-form slot="header" size="mini" label-width="90px" class="form-col no-message" @submit.native.prevent="getList">
        <div class="d-flex">
          <div style="width:94px;" class="flex-shrink-0">
            <el-button-group>
              <el-button :type="toggleTheme(1)" size="mini" @click="toggle(1)">SPU</el-button>
              <el-button :type="toggleTheme(2)" size="mini" @click="toggle(2)">SKU</el-button>
            </el-button-group>
          </div>
          <div class="flex-grow-1">
            <el-row>
              <el-col :span="6">
                <el-form-item label="类目">
                  <category-cascader v-model="categoryIds" lazy-multiple width="100%" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="'牛蛙'+dynamicCode">
                  <g-multiple-input v-model="nwCode" :placeholder="getPlaceholder()" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="dynamicCode">
                  <g-multiple-input v-model="code" :placeholder="getPlaceholder()" clearable />
                </el-form-item>
              </el-col>
              <el-col v-if="showType===2" :span="6">
                <el-form-item label="SPU编码">
                  <g-multiple-input v-model="code2" :placeholder="getPlaceholder()" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-if="!isSaas" :span="ascription==='1'?12:6" class="d-flex">
                <el-form-item label="产品归属" :class="ascription==='1'?'w-50':'w-100'">
                  <el-select v-model="ascription" class="w-100">
                    <el-option v-for="item in ascriptionOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="ascription==='1'" label-width="10px" prop="ascriptionTenantOrDeptIds" class="w-50">
                  <el-select v-model="ascriptionTenantOrDeptIds" collapse-tags clearable placeholder="请选择租户" class="w-100">
                    <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="dynamicName">
                  <el-input v-model="name" :placeholder="'请输入'+dynamicName" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态">
                  <el-select v-model="status" class="w-100">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="开发专员">
                  <DeverSelect v-model="form.developLeadUserId" :type="0" class="w-100" @loaded="setDeverList" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="5px">
                  <el-button type="primary" native-type="submit">搜索</el-button>
                  <el-button @click="resetCondition">重置</el-button>
                  <el-button v-if="$auth('pms_spuSkuList_syncNwSku')" type="primary" @click="openNw">同步牛蛙新SPU</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>

      <el-table-column slot="slotImage" label="缩略图" width="70" align="center">
        <template #default="{row}">
          <g-thumb class="d-table-cell" :url="row.imageUrl" />
        </template>
      </el-table-column>
      <el-table-column slot="categoryPath" label="类目名称" width="200">
        <template #default="{row}">
          <g-text-ellipsis lines="2">{{ row.categoryPath }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="dynamicName" :label="dynamicName">
        <template slot-scope="{row}">
          <g-link @click="viewDetail(row)">
            <g-text-ellipsis lines="2">{{ row.productName }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column slot="productSku" :label="dynamicCode" width="120">
        <template slot-scope="{row}">
          <g-link color="primary" @click="viewDetail(row)">{{ row.productSku }}</g-link>
        </template>
      </el-table-column>
      <el-table-column slot="nwCode" :label="'牛蛙'+dynamicCode" width="100">
        <template slot-scope="{row}">
          {{ row.nwProductCode }}
        </template>
      </el-table-column>
      <el-table-column slot="slotStatus" label="状态" width="50px">
        <template slot-scope="{row}">
          <span>{{ getStatusLabel(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="productCost" label="成本价" width="90px">
        <template slot-scope="{row}">
          <span>{{ row.productCost }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column slot="stock" label="可用库存" width="120px">
        <template slot-scope="{row}">
          <div v-for="(item, i) in row.stockList||[]" :key="i">
            {{ item.warehouseName }}：{{ item.availableStock }}
          </div>
        </template>
      </el-table-column> -->

      <el-table-column slot="dever" label="开发专员" width="120px">
        <template slot-scope="{row}">
          <div v-if="row.developLeadUserId>0">{{ getDeverNameById(row.developLeadUserId) }}</div>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="106px">
        <template slot-scope="{row}">
          <template v-if="showType===1">
            <el-button type="text" size="small" @click="viewSkuList(row)">SKU列表</el-button><br>
          </template>
          <el-button v-if="!isSaas" :disabled="!row.nwProductCode" :loading="getSyncStatus(row.id)" type="text" size="small" @click="syncNwData(row)">同步牛蛙数据</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import syncNwSpu from './modal/syncNwSpu.vue'
import { getSXUList, syncNwData } from '@/api/sku'
import { getTenantList } from '@/api/info'
import CategoryCascader from '@/components/category-cascader/index.vue'
import DeverSelect from '@/views/components/deverSelect.vue'
import { getDicts } from '@/api/common/dict'
import { isSaas } from '@/config/env'

export default {
  name: 'PmsSpuSkuList',
  components: { CategoryCascader, DeverSelect },
  data() {
    return {
      preloading: true, // 等待字典、专员接口加载完毕
      // 1spu， 2sku
      showType: this.$route.params.showType || 1,
      loading: false,
      categoryIds: [],
      code: this.$route.params.code || '', // spu、sku 编码
      code2: '', // sku列表 中的spu编码查询条件
      nwCode: '', // 牛蛙sku编码或spu编码条件
      status: '',
      name: '', // spu、sku 名称
      statusList: [], // 所有状态列表
      statusOptions: [], // 状态为 有效 和 无效 的列表
      list: [],
      headers: [],
      syncingIds: [],
      ascription: '',
      ascriptionOptions: [],
      ascriptionTenantOrDeptIds: '',
      tenantList: [],
      isSaas,
      form: {
        developLeadUserId: '' // 开发专员
      },
      cacheDeverList: []
    }
  },
  computed: {
    typeName() {
      return ['SPU', 'SKU'][this.showType - 1]
    },
    dynamicName() {
      return this.typeName + '名称'
    },
    dynamicCode() {
      return this.typeName + '编码'
    }
  },
  mounted() {
    this.headers = this.getHeaders()
    getTenantList().then(res => { // 租户列表
      this.tenantList = res.data
    })
    // 字典获取成功后再获取列表
    Promise.all([this.getData(), this.getAllDeverList()])
      .then(() => this.getList())
      .finally(() => {
        this.preloading = false
      })
  },
  methods: {
    openNw() {
      this.$modal({
        title: '同步牛蛙SPU',
        component: syncNwSpu,
        width: '24%',
        callback: (isRefersh) => {
          isRefersh && this.getList()
        }
      })
    },
    setDeverList(list) {
      this.cacheDeverList.push(list)
    },
    // 用于等待 一个专员列表加载完（避免列表渲染时无法通过id找到专员名称）
    getAllDeverList() {
      return new Promise(resolve => {
        const unwatch = this.$watch('cacheDeverList', (val) => {
          if (val.length) {
            unwatch()
            resolve()
          }
        })
        setTimeout(() => {
          unwatch()
          resolve()
        }, 5000)
        this.$once('beforeDestroy', unwatch)
      })
    },
    getDeverNameById(id, prefix = '') {
      const list = this.cacheDeverList
      for (let i = 0, len1 = list.length; i < len1; i++) {
        const item = list[i]
        if (Array.isArray(item)) {
          for (let j = 0, len2 = item.length; j < len2; j++) {
            if (String(item[j].id) === String(id)) return prefix + item[j].value
          }
        }
      }
      return ''
    },
    getPlaceholder() {
      return '多个可换行或空格隔开'
    },
    getSyncStatus(id) {
      return this.syncingIds.includes(id)
    },
    getStatusLabel(status) {
      let label = ''
      this.statusList.forEach(item => {
        if (item.value === String(status)) {
          label = item.label
        }
      })
      return label
    },
    getHeaders() {
      return [
        { slot: true, slotName: 'slotImage' },
        { slot: true, slotName: 'categoryPath' },
        { slot: true, slotName: 'dynamicName' },
        { slot: true, slotName: 'productSku' },
        { slot: true, slotName: 'nwCode' },
        { slot: true, slotName: 'slotStatus' },
        { slot: true, slotName: 'productCost' },
        { prop: 'packWeight', label: '打包重量（g）', width: 104 },
        // { slot: true, slotName: 'stock' },
        { slot: true, slotName: 'dever' },
        { slot: true, slotName: 'handler' }
      ]
    },
    toggle(val, cb) {
      // 数据加载中时阻止切换
      if (this.loading) return
      if (this.showType === val) return

      this.showType = val
      this.resetCondition()

      // 用于重置搜索条件后重新给spu编码赋值（从SPU跳转到SKU列表）
      cb && cb()

      this.headers = this.getHeaders()
      this.getList()
    },
    toggleTheme(val) {
      return this.showType === val ? 'primary' : ''
    },
    // 重置搜索条件
    resetCondition() {
      this.categoryIds = []
      this.code = ''
      this.code2 = ''
      this.nwCode = ''
      this.name = ''
      this.status = ''
      this.form.developLeadUserId = ''
      this.ascription = ''
      this.ascriptionTenantOrDeptIds = ''
    },
    getData() {
      return getDicts(['sku_status', 'sku_belong'], 'pms').then(res => {
        this.ascriptionOptions = [{ label: '全部', value: '' }, ...res.sku_belong.filter(item => item.value !== '3')]
        this.statusList = res.sku_status
        this.statusOptions = [
          { label: '全部', value: '' },
          ...res.sku_status.filter(item => {
            return ['2', '3'].indexOf(item.value) > -1
          })
        ]
      })
    },
    getList() {
      const condition = {
        type: this.showType,
        status: this.status || undefined,
        categoryIds: this.categoryIds,
        productName: this.name,
        ...isSaas
          ? {}
          : {
            ascriptionTenantOrDeptIds: this.ascriptionTenantOrDeptIds,
            ascription: this.ascription
          },
        ...this.form
      }

      // sku列表多一个spu编码条件
      if (this.showType === 1) {
        condition.productSpuList = this.code || []
        condition.nwSpuList = this.nwCode || []
      } else {
        condition.productSkuList = this.code || []
        condition.productSpuList = this.code2 || []
        condition.nwSkuList = this.nwCode || []
      }
      this.$refs.table.load(1, condition)
    },
    fetch(page, params) {
      this.loading = true
      return getSXUList(params, page).then(res => {
        this.loading = false
        return res.data
      }).catch((err) => {
        this.loading = false
        throw err
      })
    },
    viewDetail(data) {
      this.$newPage({
        path: '/pms/product/detail',
        data: { code: data.productSku }
      })
    },
    // 跳转到sku列表
    viewSkuList(data) {
      this.toggle(2, () => {
        this.code2 = [data.productSpu]
      })
    },
    // 同步牛蛙数据
    syncNwData(data) {
      const id = data.id
      if (this.syncingIds.includes(id)) return

      this.syncingIds.push(id)
      syncNwData(this.showType, [data.nwProductCode]).then(res => {
        this.$message.success(`${data.productName} 同步牛蛙数据成功`)
      }).finally(() => {
        this.syncingIds = this.syncingIds.filter(item => item !== id)
      })
    }
  }
}
</script>
