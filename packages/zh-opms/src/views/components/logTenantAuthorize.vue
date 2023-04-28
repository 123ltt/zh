<template>
  <div class="log-box">
    <el-form
      ref="screenForm"
      :inline="true"
      :model="form"
      size="small"
      label-width="80px"
      @submit.native.prevent
    >
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
      <!-- <el-form-item label="所属租户" prop="tenantId" size="small">
        <el-select v-model="form.tenantId" filterable placeholder="请选择所属租户">
          <el-option
            v-for="item in tenantList"
            :key="item.tenantId"
            :label="item.tenantName"
            :value="item.tenantId"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="form.current = 1; onLoad()"
        >搜 索</el-button>
        <el-button
          size="small"
          @click="
            $refs['screenForm'].resetFields();
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
      stripe
      size="small"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        type="index"
      />
      <!-- <el-table-column label="所属租户" prop="tenantName" /> -->
      <el-table-column
        label="操作类型"
        prop="optType"
      />
      <el-table-column
        label="操作内容"
        prop="optContent"
        width="300"
      />
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
import { getLogList } from '@/api/log.js'
export default {
  name: 'LogTenantAuthorize',
  // props: ['tenantList'],
  data() {
    return {
      loading: false,
      form: {
        tenantId: '',
        // 操作业务，例如:角色管理
        optBus: '',
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
