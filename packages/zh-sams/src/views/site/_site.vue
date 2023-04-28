<template>
  <basic-container>
    <!-- 站点管理 -->
    <g-table ref="table" :headers="columns" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form
          ref="formObjRef"
          :inline="true"
          :model="formObj"
          size="mini"
          class="no-message"
          @submit.native.prevent="search"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="平台"
                prop="platform"
              >
                <el-select
                  v-model="formObj.platform"
                  clearable
                  filterable
                  class="w160"
                  placeholder="请选择"
                  @change="search"
                >
                  <el-option
                    v-for="(item,index) in findForm.platformOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="站点"
                prop="site"
              >
                <el-select
                  v-model="formObj.site"
                  clearable
                  filterable
                  class="w160"
                  placeholder="请选择"
                  @change="search"
                >
                  <el-option
                    v-for="(item,index) in findForm.siteOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.displayName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-button
              type="primary"
              size="mini"
              native-type="submit"
            >搜 索</el-button>
            <el-button
              size="mini"
              @click="handlerReact('formObjRef')"
            >清 空</el-button>
            <g-auth code="site_add">
              <el-button
                size="mini"
                type="primary"
                @click="handlerEdit(null)"
              >添加站点</el-button>
            </g-auth>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" label="操作">
        <template v-slot="{row}">
          <g-auth code="site_edit">
            <el-button size="mini" type="text" @click="handlerEdit(row,1)">编辑</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>

</template>

<script>
import { pageList, listAllSite } from '@/api/site'
import { platformOption } from '@/api/platform'
import editSite from './components/editSite'
import { mapGetters } from 'vuex'
export default {
  name: 'SamsSiteSite',
  data() {
    return {
      formObj: {
        platform: '',
        site: ''
      },
      columns: [{
        label: '序号',
        type: 'index',
        width: '60px'
      }, {
        label: '平台',
        prop: 'platformName',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '站点',
        prop: 'siteCode'
      }, {
        label: '站点网址',
        prop: 'siteUrl',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '站点描述',
        prop: 'siteDescription',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        slot: true,
        width: 200,
        slotName: 'handler'
      }],
      // 平台下来列表
      findForm: {
        platformOption: [],
        siteOption: []
      }
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  mounted() {
    this.$refs.table.load(1, this.formObj)
    this.getPlatformOption()
    this.listAllSite()
  },
  methods: {
    // table list
    fetch({ current, size }, params) {
      return pageList({ ...params, current, size }).then(res => {
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      this.$refs.table.load(1, this.formObj)
    },
    // 查询所有的站点code
    listAllSite() {
      listAllSite().then(res => {
        this.findForm.siteOption = res.data
      })
    },
    // 平台下拉列表
    getPlatformOption() {
      platformOption().then(res => {
        this.findForm.platformOption = res.data
      })
    },
    // 编辑
    handlerEdit(row, type) {
      this.$modal({
        title: row ? '编辑站点' : '添加站点',
        component: editSite,
        width: '500px',
        data: {
          item: row,
          platformOption: this.findForm.platformOption,
          dialogType: type
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    // 重置
    handlerReact(formName) {
      this.$refs[formName].resetFields()
      this.search()
    }
  }

}
</script>

<style>
.w160 {
  width: 160px;
}
</style>
