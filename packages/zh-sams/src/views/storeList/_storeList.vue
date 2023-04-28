<template>
  <basic-container>
    <!-- 店铺审核管理 -->
    <g-table ref="table" :headers="columns" row-key="id" :fetch="fetch" @selection-change="checkedHandler">
      <template slot="header">
        <el-form
          ref="formObjRef"
          :model="formObj"
          size="mini"
          class="no-message"
          label-width="70px"
          @submit.native.prevent="search"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="平台"
                prop="platformId"
              >
                <el-select
                  v-model="formObj.platformId"
                  size="mini"
                  filterable
                  clearable
                  class="w180"
                  placeholder="请选择"
                  @change="changePlatformId"
                >
                  <el-option
                    v-for="(item,index) in findForm.platformOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="店铺"
                prop="siteId"
              >
                <div class="flex-search">
                  <el-select
                    v-model="formObj.siteId"
                    filterable
                    clearable
                    placeholder="站点"
                    size="mini"
                    style="width:85px"
                    @change="changeSiteId"
                  >
                    <el-option
                      v-for="(item,index) in findForm.siteOption"
                      :key="index"
                      :label="item.displayName"
                      :value="item.hiddenValue"
                    />
                  </el-select>
                  <div class="ml10">
                    <el-select
                      v-model="formObj.storeId"
                      filterable
                      clearable
                      placeholder="店铺"
                      size="mini"
                      style="width:85px"
                      @change="search"
                    >
                      <el-option
                        v-for="(item,index) in findForm.storeCodeOption"
                        :key="index"
                        :label="item.displayName"
                        :value="item.hiddenValue"
                      />
                    </el-select>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="店铺编号" prop="storeCode">
                <el-input v-model="formObj.storeCode" class="w180" placeholder="请输入" size="mini" />
              </el-form-item>
            </el-col>
            <el-col v-if="permission.store_search_register && isToggle" :span="6">
              <el-form-item label="公司" prop="companyName">
                <el-input v-model="formObj.companyName" class="w180" placeholder="请输入" size="mini" />
              </el-form-item>
            </el-col>
            <el-col v-if="isToggle" :span="6">
              <el-form-item label="店铺状态" prop="storeStatus">
                <el-select v-model="formObj.storeStatus" class="w180" clearable placeholder="请选择店铺" size="mini" @change="search">
                  <el-option
                    v-for="(item,index) in findForm.storeStatusOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="isToggle" :span="6">
              <el-form-item label="客服" prop="customerServiceName">
                <el-input v-model="formObj.customerServiceName" class="w180" placeholder="请输入" size="mini" />
              </el-form-item>
            </el-col>
            <el-col v-if=" isToggle" :span="6">
              <el-form-item label="销售" prop="sellerName">
                <el-input v-model="formObj.sellerName" class="w180" placeholder="请输入" size="mini" />
              </el-form-item>
            </el-col>
            <el-col v-if="permission.store_search_register && isToggle" :span="6">
              <el-form-item label="公司类型" prop="companyType">
                <el-select v-model="formObj.companyType" class="w180" clearable placeholder="请选择" size="mini" @change="search">
                  <el-option v-for="(item,index) in findForm.typeOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="isToggle" :span="6">
              <el-form-item label="添加日期" prop="createTime">
                <el-date-picker v-model="formObj.createTime" class="w180" size="mini" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
            <el-col v-if="permission.store_search_operate && isToggle" :span="6">
              <el-form-item label="IP" prop="ip">
                <el-input v-model="formObj.ip" class="w180" placeholder="请输入" size="mini" />
              </el-form-item>
            </el-col>
            <el-col v-if="permission.store_search_register && isToggle" :span="6">
              <el-form-item label="电话" prop="phone">
                <el-input v-model="formObj.phone" class="w180" placeholder="请输入" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div class="ml10">
                <el-button type="primary" size="mini" native-type="submit">搜 索</el-button>
                <el-button size="mini" @click="handlerReact('formObjRef')">清 空</el-button>
                <el-button size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down' " /></el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <el-button
                v-if="permission.store_all_distribute"
                type="primary"
                size="mini"
                :disabled="!checkedIds.length"
                @click="handlerBatchDistribute('formObjRef')"
              >批量分配</el-button>
              <el-button
                v-if="permission.store_import"
                :disabled="!checkedIds.length"
                type="primary"
                size="mini"
                @click="handlerImport"
              >导出</el-button>
              <el-button
                v-if="permission.store_impor_record"
                type="primary"
                size="mini"
                @click="handlerRecode"
              >导出日志</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" width="210">
        <template v-slot="{row}">
          <g-auth code="store_details">
            <el-button type="text" @click="handlerEdit(row, 0)">详情</el-button>
          </g-auth>
          <g-auth code="store_edit">
            <el-button type="text" @click="handlerEdit(row, 1)">编辑</el-button>
          </g-auth>
          <g-auth code="store_details_sale">
            <el-button type="text" @click="handlerSale(row, 1)">查看销售</el-button>
          </g-auth>
          <g-auth code="store_distribute">
            <el-button type="text" @click="handlerDistribute(row, 1)">分配</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>

