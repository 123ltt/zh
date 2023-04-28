<template>
  <el-form
    ref="dialogForm"
    v-loading="laoding > 0"
    :model="form"
    :rules="rules"
    label-width="90px"
  >
    <el-form-item label="违禁词：" prop="word" size="small">
      <el-input v-model="form.word" :rows="3" :placeholder="current ? '请输入违禁词' : '一次性可添加多个违禁词，请换行一行一个'" type="textarea" />
    </el-form-item>
    <el-form-item label="备注：" prop="wordsRemark" size="small">
      <el-input v-model="form.wordsRemark" maxlength="500" show-word-limit placeholder="请输入违禁词备注" />
    </el-form-item>
    <el-row v-if="current">
      <el-col :span="12">
        <el-form-item label="平台：" prop="platform" size="small">
          <el-select
            v-model="form.platform"
            clearable
            filterable
            placeholder="请选择平台"
            @change="(value) => changeSite_(value)"
            @clear="() => form.site = ''"
          >
            <el-option
              v-for="plat in platformList"
              :key="plat.id"
              :label="plat.platformName"
              :value="plat.platformCode"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="站点：" :prop="siteList.length ? 'site' : ''" size="small">
          <el-select v-model="form.site" clearable filterable placeholder="请选择站点">
            <el-option v-for="site in siteList" :key="site.siteCode" :label="site.siteCode" :value="site.siteCode" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!current" class="add-platform-head">
      <el-col :span="12">
        <el-form-item prop="platformSelected" :rules="{ required: true, message: '平台不能为空', trigger: 'blur' }" label-width="160px" size="small">
          <template slot="label">
            <span class="m-r-10">平台：</span>
            <el-checkbox v-model="changePlatAll" :indeterminate="Boolean(form.platformSelected.length)" @change="changePlatAllHandle">全部</el-checkbox>
          </template>
        </el-form-item>
      </el-col>

      <el-col :span="12"><el-form-item label="站点：" :rules="rulesSite ? [{ required: true, message: '站点不能为空', trigger: 'blur' }] : [] " size="small" /></el-col>
    </el-row>
    <div v-if="!current" ref="addPlatformBox" class="add-platform-box">
      <el-row v-for="item in platformList" :key="item.id">
        <el-col :span="12">
          <el-form-item size="small" label-width="30px">
            <el-checkbox
              ref="platformSiteMap"
              v-model="platformChecked[item.platformCode]"
              @change="(value) => changePlatform(value, item, 'platformSiteMap.' + item.platformCode)"
            >{{ item.platformName }}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col v-show="form.platformSelected.includes(item.platformCode) && item.sites && item.sites.length" :span="12">
          <el-form-item
            :prop="'platformSiteMap.' + item.platformCode"
            :rules="form.platformSelected.includes(item.platformCode) && item.sites.length ? [{ required: true, message: '站点不能为空', trigger: 'blur' }] : []"
            label-width="30px"
            size="small"
          >
            <el-select
              :ref="item.platformCode"
              v-model="form.platformSiteMap[item.platformCode]"
              clearable
              placeholder="请选择站点"
              multiple
              filterable
              @change="(value) => changeSiteMore(value, item, 'platformSiteMap.' + item.platformCode)"
              @focus="() => platformSiteMapFocus = item.platformCode"
              @visible-change="(value) => !value && (platformSiteMapFocus = '')"
            >
              <el-option
                v-for="site in item.sites"
                :key="site.id"
                :label="site.siteCode"
                :value="site.siteCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-form-item label="产品类目：">
      <el-select
        v-model="form.categoryIds"
        multiple
        filterable
        clearable
        collapse-tags
        placeholder="请选择产品类目"
        class="w100"
      >
        <li :class="selectCageAll && 'selected'" class="el-select-dropdown__item" @click="changeCageAll"><span>全部</span></li>
        <el-option
          v-for="cate in categoryList"
          :key="cate.id"
          :label="cate.name"
          :value="cate.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="类型：" prop="level" size="small">
      <el-radio v-model="form.level" label="0">仅提示</el-radio>
      <el-radio v-model="form.level" label="1">严禁禁止</el-radio>
    </el-form-item>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button :disabled="current ? submitBtnEnable : false" size="medium" type="primary" @click="submitDialog('dialogForm')">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
