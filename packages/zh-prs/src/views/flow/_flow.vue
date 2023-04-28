<template>
  <basic-container>
    <g-table
      ref="tableRef"
      :headers="headers"
      :fetch="fetch"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <template #header>
        <cols-form
          ref="colsForm"
          :form-info="formInfo"
          :form-item="formItem"
          :form-handler="formHandler"
        />
        <el-tabs v-model="formInfo.status">
          <el-tab-pane name="''" label="全部" />
          <el-tab-pane name="1" label="待匹配" />
          <el-tab-pane name="2" label="匹配异常" />
          <el-tab-pane name="3" label="已核销" />
        </el-tabs>
      </template>
      <el-table-column slot="platformCode" label="平台">
        <template v-slot="{row}">
          <span>{{ getPlatform(row.platformCode) }}</span>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm'
import downOrUpFlow from './downOrUpFlow'
import { filterData } from '../../utils/filterData'
import { getFlowList, getSiteNameList, getStoreCodeListUnlimit, getMyDictBiz, getTaskTypeList } from '@/api/common'

export default {

  name: 'PrsFlowFlow',
  components: { colsForm },

  data() {
    return {
      getFlowList,
      payeeTypeList: [],
      platformList: [],
      formItem: [
        {
          type: 'select',
          label: '收款方式',
          prop: 'payeeType',
          optionValue: 'payeeType',
          optionLabel: 'taskName',
          options: [

          ]
        },
        {
          type: 'input',
          label: 'Email',
          prop: 'email'
        },
        {
          type: 'select',
          label: '平台名称',
          prop: 'platformCode',
          options: []
        },

        {
          type: 'bselect',
          label: '经营站点',
          prop: 'site',
          options: [

          ]
        },

        {
          type: 'gselect',
          label: '店铺编码',
          optionValue: 'value',
          prop: 'storeCode',
          options: [

          ]
        },

        {
          type: 'datePicker',
          label: '到账时间',
          prop: 'date',
          options: [

          ]
        }
      ],
      formHandler: [
        {
          label: '查询',
          handler: () => {
            this.search()
          }
        },
        {
          label: '重置',
          handler: () => {
            this.reset()
          },
          type: 'plan'
        },
        {
          label: '导入',
          handler: () => {
            this.importBill()
          }
        }
      ],
      formInfo: {
        platformCode: '',
        storeCode: '',
        site: '',
        collectionStartTime: '',
        ollectionEndTime: '',
        status: "''"
      },
      headers: [
        { label: '收款方式', prop: 'payeeTypeName' },
        { slot: true, slotName: 'platformCode' },
        { label: '站点', prop: 'site' },
        { label: '店铺编码/主账号', prop: 'storeCode' },
        { label: 'PayPal账号/店铺注册公司', prop: 'special', width: '200' },
        { label: '到账时间', prop: 'collectionDate' },
        { label: '交易流水号', prop: 'flowNum' },
        { label: 'Email', prop: 'email' },
        { label: '币种', prop: 'currency' },
        { label: '到账流水', prop: 'collectionAmount' },
        { label: '摘要备注', prop: 'remark', width: '120' }
      ]
    }
  },
  watch: {
    'formInfo.status'() {
      this.$nextTick(() => {
        this.init()
      })
    },
    'formInfo.platformCode'(val) {
      this.formInfo.storeCode = ''
      this.formInfo.site = ''
      val || (this.formItem[3].options = [])
      val || (this.formItem[4].options = [])
      val && getStoreCodeListUnlimit({ platformCode: val }).then(res => {
        this.formItem[4].options = res.data
      })
      val && getSiteNameList({ platformCode: val }).then(res => {
        this.formItem[3].options = res.data
      })
    },
    'formInfo.date'(val) {
      this.formInfo.collectionStartTime = val?.[0]
      this.formInfo.collectionEndTime = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },

  mounted() {
    this.init()
    this.getData()
  },
  methods: {

    getData() {
      getTaskTypeList({ type: 2 }).then(res => {
        this.formItem[0].options = res.data
      })
      getMyDictBiz('platform').then(res => {
        // 数组根据dictvalue去重
        var obj = {}
        res.data = res.data.filter((item) => {
          if (!obj[item.dictKey]) {
            obj[item.dictKey] = true
            return item
          }
        })
        this.platformList = res.data
        this.formItem[2].options = res.data
      })
    },
    getPlatform(val) {
      return this.platformList.find(item => item.dictKey === (val + ''))?.dictValue
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      return getFlowList(current, size, params).then((res) => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    search() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    reset() {
      this.formInfo = {
        platformName: '',
        storeCode: '',
        site: ''
      }
      this.init()
    },
    importBill() {
      const that = this
      this.$modal({
        title: '导入流水',
        width: '38%',
        component: downOrUpFlow,
        callback(val) {
          val && that.init()
        }
      })
    }
  }

}
</script>

<style></style>
