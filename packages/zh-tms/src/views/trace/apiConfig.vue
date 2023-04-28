<template>
  <basic-container>
    <!-- 搜索区 -->
    <section
      ref="search"
      class="search"
    >
      <selectBox
        :form="submit"
        :msg="[false,'80px']"
        :search="search"
        :reset="reset"
      />
    </section>

    <!-- 显示数据表 -->
    <section class="tableData">
      <!-- 新增按钮 -->
      <!--      v-if="permission.logistics_provider_api_add"-->
      <header class="addBox">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="open()"
        >新增</el-button>
      </header>
      <!-- 表格 -->
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
          prop="diShortname"
          label="物流商"
          align="center"
          width="150"
        />
        <el-table-column
          prop="dgName"
          label="发货方式"
          align="center"
          width="250"
        />
        <el-table-column
          prop="serviceAddress"
          label="服务地址"
          align="center"
          width="auto"
        />
        <el-table-column
          label="启用状态"
          align="center"
          fixed="right"
          width="120"
        >
          <!--              :disabled="!permission.logistics_provider_api_edit"-->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              active-text="开"
              inactive-text="关"
              @change="onChangeStaus(scope.row)"
            />
          </template>
        </el-table-column>
        <!--        v-if="permission.logistics_provider_api_edit"-->
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="open(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        :current-page="Page.current"
        :page-sizes="[10, 40, 50, 80]"
        :page-size="Page.size"
        :total="Page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹出框 -->
    <div
      v-if="isOpen"
      class="openBox"
    >
      <div class="addBox">
        <div class="header">
          <p class="title">{{ isAdd?'新增':'编辑' }}</p>
          <div
            class="closeBtn"
            @click="close()"
          >
            <i class="el-icon-close" />
          </div>
        </div>
        <div ref="main" class="main">
          <el-form ref="openData" :model="openData" label-width="140px" size="mini">
            <el-row>
              <el-col v-if="isAdd" :span="12">
                <el-form-item
                  :rules="[
                    { required: true, message: '请选择物流商', trigger: 'blur' }
                  ]"
                  label="物流商"
                  class="inputBox"
                  prop="diId"
                >
                  <el-select
                    ref="input"
                    v-model="openData.diId"
                    class="input"
                    clearable
                    placeholder="请选择物流商"
                    filterable
                    @change="changeId"
                  >
                    <el-option
                      v-for="item in logisticsList"
                      :key="item.id"
                      :label="item.lpAbbreviation"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="isAdd" :span="12">
                <el-form-item
                  :rules="[
                    { required: true, message: '请选择发货方式', trigger: 'blur' }
                  ]"
                  label="发货方式"
                  class="inputBox"
                  prop="dgId"
                >
                  <el-select
                    ref="input2"
                    v-model="openData.dgId"
                    placeholder="请选择"
                    clearable
                    class="input"
                    multiple
                    collapse-tags
                    filterable
                    @change="allChoose"
                  >
                    <el-option
                      v-for="item in deliveryList"
                      :key="item.id"
                      :label="item.deliveryGroupName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="!isAdd" :span="12">
                <el-form-item
                  label="物流商"
                  class="inputBox"
                  prop="diShortname"
                >
                  <el-input
                    v-model="openData.diShortname"
                    :disabled="true"
                    class="input"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="!isAdd" :span="12">
                <el-form-item
                  label="发货方式"
                  class="inputBox"
                  prop="dgName"
                >
                  <el-input
                    v-model="openData.dgName"
                    :disabled="true"
                    class="input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  :rules="[
                    { required: true, message: '请输入服务地址', trigger: 'blur' }
                  ]"
                  label="服务地址"
                  prop="serviceAddress"
                  class="inputBox"
                >
                  <el-input
                    v-model="openData.serviceAddress"
                    class="input"
                    placeholder="请输入服务地址"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="抓取周期" prop="timePeriod" class="inputBox">
                  <el-input
                    v-model="openData.timePeriod"
                    class="input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关键词匹配策略" prop="matchStrategy" class="inputBox">
                  <el-select v-model="openData.matchStrategy" class="input">
                    <el-option :key="0" :value="0" label="增量匹配" />
                    <el-option :key="1" :value="1" label="覆蓋匹配" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="抓取优先级" prop="priority" class="inputBox">
                  <el-input
                    v-model="openData.priority"
                    class="input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分页大小" prop="pageSize" class="inputBox">
                  <el-input
                    v-model="openData.pageSize"
                    class="input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最大失败次数" prop="maxNumber" class="inputBox">
                  <el-input
                    v-model="openData.maxNumber"
                    class="input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否切换公共平台" prop="isSwitch" class="inputBox">
                  <el-radio-group v-model="openData.isSwitch">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :rules="openData.isSwitch===1?[
                    { required: true, message: '请输入映射公共平台名称', trigger: 'blur' }
                  ]:[{ required: false}]"
                  label="映射公共平台名称"
                  prop="platFormName"
                  class="inputBox"
                >
                  <el-input
                    v-model="openData.platFormName"
                    class="input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="优先抓取时间段一" prop="firstTimeStart" class="inputBox">
                  <el-input
                    v-model="openData.firstTimeStart"
                    class="miniInput"
                  /><span>-</span>
                  <el-input
                    v-model="openData.firstTimeEnd"
                    class="miniInput"
                  /><span>天</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="优先抓取时间段二" prop="secondTimeStart" class="inputBox">
                  <el-input
                    v-model="openData.secondTimeStart"
                    class="miniInput"
                  /><span>-</span>
                  <el-input
                    v-model="openData.secondTimeEnd"
                    class="miniInput"
                  /><span>天</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="优先抓取时间段三" prop="threeTimeStart" class="inputBox">
                  <el-input
                    v-model="openData.threeTimeStart"
                    class="miniInput"
                  /><span>-</span>
                  <el-input
                    v-model="openData.threeTimeEnd"
                    class="miniInput"
                  /><span>天</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="footer">
          <el-button
            size="mini"
            icon="el-icon-circle-close"
            @click="close()"
          >取消</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="define()"
          >{{ isAdd?'保存':'修改' }}</el-button>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getList, add } from '@/api/trace/logisticsProviderApi'
