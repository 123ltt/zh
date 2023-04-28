<template>
  <div class="w-100">
    <el-table ref="table"
              border
              stripe
              class="g-table g-table-dense "
              highlight-current-row
              :data="tableData"
              :expand-row-keys="expands"
              :row-key="getRowKeys"
              height="calc(100vh - 280px)"
              @expand-change="changeExpand"
    >
      <el-table-column v-loading.fullscreen.lock="loading" type="expand">
        <!-- 扩展表格开始 -->
        <template #default="{ row }">
          <div style="height:300px;">
            <el-table :ref="`expandsTable${row.id}`"
                      border
                      stripe
                      class="g-table g-table-dense priceExpandsTable"
                      highlight-current-row
                      :data="expandsData"
                      height="300px"
            >
              <el-table-column label="价格版本" prop="channelNumber" min-width="100px" align="center" />
              <el-table-column prop="templateType" label="价格模板" align="center" min-width="100px">
                <template #default="scope">
                  <g-link color="primary" @click="templateTypeDetail(scope.row,row)">
                    {{ getTemplateType(scope.row.templateType) }}
                  </g-link>
                </template>
              </el-table-column>
              <!-- 币种 -->
              <el-table-column prop="currency" label="币种" align="center" min-width="100px">
                <template #default="scope">
                  {{ getFullCurrency(scope.row.currency) }}
                </template>
              </el-table-column>
              <el-table-column prop="startDate" label="生效日期" min-width="100px" align="center" />
              <!-- 失效日期 -->
              <el-table-column prop="endDate" label="失效时期" align="center" min-width="100px">
                <template #default="scope">
                  {{ scope.row.isExhibition? '--':scope.row.endDate }}
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" align="center" width="180px">
                <template #default="scope">
                  <el-row>
                    <el-button type="text" :disabled="judgeFail(scope.row)" @click="editBtn(scope.row)">编辑</el-button>
                    <el-button type="text" :disabled="judgeUpFail(scope.row)" @click="uploadBtn(scope.row)">导入报价</el-button>
                  </el-row>
                  <el-row>
                    <el-button type="text" :disabled="judgeFail(scope.row)" @click="delBtn(scope.row)">删除</el-button>
                    <el-button type="text" :disabled="scope.row.status===2" @click="downloadBtn(scope.row)">导出报价</el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <!-- 扩展表格结束 -->
      </el-table-column>
      <el-table-column label="费用项代码" prop="itemCode" min-width="180px" align="center" />

      <el-table-column label="费用项名称" prop="itemName" min-width="180px" align="center">
        <template #default="scope">
          {{ getItemName(scope.row.itemCode) }}
        </template>
      </el-table-column>

      <el-table-column label="适用条件" prop="houqitianjia" min-width="100px" align="center">
        <template>
          <el-button size="mini" type="primary" disabled>适用条件</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="启用状态" align="center" min-width="100px">
        <template #default="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="changeState(row)"
          />
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import priceDownorUp from '../../components/downorup'
import priceAdd from './priceAdd'
import { priceDetail, priceEditionDetail, updatePriceStatus, editionDetailDelete, exportPartitionRules, exportPriceRules } from '@/api/costOffer'
import { dowloadExc, debounce } from '@/util/util'
import { dictionary, getCurrencyList } from '@/api/common'
import channelPriceDetail from './priceDetail'
export default {
  name: 'OfferTable',
  props: {
    channelCode: String,
    channelName: String
  },
  data() {
    return {
      loadingTo: false,
      noMore: false,
      loading: false,
      tableData: [],
      expands: [],
      scrollLoad: false,
      expandsData: [],
      priceNameList: [],
      editionRulesList: [],
      insurCurrList: [],
      page: {}
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.init()
  },
  methods: {
    getData() {
      Promise.all([
        dictionary('tms_base_channel_price_item_name'),
        dictionary('tms_base_channel_edition_rules'),
        getCurrencyList()
      ]).then(arr => {
        this.priceNameList = arr[0].data // 费用项名称
        this.editionRulesList = arr[1].data// 价格模板
        this.insurCurrList = arr[2].data // 币种
      })
    },
    getRowKeys(row) {
      return row.id
    },
    getItemName(val) {
      return this.priceNameList && this.priceNameList.find(item => item.dictKey === val + '')?.dictValue
    },
    getTemplateType(val) {
      return this.editionRulesList && this.editionRulesList.find(item => item.dictKey === val + '')?.dictValue
    },
    getFullCurrency(val) {
      const item = this.insurCurrList && this.insurCurrList.find(item => item.currCode === val + '')
      return `${item?.currCode}(${item?.currName})`
    },

    judgeFail(row) {
      // 生效日期在此刻之前 不可编辑、删除 返回true
      return (new Date()).getTime() > (new Date(row.startDate)).getTime()
    },
    judgeUpFail(row) {
      return this.judgeFail(row) && row.status === 1
    },
    // 主表刷新
    init(bool) {
      const params = {
        channelCode: this.channelCode,
        ...this.page
      }
      priceDetail(params).then(res => {
        this.tableData = res.data.records
        this.page.total = res.data.total
        if (bool) {
          this.expands = [this.tableData.find(item => item.itemCode === bool).id]
          this.expandsInit()
        }
      })
    },
    // 子表刷新  ！！！！引入滚动可能引起刷新问题
    expandsInit() {
      this.$nextTick(() => {
        const params = {
          ...this.page,
          parentId: this.expands[0]
        }
        priceEditionDetail(params).then(res => {
          const records = res.data.records
          this.scrollLoad ? this.expandsData.push(...records) : this.expandsData = records
          this.page.total = res.data.total
          !records.length && this.init() // 删除无数据需要刷新页面
        })
      })
    },
    bindingScrollLazy() {
      const dom = this.$refs[`expandsTable${this.expands[0]}`].$el.childNodes[2]
      const scrolldistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight - 5
      if (scrolldistance <= 0) {
        if ((this.page.current) * this.page.size < this.page.total) {
          this.page.current++
          this.scrollLoad = true
          this.expandsInit()
        }
      }
    },
    changeState(row) {
      const param = {
        id: row.id,
        status: row.status,
        channelCode: this.channelCode
      }
      updatePriceStatus(param).then(res => {
        this.init()
        this.$message.success('更改状态成功')
      })
    },
    changeExpand(row, expandedRows) {
      this.page = {
        current: 1,
        total: 1,
        size: 10
      }
      this.expandsData = []
      if (expandedRows.length) {
        this.expands = []
        if (row) this.expands.push(row.id)
        this.expandsInit()
        // 绑定监听滚动
        this.$nextTick(() => {
          const $table = this.$refs[`expandsTable${this.expands[0]}`].$el.childNodes[2]
          const scrollLazy = debounce(this.bindingScrollLazy, 500)
          $table.addEventListener('scroll', scrollLazy)
          this.$once('hook:beforeDestroy', () => {
            $table.removeEventListener('scroll', this.bindingScrollLazy)
          })
        })
      } else {
        this.expands = []
      }
      row.isExpand = !row.isExpand
    },

    editBtn(row) {
      this.$modal({
        title: '编辑费用项',
        component: priceAdd,
        width: '700px',
        data: {
          channelCode: this.channelCode,
          channelName: this.channelName,
          detailInfo: row,
          isAdd: !row
        },
        callback: (bool) => {
          if (bool) this.expandsInit()
        }
      })
    },
    uploadBtn(rows) {
      this.$modal({
        title: '价格导入表',
        component: priceDownorUp,
        width: '500px',
        data: {
          title: '新价格导入',
          rows
        },
        callback: (bool) => {
          if (bool) this.expandsInit()
        }
      })
    },
    downloadBtn(row) {
      const templateType = row.templateType
      const act = [exportPartitionRules, exportPartitionRules, exportPriceRules][templateType - 1]
      this.$confirm('确认导出价格列表?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true
        const params = {
          templateType: row.templateType,
          parentId: row.id,
          channelCode: this.channelCode
        }
        act(params).finally(() => {
          this.loading = false
        }).then(res => {
          dowloadExc(res, `${this.channelCode}.xlsx`)
        })
      })
    },
    delBtn(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id,
          parentId: this.expands[0],
          channelCode: this.channelCode
        }
        editionDetailDelete(params).then(res => {
          this.expandsInit() && this.$message.success('删除成功')
        })
      }).catch(() => {})
    },
    templateTypeDetail(row, preRow) {
      row = Object.assign({}, row)
      row.itemName = preRow.itemCode
      this.$newTab({
        path: '/provider/costOffModal/priceDetail',
        title: '渠道价格详情',
        component: channelPriceDetail,
        clearCache: true,
        data: {
          row
        }
      })
    }

  }

}
</script>
<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
}
.footer-box{
  position:absolute;
  right:0;
  bottom:0;
}
</style>
