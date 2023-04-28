<template>
  <g-table ref="table" :fetch="fetch" :headers="headers" row-key="id" :fixed-height="false" @submit.native.prevent="search">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="80px" class="no-message form-col" :page-size="20">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="模板名称" prop="policyName">
              <el-input v-model="form.policyName" placeholder="模板名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="刊登站点" prop="siteCode">
              <el-select v-model="form.siteCode" class="w-100">
                <el-option v-for="(item, index) in siteOption" :key="index" :value="item.displayName" :label="item.displayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status" @change="search">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="店铺" prop="storeArr">
              <el-select v-model="storeArr" filterable :collapse-tags="true" multiple clearable class="w-100">
                <el-option v-for="(item,index) in storeOption" :key="index" :label="item.displayName" :value="item.candidateDisplayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="创建时间" prop="createTimeStart">
              <datePicker ref="datePick"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @getVal="(timeStart, timeEnd) => { form.createTimeStart = timeStart,form.createTimeEnd = timeEnd }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7" style="margin-left: 43px">
            <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
            <el-button size="mini" @click="resetForm('form')">清空</el-button>
            <el-button type="primary" size="mini" @click="editItem(null)">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="status" label="状态">
      <template v-slot="{row}">
        {{ row.status?'启用':'禁用' }}
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作" width="200px">
      <template v-slot="{row}">
        <el-button type="text" @click="editItem(row)">编辑</el-button>
        <el-button type="text" @click="viewItem(row)">查看</el-button>
        <el-button type="text" @click="record(row)">日志</el-button>
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" class="ms-3" @change="changeStatus(row)" />
      </template>
    </el-table-column>
  </g-table>
</template>
<script>
import { getPolicyPage, updatePolicyStatus } from '@/api/ebay/template.js'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { optionsSiteCode } from '@/api/amazon/amazon.js'
import { ebayconstants } from '@/api/ebay/ebay'
import saveModal from './components/saveModal.vue'
import viewModal from './components/viewModal.vue'
import templateLog from '../../../components/templateLog.vue'
import { debounce } from '@/util/util'
import datePicker from '@/views/components/datePicker/index.vue'
export default {
  name: 'ReundTemplateList',
  components: { datePicker },
  data() {
    return {
      form: {
        policyType: 'RETURN_POLICY',
        descs: 'id'
      },
      siteOption: [],
      storeArr: [],
      storeOption: [],
      headers: [{
        type: 'index',
        label: '序号'
      }, {
        prop: 'policyName',
        label: '模板名称'
      }, {
        prop: 'siteCode',
        label: '刊登站点'
      }, {
        prop: 'storeName',
        label: '店铺名'
      }, {
        slot: true,
        slotName: 'status'
      }, {
        prop: 'createUserName',
        label: '创建人'
      }, {
        prop: 'createTime',
        label: '创建时间'
      }, {
        slot: true,
        slotName: 'handler'
      }]
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getSiteList()
    this.getEbayconstants()
  },
  methods: {
    async fetch({ current, size }, params) {
      this.storeOption = await this.getStoreList()
      if (this.storeArr.length) {
        params.storeCodes = this.storeArr.join(',')
      }
      // console.log('this.storeOption', this.storeOption)
      return getPolicyPage({ current, size, ...params }).then(res => {
        const data = res.data
        data.records.forEach(item => {
          item.storeName = this.storeOption.find(e => e.candidateDisplayName === item.storeCode) && this.storeOption.find(e => e.candidateDisplayName === item.storeCode).displayName
        })
        return {
          records: data.records,
          total: data.total,
          size: data.size
        }
      })
    },
    // 查询当前平台的站点code
    getSiteList() {
      optionsSiteCode({ platformCode: 'EB' }).then(res => {
        this.siteOption = [...res.data, {
          displayName: 'eBayMotors',
          hiddenValue: 'eBayMotors'
        }]
      })
    },
    getStoreList() {
      return storeOptionsWithPlatformCode({ platformCode: 'EB' }).then(res => res.data)
    },
    changeStatus: debounce(function(item) {
      updatePolicyStatus({ ids: item.id, status: item.status }).then(res => {
        this.$message.success('操作成功')
      }).finally(() => {
        this.search()
      })
    }, 500),
    search() {
      this.$refs.table.load(1, this.form)
    },
    editItem(row) {
      this.$modal({
        title: row ? '编辑退货模板' : '添加退货模板',
        component: saveModal,
        width: '500px',
        data: {
          row: row,
          storeOption: this.storeOption,
          siteOption: this.siteOption,
          constList: this.constList
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    viewItem(row) {
      this.$modal({
        title: '查看退货模板',
        component: viewModal,
        data: {
          row: row,
          constList: this.constList
        }
      })
    },
    record(row) {
      this.$newTab({
        title: '退货模板日志',
        component: templateLog,
        clearCache: true,
        data: {
          row: row,
          tempType: this.form.policyType
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {
        policyType: 'RETURN_POLICY',
        descs: 'id'
      }
      this.$refs.datePick.createDate = []
      this.storeArr = []
      this.search()
    },
    // 获取各种常量
    getEbayconstants() {
      ebayconstants().then(res => {
        this.constList = res.data.constants
      })
    }
  }
}
</script>
