<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" show-order>
      <template slot="header">
        <el-form
          ref="formRef"
          :model="form"
          size="mini"
          label-width="100px"
          class="search-form no-message"
          @submit.native.prevent="search"
        >
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item
                label="问题创建时间"
                prop="problemCreateTimes"
              >
                <el-date-picker
                  v-model="form.problemCreateTimes"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="问题状态"
                prop="problemStatus"
                label-width="70px"
              >
                <el-select
                  v-model="form.problemStatus"
                  clearable
                  placeholder="请选择属性类型"
                  style="width:100%;"
                >
                  <el-option value="" label="全部" />
                  <el-option v-for="item in purchaseProblemStatusList"
                             :key="item.value"
                             :value="+item.value"
                             :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-button type="primary" native-type="submit">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="titleSlot" label="问题标题">
        <template #default="{row}">
          <g-link @click="replyOrViewBtn(row, 'view')">
            <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="100px">
        <template #default="{row}">
          <el-button type="text" @click="replyOrViewBtn(row, 'view')">详情</el-button>
          <el-button v-if="+row.problemStatus !== 1" type="text" @click="replyOrViewBtn(row, 'reply')">答复</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { queryData } from '@/api/purchasingIssues'
import PurchasingIssuesModal from './modal/purchasingIssuesModal.vue'
import { getDict } from '@/api/common/dict'

export default {
  name: 'PmsPurchasingIssues',
  components: {},
  props: {},
  data() {
    return {
      form: {
        problemCreateTimes: [],
        problemStatus: ''
      },
      purchaseProblemStatusList: [],
      loading: false,
      defaultColumnConfig: {
        align: 'center'
      },
      tableData: [],
      headers: [
        {
          label: '问题状态',
          prop: 'problemStatusName',
          width: 90
        },
        {
          slot: true,
          slotName: 'titleSlot'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 140
        },
        {
          label: '创建人',
          prop: 'createUserName',
          width: 150
        },
        {
          label: '开发处理人',
          prop: 'productDeveloperName',
          width: 150
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  created() {
    // 字典- 采购问题列表
    getDict('purchase_problem_status', 'pms').then(list => {
      this.purchaseProblemStatusList = list
    })
  },
  mounted() {
    this.$refs.table.load(1, {})
  },
  methods: {
    fetch({ current, size }, params) {
      return queryData({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    reset() {
      this.$refs.formRef.resetFields()
    },
    replyOrViewBtn(row, type) {
      const title = type === 'reply' ? '答复问题' : '查看问题'
      this.$modal({
        title,
        component: PurchasingIssuesModal,

        data: { id: row.id, replyOnly: type === 'reply', viewOnly: type === 'view' },
        callback: (bool) => {
          bool && this.search()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
