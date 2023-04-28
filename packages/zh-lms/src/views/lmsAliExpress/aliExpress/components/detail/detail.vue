<template>
  <el-row :gutter="10" class="ms-0 me-0 detail-box">
    <el-col :span="4" class="mb-0">
      <draggable :options="{group:{name: 'detail',pull:'clone'},sort: false,put: false}"
                 animation="300"
                 class="module-menu"
      >
        <transition-group>
          <div v-for="(item, index) in moduleMenu" :key="index" class="item item-menu">
            <div v-if="item.type !== 'productTempHtml'">
              <i :class="item.icon + ' font-30'" />
              <span class="d-block lh-1">{{ item.name }}</span>
            </div>
          </div>
        </transition-group>
      </draggable>
    </el-col>
    <el-col :span="6" class="mb-0">
      <draggable v-model="moduleList"
                 :options="{group:{name: 'detail',pull: false},sort: true, draggable:'.item'}"
                 animation="300"
                 @add="onAdd"
      >
        <transition-group ref="detailContent" class="d-block module-content">
          <div v-for="(item, index) in moduleList"
               :key="index"
               :class="currentModule === index ? 'current' : ''"
               class="item item-content"
               @click="selectActive(item, index)"
          >
            <span>{{ showName(item.type) }}</span>
            <i class="el-icon-delete del-btn" @click="removeHandle(item, index)" />
          </div>
        </transition-group>
      </draggable>
    </el-col>
    <el-col v-if="moduleList[currentModule]" :span="14">
      <edit :data="moduleList[currentModule]" :title="currModuleName" />
    </el-col>
    <div style="display: none;">
      <moduleContent v-if="productDetailTemplateShow.list"
                     ref="productTemp"
                     :product="productDetailTemplateShow"
      />
    </div>
  </el-row>
</template>
<script>
// import { deepClone } from '@/util/util'
// 导入draggable组件
import draggable from 'vuedraggable'
import moduleContent from './moduleContent.vue'
import * as detailHandel from './detail.js'
import edit from './edit.vue'
export default {
  name: 'Detail',
  // 注册draggable组件
  components: {
    draggable,
    edit,
    moduleContent
  },
  props: {
    detail: {
      type: Object,
      default: () => ({
        version: '2.0.0',
        moduleList: []
      })
    },
    detailTemplateName: String, // 产品信息模板名
    baseProductInfo: Object,
    productDetailTemplateShow: Object,
    showPositionVal: String
  },
  data() {
    return {
      moduleMenu: detailHandel.moduleMenu,
      moduleList: [],
      currentModule: '', // 当前编辑的组件索引,
      currModuleName: ''
    }
  },
  watch: {
    'detail'() {
      this.moduleList = this.detail.moduleList
    }
  },
  mounted() {
    const moduleListWatcher = this.$watch(
      () => ({ moduleList: this.detail.moduleList }),
      d => {
        this.moduleList = d.moduleList
      },
      { immediate: true }
    )
    const productDetailTempWatcher = this.$watch(
      () => ({ showPositionVal: this.showPositionVal, productDetailTemplateShow: this.productDetailTemplateShow }),
      d => {
        // 先删除
        this.moduleList.filter((item, i) => {
          if (item.type === 'productTempHtml') {
            this.moduleList.splice(i, 1)
          }
        })
        // 再添加
        const descriptionHtml = this.$refs.productTemp.$el.innerHTML
        if (descriptionHtml !== '<ul style="list-style: none; overflow: hidden;"></ul>') {
          const i = d.showPositionVal === 'showAbove' ? 0 : this.moduleList.length
          this.moduleList.splice(i, 0, {
            ...detailHandel.productTempHtml(descriptionHtml),
            tempType: d.productDetailTemplateShow.type,
            templateId: d.productDetailTemplateShow.templateId // 产品信息模板id
          })
        }
      },
      { immediate: true }
    )
    this.$once('hook:beforeDestroy', () => {
      moduleListWatcher()
      productDetailTempWatcher()
    })
  },
  methods: {
    // 添加组件
    onAdd(e, originalEvent) {
      this.$refs.detailContent.$el.removeChild(e.item)
      const type = this.moduleMenu[e.oldIndex].type
      this.moduleList.splice(e.newIndex, 0, detailHandel[type](this.baseProductInfo))
    },
    showName(type) {
      const index = this.moduleMenu.findIndex(item => item.value === type)
      return index > -1 ? this.moduleMenu[index].name : ''
    },
    // 删除组件事件
    removeHandle(item, index) {
      this.moduleList.splice(index, 1)
      this.currentModule === index && (this.currentModule = '')
      item.type === 'productTempHtml' && this.$emit('update:detailTemplateName', '')
    },
    // 当前激活的组件
    selectActive(item, index) {
      this.currentModule = index
      this.currModuleName = this.showName(item.type)
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-box{
  border: 1px solid $--border-color-base;
  border-radius: 4px;
  background: #f8f8f8;
  .font-30{
    font-size: 35px;
    color: $--icon-color;
  }
  .module-menu{
    .item-menu{
      width: 50%;
      text-align: center;
      display: inline-block;
      padding: 10px 0;
      cursor: copy;
      transition: 0.35s color;
      &:hover{
        color: $--color-primary;
        .font-30{
          color: $--color-primary;
        }
      }
    }
  }
  .module-content{
    min-height: 150px;
    background: #fff;
    padding: 10px;
    .item-content{
      background: #f8f8f8;
      border: 1px solid $--border-color-base;
      border-radius: 4px;
      cursor: move;
      padding-left: 10px;
      margin-bottom: 10px;
      &.current{
        color: #409eff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
    .del-btn{
      font-size: 16px;
      float: right;
      padding: 5px 10px;
      cursor: pointer;
      transition: 0.35s color;
      &:hover{
        color: $--color-primary;
      }
    }
  }
}
</style>