</template>

<script>
import { platformCode, storePlatformCode } from '@/api/site'
import { platformOption } from '@/api/platform'
import { nopassExport } from '@/api/storeAudit'
import { dictionary } from '@/api/public'
import { storeList, getStoreStatusList, exportStore } from '@/api/storeList'
import { dowloadExc } from '@/util/util'
import storeListEdit from './components/storeListEdit'
import RecordTemp from './components/recordTemp.vue'
import SellerTable from './components/sellerTable.vue'
import { mapGetters } from 'vuex'
import DistributeStore from './components/distributeStore.vue'
import BatchDistributeStore from './components/batchDistributeStore.vue'

export default {
  name: 'SamsStoreListStoreList',
  data() {
    return {
      importFormObj: {},
      formObj: {
        platformId: '',
        siteId: '',
        storeId: '',
        storeCode: '',
        companyName: '',
        storeStatus: '',
        customerServiceName: '',
        sellerName: '',
        companyType: '',
        createTime: '',
        ip: '',
        phone: ''
      },
      isToggle: true,
      dialogType: null, // 0添加 1编辑
      checkedIds: [],
      platformCode: '', // 店铺code
      showImportDialog: false,
      columns: [{
        type: 'selection'
      }, {
        label: '平台',
        prop: 'platformName'
      }, {
        label: '站点',
        prop: 'siteName'
      }, {
        label: '店铺名',
        prop: 'storeName',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '店铺编号',
        prop: 'storeCode',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '店铺状态',
        prop: 'storeStatusName'
      }, {
        label: '销售',
        prop: 'sellerName'
      }, {
        label: '客服',
        prop: 'customerServiceName'
      }, {
        slot: true,
        slotName: 'handler'
      }],
      // 平台下来列表
      findForm: {
        platformOption: [],
        siteOption: [],
        storeStatusOption: [],
        storeCodeOption: [],
        typeOption: []
      }

    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  mounted() {
    this.$refs.table.load(1, this.formObj)
    this.getStoreStatusList()
    this.getPlatformOption()
    this.dictionary('sams_company_type')
  },
  methods: {
    fetch({ current, size }, params) {
      return storeList({ ...params, current, size }).then(res => {
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      this.$refs.table.load(1, this.formObj)
    },
    // 批量分配
    handlerBatchDistribute() {
      const checkedIds = this.checkedIds
      const batchDistribute = []
      checkedIds.forEach(acc => {
        batchDistribute.push({ id: acc })
      })
      this.$modal({
        title: '批量分配店铺权限',
        component: BatchDistributeStore,
        width: '600px',
        data: {
          checkedIds: batchDistribute
        },
        callback: require => {
          require && this.search()
        }
      })
    },
    // 分配
    handlerDistribute(row, type) {
      this.$modal({
        title: '分配店铺权限',
        component: DistributeStore,
        data: {
          item: row,
          sellerType: type
        }
      })
    },
    // 导出日志
    handlerRecode() {
      this.$modal({
        title: '导出日志',
        component: RecordTemp
      })
    },
    // 获取店铺下拉列表
    getStoreStatusList() {
      getStoreStatusList().then(res => {
        this.findForm.storeStatusOption = res.data
      })
    },
    handlerEdit(row, type) {
      this.$newTab({
        path: type ? '/storeList/storeListEdit' : '/storeList/storeListDetail',
        title: type ? '编辑' : '详情',
        component: storeListEdit,
        clearCache: true,
        data: {
          compId: row.id,
          type: type,
          platformCode: row.platformCode
        }

      })
    },
    // 查看销售
    handlerSale(row) {
      this.$modal({
        title: '查看店铺销售相关人员信息',
        component: SellerTable,
        height: '600px',
        data: {
          compId: row.id
        }
      })
    },
    // 导出
    handlerImport() {
      const name = '店铺信息.xlsx'
      let str = []
      if (this.permission.store_base) {
        str.push('store_base')
      }
      if (this.permission.store_operate) {
        str.push('store_operate')
      }
      if (this.permission.store_finance) {
        str.push('store_finance')
      }
      if (this.permission.store_register) {
        str.push('store_register')
      }
      if (this.permission.store_network) {
        str.push('store_network')
      }
      if (this.permission.store_record) {
        str.push('store_record')
      }
      str = str.join(',')
      exportStore({ ...this.formObj, storeIdList: this.checkedIds, resourceCodes: str }).then(res => {
        // if (res.size) {
        dowloadExc(res, name)
        // }
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    },
    // 店铺资料待完善列表-批量导出
    handlerExport() {
      const name = '资料待完善列表.xlsx'
      nopassExport({ ...this.formObj, ids: this.checkedIds }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
        }
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    },
    // 关闭上传
    cancel() {
      this.showImportDialog = false
    },
    // 批量导入
    handlerAllImport() {
      this.showImportDialog = true
    },
    // 表格多选
    checkedHandler(data) {
      this.checkedIds = data.map(item => item.id)
    },
    // 平台下拉列表
    getPlatformOption() {
      platformOption().then(res => {
        this.findForm.platformOption = res.data
      })
    },
    // 平台切换
    changePlatformId(id) {
      if (id) {
        this.platformCode = this.findForm.platformOption.find(item => item.hiddenValue === id).candidateDisplayName
        this.getStoreOption()
        this.getSiteOption()
      }
      this.formObj.siteId = ''
      this.formObj.storeId = ''
      this.findForm.siteOption = []
      this.findForm.storeCodeOption = []
    },
    // 站点下拉列表
    getSiteOption() {
      platformCode({ platformCode: this.platformCode }).then(res => {
        this.findForm.siteOption = res.data
      })
    },
    // 站点切换
    changeSiteId() {
      this.getStoreOption()
      this.formObj.storeId = ''
    },
    // 店铺列表
    getStoreOption() {
      storePlatformCode({ platformCode: this.platformCode, siteId: this.formObj.siteId, openFilter: false }).then(res => {
        this.findForm.storeCodeOption = res.data
      })
    },
    // 字典
    dictionary(code) {
      dictionary({ code: code }).then(res => {
        const arr = res.data
        switch (code) {
          case 'sams_company_nature':
            this.findForm.natureOption = arr
            break
          case 'sams_company_type':
            this.findForm.typeOption = arr
            break
          case 'sams_annual_audit_date':
            this.findForm.annualAuditStatusOption = arr
            break
          case 'sams_yes_or_not':
            this.findForm.auditOption = arr
            break
        }
      })
    },
    // 重置
    handlerReact(formName) {
      this.$refs[formName].resetFields()
      this.formObj.storeId = ''
      this.findForm.siteOption = []
      this.findForm.storeCodeOption = []
      this.search()
    }
  }

}
</script>

<style lang="scss" scoped>
.w-100{
  width:100% !important;
}
.w180 {
  width: 180px;
}
.flex-search{
  width: 180px;
  display: flex;
  justify-content: space-between;
}
.ml10{
  margin-left: 10px;
}
.comp-head {
  display: flex;
  justify-content: space-between;
  height: 40px;
  border-bottom:1px solid #ebeef5;
  padding: 0 20px;
  margin-bottom: 20px;
  cursor:pointer;
}
.comp-title {
  font-size: 14px;
  line-height: 40px;
}
</style>