import { addFbwords, updateFbwords } from '@/api/fbwords.js'
import { getDict } from '@/api/common/dict.js'
import { deepClone } from '@/util/util'
export default {
  name: 'EditWords',
  props: {
    current: {
      type: Object,
      default: null
    },
    platformList: {
      type: Array,
      default: () => []
    },
    categoryList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      laoding: 0,
      form: {
        word: '',
        wordsRemark: '',
        level: '0',
        platformSiteMap: undefined,
        categoryIds: [],
        platform: undefined,
        site: undefined,
        // 已经选择平台
        platformSelected: []
      },
      rules: {
        word: [{ required: true, message: '一次性可添加多个违禁词，请换行一行一个', trigger: 'blur' }],
        platform: [{ required: true, message: '平台能为空', trigger: 'blur' }],
        site: [{ required: true, message: '站点不能为空', trigger: 'blur' }]
      },
      // 用于提交时判断是否修改
      oldForm: null,
      // 平台下站点列表
      siteList: {},
      changePlatAll: false,
      platformChecked: {},
      selectCageAll: false,
      // 当前获得焦点的站点列表
      platformSiteMapFocus: ''
    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    },
    // 是否展示站点红色星号
    rulesSite() {
      let status = false
      this.platformList.find(item => {
        if (this.form.platformSelected.includes(item.platformCode) && item.sites.length) {
          status = true
        }
      })
      return status
    }
  },
  mounted() {
    !this.current && this.$refs.addPlatformBox.addEventListener('scroll', this.handleScroll)
  },
  created() {
    if (this.current) {
      const { id, word, wordsRemark, platform, site, categoryIds, level } = deepClone(this.current)
      this.selectCageAll = (this.form.categoryIds.length === this.categoryList.length)
      this.form = Object.assign(this.form, {
        wordsRemark,
        word,
        id,
        platform,
        site,
        level: level ? level + '' : '0',
        categoryIds: categoryIds ? categoryIds.split(',') : []
      })
      this.getSiteOption(null, platform)
    } else {
      this.form.platformSiteMap = {}
      this.changeCageAll()
    }
    this.platformList.map(item => {
      this.platformChecked[item.platformCode] = false
    })
  },
  destroyed() {
    !this.current && window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 平台站点内容区滚动事件
    handleScroll() {
      if (this.platformSiteMapFocus) {
        this.$refs[this.platformSiteMapFocus][0].visible = false
      }
    },
    // 平台全选事件
    changePlatAllHandle() {
      // 全选
      if (this.changePlatAll) {
        this.platformList.filter(item => {
          if (!this.form.platformSelected.includes(item.platformCode)) {
            this.form.platformSelected.push(item.platformCode)
            this.getSiteOption(item)
          }
        })
      } else {
        // 取消全选
        this.form.platformSelected = []
      }
      for (const i in this.platformChecked) {
        this.platformChecked[i] = this.changePlatAll
      }
    },
    // 选择平台事件
    changePlatform(value, item, prop) {
      if (!this.form.platformSiteMap) {
        this.form.platformSiteMap = {}
      }
      // 选中事件
      if (value) {
        this.form.platformSiteMap[item.platformCode] = []
        this.form.platformSelected.push(item.platformCode)
        this.$refs.dialogForm.validateField('platformSelected')
        this.changePlatAll = (this.form.platformSelected.length === this.platformList.length)
        this.getSiteOption(item)
      } else {
        // 取消选中事件
        if (prop) {
          this.$refs.dialogForm.clearValidate(prop)
        }
        this.changePlatAll = false
        const temp = {}
        const data = this.form.platformSiteMap
        for (const k in data) {
          if (k !== item.platformCode) {
            temp[k] = data[k]
          }
        }
        const index = this.form.platformSelected.indexOf(item.platformCode)
        this.form.platformSelected.splice(index, 1)
      }
      this.platformChecked[item.platformCode] = value
    },
    // 选择站点事件
    changeSite(value, item) {
      this.$set(this.form.platformSiteMap, item.siteCode, value)
    },
    // 新增-选择平台
    changeSite_(value) {
      this.form.site = ''
      this.getSiteOption(null, value)
    },
    // 新增-多选站点
    changeSiteMore(value, item, prop) {
      this.$refs.dialogForm.validateField(prop)
      this.changeSite(value, item)
    },
    // 获取平台下站点列表
    getSiteOption(item, value) {
      if (!item) {
        // this.platformList.find(item2 => {
        //   if (item2.platformCode === value) {
        //     if (this.current) {
        //       this.siteList = item2.sites
        //     }
        //   }
        // })
        this.laoding++
        getDict(value, 'sams').then(list => {
          this.siteList = list.map(({ value: siteCode }) => ({ siteCode }))
        }).finally(item => { this.laoding-- })
      } else {
        this.laoding++
        getDict(item.platformCode, 'sams').then(list => {
          item.sites = list.map(({ value: siteCode }) => ({ siteCode }))
        }).finally(item => { this.laoding-- })
      }
    },
    // 全选类目事件
    changeCageAll() {
      this.selectCageAll = !this.selectCageAll
      if (this.selectCageAll) {
        this.form.categoryIds = this.categoryList.map(item => item.id)
      } else {
        this.form.categoryIds = []
      }
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.laoding++
          const request = this.current ? updateFbwords : addFbwords
          // 处理站点数据格式
          const maptemp = {}
          const mapData = deepClone(this.form.platformSiteMap)
          for (const k in mapData) {
            if (this.form.platformSelected.indexOf(k) > -1) {
              maptemp[k] = mapData[k].join(';')
            }
          }
          request(Object.assign({}, this.form, {
            platformSiteMap: this.current ? undefined : maptemp,
            categoryIds: this.form.categoryIds.join(','),
            level: Number(this.form.level)
          })).then((res) => {
            if (res.success) {
              this.$message.success(`${this.current ? '修改' : '添加'}违禁词成功`)
              this.$parent.$emit('close', true)
            }
          }).finally(() => {
            this.laoding--
          })
        } else {
          this.$message.error('请根据提示完成表单')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form{
  padding: 20px 50px 20px 20px;
}
.el-col{
  margin-bottom: 0;
}
.add-platform-box{
  max-height: 250px;
  overflow-y: scroll;
  margin-bottom: 10px;
  padding-right: 10px;
}
.add-platform-head{
  .el-form-item{
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__error{
    top: 8px;
  }
}
.m-r-10{
  margin-right: 10px;
}
.w100{
  width: 100%;
}
</style>
