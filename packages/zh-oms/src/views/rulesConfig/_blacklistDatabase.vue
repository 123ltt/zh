<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" :inline="true">
          <el-form-item label="创建人" prop="createUser">
            <organization-panel ref="organization" v-model="form.createUser">
              <el-input v-model="form.createUser.name" />
            </organization-panel>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="serach">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button v-if="$auth('oms_rule_config_blacklist_add')" type="primary" @click="add">新增</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table-column v-if="$auth('oms_rule_config_blacklist_edit', 'oms_rule_config_blacklist_delete')" slot="handler" label="操作">
        <template slot-scope="{row:{id}}">
          <el-button v-if="$auth('oms_rule_config_blacklist_edit')" type="text" @click="updata(id)">修改</el-button>
          <el-button v-if="$auth('oms_rule_config_blacklist_delete')" type="text" @click="del(id)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { blacklist, remove } from '@/api/downloadCenter'
import OrganizationPanel from '@/components/organization/index.vue'
import BlacklistInfo from './modal/blacklistInfo'
export default {
  name: 'OmsRulesConfigBlacklistDatabase',
  components: { OrganizationPanel },
  data() {
    return {
      form: {
        email: '',
        createUser: {}
      },
      headers: [
        { label: '邮箱', prop: 'email' },
        { label: '销售平台', prop: 'platName' },
        { label: '买家账号', prop: 'buyerId' },
        { label: '收件人', prop: 'receiveFullName', width: 150 },
        { label: '电话', prop: 'mobileNo', width: 150 },
        { label: '创建人', prop: 'createName', width: 150 },
        { label: '创建时间', prop: 'createTime' },
        { slotName: 'handler', slot: true }
      ]
    }
  },
  watch: {
    'createUser.name'(newVal, oldVal) {
      if (!newVal) {
        this.createUser = {}
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    serach() {
      this.getList()
    },
    getList() {
      const params = Object.assign({ createUser: this.form.createUser.id || '', email: this.form.email })
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return blacklist(Object.assign(params, { current, size })).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.getList()
    },
    add() {
      this.upList('add')
    },
    del(ids) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(ids).then(res => {
          if (res.success) {
            this.getList()
            this.$message.success('删除成功')
          }
        })
      }).catch(() => {
      })
    },
    updata(id) {
      this.upList('updata', id)
    },
    upList(type, id) {
      this.$modal({
        component: BlacklistInfo,
        width: '45%',
        title: (id ? '修改' : '新增') + '黑名单信息',
        data: { type, id },
        callback: (type) => {
          type && this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
