<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <el-form ref="form" slot="header" :model="form" :inline="true" size="mini">
        <el-form-item label="销售平台" prop="platformCode">
          <el-select v-model="form.platformCode" filterable clearable>
            <el-option v-for="(item,index) in platformList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="ruleStatus">
          <el-select v-model="form.ruleStatus" filterable clearable>
            <el-option v-for="(item,index) in ruleStatus" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
          <g-auth code="oms_rule_config_tag_delivery_add">
            <el-button type="primary" @click="add('')">新增</el-button>
          </g-auth>
        </el-form-item>
      </el-form>
      <el-table-column slot="ruleStatusSlot" label="状态">
        <template slot-scope="{row}">
          {{ row.ruleStatus?'启用':'禁用' }}
        </template>
      </el-table-column>
      <el-table-column v-if="$auth('oms_rule_config_tag_delivery_edit','oms_rule_config_tag_delivery_delete')" slot="handleSlot" label="操作">
        <template slot-scope="scope">
          <g-auth code="oms_rule_config_tag_delivery_edit">
            <el-button type="text" @click="add(scope.row)">修改</el-button>
          </g-auth>
          <g-auth code="oms_rule_config_tag_delivery_delete">
            <el-button type="text" @click="del(scope.row.id)">删除</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import tagConfigModal from './modal/tagConfigModal.vue'
import { list, remove } from '@/api/ruleConfig'
import { getPlatformList } from '@/api/common.js'
export default {
  name: 'OmsRulesConfigTagConfig',
  data() {
    return {
      headers: [
        { label: '销售平台', prop: 'platformCode' },
        { label: '规则名称', prop: 'ruleName' },
        { label: '优先级', prop: 'markPriority' },
        { slot: true, slotName: 'ruleStatusSlot' },
        { label: '创建人', prop: 'createUserName' },
        { label: '创建时间', prop: 'createTime' },
        { slot: true, slotName: 'handleSlot' }
      ],
      ruleStatus: [
        { label: '全部', value: '' },
        { label: '禁用', value: '0' },
        { label: '启用', value: '1' }
      ],
      searchTypeCountList: [{ typeCode: 0, typeDescribe: '平台单号' }],
      value: '0',
      form: {
        platformCode: '',
        ruleName: '',
        ruleStatus: ''
      },
      platformList: []
    }
  },
  mounted() {
    this.getPlatformList()
    this.getData()
  },
  methods: {
    search() {
      this.getData()
    },
    getData() {
      this.$refs.table.load(1)
    },
    fetch({ current, size }) {
      const params = Object.assign({}, this.form)
      return list(params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.getData()
    },
    getPlatformList() {
      getPlatformList().then(res => {
        this.platformList = res.data.map(item => {
          return {
            label: item.platformName,
            value: item.platformCode
          }
        })
      })
    },
    add(row) {
      let id = ''
      if (row) {
        id = row.id
      }
      const { platformList } = this
      this.$modal({
        title: `${id ? '编辑' : '新增'}标记规则`,
        component: tagConfigModal,
        data: { platformList, id },
        callback: (type) => {
          type && this.getData()
        }
      })
    },
    del(id) {
      this.$confirm('删除此条规则, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(id).then(res => {
          this.$message.success('删除成功') && this.getData()
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
