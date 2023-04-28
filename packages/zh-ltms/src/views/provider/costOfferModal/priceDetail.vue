<template>
  <basic-container>
    <el-dialog
      v-show="dialogVisible"
      :visible="true"
      :before-close="handleClose"
      fullscreen
      :modal="false"
    >
      <div :style="{height:height}">
        <g-table ref="table"
                 :headers="headers"
                 :fetch="fetch"
                 :row-class-name="tableRowClassName"
                 :cell-style.sync="rowStyle"
                 :page-size="15"
        />
      </div>

    </el-dialog>
    <el-row ref="formRef" v-loading="loading" class="row">
      <el-card ref="detailCard" class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>渠道报价详情</span>
        </div>
        <g-list-group
          :cols="3"
          label-width="100px"
          label-align="center"
          class="d-flex justify-content-left align-items-left"
        >
          <g-list-group-item
            v-for="item in groupList"
            :key="item.prop"
            :label="item.name"
          >
            {{
              item.prop === 'endDate' && row.isExhibition === 1
                ? '--'
                : row[item.prop]
            }}</g-list-group-item>
        </g-list-group>

      </el-card>
    </el-row>
    <detailTab :include-pane="includePane" class="details-tab" :hide-handle-rec="true" @emitUpdate="emitUpdate">
      <template slot="default">
        <el-tab-pane label="价格详情" name="priceInfo" lazy>
          <g-table ref="priceTable"
                   :headers="headers"
                   :fetch="fetch"
                   :row-class-name="tableRowClassName"
                   :cell-style="rowStyle"
                   :page-size="15"
          />
        </el-tab-pane>
      </template>
      <template slot="btns" slot-scope="{activeName}">
        <div class="btns">
          <el-tooltip v-if="activeName ==='priceInfo'" content="全屏" effect="dark" placement="bottom">
            <div>
              <el-button icon="el-icon-full-screen" size="mini" class="border-0" @click="fullScreen" />
            </div>
          </el-tooltip>
        </div>
      </template>
    </detailtab>
  </basic-container>
</template>

