<template>
  <div class="log-box">
    <el-form
      ref="screenForm"
      v-model="form"
      :inline="true"
      size="small"
      label-width="80px"
    >
      <el-form-item
        label="资源名称"
        prop="createUser"
      >
        <el-input
          v-model="form.optBus"
          placeholder="资源名称"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="操作人"
        prop="createUser"
      >
        <el-input
          v-model="form.createUser"
          placeholder="操作人"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-loading="loading"
          type="primary"
          size="small"
          @click="form.current = 1; onLoad()"
        >搜 索</el-button>
        <el-button
          size="small"
          @click="
            $refs['screenForm'].resetFields();
            form.optBus='';
            form.createUser='';
            form.current = 1;
            onLoad()"
        >清 空</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="logList"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      border
      size="small"
      stripe
      class="g-table"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        type="index"
      />
      <el-table-column
        label="操作类型"
        prop="optType"
      />
      <el-table-column
        label="资源名称"
        prop="optBus"
      />
      <el-table-column
        label="内容"
        prop="optContent"
        height="40"
        width="300"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            v-if="row.optContent && row.optContent.length > 20"
            :content="row.optContent"
            popper-class="tool-tip"
            placement="top"
          >
            <div class="txt-over-ell-one">{{ row.optContent }}</div>
          </el-tooltip>
          <span v-else>{{ row.optContent }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人"
        prop="createUser"
      />
      <el-table-column
        label="操作时间"
        prop="createTime"
      />
    </el-table>
    <el-pagination
      :current-page="form.current"
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
// import { mapGetters } from 'vuex'
import { getLogList } from '@/api/log.js'
export default {
  name: 'Log',
  props: {
    optBus: String
  },
  data() {
    return {
      loading: false,
      form: {
        // 操作业务，例如:角色管理
        optBus: this.optBus || '',
        // 操作类型
        optType: '',
        // 操作人
        createUser: '',
        current: 1,
        size: 10
      },
      total: 0,
      logList: [],
      // 操作类型
      dicData: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '新增',
          value: '新增'
        },
        {
          label: '更新',
          value: '更新'
        }
      ]
    }
  },
  // computed: {
  //   ...mapGetters(['userInfo']),
  //   // 是否超级管理员
  //   isAdmin() {
  //     // console.log(this.userInfo)
  //     return this.userInfo.role_name.includes('administrator')
  //     // return false
  //   }
  // },
  created() {
    this.onLoad()
  },
  methods: {
    // 获取日志列表
    onLoad() {
      this.loading = true
      getLogList(this.form)
        .then((data) => {
          this.logList = []
          if (data.success && data.data) {
            const { records, total } = data.data
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

<style lang="scss">
.tool-tip {
  max-width: 300px;
  line-height: 20px;
}
</style>
