<template>
  <el-form ref="dialogForm"
           v-loading="loading"
           :model="form"
           :rules="rules"
           size="small"
           label-width="110px"
  >
    <el-row :gutter="gutter" class="m-t-20">
      <el-col :span="12">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" class="w253 " />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单类型" prop="category" placeholder="请选择菜单类型">
          <el-radio-group v-model="form.category">
            <el-radio v-for="item in categoryTypes" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="上级菜单" prop="parentName">
          <el-popover v-model="showParentTree"
                      placement="bottom"
                      width="350"
                      trigger="click"
          >
            <div slot="reference">
              <el-input v-model="form.parentName"
                        :loading="menuChangeLoading"
                        clearable
                        placeholder="请输入上级菜单"
                        class="w253"
                        @input="parentName_"
              />
            </div>
            <div style="max-height:300px">
              <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
              <el-tree ref="tree"
                       :data="treeData"
                       :props="{ children: 'children', label: 'name' }"
                       :check-on-click-node="true"
                       :expand-on-click-node="false"
                       :filter-node-method="filterNode"
                       node-key="id"
                       highlight-current
                       class="filter-tree"
                       @current-change="parentChange"
              />
            </div>
          </el-popover>
        </el-form-item>
      </el-col>
      <el-col v-if="form.category == 1" :span="12">
        <el-form-item :prop="'icon'"
                      :rules="[{ required: true, message: '菜单图标不能为空', trigger: 'blur' }]"
                      label="菜单图标"
        >
          <el-input ref="menuIcon"
                    v-model="form.icon"
                    placeholder="请输入菜单图标"
                    @focus="changeMenuIcon = true"
          >
            <v-icon slot="append" :icon="form.icon" @click="changeMenuIcon = true" />
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :prop="'path'"
                      :rules="form.category == 1 ? [{ required: true, message: '前端路由地址不能为空', trigger: 'blur' }] : []"
                      label="前端路由地址"
        >
          <el-input v-model="form.path"
                    class="w253"
                    placeholder="请输入前端路由地址"
                    @input="editPath"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入菜单排序" class="w253" @input="changeSort" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单标签" prop="label">
          <el-input v-model="form.label" placeholder="请输入菜单标签" class="w253" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单别名" prop="alias">
          <el-input v-model="form.alias" placeholder="请输入菜单别名" class="w253" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属应用" prop="appId">
          <el-select v-model="form.appId"
                     filterable
                     placeholder="请选择所属应用"
                     popper-class="select-style-modal"
                     class="w253"
          >
            <el-option v-for="item in appList"
                       :key="item.id"
                       :label="item.appName"
                       :value="item.id"
                       :title="item.appName"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item v-if="resShow"
                      label="关联资源"
                      prop="resList"
                      class="res-list"
        >
          <el-cascader v-model="form.resList"
                       :options="resChangeList"
                       :props="{ multiple: true, children: 'resList', label: 'resName', value: 'id' }"
                       filterable
                       popper-class="app-res-box"
                       placeholder="请选择资源"
                       class="w626"
                       @expand-change="resFocus"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="gutter">
      <el-col :span="20">
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark"
                    class="w626"
                    type="textarea"
                    rows="5"
                    placeholder="请输入描述"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <div style="text-align: right">
      <span class="el-button el-button--default el-button--medium" style="display:inline-block;width:60px;height:32px;padding-left:16px;" @click="$parent.$emit('close')">
        <span>取消</span>
      </span>
      <el-button :disabled="current ? submitBtnEnable : false"
                 size="medium"
                 type="primary"
                 style="width:60px;height:32px;padding-left: 16px;"
                 @click="submitDialog('dialogForm')"
      >保 存</el-button>
    </div>
    <!-- 菜单图标选择器 -->
    <div v-if="changeMenuIcon" class="change-menu-box">
      <button type="button"
              aria-label="Close"
              class="el-dialog__headerbtn close-icon"
              @click.stop="changeMenuIcon = false"
      >
        <i class="el-dialog__close el-icon el-icon-close" />
      </button>
      <div class="change-menu-content">
        <el-tabs v-model="activedTab">
          <el-tab-pane v-for="(item, ic) in iconList"
                       :key="ic"
                       :label="item.label"
                       :name="item.type"
          >
            <svg-panel v-if="activedTab==='svg'" @select="onSelect" />
            <div v-else class="avue-icon-select__list change-menu-list">
              <div v-for="(icon, idx) in item.list" :key="idx" class="avue-icon-select__item">
                <i :class="['avue-icon-select__icon ', icon]" @click="onSelect(icon)" />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-form>

