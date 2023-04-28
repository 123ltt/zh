<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :fixed-height="false" @select="select" @select-all="select">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" class="form-col" @submit.native.prevent="search">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="模板名称" prop="templateName" label-width="60px">
              <el-input v-model="form.templateName" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="添加人" prop="createUser" label-width="60px">
              <g-select v-model="form.createUser" :items="createUserOption" key-field="id" label-field="nameJobNumber" value-field="id" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="添加时间" prop="templateType" label-width="60px">
              <DateTimePicker ref="createDate" :search-data="form" :date-time-start="'createTimeStart'" :date-time-end="'createTimeEnd'" value-format="yyyy-MM-dd hh:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="SKU" prop="productSku" label-width="40px">
              <el-input v-model="form.productSku" type="textarea" size="mini" placeholder="多个按逗号、空格或回车隔开" resize="none" clearable class="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
            <el-button size="mini" @click="resetForm('form')">清空</el-button>
            <el-button v-if="$auth('car_bind')" type="primary" size="mini" @click="handleSKU">绑定SKU</el-button>
            <el-button v-if="$auth('car_batch_del')" size="mini" type="danger" :disabled="!checked.length" @click="handleBatchDel">批量删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="handler" label="操作">
      <template v-slot="{row}">
        <el-button v-if="$auth('car_details')" type="text" @click="handleView(row)">查看</el-button>
        <el-button v-if="$auth('car_del')" type="text" @click="handleDel(row.id)">删除</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { carAttrSkuPage, skuDel } from '@/api/aliExpress/temp.js'
import viewModal from './components/viewModal.vue'
import editModal from './components/editModal.vue'
import { getUserList } from '@/api/amazon/amazon'
import DateTimePicker from '@/views/components/searchHead/dateTimePicker.vue'
export default {
  name: 'BacksyncTemp',
  components: {
    DateTimePicker
  },
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
          label: 'SKU',
          prop: 'productSku'
        },
        {
          label: '模板名称',
          prop: 'templateName'
        },
        {
          label: '添加人',
          prop: 'createUserName'
        },
        {
          label: '添加时间',
          prop: 'createTime'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      createUserOption: [],
      form: {
        account: null,
        templateName: null,
        createTimeStart: null,
        createTimeEnd: null,
        productSku: null
      }
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getUserList()
  },
  methods: {
    async fetch({ current, size }, params) {
      return carAttrSkuPage({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    handleSKU() {
      this.$modal({
        title: '绑定SKU模板',
        component: editModal,
        width: '550px',
        callback: refresh => {
          refresh && this.search()
        }

      })
    },
    select(checkedList = [], row) {
      if (row) { // 单选
        if (checkedList.includes(row)) {
          this.checked.push(row.id)
        } else {
          this.checked = this.checked.filter(item => item.id !== row.id)
        }
      } else { // 全选
        const rest = []
        if (checkedList.length > 0) {
          rest.push(...checkedList.map(item => item.id))
        }
        this.checked = rest
      }
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
        skuDel(id).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      })
    },
    handleView(row) {
      this.$modal({
        title: '查看详情',
        component: viewModal,
        data: {
          id: row.id
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.$refs.createDate.createDate = []
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-textarea__inner{
  height: 30px;
}

</style>
