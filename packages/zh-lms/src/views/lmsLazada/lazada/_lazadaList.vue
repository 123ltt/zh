<template>
  <basic-container>
    <div>
      <div :class="isToggle && 'toggle'" class="isToggle">
        <div class="mb-2">
          <el-button v-if="permission.lz_add" type="primary" size="mini" @click="createListing()">创建Listing</el-button>
          <el-button v-if="[6,7].includes(auditTabActiveNum)" type="primary" size="mini" :disabled="!checkIds.length" @click="batchUpdate()">批量更新价格/库存</el-button>
        </div>
        <el-form ref="searchDataRef" size="mini" :model="searchData" class="search-flex no-message form-col">
          <el-row :gutter="10">
            <el-col :span="[2,3].includes(searchData.searchType)?9:7">
              <el-form-item prop="searchType">
                <el-row>
                  <el-col :span="6" class="mb-0">
                    <el-select v-model="searchData.searchType" size="mini" placeholder="请选择" clearable>
                      <el-option v-for="(item,index) in findform.searchTypeOption" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-col>
                  <el-col :span="[2,3].includes(searchData.searchType)?11:17" class="mb-0">
                    <div style="margin-left:10px">
                      <template v-if="searchData.searchType ===1">
                        <el-input v-model="searchData.searchContent" size="mini" style="height:28px" placeholder="支持单个标题模糊搜索" clearable />
                      </template>
                      <template v-else>
                        <el-input v-model="searchData.searchContent" resize="none" style="height:28px" type="textarea" size="mini" placeholder="多个按逗号、空格或回车隔开" clearable />
                      </template>
                    </div>
                  </el-col>
                  <el-col v-if="[2,3].includes(searchData.searchType)" :span="7" class="mb-0">
                    <div style="margin-left:10px;">
                      <el-radio-group v-model="searchData.searchSort">
                        <el-radio :label="1">子</el-radio>
                        <el-radio :label="2">父</el-radio>
                      </el-radio-group>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="店铺" prop="storeCodes" label-width="40px">
                <SelectStore ref="selectStore" :search-data="searchData" :store-list="findform.accountOption" :prop="'storeCodes'" :platform-code="'LZ'" />
                <!-- <el-select v-model="searchData.storeCodes" filterable multiple collapse-tags placeholder="请选择" size="mini" style="width:100%;" clearable>
                  <el-option v-for="item in findform.accountOption" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="站点" prop="site" label-width="40px">
                <el-select v-model="searchData.site" filterable placeholder="请选择" size="mini" style="width:100%;" clearable>
                  <el-option v-for="item in findform.siteOption" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="创建人" prop="createUser" label-width="50px">
                <g-select v-model="searchData.createUser" :items="findform.createUserOption" key-field="id" label-field="nameJobNumber" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" prop="createTime" label-width="60px">
                <div class="d-flex">
                  <el-date-picker v-model="searchData.createTime"
                                  type="datetimerange"
                                  value-format="timestamp"
                                  :picker-options="pickerOptions"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  align="right"
                                  unlink-panels
                                  class="w-100"
                                  :default-time="['00:00:00', '23:59:59']"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col v-if="auditTabActiveNum>4" :span="6">
              <el-form-item label="上架时间" prop="upOnlineTime" label-width="60px">
                <div class="d-flex">
                  <el-date-picker v-model="searchData.upOnlineTime"
                                  type="datetimerange"
                                  value-format="timestamp"
                                  :picker-options="pickerOptions"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  align="right"
                                  unlink-panels
                                  class="w-100"
                                  :default-time="['00:00:00', '23:59:59']"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="Listing类型" prop="listingType" label-width="74px">
                <el-button-group v-model="searchData.listingType" style="display:flex">
                  <el-button v-for="(item,index) in findform.listingTypeOption" :key="index" :type="item.isActive?'primary':''" :value="item.value" @click="toggleListingType(item)">{{ item.label }}</el-button>
                </el-button-group>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否后台刊登" prop="isLazadaPublish" label-width="90px">
                <el-select v-model="searchData.isLazadaPublish" clearable @change="searchSmtListing(1)">
                  <el-option v-for="(item,index) in isAliexpressUploadOption" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否自动刊登" prop="isAutoPublish" label-width="90px">
                <el-select v-model="searchData.isAutoPublish" clearable @change="searchSmtListing(1)">
                  <el-option v-for="(item,index) in isAutoPublicationOption" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div style="display:flex">
                <el-button type="primary" size="mini" @click="searchSmtListing(1)">搜索</el-button>
                <el-button size="mini" @click="clearSearch">清空</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="justify-toggler">
      <el-button size="mini" type="text" @click="isToggle=!isToggle">{{ isToggle?'收起':'展开' }}<i class="el-icon--right " :class="isToggle?'el-icon-arrow-up':'el-icon-arrow-down' " /></el-button>
    </div>
    <el-tabs v-model="auditTabActiveName" type="border-card" class="tab-box" @tab-click="handleTabClick">
      <el-tab-pane v-for="(v, k, index) in tabActiveList"
                   :key="index"
                   :label="`${v.label}(${v.auditTabActiveTotal})`"
                   :name="v.label"
                   :stretch="true"
      />
      <lazadaTable ref="lazadaTable" :audit-tab-active-name="auditTabActiveName" :audit-tab-active-num="auditTabActiveNum" :search-data="searchData" @changeCheckIds="changeCheckIds" @changeStatus="getStatisticsStatus" />
    </el-tabs>
  </basic-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { optionsWithPlatformCode, getUserList, optionsSiteCode } from '@/api/amazon/amazon.js'