</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/util/util'
import iconList from '@/config/iconList'
import { submitResourceList, getResourceTree, getMenuDetail } from '@/api/menuManage.js'
import svgPanel from './svgPanel.vue'
import vIcon from './icon.vue'

export default {
  name: 'MenuModal',
  components: { svgPanel, vIcon },
  // eslint-disable-next-line
  props: ['row', 'currentObj', 'appList', 'menuList', 'index', 'menuChangeLoading'],
  data() {
    const validateLabel = (rule, value, callback) => {
      if (value && /^[a-zA-Z_]{1,}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入标签格式为字母+下划线'))
      }
    }
    return {
      loading: !!this.currentObj, // 只有编辑才会有loading
      gutter: 5,
      activedTab: 'common',
      treeData: deepClone(this.menuList),
      // 显示隐藏上级菜单选择popover
      showParentTree: false,
      form: {
        // 菜单名称
        name: '',
        // 菜单图标
        icon: '',
        // 上级菜单
        parentId: '',
        parentName: '',
        // 菜单类型
        category: '1',
        // 前端路由地址
        path: '',
        // 菜单排序
        sort: '',
        // 菜单标签
        label: '',
        // 菜单别名
        alias: '',
        // 所属应用
        appId: '',
        // 关联资源
        resList: [],
        // 描述
        remark: ''
        // 是否系统菜单 0不是 1是
        // isSuperShowOnly: '0'
      },
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        // icon: [{ required: true, message: '菜单图标不能为空', trigger: 'blur' }],
        category: [{ required: true, message: '菜单类型不能为空', trigger: 'blur' }],
        // path: [{ required: true, message: '前端路由地址不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单排序不能为空', trigger: 'blur' }],
        label: [{ required: true, validator: validateLabel }],
        appId: [{ required: true, message: '所属应用不能为空', trigger: 'blur' }],
        resList: [{ required: true, message: '关联资源不能为空', trigger: 'blur' }]
        // isSuperShowOnly: [{ required: true, message: '系统管理菜单不能为空', trigger: 'blur' }]
      },
      // 资源列表
      resChangeList: [],
      // 过滤KEY
      filterText: '',
      iconList,
      changeMenuIcon: false,
      // 关联资源显示隐藏
      resShow: true,
      // 用于提交时判断是否修改
      oldForm: null,
      current: null,
      categoryTypes: [{ label: '菜单', value: '1' }, { label: '按钮', value: '2' }]
    }
  },
  computed: {
    ...mapGetters(['menuId']),
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(this.filterText)
    }
  },
  async created() {
    this.resAppIdChange()
    if (this.currentObj) {
      this.current = await getMenuDetail({ id: this.currentObj.id }).then(res => res.data)
      this.loading = false
    }
    // 编辑
    if (this.current) {
      const {
        alias,
        appId,
        category,
        icon,
        label,
        name,
        parentId,
        parentName,
        remark,
        path,
        sort,
        id
        // isSuperShowOnly
      } = deepClone(this.current)
      const resList = []
      this.current.resList.forEach(item => {
        resList.push([item.appId, item.id])
      })
      this.form = Object.assign(this.form, {
        alias,
        appId: String(appId),
        category: String(category),
        icon,
        label,
        name,
        parentId,
        parentName,
        remark,
        resList,
        path,
        sort,
        id
        // isSuperShowOnly: String(isSuperShowOnly)
      })
      // 选中的上级菜单没有下级侧不展示关联资源
      if (this.current.parentId === '0') {
        this.resShow = true
      } else if (this.current.children && this.current.children.length > 0) {
        // 编辑时，当前项有子菜单，并且有菜单类型，表示虚菜单
        if (this.current.children.find(item => item.category === '1')) {
          this.form.resList = []
          this.resShow = false
        } else {
          this.resShow = true
        }
      } else {
        this.resShow = true
      }
      this.oldForm = deepClone(this.form)
    } else {
      // 添加子项自动赋值上级菜单
      if (this.row) {
        this.form.parentId = this.row.id
        this.form.parentName = this.row.name
      }
    }
  },
  methods: {
    // 关联资源获取焦点 设置文字点击选择
    resFocus(event) {
      if (event) {
        setTimeout(this.textChangeBox, 200)
      } else {
        clearTimeout(this.textChangeBox)
      }
    },
    textChangeBox() {
      document.querySelectorAll('.el-cascader-menu:nth-child(2) .el-cascader-node__label').forEach(el => {
        el.onclick = function() {
          if (this.previousElementSibling) this.previousElementSibling.click()
        }
      })
    },
    parentName_(val) {
      if (!val) {
        this.form.parentId = ''
      }
    },
    // 路由编辑验证
    editPath(val) {
      if (!(this.form.path.indexOf('/') === 0)) {
        this.form.path = '/' + this.form.path
      }
    },
    // 排序
    changeSort(value) {
      this.form.sort = Number(value.replace(/[^0-9]/g, ''))
    },
    filterNode(value, data) {
      if (!value) {
        this.treeData = []
        this.$nextTick(() => {
          this.treeData = deepClone(this.menuList)
        })
        return
      }
      if (value) return data.name.indexOf(value) !== -1
    },
    parentChange(node, obj) {
      this.form.parentId = node.id
      this.form.parentName = node.name
      // 选中的上级菜单没有下级侧不展示关联资源
      if (node.children && node.children.length > 0) {
        // 编辑时，当前项有子菜单，并且有菜单类型，表示虚菜单
        if (node.children.find(item => item.category === '1')) {
          this.resShow = false
          this.form.resList = []
        } else {
          this.resShow = true
        }
      } else {
        this.resShow = true
      }
      this.showParentTree = false
    },
    // 关联资源-选择应用-获取资源
    resAppIdChange(value) {
      getResourceTree().then(res => {
        this.resChangeList = res.data.map(item => {
          item.resName = item.appName
          return item
        })
      })
    },
    onSelect(icon) {
      this.form.icon = icon
      this.changeMenuIcon = false
      this.$refs.dialogForm.validateField('icon')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const resList = []
          this.form.resList.forEach(item => {
            resList.push(item[1])
          })
          const formData = Object.assign({}, this.form, { resList })
          if (formData.id === formData.parentId) return this.$message.error('上级菜单不能选择本级')
          submitResourceList(formData).then((res) => {
            if (res.success) {
              this.$parent.$emit('close', true, !!this.currentObj, this.getReturnData(formData))
              this.index.openMenu(this.menuId)
            }
          })
        } else {
          return false
        }
      })
    },
    getReturnData(data) {
      if (!data.id) return
      const menuItem = this.menuList.find(item => item.appId === data.appId)
      return {
        id: data.id,
        name: data.name,
        appName: menuItem?.appName || '',
        path: data.path,
        sort: data.sort,
        category: data.category
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.change-menu-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 2;
  .change-menu-content {
    margin: 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    height: 100%;
    .change-menu-list {
      height: 350px;
      overflow: scroll;
    }
  }
}
.el-form {
  padding-right: 10px;
}
.el-form-item {
  margin-bottom: 10px;
}
.m-t-20 {
  margin-top: 20px;
}
.close-icon {
  z-index: 2;
}
.filter-tree {
  max-height: 280px;
  overflow: scroll;
}
.w253{
  width:253px !important;
}
.w626{
  width:626px !important;
}
::v-deep .el-input__inner {
  height:32px;
}
::v-deep .el-form-item__content{
  line-height: 32px;
}
</style>

<style lang="scss" scoped>
/* 隐藏关联资源的用户复选框 */
.app-res-box .el-cascader-panel .el-cascader-menu:first-child .el-checkbox {
  display: none;
}
.app-res-box .el-cascader-node__label {
  max-width: 220px;
}
.res-list .el-cascader {
  width: 100%;
}
</style>
