<template>
  <el-form
    ref="dialogForm"
    :model="form"
    :rules="rules"
    size="mini"
    label-width="110px"
  >
    <el-row
      :gutter="gutter"
      class="m-t-20"
    >
      <el-col :span="12">
        <el-form-item
          label="菜单名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="菜单类型"
          prop="category"
          placeholder="请选择菜单类型"
        >
          <el-row>
            <el-col :span="10">
              <el-radio
                v-model="form.category"
                label="1"
              >菜单</el-radio>
            </el-col>
            <el-col :span="10">
              <el-radio
                v-model="form.category"
                label="2"
              >按钮</el-radio>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="上级菜单"
          prop="parentName"
        >
          <el-popover
            v-model="showParentTree"
            placement="bottom"
            width="350"
            trigger="click"
          >
            <div slot="reference">
              <el-input
                v-model="form.parentName"
                clearable
                placeholder="请输入上级菜单"
                @input="parentName_"
              />
            </div>
            <div style="max-height:300px">
              <el-input
                v-model="filterText"
                placeholder="输入关键字进行过滤"
              />
              <el-tree
                ref="tree"
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
      <el-col
        v-if="form.category == 1"
        :span="12"
      >
        <el-form-item
          :prop="'path'"
          :rules="[{ required: true, message: '菜单图标不能为空', trigger: 'blur' }]"
          label="菜单图标"
        >
          <el-input
            ref="menuIcon"
            v-model="form.icon"
            placeholder="请输入菜单图标"
            @focus="changeMenuIcon = true"
          >
            <el-button
              slot="append"
              :icon="form.icon"
              @click="changeMenuIcon = true"
            />
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :prop="'path'"
          :rules="form.category == 1 ? [{ required: true, message: '前端路由地址不能为空', trigger: 'blur' }] : []"
          label="前端路由地址"
        >
          <el-input
            v-model="form.path"
            placeholder="请输入前端路由地址"
            @input="editPath"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="菜单排序"
          prop="sort"
        >
          <el-input
            v-model="form.sort"
            placeholder="请输入菜单排序"
            @input="changeSort"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="菜单标签"
          prop="label"
        >
          <el-input
            v-model="form.label"
            placeholder="请输入菜单标签"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="菜单别名"
          prop="alias"
        >
          <el-input
            v-model="form.alias"
            placeholder="请输入菜单别名"
          />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item
          label="系统管理菜单:"
          prop="isSuperShowOnly"
          placeholder="请选择系统管理菜单"
        >
          <template slot="label">
            <el-tooltip
              class="item"
              effect="dark"
              content="选择“是”表示角色授权时的功能菜单只有超级管理员可查看"
              placement="top-start"
            >
              <span>系统管理菜单:</span>
            </el-tooltip>
          </template>
          <el-radio
            v-model="form.isSuperShowOnly"
            label="0"
          >否</el-radio>
          <el-radio
            v-model="form.isSuperShowOnly"
            label="1"
          >是</el-radio>
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item
          label="所属应用"
          prop="appId"
        >
          <el-select
            v-model="form.appId"
            filterable
            placeholder="请选择所属应用"
            popper-class="select-style-modal"
          >
            <el-option
              v-for="item in appList"
              :key="item.appId"
              :label="item.appName"
              :value="item.appId"
              :title="item.appName"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item
          v-if="resShow"
          label="关联资源"
          prop="resList"
          class="res-list"
        >
          <el-cascader
            v-model="form.resList"
            :options="resChangeList"
            :props="{ multiple: true, children: 'resList', label: 'resName', value: 'id' }"
            filterable
            popper-class="app-res-box"
            placeholder="请选择资源"
            @expand-change="resFocus"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="gutter">
      <el-col :span="20">
        <el-form-item
          label="描述"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            type="textarea"
            rows="5"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <div style="padding-bottom: 20px;margin-top: 20px;text-align: right">
      <span
        class="el-button el-button--default el-button--small"
        @click="$parent.$emit('close')"
      >
        <span>取消</span>
      </span>
      <el-button
        :disabled="current ? submitBtnEnable : false"
        size="small"
        type="primary"
        @click="submitDialog('dialogForm')"
      >保存</el-button>
    </div>
    <!-- 菜单图标选择器 -->
    <div
      v-if="changeMenuIcon"
      class="change-menu-box"
    >
      <button
        type="button"
        aria-label="Close"
        class="el-dialog__headerbtn close-icon"
        @click.stop="changeMenuIcon = false"
      >
        <i class="el-dialog__close el-icon el-icon-close" />
      </button>
      <div class="change-menu-content">
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="(item, index) in iconList"
            :key="index"
            :label="item.label"
            :name="item.label"
          >
            <div class="avue-icon-select__list change-menu-list">
              <div
                v-for="(icon, idx) in item.list"
                :key="idx"
                class="avue-icon-select__item"
              >
                <i
                  :class="['avue-icon-select__icon ', icon]"
                  @click="form.icon = icon; changeMenuIcon = false; "
                />
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
import { submitResourceList, getResourceTree } from '@/api/menuManage.js'
export default {
  name: 'MenuModal',
  props: ['row', 'current', 'appList', 'menuList', 'index'],
  data() {
    const validateLabel = (rule, value, callback) => {
      if (value && /^[a-zA-Z_]{1,}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入标签格式为字母+下划线'))
      }
    }
    return {
      gutter: 5,
      activeName: '通用图标',
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
      oldForm: null
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
  created() {
    this.resAppIdChange()
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
      this.current.resList.map(item => {
        resList.push([item.appId, item.id])
      })
      this.form = Object.assign(this.form, {
        alias,
        appId,
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
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const resList = []
          this.form.resList.map(item => {
            resList.push(item[1])
          })
          submitResourceList(Object.assign({}, this.form, { resList })).then((res) => {
            if (res.success) {
              this.$parent.$emit('close', true)
              this.index.openMenu(this.menuId)
            }
          })
        } else {
          return false
        }
      })
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
</style>

<style lang="scss">
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
