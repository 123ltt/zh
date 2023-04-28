
<template>
  <el-dialog :visible.sync="visible" :append-to-body="true" :close-on-click-modal="true" :destroy-on-close="true" title="查看组织机构" top="80px" custom-class="my-dialog" @close="handleClose">
    <el-form ref="dialogForm" :model="dialogForm" label-width="110px">
      <!-- <el-row v-if="isAdmin" :gutter="20">
        <el-col :span="5"></el-col>
        <el-col :span="14">
          <el-form-item label="所属租户" prop="tenantId" size="small" required>
            <span class="value-color">{{ dialogForm.tenantId }}</span>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col :span="4" />
        <el-col :span="14">
          <el-form-item label="机构名称" prop="orgName" size="small" required>
            <span class="value-color">{{ dialogForm.orgName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" />
        <el-col :span="14">
          <el-form-item label="上级机构" prop="parentId" size="small">
            <span v-if="dialogForm.parentId == '0'" class="value-color">无上级机构</span>
            <template v-else>
              <InputTree v-if="organizationTree.length"
                         v-model="dialogForm.parentId"
                         class="w-100"
                         disabled
                         :data="organizationTree"
              />
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="dialogForm.prefixNo" :gutter="20">
        <el-col :span="4" />
        <el-col :span="14">
          <el-form-item label="工号前缀" prop="prefixNo" size="small" required>
            <span class="value-color">{{ dialogForm.prefixNo }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" />
        <el-col :span="14">
          <el-form-item label="机构级别" prop="category" required>
            <span class="value-color">{{ dialogForm.categoryName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" />
        <el-col :span="14">
          <el-form-item label="排序" prop="sort" size="small" required>
            <span class="value-color">{{ dialogForm.sort }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="dialogForm.logoValue" :gutter="20">
        <el-col :span="4" />
        <el-col :span="14">
          <el-form-item label="机构LOGO" prop="logo" size="small" required>
            <img :src="dialogForm.logoValue" style="width: auto; height: 50px">
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" />
        <el-col :span="14">
          <el-form-item label="负责人" prop="manager" size="small">
            <span class="value-color">{{ dialogForm.manager }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" />
        <el-col :span="14">
          <el-form-item :disabled="true" label="备注" prop="remark" size="small">
            <span class="value-color">{{ dialogForm.remark }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { InputTree } from 'global-components'
import { getOrgTree } from '@/api/organization'
import { mapGetters } from 'vuex'

export default {
  name: 'ViewOrg',
  components: { InputTree },
  props: ['isShow', 'dialogForm'],
  data() {
    return {
      dialogVisible: false,
      organizationTree: [],
      visible: this.isShow
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    // 是否超级管理员
    isAdmin() {
      return this.userInfo.role_name.includes('administrator')
    }
  },
  created() {
    this.getOrgTree()
  },
  methods: {
    handleClose(val) {
      this.$emit('closeView', true)
    },
    // 组织机构树
    getOrgTree() {
      getOrgTree({ tenantId: this.dialogForm.tenantId }).then(res => {
        this.organizationTree = res.data
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../index.scss";
</style>
