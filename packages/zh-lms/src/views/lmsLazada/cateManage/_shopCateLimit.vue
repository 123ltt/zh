<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form label-width="100px" size="mini" class="no-message form-col">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="店铺" prop="storeNames">
                <el-select v-model="form.storeNames" clearable filterable multiple style="width:100%">
                  <el-option v-for="item in shopList" :key="item.candidateDisplayName" :value="item.displayName" :label="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="可上传类目" prop="limitCategory">
                <el-input v-model="form.limitCategory" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item>
                <el-button type="primary" size="mini" @click="onLoad">搜索</el-button>
                <el-button @click="reset">清空</el-button>
                <el-button v-if="permission.shopLimitAdd" type="primary" size="mini" @click="addEdit('add')">添加</el-button>
                <!-- <el-button size="mini" @click="reset">清空</el-button> -->
                <!-- <el-button type="primary" size="mini" @click="openLog(true)">日志(模拟)</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="index" label="序号" type="index" width="60px" />
      <el-table-column slot="limitCategory" label="可传类目(MY站点一级类目)">
        <template v-slot="{row}">
          <g-text-ellipsis :max-length="20">{{ row.limitCategory }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作">
        <template v-slot="{row}">
          <el-button v-if="permission.shopLimitEdit" type="text" @click="addEdit('edit',row)">编辑</el-button>
          <el-button v-if="permission.shopLimitLog" type="text" @click="openLog(true,row)">日志</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import shopModal from './components/shopModal'
import { lazadaCategoryLimit } from '@/api/lazada/cateComparison'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { mapGetters } from 'vuex'
export default {
  name: 'LmsLazadaCateManageShopCateLimit',
  data() {
    return {
      form: {},
      shopList: [
      ],
      headers: [
        { slot: true, slotName: 'index' },
        { label: '店铺', prop: 'storeName' },
        // { label: '可传类目(MY站点一级类目)', prop: 'limitCategory' },
        { slot: true, slotName: 'limitCategory' },
        { label: '操作人', prop: 'updateUserName' },
        { label: '最后操作时间', prop: 'updateTime' },
        { slot: true, slotName: 'handler' }
      ]

    }
  },
  computed: {
    ...mapGetters(['permission']),
    // 是否超级管理员
    isAdmin() {
      // console.log(this.userInfo)
      return this.userInfo.role_name.includes('administrator')
      // return false
    }
  },
  mounted() {
    this.onLoad()
    storeOptionsWithPlatformCode({ platformCode: 'LZ' }).then(res => {
      this.shopList = res.data
    })
  },
  methods: {
    onLoad() {
      this.$refs.table.load(1, this.form)
    },
    fetch({ current, size }, params) {
      return lazadaCategoryLimit({ current, size }, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    addEdit(type, rows) {
      this.$modal({
        title: type === 'add' ? '新增' : '编辑',
        component: shopModal,
        width: '600px',
        data: {
          type,
          rows
        },
        callback: (fresh) => {
          fresh && this.onLoad()
        }
      })
    },
    openLog(bool, rows) {
      this.$modal({
        title: '日志',
        component: shopModal,
        width: '600px',
        data: {
          bool,
          rows
        },
        callback: (fresh) => {
          fresh && this.onLoad()
        }
      })
    },
    reset() {
      this.form = {}
      this.onLoad()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-col {
  margin-bottom:-8px;
}
</style>
