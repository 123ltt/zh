// SPU/SKU 信息维护
<template>
  <div v-loading="loading" class="info h-100">
    <template v-if="!loading">
      <el-tabs v-model="currentTab" type="border-card" class="shadow-none">
        <el-tab-pane v-for="(item,index) in tabs" :key="index" class="h-100 tab-over" :name="String(index)" :label="item.title" lazy>
          <template v-if="item.component">
            <component :is="item.component"
                       :is-edit="isEdit"
                       :form-data="childrenData[item.key]"
                       v-bind="item.props"
                       :readonly="readonly"
                       @close="closeTab"
                       @update="updateTab"
            />
          </template>
          <span v-else>{{ item.title }} 开发中...</span>
        </el-tab-pane>
      </el-tabs>
      <flow-audit v-if="isAudit" :flow-id="flowId" @close="closeTab" @update="updateTab" @loaded="auditLoaded" />
    </template>
  </div>
</template>

<script>
import { queryAuditById, saveSafeInfo } from '@/api/myAudit'

import { getDetailByIdOrCode } from '@/api/sku'
import Logistics from './logistics.vue'
import Warehouse from './warehouse.vue'
import SalesInfo from './salesInfo.vue'
import SupplierInfo from './supplierInfo.vue'
import MultiLangInfo from './multiLangInfo.vue'
import Log from './log.vue'
import FlowAudit from './flowAudit.vue'
import PropsInfo from './propsInfo.vue'

