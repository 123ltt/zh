<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" size="mini">
      <el-form slot="header" ref="form" :inline="true" :model="form" class="form-col" size="mini" label-width="60px">
        <el-form-item label="销售平台" prop="platformCode">
          <el-select v-model="form.platformCode" clearable filterable>
            <el-option v-for="(item,index) in platformList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则状态" prop="ruleStatus">
          <el-select v-model="form.ruleStatus" clearable>
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.typeDescribe" :value="item.typeCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
          <g-auth code="oms_rule_config_delivery_priority_add">
            <el-button type="primary" @click="addRules('')">新增</el-button>
          </g-auth>
        </el-form-item>
      </el-form>
      <el-table-column slot="slotStatus" label="状态">
        <template slot-scope="scope">
          {{ scope.row.ruleStatus===0?"禁用":"启用" }}
        </template>
      </el-table-column>
      <el-table-column v-if="$auth('oms_rule_config_delivery_priority_delete','oms_rule_config_delivery_priority_edit')" slot="handler" label="操作">
        <template slot-scope="scope">
          <g-auth code="oms_rule_config_delivery_priority_edit">
            <el-button type="text" @click="addRules(scope.row)">修改</el-button>
          </g-auth>
          <g-auth code="oms_rule_config_delivery_priority_delete">
            <el-button type="text" @click="del(scope.row.id)">删除</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import deliveryModal from './modal/deliveryModal.vue'
import { page, ruleDelete } from '@/api/ruleConfig.js'
import { getPlatformList } from '@/api/common'
export default {
  name: 'OmsRulesConfigDeliveryPriority',
  data() {
    return {
      typeList: [
        { typeCode: '', typeDescribe: '全部' },
        { typeCode: '1', typeDescribe: '启用' },
        { typeCode: '0', typeDescribe: '禁用' }
      ],
      platformList: [
        { typeCode: '', typeDescribe: '全部' },
        { typeCode: '1', typeDescribe: 'eBay' },
        { typeCode: '2', typeDescribe: 'wish' },
        { typeCode: '3', typeDescribe: 'Amazon' },
        { typeCode: '4', typeDescribe: '速卖通' },
        { typeCode: '5', typeDescribe: 'lazada' },
        { typeCode: '6', typeDescribe: 'linio' },
        { typeCode: '7', typeDescribe: 'shopee' },
        { typeCode: '8', typeDescribe: 'joom' },
        { typeCode: '9', typeDescribe: '乐天' },
        { typeCode: '10', typeDescribe: 'WalMart' },
        { typeCode: '11', typeDescribe: '京东' }
      ],
      headers: [
        { label: '销售平台', prop: 'platformCodeName' },
        { label: '规则名称', prop: 'ruleName' },
        { label: '优先级', prop: 'deliverPriority' },
        { slot: true, slotName: 'slotStatus' },
        { label: '创建人', prop: 'createUserName' },
        { label: '创建时间', prop: 'createTime' },
        { slot: true, slotName: 'handler' }
      ],
      form: {
        platformCode: '',
        ruleName: '',
        ruleStatus: ''
      }
    }
  },
  mounted() {
    this.getData()
    this.getPlatformList()
  },
  methods: {
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
    getData() {
      this.$refs.table.load(1)
    },
    search() {
      this.getData()
    },
    reset() {
      this.$refs.form.resetFields()
      this.getData()
    },
    addRules(row) {
      let id = ''
      if (row) {
        id = row.id
      }
      this.$modal({
        title: `${id ? '修改' : '新增'}发货优先级配置`,
        component: deliveryModal,
        data: { id },
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
        ruleDelete({ id }).then(res => {
          this.$message.success('删除成功') && this.getData()
        })
      }).catch(() => {
      })
    },
    fetch({ current, size }) {
      const params = Object.assign({ current, size }, this.form)
      return page(params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
