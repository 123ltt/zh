<template>
  <basic-container>
    <!-- 店铺api授权 -->
    <g-table ref="table" :headers="columns" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form
          ref="formObjRef"
          :inline="true"
          class="no-message form-col"
          :model="formObj"
          size="mini"
          label-width="60px"
          @submit.native.prevent="search"
        >
          <el-row>
            <el-col :span="5">
              <el-form-item label="平台" prop="platform">
                <el-select v-model="formObj.platform" clearable filterable class="w160" placeholder="请选择" @change="search">
                  <el-option
                    v-for="(item,index) in findForm.platformOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="店铺名称" prop="store">
                <el-input v-model.trim="formObj.storeName" placeholder="请输入" clearable class="w160" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="店铺编号" prop="storeCode">
                <el-input v-model.trim="formObj.storeCode" placeholder="请输入" clearable class="w160" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="状态"
                prop="status"
                label-width="40px"
              >
                <el-select
                  v-model="formObj.status"
                  clearable
                  placeholder="请选择"
                  @change="search"
                >
                  <el-option
                    v-for="(item,index) in findForm.stateOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                size="mini"
                native-type="submit"
              >搜 索</el-button>
              <el-button
                size="mini"
                @click="handlerReact('formObjRef')"
              >清 空</el-button>
              <g-auth code="shops_api_add">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handlerEdit(null)"
                >添加授权</el-button>
              </g-auth>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" label="操作" width="175">
        <template v-slot="{row}">
          <template v-if="$auth('shops_api_update')">
            <el-button type="text" @click="handlerEdit(row, 1)">编辑</el-button>
          </template>
          <template v-if="$auth('shops_api_record')">
            <el-button type="text" @click="handlerRecord(row)">日志</el-button>
          </template>
          <template v-if="$auth('shops_api_del')">
            <el-button type="text" @click="handlerDel(row)">删除</el-button><br>
          </template>
          <template v-if="$auth('shops_api_rempower')">
            <el-button type="text" @click="handleRempower(row, 1)">授权</el-button>
          </template>
          <template v-if="$auth('shops_api_refresh')">
            <el-button type="text" @click="handlerRefresh(row, 1)">刷新秘钥</el-button>
          </template>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { pageAuths, delRecord, refreshAuthorization, authorizationUrl } from '@/api/shopsApi.js'
import { platformOption } from '@/api/platform' // 平台
import RecordTable from './components/recordTable'
import EditShopsApi from './components/editShopsApi.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'SamsApiAuthorizeShopsApiShopsApi',
  data() {
    return {
      formObj: {
        platform: '',
        storeName: '',
        storeCode: '',
        status: ''
      },
      dialogType: null, // 0添加 1编辑

      columns: [{
        label: '序号',
        type: 'index'
      }, {
        label: '平台',
        prop: 'platformName',
        width: 70
      }, {
        label: '站点',
        prop: 'siteCode',
        width: 46
      }, {
        label: '店铺名称',
        prop: 'storeName',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '店铺编号',
        prop: 'storeCode',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '开发者账号',
        prop: 'developAccount',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '状态',
        prop: 'authStatus',
        width: 50
      }, {
        label: '创建人',
        prop: 'createUserName',
        width: 120,
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 135
      }, {
        label: '最后修改时间',
        prop: 'updateTime',
        width: 135
      }, {
        label: '有效截止时间',
        prop: 'deadline',
        width: 135,
        'show-overflow-tooltip': true // 溢出点点
      }, {
        slot: true,
        width: 180,
        slotName: 'handler'

      }],
      // 平台下来列表
      findForm: {
        platformOption: [],
        siteOption: [],
        stateOption: [{ label: '有效', value: '1' }, { label: '失效', value: '2' }],
        storeCodeOption: [], // 店铺编号
        developAccountOption: [] // 开发者账号
      }
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  mounted() {
    this.$refs.table.load(1, this.formObj)
    this.getPlatformOption()
  },
  methods: {
    // table list
    fetch({ current, size }, params) {
      return pageAuths({ ...params, current, size }).then(res => {
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
    // 平台下拉列表
    getPlatformOption() {
      platformOption().then(res => {
        this.findForm.platformOption = res.data
      })
    },
    handleRempower(row) {
      // if (['LZ', 'EB'].includes(row.platformCode)) {
      if (['LZ'].includes(row.platformCode)) {
        const prefix = { LZ: 'lazada', EB: 'ebay' }
        authorizationUrl({ storeCode: row.storeCode }, prefix[row.platformCode]).then(res => {
          const url = res.data
          window.location.replace(url)
        })
      } else {
        return this.$message.error(`${row.platformName}平台暂未开放！`)
      }
    },
    handlerRefresh(row) {
      //  if (['LZ', 'EB'].includes(row.platformCode)) {
      if (['LZ'].includes(row.platformCode)) {
        const prefix = { LZ: '', EB: 'ebay/' }
        refreshAuthorization({ platformCode: row.platformCode, name: row.storeName }, prefix[row.platformCode]).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      } else {
        return this.$message.error(`${row.platformName}平台暂未开放！`)
      }
    },
    // 编辑
    handlerEdit(row, type) {
      this.$modal({
        title: row ? '更新授权' : '添加授权',
        component: EditShopsApi,
        width: '580px',
        data: {
          row: row,
          findForm: this.findForm
        },
        callback: require => {
          require && this.search()
        }
      })
    },
    // 删除
    handlerDel(row) {
      this.$confirm('确认删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.loading = true
        delRecord({ id: row.id }).then((res) => {
          this.$message.success('删除成功')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {

      })
    },
    // 查看日志
    handlerRecord(row) {
      this.$modal({
        title: '日志',
        component: RecordTable,
        data: {
          authorizeId: row.id
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
