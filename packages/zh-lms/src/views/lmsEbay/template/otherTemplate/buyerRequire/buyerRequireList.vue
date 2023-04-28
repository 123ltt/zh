<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :fixed-height="false">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="80px" class="form-col no-message" :page-size="20" @submit.native.prevent="search">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="模板名称" prop="policyName">
              <el-input v-model="form.policyName" placeholder="模板名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="创建时间" prop="createStartTime">
              <datePicker ref="datePick"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @getVal="(timeStart, timeEnd) => { form.createTimeStart = timeStart,form.createTimeEnd = timeEnd }"
              />
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
              <el-select v-model="storeArr" filterable :collapse-tags="true" multiple clearable placeholder="请选择" class="w-100">
                <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
              <el-button type="primary" size="mini" @click="editItem()">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="status" label="状态">
      <template v-slot="{ row }">
        <div>{{ row.status ? '启用' : '禁用' }}</div>
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作" width="200px">
      <template v-slot="{ row }">
        <el-button type="text" size="mini" @click="editItem(row)">编辑</el-button>
        <el-button type="text" size="mini" @click="viewItem(row)">查看</el-button>
        <el-button type="text" size="mini" @click="showLog(row)">日志</el-button>
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" class="ms-3" @change="updateStatus(row)" />
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getPolicyPage, updatePolicyStatus } from '@/api/ebay/template.js'
import { debounce } from '@/util/util'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import saveModal from './components/saveModal.vue'
import viewModal from './components/viewModal.vue'
import templateLog from '../../../components/templateLog.vue'
import datePicker from '@/views/components/datePicker/index.vue'

export default {
  name: 'LmsEbayTemplateTagManageTagList',
  components: { datePicker },
  data() {
    return {
      headers: [
        { type: 'index', label: '序号' },
        { label: '模板名称', prop: 'policyName' },
        { label: '店铺名', prop: 'storeName' },
        { slot: true, slotName: 'status' },
        { label: '创建人', prop: 'createUserName' },
        { label: '创建时间', prop: 'createTime' },
        { slot: true, slotName: 'handler' }
      ],
      form: {
        policyType: 'BUYER_REQUIREMENTS',
        descs: 'id'
      },
      storeList: [],
      storeArr: []
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    // 查询所有店铺code
    getStoreList() {
      return storeOptionsWithPlatformCode({ platformCode: 'EB' }).then(res => res.data)
    },
    async fetch({ current, size }, params) {
      this.storeList = await this.getStoreList()
      if (this.storeArr.length) {
        params.storeCodes = this.storeArr.join(',')
      }
      return getPolicyPage({ current, size, ...params }).then(res => {
        res.data.records.forEach(item => {
          item.storeName = this.storeList.find(e => e.candidateDisplayName === item.storeCode) && this.storeList.find(e => e.candidateDisplayName === item.storeCode).displayName
        })
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {
        policyType: 'BUYER_REQUIREMENTS',
        descs: 'id'
      }
      this.$refs.datePick.createDate = []
      this.paypalList = []
      this.storeArr = []
      this.search()
      this.$nextTick(() => {
        this.paypalList = this.paypalListCache
      })
    },
    editItem(row) {
      const title = row ? '编辑买家要求模板' : '添加买家要求模板'
      this.$modal({
        title: title,
        component: saveModal,
        width: '600px',
        data: {
          storeList: this.storeList,
          paypalList: this.paypalList,
          row: row
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    viewItem(row) {
      this.$modal({
        title: '查看买家要求',
        component: viewModal,
        width: '600px',
        data: {
          row: row,
          storeList: this.storeList
        }
      })
    },
    showLog(row) {
      this.$newTab({
        title: '买家要求模板日志',
        component: templateLog,
        clearCache: true,
        data: {
          row: row,
          tempType: this.form.policyType
        }
      })
    },
    updateStatus: debounce(function(row) {
      const { id, status } = row
      updatePolicyStatus({ ids: id, status }).then(() => {
        this.$message.success('操作成功!')
      }).finally(() => {
        this.search()
      })
    }, 500)
  }
}
</script>
