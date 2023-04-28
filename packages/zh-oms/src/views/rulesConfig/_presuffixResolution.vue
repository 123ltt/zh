<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <el-form slot="header"
               ref="form"
               label-width="90px"
               size="mini"
               :model="form"
               class="no-message form-col"
               @submit.native.prevent="search"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="平台" label-width="70px" prop="platformCode">
              <el-select v-model="form.platformCode" filterable clearable class="w-100">
                <el-option
                  v-for="item in platformList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU包含内容" prop="affixContent">
              <el-input v-model="form.affixContent" class="w-100" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="form.ruleName" class="w-100" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实发仓库" prop="deliveryWarehouse">
              <wareCascader ref="wc" class="w-100" clearable :value.sync="form.deliveryWarehouse" @rendered="wcRendered" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="发货渠道" label-width="70px" prop="deliveryChannel">
              <g-select v-model="form.deliveryChannel" :items="deliveryChannelList" key-field="id" label-field="fullName" value-field="channelCode" dropdown-width="24em" class="w-100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" clearable class="w-100">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否虚拟仓" prop="isVirtual">
              <el-select v-model="form.isVirtual" class="w-100">
                <el-option label="ALL" value="" />
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px">
              <el-button type="primary" native-type="submit">搜索</el-button>
              <el-button @click="reset">重置</el-button>
              <g-auth code="oms_rule_config_sku_parse_add">
                <el-button type="primary" class="mb-2" @click="updateSKU()">新增</el-button>
              </g-auth>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table-column slot="channelName" label="物流渠道">
        <div slot-scope="{row:{channelNameArray}}" class="d-flex justify-content-between">
          <g-text-ellipsis>{{ channelNameArray[0] }}</g-text-ellipsis>
          <el-popover
            v-if="channelNameArray.length>1"
            placement="right"
            width="300"
            trigger="hover"
          >
            <g-text-ellipsis v-for="(item, i) in channelNameArray" :key="item.id">{{ i+1 + '、'+ item }}</g-text-ellipsis>
            <el-button slot="reference" type="text">更多</el-button>
          </el-popover>
        </div>
      </el-table-column>

      <el-table-column slot="warehouseNames" label="实发仓库">
        <div slot-scope="{row}" class="d-flex justify-content-between">
          <g-text-ellipsis>{{ (row.warehouseList[0]||{}).deliveryWarehouseName }}</g-text-ellipsis>
          <el-popover
            v-if="row.warehouseList.length>1"
            placement="right"
            width="400"
            trigger="hover"
          >
            <g-text-ellipsis v-for="(item, i) in row.warehouseList" :key="item.id">{{ i+1 + '、'+ item.deliveryWarehouseName }}</g-text-ellipsis>
            <el-button slot="reference" type="text">更多</el-button>
          </el-popover>
        </div>
      </el-table-column>
      <el-table-column slot="descriptionSlot" label="描述">
        <template slot-scope="{row}">
          <g-text-ellipsis>{{ row.description }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handlerBtnSlot" label="操作" width="100px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            :disabled="!$auth('oms_rule_config_sku_parse_enable')"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(row)"
          />
          <g-auth code="oms_rule_config_sku_parse_edit">
            <el-button type="text" @click="updateSKU(row.id)">修改</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { debounce } from '@/util/util'
import { getPageList, updateStatusById } from '@/api/presuffixResolution'
import { getChannelListAll, getPlatformList } from '@/api/common.js'

import PresuffixModal from './modal/presuffixModal.vue'
import wareCascader from '@/views/components/wareCascader/index.vue'

export default {
  name: 'OmsRulesConfigPresuffixResolution',
  components: { wareCascader },
  data() {
    return {
      form: {
        platformCode: '',
        affixContent: '',
        status: '',
        deliveryWarehouse: [],
        channelCode: '',
        ruleName: '',
        isVirtual: ''
      },
      headers: [
        { label: '平台', prop: 'platformName', showOverflowTooltip: true },
        { label: 'SKU包含内容', prop: 'affixContent', showOverflowTooltip: true },
        { label: '规则名称', prop: 'ruleName', showOverflowTooltip: true },
        { label: '规则优选级', prop: 'priority', width: 82 },
        {
          label: '是否虚仓',
          prop: 'isVirtual',
          width: 70,
          formatter(row, column, cellValue) {
            return cellValue === 1 ? '虚拟仓' : '实体仓'
          }
        },
        { slot: true, slotName: 'warehouseNames' },
        { slot: true, slotName: 'channelName' },
        { slot: true, slotName: 'descriptionSlot' },
        { label: '创建人', prop: 'handler', width: 140 },
        { label: '创建时间', prop: 'createTime', width: 130 },
        { slot: true, slotName: 'handlerBtnSlot' }
      ],
      skuAffixTypeList: [
        { label: '前缀', value: '1' },
        { label: '后缀', value: '2' }
      ],
      statusList: [
        { label: '有效', value: 1 },
        { label: '无效', value: 0 }
      ],
      deliveryChannelList: [],
      platformList: []
    }
  },
  created() {
    getChannelListAll().then(res => {
      this.deliveryChannelList = res.data.filter(item => {
        item.fullName = item.name + '(' + item.channelCode + ')'
        return item.channelCode !== ''
      })
    })
    getPlatformList().then(res => {
      this.platformList = res.data.map(item => {
        return {
          label: item.platformName,
          value: item.platformCode
        }
      })
    })
  },
  mounted() {
    this.search()
  },
  methods: {
    wcRendered(list) {
      this.$refs.wc.warehouseList = list.filter(item => item.warehouseCode !== 'VIRTUAL')
    },
    reset() {
      this.$refs.form.resetFields()
      this.search()
    },
    search(page = 1) {
      const { deliveryWarehouse } = this.form
      const dw = deliveryWarehouse.toString()
      this.$refs.table.load(page, { ...this.form, deliveryWarehouse: dw })
    },
    fetch({ current, size }, params) {
      return getPageList({ current, size, ...params }).then(({ data: { records, total, size } }) => {
        const data = records.map(item => {
          item.channelNameArray = typeof item.channelName === 'string' ? item.channelName.split(',') : []
          return item
        })
        return {
          records: data, // 列表数据
          total, // 总记录数
          size // 每页最大记录数
        }
      })
    },
    updateSKU(id) {
      const { skuAffixTypeList, deliveryChannelList } = this
      this.$modal({
        title: `${id ? '修改' : '新增'}分仓规则`,
        width: '880px',
        component: PresuffixModal,
        data: { id, skuAffixTypeList, deliveryChannelList },
        callback: bool => {
          if (bool) this.search(-1)
        }
      })
    },
    changeStatus: debounce(function({ id, status }) {
      updateStatusById(id, status).then(res => {
        this.$message.success(res.msg)
      })
    }, 500)
  }
}
</script>

<style scoped lang="scss">
</style>
