<template>
  <basic-container>
    <!-- 平台管理 -->
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="formObjRef" :model="formObj" size="mini" class="no-message" @submit.native.prevent="search">
          <el-row>
            <el-col :span="5">
              <el-form-item label="平台" prop="platform">
                <el-select v-model="formObj.platform" clearable filterable class="w160" placeholder="请选择" @change="search">
                  <el-option v-for="(item,index) in platformOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-button type="primary" size="mini" native-type="submit">搜 索</el-button>
            <el-button size="mini" @click="handlerReact('formObjRef')">清 空</el-button>
            <g-auth code="platform_add">
              <el-button size="mini" type="primary" @click="handlerEdit(null,0)">添加平台</el-button>
            </g-auth>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" label="操作">
        <template v-slot="{row}">
          <g-auth code="platform_details">
            <el-button size="mini" type="text" @click="showConfiguredSites(row)">查看配置站点</el-button>
          </g-auth>
          <g-auth code="platform_edit">
            <el-button size="mini" type="text" @click="handlerEdit(row,1)">编辑</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>

</template>

<script>
import { platformOption, platformList } from '@/api/platform'
import editPlatform from './components/editPlatform'
export default {
  name: 'Platform',
  data() {
    return {
      formObj: { platform: '' },
      headers: [{
        label: '序号',
        type: 'index',
        width: 60
      }, {
        label: '平台',
        prop: 'platformName',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '平台英文名称',
        prop: 'platformEnName',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '平台网址',
        prop: 'url',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '平台二字简称',
        prop: 'platformCode',
        'show-overflow-tooltip': true // 溢出点点
      },
      {
        slot: true,
        width: 140,
        slotName: 'handler'
      }],
      // 平台下来列表
      platformOption: []
    }
  },
  mounted() {
    this.$refs.table.load(1, this.formObj)
    this.getPlatformOption()
  },
  methods: {
    fetch({ current, size }, params) {
      return platformList({ current, size, platform: params.platform }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      this.$refs.table.load(1, this.formObj)
    },
    // 平台下拉列表
    getPlatformOption() {
      platformOption().then(res => {
        this.platformOption = res.data
      })
    },
    // 编辑
    handlerEdit(row, type) {
      this.$modal({
        title: row ? '编辑平台' : '添加平台',
        component: editPlatform,
        width: '500px',
        data: {
          item: row,
          platformOption: this.platformOption,
          dialogType: type,
          isShowSites: false // true 查看配置站点
        },
        callback: (refresh) => {
          if (refresh) {
            this.search()
            this.getPlatformOption()
          }
        }
      })
    },
    // 查看配置站点
    showConfiguredSites(row) {
      this.$modal({
        title: '查看配置站点',
        component: editPlatform,
        width: '500px',
        data: {
          item: row,
          isShowSites: true // true 查看配置站点
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
