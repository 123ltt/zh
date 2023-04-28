<template>
  <basic-container>
    <g-table ref="tableRef" :fetch="fetch" row-key="id" :headers="headers">
      <template v-slot:header>
        <el-form size="mini" label-width="100px" class="no-message form-col">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="渠道名称:">
                <g-select v-model.trim="formData.id"
                          :items="channelList"
                          key-field="id"
                          :label-field="getLabel"
                          value-field="id"
                          placeholder="请选择"
                          style="width:87%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="状态:">
                <el-radio-group v-model="formData.quotationStatus" size="mini" @change="changeFunc">
                  <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
                </el-radio-group>

              </el-form-item>
            </el-col>
            <el-col :span="8" class="pb-2">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button size="mini" icon="el-icon-delete" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </template>
      <el-table-column slot="operation" label="操作" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">报价</g-link>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import priceDetail from './costOfferModal/detail.vue'
import { logisticsChannel, dictionary } from '@/api/common'
import { getChannelList } from '@/api/costOffer'
export default {
  name: 'TmsProviderCostOffer',
  data() {
    return {
      statusList: [],

      headers: [{
        label: '渠道名称', prop: 'name', align: 'center'
      },

      {
        label: '渠道代码(内)', prop: 'channelCode', align: 'center'
      },
      {
        label: '状态', prop: 'quotationStatusStr', align: 'center'
      },

      {
        slot: true, slotName: 'operation'
      }
      ],
      formData: { quotationStatus: '' },
      channelList: []

    }
  },
  mounted() {
    this.getData()

    this.init()
  },
  methods: {
    // 获取表格数据
    fetch({ current, size }, params) {
      return getChannelList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },

    // 获取渠道名称下拉数据
    getData() {
      logisticsChannel().then(res => {
        this.channelList = res.data
      })
      // 获取字典状态
      dictionary('quotation_status').then(res => {
        res.data.unshift({ dictKey: '', dictValue: '全部' })
        this.statusList = res.data
      })
    },
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    detailBtn(row) {
      this.$newTab({
        path: '/provider/costOfferModal/detail',
        title: '报价详情',
        component: priceDetail,
        clearCache: true,
        data: {
          detailInfo: row
        },
        callback: (bool) => {
        }
      })
    },
    // 启用状态更改
    changeFunc() {
      this.init()
    },
    // 搜索
    search() {
      this.init()
    },
    init() {
      this.$refs.tableRef.load(1, this.formData)
    },
    // 重置
    reset() {
      this.formData = { quotationStatus: '', id: '' }
      this.init()
    }
  }

}
</script>

<style scoped lang="scss">

.el-radio-group{
  width:85%;
  display:flex;
  .el-radio-button.el-radio-button--mini{
   flex:1;
    ::v-deep .el-radio-button__inner{
      padding:0!important;
      width:100%;
      height:28px;
      line-height:28px;
    }
  }
}

</style>
