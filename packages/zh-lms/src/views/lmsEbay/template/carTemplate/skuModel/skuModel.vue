<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :fixed-height="false" @select="select" @select-all="select">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="90px" class="form-col no-message" @submit.native.prevent="search">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="form.templateName" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人" prop="createUser">
              <g-select v-model="form.createUser" :items="createUserOption" key-field="id" label-field="nameJobNumber" value-field="id" class="w-100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间" prop="templateType">
              <datePicker ref="datePick"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @getVal="(timeStart, timeEnd) => { form.createTimeStart = timeStart,form.createTimeEnd = timeEnd }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="20px">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="刊登站点" prop="siteCode">
              <el-select v-model="form.siteCode" class="w-100">
                <el-option v-for="(item, index) in siteOption" :key="index" :value="item.displayName" :label="item.displayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU" prop="productSku">
              <el-input v-model="form.productSku" placeholder="多个输入请用空格隔开" size="mini" clearable class="w-100" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-button type="primary" size="mini" @click="handleSKU">绑定SKU</el-button>
              <el-button size="mini" :disabled="!checked.length" @click="handleBatchDel">批量删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="handler" label="操作">
      <template v-slot="{row}">
        <el-button type="text" @click="handleView(row)">查看</el-button>
        <el-button type="text" @click="handleDel(row.id)">删除</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getSkuCarList, deleteSkuCar } from '@/api/ebay/template.js'
import { getUserList, optionsSiteCode } from '@/api/amazon/amazon'
import viewModal from './components/viewModal.vue'
import editModal from './components/editModal.vue'
import { deepClone } from '@/util/util'
import datePicker from '@/views/components/datePicker/index.vue'
export default {
  name: 'BacksyncTemp',
  components: { datePicker },
  data() {
    return {
      cateList: [],
      checked: [],
      activeName: 'productInfo',
      headers: [
        {
          type: 'selection'
        },
        {
          label: '产品SKU',
          prop: 'productSku'
        },
        {
          label: '刊登站点',
          prop: 'siteCode'
        },
        {
          label: '模板名称',
          prop: 'templateName'
        },
        {
          label: '创建人',
          prop: 'createUserName'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      createUserOption: [],
      form: {
        descs: 'id'
      },
      siteOption: []
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getUserList()
    this.getSiteList()
  },
  methods: {
    fetch({ current, size }, params) {
      const param = deepClone(params)
      const { productSku } = param
      if (productSku) {
        param.productSkus = productSku.trim().replace(/\s+/g, ',')
        delete param.productSku
      }
      return getSkuCarList({ current, size, ...param }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
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
    handleSKU() {
      this.$modal({
        title: '绑定SKU模板',
        component: editModal,
        width: '550px',
        data: {
          siteOption: this.siteOption
        },
        callback: refresh => {
          refresh && this.search()
        }
      })
    },
    select(checkedList) {
      this.checked = checkedList.map(item => item.id)
      console.log('this.checked: ', this.checked)
    },
    // 创建人列表
    getUserList(query) {
      this.loadingUser = true
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        this.loadingUser = false
        const records = res.data.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}${item.jobNumber}`
        })
        this.createUserOption = records
      }).finally(() => {
        this.loadingUser = false
      })
    },
    // 批量删除
    handleBatchDel() {
      this.handleDel(this.checked.join())
    },
    handleDel(id) {
      this.$confirm('请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSkuCar({ ids: id }).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      }).catch(() => {})
    },
    handleView(row) {
      this.$modal({
        title: '查看详情',
        component: viewModal,
        data: {
          row: row
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
        descs: 'id'
      }
      this.$refs.datePick.createDate = []
      this.search()
    }
  }
}
</script>
