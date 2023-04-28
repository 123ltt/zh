<template>
  <div class="log-box">
    <el-table
      v-loading="loading"
      :data="logList"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      border
      stripe
      size="small"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" />
      <el-table-column label="操作内容" prop="optContent" width="300" />
      <el-table-column label="操作人" prop="createUser" />
      <el-table-column label="操作时间" prop="createTime" />
    </el-table>
    <el-pagination
      :current-page="form.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="form.size"
      :total="total"
      style="text-align: right; padding-top: 18px"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLogPage } from '@/api/log.js'
export default {
  name: 'Log',
  props: {
    optBusId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form: {
        optBusId: this.optBusId || '',
        current: 1,
        size: 10
      },
      total: 0,
      logList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.onLoad()
  },
  methods: {
    // 获取日志列表
    onLoad() {
      this.loading = true
      getLogPage(this.form)
        .then(res => {
          this.logList = []
          if (res.success && res.data) {
            const { records, total } = res.data
            this.logList = records || []
            this.total = total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 分页相关
    handleSizeChange(val) {
      this.form.size = val
      this.onLoad()
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.onLoad()
    }
  }
}
</script>

<style lang="scss" scoped>
.log-box {
  margin: 10px;
}
</style>
