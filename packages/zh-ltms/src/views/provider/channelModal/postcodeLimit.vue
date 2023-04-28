<template>
  <g-table ref="table" :headers="headers" :fetch="fetch">
    <template slot="header">

      <el-row :gutter="10">
        <el-col :span="1" />
        <el-col :span="1" style="line-height:28px;text-align:right">
          <span>邮编:</span>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchData.postCode" placeholder="请输入内容" size="small" clearable />
        </el-col>
        <el-col :span="2" style="line-height:28px;margin-top:2px;">
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="init"
          >搜索</el-button>
        </el-col>
        <el-col :span="8" align="center">
          <el-button v-if="!isDetail" type="text" @click="templateBtn()">模板下载</el-button>
          <el-button v-if="!isDetail" type="text" @click="upBtn()">邮编导入</el-button>
          <el-button type="text" @click="downBtn()">邮编导出</el-button>
        </el-col>
      </el-row>

    </template>
  </g-table>
</template>
<script>
import {
  downloadTemplate,
  exportPostCode,
  postCodeList
} from '@/api/channelInformation'
import { logisticsChannel } from '@/api/common'
import { dowloadExc, debounce } from '@/util/util'
import priceDownorUp from '../../components/downorup'

export default {
  name: 'PostCodeInfo',

  props: {
    detailInfo: Object
  },
  inject: ['isDetail'],
  data() {
    return {
      current: 1,
      headers: [
        { label: '国家', prop: 'country', align: 'center' },
        { label: '邮编', prop: 'postCode', align: 'center' }
      ],
      searchData: {
        postCode: ''
      },
      channelList: [],
      rules: {}
    }
  },
  created() {
    logisticsChannel().then(res => {
      this.channelList = res.data
    })
  },
  mounted() {
    const fn = debounce(this.updateHeight, 500)
    window.addEventListener('resize', fn)
    this.$once('hook: beforeDestroy', () => {
      window.removeEventListener('resize', fn)
    })
    this.updateHeight()
    this.init()
  },

  methods: {
    templateBtn() {
      downloadTemplate().then(res => {
        dowloadExc(res, '邮编限制导入模板.xlsx')
      })
    },

    upBtn() {
      this.$modal({
        title: '邮编限制导入',
        component: priceDownorUp,
        width: '500px',
        data: {
          title: '邮编限制导入',
          rows: {
            channelCode: this.detailInfo.channelCode
          }
        },
        callback: (bool) => {
          if (bool) {
            this.init(false)
          }
        }
      })
    },

    downBtn() {
      this.$confirm('确认导出邮编列表?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true
        const channelCode = this.detailInfo.channelCode
        const params = {
          channelCode
        }
        const channelName = this.channelList.find(item =>
          item.channelCode === channelCode
        )?.name
        exportPostCode(params).finally(() => {
          this.loading = false
        }).then(res => {
          dowloadExc(res, `${channelName}.xlsx`)
          this.$message.success('导出成功')
        })
      })
    },
    init() {
      const params = { channelCode: this.detailInfo.channelCode, ...this.searchData }
      this.$refs.table.load(1, params)
    },

    updateHeight() {
      const h = this.$parent.$parent.$el.clientHeight - 20
      document.querySelector('#tabs>.el-tabs__content .el-card__body').style.height = h + 'px'
      document.querySelector('#tabs>.el-tabs__content .el-table').parentElement.style.height = h - 115 + 'px'
      this.$refs.table.updateTableHeight()
    },

    fetch({ current, size }, params) {
      return postCodeList(current, size, params).then(res => {
        this.updateHeight()
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.pageSize
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
</style>