export default {
  name: 'AddInfo',
  components: { FlowAudit },
  provide() {
    return {
      addInfo: this
    }
  },
  props: {
    // 类型， 0 SPU，1 SKU，2 组合SKU，3 产品开发，4 美工任务
    type: [Number, String], // 使用$newPage，接受的参数是字符串（0,1,2 类型的type可以不用传，会从接口中读取）
    // 审核类型，1 SPU/SKU审核， 2 产品开发审核
    auditType: {
      type: Number,
      default: 1
    },
    id: [String, Number],
    // 是否是审核
    isAudit: {
      type: Boolean,
      default: false
    },
    // 流程id
    flowId: String,
    // 是否是只读
    readonly: {
      type: Boolean,
      default: false
    },
    // getDetail 使用 code (productCode) 优先级 高于 id
    code: String,
    /** 页面显示模式：tab | page. */
    mode: {
      type: String,
      default: 'tab'
    },
    // 只在 mode为`page`时生效
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iid: this.id, // 用于存id，不管是传id还是code，都会在getDetail里面重新赋值
      itype: this.type,
      loading: false,
      loadingAudit: true, // 是否正在获取审核的数据
      currentTab: 0,
      childrenData: {
        baseInfo: {}, // 基础信息、产品信息
        specificationsInfo: {}, // 规格和类目属性信息
        logisticsInfo: {}, // 物流信息
        safetyAuditInfo: {}, // 安全审核信息
        // 图片、视频、附件信息
        imageInfo: {
          mode: 0 // 显示模式。assets组件中会用到（由于assets保存后会重新渲染组件导致mode值会被重置，只能放这里存储）
        },
        supplierInfo: {}, // 供应商信息
        warehouseInfo: {}, // 仓储信息
        saleInfo: {}, // 销售信息
        flowInfo: {}, // 流程信息
        multiLangInfo: {}, // 多语言信息
        artInfo: {}, // 美工任务
        handlerInfo: {}, // 日志信息产品处理人

        imageList: {}, // 产品开发 图片信息。数组格式
        infringementInfo: {}, // 安全审核信息
        logInfo: {} // 安全审核信息
      }
    }
  },
  computed: {
    isEdit() {
      // 只有 SPU/SKU审核 支持 code
      return Boolean(this.id || (this.auditType === 1 && this.code))
    },
    tabs() {
      const { iid: id, itype: type, isAudit, childrenData: { baseInfo } } = this

      // spu/sku
      const tabs1 = [
        { title: '基础信息', component: () => import('./basicsInfo.vue'), key: 'baseInfo' },
        { title: '产品属性信息', component: PropsInfo, key: 'specificationsInfo' },
        { title: '物流属性信息', component: Logistics, key: 'logisticsInfo' },
        { title: '仓储库存信息', component: Warehouse, key: 'warehouseInfo', props: { spu: baseInfo.productSpu } },
        { title: '销售信息', component: SalesInfo, key: 'saleInfo' },
        { title: '图片/视频/附件信息', component: () => import('./assets/index.vue'), key: 'imageInfo' },
        { title: '供应商信息', component: SupplierInfo, key: 'supplierInfo' },
        { title: '安全审核信息', component: () => import('./safetyAuditInfo.vue'), key: 'safetyAuditInfo' },
        { title: '多语言信息', component: MultiLangInfo, key: 'multiLangInfo' },
        { title: '美工任务信息', component: () => import('./uiTask.vue'), key: 'artInfo', props: { tasktype: 1, productId: id } },
        { title: '日志信息', component: Log, key: 'handlerInfo', props: { type: Number(type) } }
      ].map(item => {
        item.props = Object.assign({
          isAudit: this.isAudit
        }, item.props || {})
        return item
      })

      // 安全审核
      const tabs2 = [
        {
          title: '产品信息',
          component: () => import('@/views/tabs/productDev/productInfo.vue'),
          key: 'baseInfo',
          props: { id, isAudit }
        },
        {
          title: '图片/附件信息',
          component: () => import('@/views/tabs/productDev/imageInfo.vue'),
          key: 'imageList',
          props: { id, isAudit }
        },
        {
          title: '安全审核信息',
          component: () => import('@/views/tabs/productDev/safeAuditInfo.vue'),
          key: 'infringementInfo',
          props: { id, saveSafeInfo }
        },
        {
          title: '日志信息',
          component: () => import('@/views/tabs/productDev/logInfo.vue'),
          key: 'logInfo',
          props: { id, type }
        }
      ]

      const tabs = [tabs1, tabs2][this.auditType - 1] || []

      // 新增时只需要显示基础信息
      return this.loading ? [] : (this.isEdit ? tabs : tabs.slice(0, 1))
    }
  },
  watch: {
    loading(status) {
      this.$parent.$emit('loading', status)
    },
    currentTab(val) {
      // 记录当前所在标签页
      this.$route.params.currentTab = val
    }
  },
  created() {
    if (this.isEdit) {
      this.getDetail()
    } else if (this.mode === 'page') {
      this.pageModeSetTitle()
    }
    if (this.$route.params.currentTab) {
      this.currentTab = this.$route.params.currentTab
    }
  },
  methods: {
    // 如果是审核，默认滚动到底部
    scrollToBottom() {
      if (!this.loading && !this.loadingAudit) {
        setTimeout(() => {
          (document.getElementById('container') || document.getElementById('container-page')).scrollTop = this.$el.scrollHeight
        }, 100)
      }
    },
    closeTab() {
      if (this.mode === 'page') {
        this.$parent.$emit('close', ...arguments)
      } else {
        this.$emit('close', ...arguments)
      }
    },
    updateTab() {
      this.$emit('update', ...arguments)
    },
    // 获取spu、sku详情
    getDetail() {
      this.loading = true
      let apiPromise
      if (this.auditType === 1) {
        const params = this.code ? { productCode: this.code } : { id: this.id }
        apiPromise = getDetailByIdOrCode(params)
      } else {
        // 注意：产品开发审核 目前不支持传code
        apiPromise = queryAuditById(this.id)
      }
      apiPromise.then(res => {
        const d = res.data
        const id = d.baseInfo.id
        this.iid = id

        // 如果是sku,spu,组合sku 则根据接口返回的type去重置 itype
        if (this.auditType === 1) this.itype = d.baseInfo.type - 1
        this.pageModeSetTitle(d)

        // 获取日志的业务编码
        this.childrenData.handlerInfo.logId = d.baseInfo.productSku

        // 重构数据格式
        if (this.auditType === 2) {
          d.imageList = {
            ifCanUpdate: d.baseInfo.ifCanUpdate,
            images: d.imageList,
            attachments: d.attachments
          }
        }

        for (const key in this.childrenData) {
          if (Array.isArray(d[key])) {
            Object.assign(this.childrenData[key], { id, list: d[key] })
          } else {
            Object.assign(this.childrenData[key], d[key] || {}, { id })
          }
        }
      }).finally(() => {
        this.loading = false
        this.scrollToBottom()
      })
    },
    auditLoaded() {
      this.loadingAudit = false
      this.scrollToBottom()
    },
    // 页面模式 根据参数 设置页面标签的标题
    pageModeSetTitle(d) {
      if (this.mode !== 'page') return
      if (!d) return this.$parent.$emit('title', '新增SPU')
      let prefix = ''
      if (this.auditType === 1) {
        prefix = ['SPU', 'SKU', '组合SKU'][Number(this.itype)] + (this.isAudit ? '审核' : '')
      } else if (this.auditType === 2) {
        prefix = '产品开发' + (this.isAudit ? '审核' : '')
      }
      this.$parent.$emit('title', prefix + ' - ' + (d.baseInfo.productName || d.baseInfo.productSku))
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  padding: 0;
  ::v-deep {
    .el-tabs {
      height: calc(100% - 2px);
    }
    .el-tabs .el-tabs__item {
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
    }
    .el-tabs__header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #eee;
      .el-tabs__nav-next, .el-tabs__nav-prev {
        line-height: 32px;
      }
    }
    .el-tabs__content {
      height: calc(100% - 61px);
      overflow: initial;
    }
    .el-row {
      .el-col {
        margin-bottom: 0;
      }
    }
  }
  .tab-over{
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
