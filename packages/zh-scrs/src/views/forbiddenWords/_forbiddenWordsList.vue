<template>
  <basic-container>
    <g-table
      ref="table"
      row-key="id"
      :headers="columns"
      :fetch="fetch"
      size="mini"
      @selection-change="selectionChange"
    >
      <el-form
        slot="header"
        ref="screenForm"
        :model="form"
        :inline="true"
        size="small"
        label-width="50px"
        class="no-message mb-3"
        @submit.native.prevent="search"
      >
        <el-row :gutter="10">
          <el-form-item label="违禁词" prop="word">
            <el-input v-model="form.word" placeholder="请输入违禁词" clearable />
          </el-form-item>
          <el-form-item prop="platform" label="平台" size="small">
            <el-select
              v-model="form.platform"
              clearable
              filterable
              placeholder="请选择平台"
            >
              <el-option
                v-for="(item, index) in platformList"
                :key="index"
                :label="item.platformName"
                :value="item.platformCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="站点" prop="site">
            <el-select
              v-model="form.site"
              clearable
              filterable
              placeholder="请选择站点"
            >
              <el-option
                v-for="(item,index) in siteList"
                :key="index"
                :label="item.siteCode"
                :value="item.siteCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建人" prop="createUser">
            <el-select
              v-model="form.createUser"
              :remote-method="getUserList"
              :loading="loadingUser"
              placeholder="请选择创建人"
              clearable
              filterable
              remote
              size="small"
              style="width:100%;"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" size="small" class="m-l-80" native-type="submit">查询</el-button>
          <el-button size="small" @click="$refs['screenForm'].resetFields(); form.current = 1; search()">重置</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="showEdit(null)">新增违禁词</el-button>
          <el-button type="danger" size="small" plain @click="removeHandle_">批量删除</el-button>
        </el-row>
      </el-form>
      <el-table-column v-if="levelShow" slot="level" label="类型" width="120">
        <template v-slot="{ row }">
          <span :class="'point point'+row.level" />{{ levelList[row.level] }}
        </template>
      </el-table-column>
      <el-table-column slot="word" label="违禁词">
        <template #default="{row}">
          <g-text-ellipsis>{{ row.word }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="wordsRemark" label="备注">
        <template #default="{row}">
          <g-text-ellipsis>{{ row.wordsRemark }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handle" label="操作" width="120">
        <template v-slot="{ row }">
          <el-button type="text" size="small" @click="editHandle(row)">编辑</el-button>
          <el-button type="text" size="small" @click="removeHandle([row.id])">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getUserList } from 'zh-cams/src/api/userManange.js'
import {
  getFbwordsList,
  removeFbwords,
  // getDictionary,
  getFbwordsDetail
} from '@/api/fbwords.js'
import { getDict } from '@/api/common/dict.js'
// import { listAllWithSites } from '@/api/sams/platform.js'
// import { listAllSite } from '@/api/sams/site.js'
import { getChildren } from 'zh-pms/src/api/categoryManagement'
import editWords from './components/editWords.vue'
export default {
  name: 'ScrsForbiddenWordsForbiddenWordsList',
  data() {
    return {
      // 列表加载状态
      total: 0,
      form: {
        // 违禁词
        word: '',
        // 平台
        platform: '',
        // 站点
        site: '',
        // 创建人UserId
        createUser: ''
      },
      levelShow: false,
      levelList: { 0: '仅提示', 1: '严禁禁止' },
      // 平台列表
      platformList: [],
      // 站点列表
      siteList: [],
      // 创建人列表
      userList: [],
      // 类目列表
      categoryList: [],
      ids: [],
      loadingUser: false,
      columns: [
        { type: 'selection', width: '55' },
        { slot: true, slotName: 'word' },
        { label: '平台', prop: 'platform', width: '100' },
        { label: '站点', prop: 'site', width: '100' },
        { slot: true, slotName: 'level' },
        { slot: true, slotName: 'wordsRemark' },
        { label: '创建人', prop: 'createUserName' },
        { label: '创建时间', prop: 'createTime' },
        { slot: true, slotName: 'handle' }
      ]
    }
  },
  created() {
    this.getPlatformList()
    this.getSiteList()
    this.getCategoryLeve1()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    fetch({ current, size }, params) {
      return getFbwordsList({ current, size, ...params }).then(res => {
        const data = res.data.records
        this.levelShow = data.findIndex(item => item.level !== undefined) > -1
        return {
          records: data, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    search() {
      this.$refs.table.load({}, this.form)
    },
    // 多选操作
    selectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    // 获取平台下拉列表
    getPlatformList() {
      // listAllWithSites().then(res => {
      //   res.data.filter(item => {
      //     if (item.checkInfringement) {
      //       this.platformList.push(item)
      //     }
      //   })
      // })
      // Promise.all([getDictionary('platform', 'all'), getDictionary('platform_site', 'all')]).then(res => {
      //   const platformAllList = res[0].data.map(({ dictValue: platformCode, dictKey: platformName }) => ({ platformCode, platformName }))
      //   const siteAllList = res[1].data.map(({ dictKey: platformCode, dictValue: siteCode }) => ({ platformCode, siteCode }))
      //   this.shortByabc(platformAllList, 'platformCode')
      //   this.shortByabc(siteAllList, 'siteCode')
      //   platformAllList.forEach(item => {
      //     item.sites = siteAllList.filter(s => s.platformCode === item.platformCode)
      //   })
      //   this.platformList = platformAllList
      //   this.siteList = []
      //   // 列表筛选站点列表去重
      //   siteAllList.forEach(item => {
      //     const i = this.siteList.findIndex(s => s.siteCode === item.siteCode)
      //     i === -1 && this.siteList.push(item)
      //   })
      // })

      this.getDict()
    },
    getDict() {
      getDict('platform', 'sams').then(list => {
        this.platformList = list.map(({ label: platformCode, value: platformName }) => ({ platformCode, platformName, sites: [] }))
      })
    },
    // 按字母排序
    shortByabc(arr, key) {
      for (var i = 0; i < arr.length - 1; i++) { // 确定轮数
        for (var j = 0; j < arr.length - i - 1; j++) { // 确定每次比较的次数
          if (arr[j][key] > arr[j + 1][key]) {
            const tem = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = tem
          }
        }
      }
    },
    // 获取站点下拉列表
    async getSiteList() {
      // this.siteList = await listAllSite().then(res => res.data)
      getDict('platform_all_site', 'sams').then(list => {
        this.siteList = list.map(({ value: siteCode }) => ({ siteCode }))
      })
    },
    // 获取一级类目列表
    async getCategoryLeve1() {
      this.categoryList = await getChildren().then(res => res.data)
    },
    // 获取用户列表
    getUserList(query) {
      if (query !== '') {
        this.loadingUser = true
        getUserList({ fuzzyName: query, current: 1, size: 9999 }).then(res => {
          this.userList = res.data.records
        }).finally(() => {
          this.loadingUser = false
        })
      }
    },
    // 新增编辑事件
    editHandle(row) {
      const loading = this.$loading({
        lock: true,
        text: '正在加载违禁词详情......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getFbwordsDetail({ id: row.id }).then(res => {
        this.showEdit(res.data)
      }).finally(() => {
        loading.close()
      })
    },
    showEdit(data) {
      this.$modal({
        title: data ? '编辑违禁词' : '新增违禁词',
        component: editWords,
        width: '550px',
        data: {
          current: data,
          platformList: this.platformList,
          categoryList: this.categoryList
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    // 删除事件
    removeHandle_() {
      if (this.ids.length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      this.removeHandle(this.ids)
    },
    removeHandle(ids) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeFbwords({
          ids: ids.join(',')
        }).then((res) => {
          this.$message.success('删除成功')
          this.search()
        }).finally(() => {
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container{
  padding: 17px 17px 0 !important;
}
.point{
  width: 5px;
  height: 5px;
  display: inline-block;
  border-radius: 100%;
  margin-right: 4px;
  vertical-align: 7%;
}
.point0{
  background: $--color-success;
}
.point1{
  background: $--color-danger;
}
</style>