import { statisticsStatus } from '@/api/lazada/lazadaList'
import lazadaTable from './components/lazadaTable.vue'
import AddListing from './addListing.vue'
import batchUpdateModal from './components/batchUpdateModal.vue'
import { tabActiveList, generateRandomNum } from './components/addListing.handle.js'
import { pickerOptions } from '@/views/components/utils.js'
import SelectStore from '@/views/components/searchHead/selectStore.vue'
export default {
  name: 'LmsLmsLazadaLazadaLazadaList',
  components: {
    lazadaTable,
    SelectStore
  },
  data() {
    return {
      textarea: '',
      isToggle: true,
      checkIds: [],
      searchData: {
        upOnlineStartTime: '',
        listingType: '',
        createUser: null,
        storeCodes: [],
        site: '',
        searchType: '',
        searchContent: '',
        upOnlineEndTime: '',
        createStartTime: '',
        createEndTime: '',
        isLazadaPublish: null,
        isAutoPublish: null,
        searchSort: 1 // 搜索类别 1-子sku 2-父sku 默认为:1
      },
      findform: {
        createUserOption: [],
        searchTypeOption: [
          { label: '标题', value: 1 },
          { label: 'SKU', value: 2 },
          { label: '平台SKU', value: 3 },
          { label: 'ItemID', value: 4 },
          { label: 'ListingID', value: 5 }
        ],
        accountOption: [],
        siteOption: [],
        listingTypeOption: [
          { label: 'Normal', value: 'Normal', isActive: false },
          { label: 'Variation', value: 'Variation', isActive: false },
          { label: 'Combo', value: 'Combo', isActive: false }
        ]
      },
      loadingUser: false,
      auditTabActiveName: 'Draft',
      auditTabActiveNum: 1,
      tabActiveList: tabActiveList(),
      isAliexpressUploadOption: [{ label: '是', value: true }, { label: '否', value: false }],
      isAutoPublicationOption: [{ label: '是', value: true }, { label: '否', value: false }],
      pickerOptions
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
    this.getSiteList()
    this.getOptionsWithPlatformCode()
    this.getUserList()
  },
  methods: {
    getStatisticsStatus() {
      const params = {
        ...this.searchData,
        listingStatus: Number(this.auditTabActiveNum),
        pageNumber: 1,
        pageSize: 10
      }
      let searchContent = []
      if (params.searchContent) {
        if (params.searchType === '1') {
          searchContent = [params.searchContent]
        } else {
          searchContent = params.searchContent.split(/,|，|\r|\n|\r\n|\s+/)
        }
      }
      // 处理创建时间和上架时间
      if (params.createTime && params.createTime.length) {
        params.createStartTime = params.createTime[0]
        params.createEndTime = params.createTime[1]
        delete params.createTime
      }
      if (params.upOnlineTime && params.upOnlineTime.length) {
        params.upOnlineStartTime = params.upOnlineTime[0]
        params.upOnlineEndTime = params.upOnlineTime[1]
        delete params.upOnlineTime
      }
      statisticsStatus({ ...params, searchContent }).then(res => {
        const data = res.data
        this.tabActiveList = tabActiveList()
        Object.keys(data).forEach(list => {
          if (list > 0 && this.tabActiveList[Number(list)]) {
            this.tabActiveList[Number(list)].auditTabActiveTotal = data[list]
          }
        })
      })
    },
    createListing() {
      this.$newTab({
        path: '/lms/lazada/add/listing' + generateRandomNum(),
        title: '创建Listing',
        component: AddListing,
        clearCache: true,
        callback: refresh => {
          refresh && this.searchSmtListing()
        }
      })
    },
    // 接收子组件勾选的ids
    changeCheckIds(ids) {
      this.checkIds = ids
    },
    // 批量更新价格/库存弹窗
    batchUpdate() {
      this.$modal({
        title: '批量更新价格/库存',
        component: batchUpdateModal,
        width: '600px',
        minHeight: '300px',
        padding: '20px',
        data: {
          selectedIds: this.checkIds,
          productStatus: this.auditTabActiveNum
        },
        callback: refresh => {
          refresh && this.searchSmtListing()
        }
      })
    },
    getOptionsWithPlatformCode() { // 获取店铺列表
      optionsWithPlatformCode({ platformCode: 'LZ' }).then(res => {
        this.findform.accountOption = res.data
      })
    },
    getSiteList() { // 获取站点列表
      optionsSiteCode({ platformCode: 'LZ' }).then(res => {
        this.findform.siteOption = res.data
      })
    },
    // 创建人列表
    getUserList(query) {
      this.loadingUser = true
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        this.loadingUser = false
        const records = res.data.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}${item.jobNumber}`
        })
        this.findform.createUserOption = records
      }).finally(() => {
        this.loadingUser = false
      })
    },
    toggleListingType(list) {
      this.findform.listingTypeOption.filter(item => {
        if (item.value === list.value && !list.isActive) {
          item.isActive = true
        } else {
          item.isActive = false
        }
        this.searchData.listingType = this.findform.listingTypeOption.filter(item => item.isActive).map(acc => acc.value)[0]
      })
      this.searchSmtListing(1)
    },
    // 查询速卖通的listing
    searchSmtListing(current = 1) {
      this.$refs.lazadaTable && this.$refs.lazadaTable.listLazadaListing(current)
      this.getStatisticsStatus()
    },
    // 清空
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.searchData.searchContentNum = ''
      this.searchData.upOnlineEndTime = ''
      this.searchData.createEndTime = ''
      this.searchData.storeCodes = []
      this.findform.createUserOption = []
      this.getUserList()
      this.$nextTick(() => {
        this.searchSmtListing(1)
      })
    },
    // 切换状态
    handleTabClick(item) {
      this.checkIds = []
      this.auditTabActiveNum = Number(item.index) + 1
      this.$nextTick(() => {
        this.searchSmtListing(1)
      })
    },
    clearSearch() {
      this.resetForm('searchDataRef')
      this.searchData.searchContent = ''
      this.searchData.listingType = ''
      this.findform.listingTypeOption.forEach(item => {
        item.isActive = false
      })
    }
  }
}
</script>
<style >
  .expand .el-table__expand-column .cell {
    display: none;
  }
</style>
<style lang="scss" scoped>
// 设置tab按钮样式
.tab-box{
  ::v-deep {
    .el-tabs__item.is-active {
      border-bottom: 1px solid #dcdfe6;
      border-top: 1px solid #dcdfe6;
    }
    .el-tabs__nav{
      white-space: initial
    }
  }
}
.el-button-group ::v-deep.el-button--mini{
  // padding:7px 5px;
  padding: 7px 4%;
}
  ::v-deep .el-table__expanded-cell[class*=cell]{
    padding:0 0!important;
  }
  .search-flex{
    display: flex;
    flex-wrap:wrap;
    flex-direction:row;
    // margin-bottom: 14px;
  }
  ::v-deep .el-textarea__inner{
    height: 30px;
  }
  ::v-deep .el-radio{
    margin-right: 6px;
  }
  .isToggle{
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: all 0.25s ease;
    &.toggle{
      opacity: 1;
      height: auto;
    }
  }
  .justify-toggler{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