<script>
import detailTab from '@/views/components/detailTab'
import { getChangeTable, getFixTable } from '@/api/costOffer'
import { dictionary, getCurrencyList } from '@/api/common'
export default {
  components: { detailTab },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      includePane: [{ tabName: 'priceInfo', tableName: 'priceTable' }],
      height: 'calc(100vh - 80px)',
      // 计费类型
      page: { current: 1, size: 15 },
      chargingType: {},
      dialogVisible: false,
      weightList: [],
      partitionNameList: [],
      valueList: [],
      groupList: [
        { name: '费用项名称', prop: 'itemNameRe', align: 'center' },
        { name: '价格版本', prop: 'channelNumber', align: 'center' },
        { name: '价格模板', prop: 'templateTypeRe', align: 'center' },
        { name: '币种', prop: 'currency', align: 'center' },
        { name: '生效日期', prop: 'startDate', align: 'center' },
        { name: '失效日期', prop: 'endDate', align: 'center' }

      ],
      loading: false,
      tableList: [],
      tableData: [],
      headers: []
    }
  },

  mounted() {
    this.getDictionary()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (this.row.templateType === 3) {
        if (row.addClass && rowIndex === this.page.index) {
          return 'fw-bolder highlight-current-row'
        }
      }
    },
    rowStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.page.index &&
      columnIndex === this.page.targetColIndex &&
      this.page.flag &&
       this.row.templateType !== 3
      ) {
        return 'background-color:  #0caae042 !important;font-weight:bolder'
      }
    },

    emitUpdate(val) {
      const tableName = this.includePane.filter(item => item.tabName === val[0])[0].tableName
      this.$refs[tableName].updateTableHeight()
    },
    fullScreen() {
      this.$refs.table.load(this.page.current)
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs.priceTable.load(this.page.current)
      this.dialogVisible = false
    },
    // 获取字典资料
    getDictionary() {
      Promise.all([
        dictionary('tms_base_channel_price_item_name'),
        dictionary('tms_base_channel_edition_rules'),
        getCurrencyList(),
        dictionary('tms_base_channel_edition_charging_type')
      ]).then(
        ([
          { data: costName },
          { data: templateType },
          { data: currency },
          { data: chargingType }
        ]) => {
          this.row.templateTypeRe = templateType.map(
            item => item.dictValue
          )[this.row.templateType - 1]

          costName.forEach((item) => {
            if (item.dictKey === this.row.itemName) {
              this.row.itemNameRe = item.dictValue
            }
          })
          currency.forEach((item) => {
            if (item.currCode === this.row.currency) {
              this.row.currency = item.currCode + '(' + item.currName + ')'
            }
          })
          chargingType.forEach((item) => {
            this.chargingType[item.dictKey] = item.dictValue
          })
          // 根据价格模板,获取对应的数据
          this.init()
        }
      )
    },
    fetch({ current, size }) {
      if (this.row.templateType === 3) {
        return getFixTable(current, size, { parentId: this.row.id }).then(({ data }) => {
          // 分页跳转  +  页数跳转
          data.records.forEach((item, index) => {
            if (item.id === this.row.itemId) {
              this.page.index = index
              item.addClass = true
            }

            ['endWeight',
              'incidentalPrice',
              'maxFreight',
              'minFreight',
              'price',
              'startWeight',
              'continuationWeight',
              'carryWeight'

            ].forEach(i => {
              item[i] = item[i] == null ? '--' : parseFloat(item[i])
            })

            item.chargingType = this.chargingType[item.chargingType]
            this.page.current = data.current
          })
          this.tableData = data.records
          return {
            records: data.records, // 列表数据
            total: data.total, // 总记录数
            size: data.size // 每页最大记录数
          }
        })
      } else {
        return Promise.resolve(1).then(res => {
          const tableList = Object.assign([], this.tableList)
          const len = tableList.length
          current === 1
            ? this.tableData = tableList.splice(0, size)
            : this.tableData = tableList.splice((current - 1) * size, size)
          if (this.row.current !== undefined) {
            this.page.size = size
            this.getItemInfo()
          }
          this.page.flag = current === this.page.current

          return {
            total: len,
            records: this.tableData,
            size
          }
        })
      }
    },
    init() {
      this.row.templateType === 3
        ? this.initFixHeaders()
        : this.getChangeTableData()
    },
    initFixHeaders() {
      this.headers = [
        {
          label: '分区名称',
          prop: 'partitionName',
          align: 'center'
        },
        {
          label: '起始重量(kg)',
          prop: 'startWeight',
          align: 'center'
        },
        {
          label: '截止重量(kg) ',
          prop: 'endWeight',
          align: 'center'
        },
        {
          label: '进位值',
          prop: 'carryWeight',
          align: 'center'
        },
        {
          label: ' 续重(kg)',
          prop: 'continuationWeight',
          align: 'center'
        },
        {
          label: '计费方式 ',
          prop: 'chargingType',
          align: 'center'
        },
        {
          label: '基础收费',
          prop: 'incidentalPrice',
          align: 'center'
        },
        {
          label: ' 价格',
          prop: 'price',
          align: 'center'
        },
        {
          label: ' 最低收费 ',
          prop: 'minFreight',
          align: 'center'
        },
        {
          label: '最高收费',
          prop: 'maxFreight',
          align: 'center'
        }
      ]
      // 试算监控跳转

      if (this.row.current !== undefined) {
        this.page.current = this.row.current || 1
      }
      this.$refs.priceTable.load(this.page.current)
    },
    getChangeTableData() {
      getChangeTable({ parentId: this.row.id }).then(res => {
        const {
          weightList, partitionNameList, valueList
        } = res.data
        this.valueList = valueList
        this.weightList = weightList
        this.partitionNameList = partitionNameList
        // 分区竖版
        if (this.row.templateType === 2) {
          // 分区竖版 内容
          this.tableList = weightList.map((item) => {
            const obj = { title: parseFloat(item.endWeight) }
            valueList.map((val) => {
              if (val.endWeight === item.endWeight) {
                obj[val.partitionName] = val.price === null ? '--' : parseFloat(val.price)
              }
            })
            partitionNameList.forEach((val) => {
              if (obj[val.partitionName] === undefined) {
                obj[val.partitionName] = '--'
              }
            })
            return obj
          })
          // 分区竖版 头部
          this.headers = partitionNameList.map((val) => {
            return {
              label: val.partitionName,
              prop: val.partitionName,
              align: 'center'
            }
          })
          this.headers.unshift({
            label: '重量(kg)',
            prop: 'title',
            align: 'center'
          })
        }
        // 分区横版
        if (this.row.templateType === 1) {
          // 分区横板 头部
          this.headers = weightList.map((val) => {
            return {
              label: parseFloat(val.endWeight).toString(),
              prop: Math.floor(
                parseFloat(val.endWeight * 1000000)
              ).toString()
            }
          })
          this.headers.unshift({
            label: '重量(kg)',
            prop: 'title'
          })
          // 分区横板 身体
          this.tableList = partitionNameList.map((item) => {
            const obj = { title: item.partitionName }
            valueList.forEach((val) => {
              if (val.partitionName === item.partitionName) {
              // 防止出现0.070*10000=700.000000001匹配不上
                obj[
                  Math.floor(parseFloat(val.endWeight * 1000000))
                ] = val.price === null ? '--' : parseFloat(val.price)
              }
            })
            weightList.forEach((val) => {
              obj[Math.floor(parseFloat(val.endWeight * 1000000))] =
              obj[Math.floor(parseFloat(val.endWeight * 1000000))] ??
              '--'
            })
            return obj
          })
        }

        // 是否监控跳转来的
        if (this.row.current !== undefined) {
          this.getItemInfo()
        }
        this.$refs.priceTable.load(this.page.current)
      })
    },
    // 横竖版的指定单元格索引
    getItemInfo() {
      this.page.targetItem = this.valueList.find(item => item.id === this.row.itemId)
      const targetItem = this.page.targetItem
      const partitionIndex = this.partitionNameList.findIndex(item => item.partitionName === targetItem.partitionName)
      const weightIndex = this.weightList.findIndex(item => item.endWeight === targetItem.endWeight)
      this.page.targetRowIndex = this.row.templateType === 2 ? weightIndex + 1 : partitionIndex + 1
      this.page.targetColIndex = this.row.templateType === 2 ? partitionIndex + 1 : weightIndex + 1
      this.page.current = Math.ceil(this.page.targetRowIndex / this.page.size)
      this.page.index = (this.page.targetRowIndex % this.page.size) === 0 ? this.page.size - 1 : (this.page.targetRowIndex % this.page.size) - 1
    }

  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
    padding: 5px 10px;
}
::v-deep .el-table__body tr.highlight-current-row>td {
   background-color:  #0caae042 !important;
}
</style>
