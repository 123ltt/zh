<template>
  <basic-container>
    <!-- 搜索区 -->
    <header class="header">
      <el-form :model="submit" size="mini" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="导出时间" prop="timeBool">
              <el-date-picker
                v-model="submit.dateTimeList"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
                type="datetimerange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="search()">查 询</el-button>
            <el-button type="primary" size="mini" @click="reset()">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <!-- 表格 -->
    <main class="main">
      <el-table
        v-loading="loading"
        :data="tableData"
        :max-height="tableMaxHeight"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70"
        />
        <el-table-column
          prop="createTime"
          label="导出时间"
          align="center"
          min-width="250"
        />
        <el-table-column
          prop="fileName"
          label="导出文件"
          align="center"
          min-width="250"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.fileName }}.xlsx</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileType"
          label="文件状态"
          align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.fileType == 0">未加载</span>
            <span v-if="scope.row.fileType == 1">加载中</span>
            <span v-if="scope.row.fileType == 2">已加载</span>
            <span v-if="scope.row.fileType == 3">加载失败</span>
            <span v-if="scope.row.fileType == 4">加载过期</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          min-width="250"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.fileType == 2"
              type="text"
              size="small"
            ><a :href="scope.row.url">下载</a></el-button>
            <el-button
              v-if="scope.row.fileType !=1 && scope.row.fileType != 2"
              type="text"
              size="small"
              @click="toupload(scope.row)"
            >加载</el-button>
            <el-button
              v-if="scope.row.fileType == 1"
              type="text"
              size="small"
              disabled
              @click="open(scope.row)"
            >加载中</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>

    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        :current-page="page.current"
        :page-sizes="[10, 40, 50, 80]"
        :page-size="page.size"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </basic-container>
</template>

<script>
import { getList, upload } from '@/api/trace/exportQueue'
import { getMaxTableHei } from '@/util/util'
export default {
  name: 'TraceExportQueue',
  data() {
    return {
      submit: {
        dateTimeList: ['', ''], // 时间范围集合, // 时间范围集合
        startDate: '', // 开始时间
        endDate: '' // 结束时间
      },
      submitData: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableData: [],
      tableMaxHeight: 'auto',
      page: {
        current: 1,
        total: 1,
        size: 10
      },
      loading: false

    }
  },
  created() {
    const dataJson = { start: null, end: null, query: { size: this.page.size, current: this.page.current } }
    this.initialization(dataJson)
  },
  mounted() {
    this.$nextTick(() => {
      this.tableMaxHeight = getMaxTableHei(this, [], 320)
    })
  },
  methods: {
    initialization(val) {
      getList(val).then(res => {
        const data = res.data
        this.tableData = data.list
        this.tableData.forEach(item => {
          item.url = `https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/${item.fileAddress}${item.fileName}.xlsx`
        })
        this.page.total = data.pageVO.totalPages
      })
    },
    //   搜索
    search() {
      this.submit.startDate = this.submit.dateTimeList[0]
      this.submit.endDate = this.submit.dateTimeList[1]
      this.submitData = JSON.parse(JSON.stringify(this.submit))
      const dataJson = { start: this.submitData.startDate, end: this.submitData.endDate, query: { size: this.page.size, current: this.page.current } }
      this.initialization(dataJson)
    },
    // 重置
    reset() {
      this.submit = {
        dateTimeList: ['', ''], // 时间范围集合, // 时间范围集合
        startDate: '', // 开始时间
        endDate: '' // 结束时间
      }
      this.submitData = JSON.parse(JSON.stringify(this.submit))
      const dataJson = { start: null, end: null, query: { size: this.page.size, current: this.page.current } }
      this.initialization(dataJson)
    },
    // 点击分页
    handleSizeChange(val) {
      this.page.size = val
      this.page.current = 1
      const dataJson = { start: this.submitData.startDate, end: this.submitData.endDate, query: { size: this.page.size, current: this.page.current } }
      this.initialization(dataJson)
    },
    // 点击页码跳转
    handleCurrentChange(val) {
      this.page.current = val
      const dataJson = { start: this.submitData.startDate, end: this.submitData.endDate, query: { size: this.page.size, current: this.page.current } }
      this.initialization(dataJson)
    },
    // 加载
    toupload(val) {
      upload(val.createTime).then(() => {
        const dataJson = { start: this.submitData.startDate, end: this.submitData.endDate, query: { size: this.page.size, current: this.page.current } }
        this.initialization(dataJson)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }, error => {
        window.console.log(error)
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
</style>
