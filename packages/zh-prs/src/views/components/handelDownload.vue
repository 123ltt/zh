<template>
  <div class="dropDownTitle mb-1">
    <el-dropdown>
      <el-button type="primary" size="mini"> 导出<i class="el-icon-arrow-down el-icon--right" /></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="handleDownload(0)">部分导出</el-dropdown-item>
        <el-dropdown-item @click.native="handleDownload(1)">全部导出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'HandelDownload',
  props: {

    // 全部导出数据
    allData: {
      type: Array,
      default: () => []
    },
    // 部分导出选中数据
    partData: {
      type: Array,
      default: () => []
    },

    // 导出头部
    headers: {
      type: Array,
      default: () => []
    }

  },
  data() {
    return {
      downloadLoading: ''
    }
  },
  watch: {
    allData(val) {
      this.DownloadExcel(val, this.headers)
    }
  },
  methods: {
    handleDownload(val) {
      if (val) {
        this.$emit('getAllData')
      } else {
        if (!this.partData.length) {
          this.$message.warning('请选择导出数据')
          return
        }
        this.DownloadExcel(this.partData, this.headers)
      }
      this.downloadLoading = true
    },
    // 导出excel
    DownloadExcel(list, headers) {
      import('../../utils/Export2Excel').then(excel => {
        const tHeader = headers.slice(1).map(item => {
          return item.label || item.field || item.slotName
        })

        const filterVal = headers.slice(1).map(item => {
          return item.prop || item.slotName
        })
        const data = this.formatJson(filterVal, list)
        const time = new Date()
        const date = time.getFullYear() + '-' + (time.getMonth() + 1 + '').padStart(2, '0') + '-' + (time.getDate() + '').padStart(2, '0')
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '明细' + date,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    // 格式化成二维数据
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>

<style scoped lang="scss">
 .el-dropdown-link {
  font-size: 15px;
    color: #409EFF;
  }
.dropDownTitle{
  margin-left:auto ;
   width:80px
}

</style>
