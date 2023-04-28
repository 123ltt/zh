<template>
  <basic-container v-loading="loading">
    <el-row ref="formRef" type="flex" :gutter="8" class="row">
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <g-list-group :cols="2" label-width="80px" label-align="center">
            <g-list-group-item label="渠道代码">
              <g-text-ellipsis>{{ detailInfo.channelCode }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="渠道名称">
              <g-text-ellipsis>{{ detailInfo.name }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </el-card>
      </el-col>
    </el-row>

    <detailTab :id="detailInfo.channelCode" type="channel_postcode_and_price" :include-pane="includePane" class="details-tab" @emitUpdate="emitUpdate">
      <template slot="default">
        <el-tab-pane label="渠道分区" name="zone" lazy>
          <!-- hasImportFunc是判断是否有渠道分区是否置灰 -->
          <zone-table ref="zoneTable" :channel-code="detailInfo.channelCode" @hasImportFunc="val=>{hasImport=val} " />
        </el-tab-pane>
        <el-tab-pane label="渠道报价" name="offer" lazy>
          <offerTable ref="offerTable" :channel-code="detailInfo.channelCode" :channel-name=" detailInfo.name" />
        </el-tab-pane>
      </template>
      <template slot="btns" slot-scope="{activeName}">
        <div class="btns">
          <el-button v-if="activeName === 'zone'" type="text" size="mini" @click="upload">分区导入</el-button>
          <el-button v-if="activeName === 'zone'" type="text" size="mini" :disabled="!hasImport" @click="download">分区导出</el-button>
          <el-button v-if="activeName === 'offer'" type="text" size="mini" @click="addPrice">新增</el-button>
        </div>
      </template>
    </detailtab>

  </basic-container>
</template>
<script>
import detailTab from '../../components/detailTab'
import priceDownorUp from '../../components/downorup'
import { dowloadExc } from '@/util/util'
import { downloadPartition } from '@/api/costOffer'
import priceAdd from './priceAdd'
import zoneTable from './zoneTable'
import offerTable from './offerTable'
export default {
  name: 'CostOfferDetail',
  components: {
    detailTab,
    zoneTable,
    offerTable
  },
  props: {
    detailInfo: Object
  },
  data() {
    return {
      hasImport: false,
      loading: false,
      includePane: [
        { tabName: 'zone', tableName: 'zoneTable' },
        { tabName: 'offer', tableName: 'offerTable' }
      ]
    }
  },
  methods: {
    // val[0]=> activeName激活当前的组件 val[1]=>表格高度
    emitUpdate(val) {
      const activeTableName = this.includePane.filter(item => item.tabName === val[0])[0].tableName
      if (activeTableName === 'offerTable') return
      this.$refs[activeTableName].$refs.table.updateTableHeight()
    },
    upload() {
      this.$modal({
        title: '邮编分区导入',
        component: priceDownorUp,
        width: '500px',
        data: {
          title: '邮编分区导入',
          selectTitle: '',
          rows: { channelCode: this.detailInfo.channelCode }
        },
        callback: (bool) => {
          if (bool) {
            this.$refs.zoneTable.init()
          }
        }
      })
    },

    download() {
      this.$confirm('确认导出邮编列表?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true
        const params = {
          channelCode: this.detailInfo.channelCode
        }
        downloadPartition(params).finally(() => {
          this.loading = false
        }).then(res => {
          dowloadExc(res, `${this.detailInfo.channelCode}.xlsx`)
        })
      })
    },
    addPrice() {
      this.$modal({
        title: '新增费用项',
        component: priceAdd,
        width: '700px',
        data: {
          channelCode: this.detailInfo.channelCode
        },
        callback: (bool) => {
          if (bool) this.$refs.offerTable.init(bool) // 主表刷新 -> 子表刷新
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.details-tab{
  min-height: 200px;
  position: relative;
  .el-tabs__content {
  position: none;
  }
  .btns{
    position: absolute;
    right: 5px;
    top: 5px;
  }
}
</style>