import { getMaxTableHei, debounce } from '@/util/util'
import { mapState, mapGetters } from 'vuex'
import selectBox from '@/components/selectBox.vue'
export default {
  name: 'TraceLogisticsProviderApi',
  components: { selectBox },
  data() {
    return {
      deliveryList: [],
      // 新增或编辑
      isAdd: true,
      // 编辑数据
      openData: {},
      // 新增数据
      addBox: {
        serviceAddress: '',
        diId: '',
        dgId: [],
        dgName: '',
        diShortname: '',
        status: '',
        timePeriod: 1,
        matchStrategy: 0,
        priority: 0,
        pageSize: 300,
        maxNumber: 99,
        isSwitch: 0,
        platFormName: '',
        firstTimeStart: 1,
        firstTimeEnd: 30,
        secondTimeStart: 31,
        secondTimeEnd: 60,
        threeTimeStart: 61,
        threeTimeEnd: 90
      },
      oldSearchJobType: [], // 全选转接数组
      // 弹框状态
      isOpen: false,
      // 启用状态
      switchVal: true,
      // 表格max-height
      tableMaxHeight: 'auto',
      fixMaxHei: {
        max: 'auto',
        min: 'auto',
        fold: 'auto'
      },
      loading: true,
      submit: {
        diId: null, // 物流商id
        dgId: null // 发货方式id
      },
      submitData: {},
      findForm: {
        logisticsList: [], // 物流商下拉
        delivery: ['手动', '自动'] // 发货方式
      },
      //   表格数据
      tableData: [],
      //   分页参数
      Page: {
        current: 1,
        total: 1,
        size: 10
      },
      form: {
        deliveryBool: true
      },
      paramsVal: {}
    }
  },
  computed: {
    ...mapState({
      logisticsList: state => state.trace.logisticsList
    }),
    ...mapGetters(['permission'])
  },
  mounted() {
    this.$nextTick(() => {
      this.tableMaxHeight = getMaxTableHei(this, [], 284)
      this.findForm.logisticsList = this.logisticsList
    })
  },
  created() {
    this.initialization()
  },
  methods: {
    // 获取发货方式
    getListOrData(diId, flag = false) {
      const list = this.logisticsList
      if (list.length) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.id === diId) {
            if (flag) return item.lpAbbreviation
            return item.groups
          }
        }
      }
    },
    changeId(val) {
      this.openData.dgId = ''
      if (val === '') {
        this.deliveryList = []
        return
      }
      this.deliveryList = this.getListOrData(val)
      if (this.deliveryList.length !== 0) {
        // eslint-disable-next-line no-unused-vars
        let qued = true
        this.deliveryList.forEach(item => {
          if (item.id === 'all') {
            qued = false
          }
        })
        if (qued) {
          this.deliveryList.unshift({ id: 'all', deliveryGroupName: '全选' })
        }
      }
    },
    //   新增
    define() {
      let val = {}
      let panduan = true
      if (this.isAdd) {
        const RegUrl = new RegExp()
        RegUrl.compile('^((https|http|ftp|rtsp|mms){1}://)?[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&?/.=]+$') // 正则后期修改
        if (this.openData.serviceAddress === '' || this.openData.dgId === '' || this.openData.diId === '') {
          this.$message.error('操作错误！选项不能为空！')
          panduan = false
        } else if (!RegUrl.test(this.openData.serviceAddress)) {
          this.$message.error('服务地址格式不对！')
          panduan = false
        } else {
          // eslint-disable-next-line no-unused-vars
          const { dgId, ...obj } = this.openData
          val = JSON.parse(JSON.stringify(obj))
          for (let i = 0; i < this.openData.dgId.length; i++) {
            if (this.openData.dgId[i] === 'all') {
              this.openData.dgId.splice(i, 1)
            }
          }
          val.dgIds = this.openData.dgId.join(',')
        }
      } else {
        const RegUrl = new RegExp()
        RegUrl.compile('^((https|http|ftp|rtsp|mms){1}://)?[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&?/.=]+$') // 正则后期修改
        if (!RegUrl.test(this.openData.serviceAddress)) {
          this.$message({
            type: 'error',
            message: '服务地址格式不对！'
          })
          panduan = false
        } else {
          val = this.openData
        }
      }
      if (this.openData.isSwitch === 1 && this.openData.platFormName === '') {
        this.$message.error('映射公共平台名称为空')
        panduan = false
      }
      if (panduan) {
        add(val).then(() => {
          this.initialization(this.page)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.close()
        }, error => {
          window.console.log(error)
        })
      }
    },
    // 新增弹框
    open(value) {
      if (value !== undefined) {
        this.isAdd = false
        this.openData = JSON.parse(JSON.stringify(value))
      } else {
        this.isAdd = true
        this.openData = JSON.parse(JSON.stringify(this.addBox))
      }
      this.isOpen = true
    },
    // 关闭弹框
    close() {
      this.addBox.serviceAddress = ''
      this.addBox.diId = ''
      this.addBox.dgId = ''
      this.openData = {}
      this.isOpen = false
    },
    // 点击分页
    handleSizeChange(val) {
      this.Page.size = val
      this.Page.current = 1
      this.search(this.Page.current, val)
    },
    // 点击页码跳转
    handleCurrentChange(val) {
      this.Page.current = val
      this.search(val)
    },
    // 初始化
    initialization(val1, val2) {
      this.loading = true
      getList(val1, val2).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.tableData = data.records
          this.Page.total = data.total
          this.loading = false
        } else {
          this.$message.error('物流商加载失败!')
        }
      })
    },
    // 点击启用状态
    onChangeStaus: debounce(function(row) {
      add(row).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }, error => {
        window.console.log(error)
      })
    }, 500),
    // 封装判断函数
    bool(val) {
      if (val == null || val === '') {
        return true
      }
      return false
    },
    tosearch() {
      if (
        this.bool(this.submitData.diId) &&
        this.bool(this.submitData.dgId)
      ) {
        this.Page.current = 0
      }
      this.loading = true
      getList(this.Page.current, this.Page.size, this.submitData).then(res => {
        const data = res.data
        this.Page.total = data.total
        this.tableData = data.records
        this.loading = false
      })
    },
    // 清除事件
    markClear(val) {
      if (val === 'delivery') {
        this.submit.dgId = ''
      }
    },
    // 重置事件
    reset() {
      this.submit.diId = null
      this.submit.dgId = null
      this.submitData = {}
      this.Page.current = 1
      this.paramsVal = {}
    },
    // 搜索事件
    search(val1, val2) {
      // 为搜索框触发
      if (val1 === undefined) {
        this.Page.current = 1
        this.submitData = {
          diId: this.submit.diId,
          dgId: this.submit.dgId
        }
        this.tosearch()
      } else if (this.submitData.diId !== undefined) {
        // 为搜索后点击分页触发
        this.Page.current = val1
        this.tosearch()
      } else {
        // 为未搜索点击分页触发
        this.initialization(val1, val2)
      }
    },
    // 方式全选
    allChoose(val) {
      const allValues = []
      // 保留所有值
      for (const item of this.deliveryList) {
        allValues.push(item.id)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldSearchJobType.length === 1 ? this.oldSearchJobType[0] : []
      // 若是全部选择
      if (val.includes('all')) this.openData.dgId = allValues
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes('all') && !val.includes('all')) this.openData.dgId = []
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('all') && val.includes('all')) {
        const index = val.indexOf('all')
        val.splice(index, 1) // 排除全选选项
        this.openData.dgId = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('all') && !val.includes('all')) {
        if (val.length === allValues.length - 1) this.openData.dgId = ['all'].concat(val)
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldSearchJobType[0] = this.openData.dgId
    }
  }
}

