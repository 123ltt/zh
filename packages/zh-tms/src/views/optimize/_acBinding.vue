<!--线上服务配置 列表页-->
<template>
  <basic-container v-loading="loading">
    <!-- g-table 封装好的自带分页功能的表格(g开头的标签全部都是封装好的公共组件) :fetch="fetch"方法名    :headers="headers" 表格数据-->
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form
          ref="form"
          :model="searchData"
          label-width="100px"
          size="mini"
          class="form-col no-message"
        >
          <!-- 顶部待搜索按钮删除按钮的那一行 -->
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="平台：" prop="platformCode">
                <g-select
                  v-model="searchData.platformCode"
                  :items="platformList"
                  key-field="platformCode"
                  label-field="platformName"
                  value-field="platformCode"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="物流账号：" prop="name">
                <!-- 封装的下拉组件 -->
                <g-select
                  v-model="searchData.id"
                  :items="filterServiceList"
                  key-field="name"
                  label-field="name"
                  value-field="id"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <!-- 搜索，重置，新增按钮 -->
            <el-col :span="9" class="d-flex justify-content-start mb-2">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                class="me-1"
                @click="search"
              >搜索</el-button>
              <el-button
                icon="el-icon-delete"
                size="mini"
                class="me-1"
                @click="reset"
              >重置</el-button>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                class="me-1"
                @click="addEditBtn()"
              >新增</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column
        slot="handler"
        label="操作"
        fixed="right"
        align="center"
        min-width="150px"
      >
        <template v-slot="scope">
          <el-button v-if="scope.row.platformCode=='WH'" type="text" @click="codeUrl(scope.row.id)">code</el-button>
          <el-button type="text" @click="addEditBtn(scope.row)">编辑</el-button>
          <el-button type="text" @click="authorization_Btn(scope.row.id)">授权</el-button>
          <el-button type="text" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>

</template>
<script>
import { getplatformAllList } from '@/api/platformLimits' // 导入平台列表数据
import { getAccountList, platformAccountList, deleted, getCodeUrl } from '@/api/acBinding'// 物流账号下拉列表接口+物流账号分页列表接口+删除接口+code跳转接口
import addEdit from './acBindingModal/addEdit' // 导入新增页面组件
import authorization from './acBindingModal/authorization' // 导入授权页面组件
export default {
  name: 'TmsOptimizeOlConfig',
  data() {
    return {
      loading: false,
      filterServiceList: [], // 物流账号列表分页数据
      platformList: [], // 平台列表数据
      current: 1,
      // 后台参数定义的对象
      searchData: {
        platformCode: '', // 平台编码
        name: '' // 账号
      },
      // 表格头部数据
      headers: [
        {
          label: '平台名称',
          prop: 'platformName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '物流账号',
          prop: 'name',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: 'token',
          prop: 'token',
          minWidth: '180px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      del_id: '', // 删除按钮id
      id_val: '', // 授权按钮id
      code_id: ''// code按钮id
    }
  },

  // 页面一加载钩子
  created() {
    this.getData()
  },

  // 页面加载完成钩子
  mounted() {
    // 页面加载完成之后 调用搜索方法拿到表格数据
    this.initialization()
  },

  methods: {
    // 自定义封装表格绑定的方法 ，只获取表格数据
    fetch({ current, size }, params) {
      return platformAccountList(current, size, params).then((res) => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },

    // 获取其他数据
    getData() {
      Promise.all([
        // .all将异步代码已同步的方式呈现出来，等所有请求发送完毕再执行.then
        getplatformAllList(), // 调用平台列表数据
        getAccountList() // 调用物流账号列表数据
      ]).then(res => {
        this.platformList = res[0].data // 平台列表数据赋值
        this.filterServiceList = res[1].data // 表格列表数据赋值
      })
    },

    // 获取表格数据方法
    initialization() {
    //  传参数+拿到数据
      this.$refs.table.load(this.current, this.searchData)
    },

    // 搜索方法
    search() {
      // 让页面跳转到第一页
      this.current = 1
      this.initialization() // 获取表格数据
      console.log('测试')
    },
    // 重置
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
      // 让页面跳转到第一页
      this.current = 1
      this.initialization()// 获取表格数据
    },
    // 新增-编辑按钮
    addEditBtn(row) {
      const title = !row ? '新增物流账号' : '编辑物流账号'
      this.$modal({
        title,
        component: addEdit,
        width: '700px',
        data: {
          isAdd: !row,
          id: row?.id || '',
          platformList: this.platformList,
          row
        },
        callback: (bool) => {
          if (bool) {
            const isAdd = !row
            isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },

    // 授权按钮
    authorization_Btn(val) {
      this.id_val = val
      // 使用组件
      this.$modal({
        title: '授权', // 组件标题
        component: authorization, // 组件名字
        width: '500px', // 组件弹框的宽度
        // 组件传递的参数
        data: {
          id2: this.id_val
        },
        // 关闭组件弹框的回调
        callback: (bool) => {
          this.search()
        }
      })
    },

    // code 页面跳转拿到code值接口
    codeUrl(val) {
      this.code_id = val
      getCodeUrl(this.code_id).then(res => {
        // 拿到code地址，并且新开页面跳转
        window.open(res.data, '_blank')
      })
    },

    // 删除按钮
    deleteBtn(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleted(row.id).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initialization(false) // 再次调用表格数据刷新页面
          getAccountList().then(res => {
            this.filterServiceList = res.data
          })
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