</script>

<style lang="scss" scoped>
.search {
  margin-top: 5px;
}
.searchBtn {
  margin-left: 100px;

}
.resetBtn {
  margin-left: 30px;
}
.tableData {
    // margin-top: 10px;
  padding: 0 10px;
  .addBox {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
  }
}
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.openBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  translate: all 1s;
  background: rgba($color: #000000, $alpha: 0.5);
  .addBox {
    box-sizing: border-box;
    width: 700px;
    height: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 5px;
    .header {
      box-sizing: border-box;
      padding: 0 20px;
      margin-bottom: 20px;
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cccccc;
      .title {
        font-size: 18px;
      }
      .closeBtn {
        cursor: pointer;
        i {
          size: 16px;
        }
      }
    }
    .main {
      width: 100%;
      .inputBox {
        margin-top: 0px;
        .label {
          display: inline-block;
          width: 140px;
          font-size: 14px;
          text-align: right;
          .remind {
            color: red;
            font-size: 12px;
          }
        }
        .input {
          width: 80%;
        }
        .miniInput{
          width: 30%;
          /*text-align: left;*/
          margin: 0px 10px;
        }
      }
    }
    .footer {
      text-align: right;
    //   margin-top: 30px;
      padding-right: 20px;
    }
  }
}
</style>
