<template>
  <!-- oms 详情 - 提交审核 -->
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" size="mini" label-width="120px" class="form-col">
    <el-row type="flex">
      <el-col :span="14">
        <div class="d-flex">
          <el-form-item label="状态" prop="status" class="mb-1">
            <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <!-- <el-form-item label="分销规则" prop="divideRule" class="mb-1">
            <el-switch v-model="form.divideRule" :active-value="1" :inactive-value="0" />
          </el-form-item> -->
        </div>
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="平台" prop="platformCode">
          <g-select v-model="form.platformCode" is-checked-all :items="platformList" key-field="value" class="w-100" @change="platformChanged" />
        </el-form-item>

        <!-- <template v-if="form.divideRule===0&&form.platformCode.length===1"> -->
        <template v-if="form.platformCode">
          <el-form-item v-if="['WH','EB'].includes(form.platformCode)" label="店铺" prop="storeCode">
            <g-select v-model="form.storeCode" multiple is-checked-all :items="storeList" key-field="value" class="w-100" />
          </el-form-item>
          <el-form-item v-if="['WH'].includes(form.platformCode)" label="店铺后台仓库名称" prop="storeWarehouseCode">
            <el-input v-model="form.storeWarehouseCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-if="['EB'].includes(form.platformCode)" label="Location" prop="location">
            <el-input v-model="form.location" placeholder="请输入" />
          </el-form-item>
        </template>

        <el-form-item label="SKU包含内容" prop="affixContent">
          <el-input v-model="form.affixContent" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="是否虚拟仓" prop="isVirtual">
          <el-select v-model="form.isVirtual" class="w-100">
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.isVirtual===1" label="虚仓目的国家" prop="virtualAimCountry">
          <el-select v-model="form.virtualAimCountry" filterable clearable default-first-option class="w-100" :filter-method="filterCountry" @change="getChannelByServiceArea" @clear="filterCountry">
            <el-option v-for="(item,index) in countryList" :key="index" :label="item.countryCn" :value="item.countryCode" />
          </el-select>
        </el-form-item>

        <!-- <template v-if="form.divideRule===0"> -->
        <template>
          <el-form-item label="匹配库存" prop="isMatchStock">
            <el-select v-model="form.isMatchStock" class="w-100">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="匹配邮编（仅美国）" prop="isMatchZip">
            <el-select v-model="form.isMatchZip" class="w-100">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="发货仓库" prop="deliveryWarehouse">
          <wareCascader ref="wc" class="w-100" clearable :props="{multiple: true}" collapse-tags :value.sync="form.deliveryWarehouse" @rendered="rendered" />
        </el-form-item>
        <el-form-item label="发货渠道" prop="deliveryChannel">
          <g-select v-model="form.deliveryChannel" :items="channelList" key-field="id" label-field="fullName" value-field="channelCode" multiple class="w-100" />
        </el-form-item>

        <el-form-item label="匹配优选级" prop="priority">
          <el-input v-model="form.priority" v-input.number.positive.numeric v-input="[1,100]" placeholder="请输入">
            <el-tooltip slot="suffix" effect="light" placement="top-end">
              <div slot="content" style="color: #F56C6C;">
                Note：对平台内不重复，1优先级最高，200最低，<br>
                1-100是用于个平台单独规则；101-200的是ALL和通用规则；
              </div>
              <i class="priority-tip el-icon-question" style="color:#606266;" />
            </el-tooltip>
          </el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"
                    resize="none"
          />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <div class="pb-1 ms-3">发货仓库优先级排序（点击后上下拖拽调整顺序）</div>
        <div class="ms-3 my-1 bg rounded-2 drag-wrap" :class="whcHeight">
          <draggable v-model="whcSort" :move="checkMove" @end="moveEnd">
            <div v-for="(item,i) in whcSort" :key="i" class="p-1">
              <el-tag effect="plain" closable class="w-100 ps-1 d-flex align-items-center justify-content-between" size="small" @close="handleClose(item)">
                <i class="el-icon-sort me-1">{{ item.path }}</i>
              </el-tag>
            </div>
          </draggable>
        </div>
      </el-col>
    </el-row>
    <div class="text-end">
      <el-button size="mini" @click="close(false)">取消</el-button>
      <el-button type="primary" size="mini" @click="submit">确认</el-button>
    </div>
  </el-form>
</template>
<script>
import { baseCountry } from '@/api/packOrders'
import { getPlatformList, getStoreByPlatform, getChannelByServiceArea } from '@/api/common.js'
import { updateRules, getDetails } from '@/api/presuffixResolution'
import wareCascader from '@/views/components/wareCascader/index.vue'
import draggable from 'vuedraggable'

export default {
  name: 'PresuffixModal',
  components: { wareCascader, draggable },
  props: {
    id: String,
    skuAffixTypeList: {
      type: Array,
      default: () => []
    },
    deliveryChannelList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rules: {
        ruleName: [{ required: true, message: '请输入规则名称' }],
        platformCode: [{ required: true, message: '请选择平台' }],
        storeCode: [{ required: true, message: '请选择店铺' }],
        location: [{ required: true, message: '请输入Location' }],
        storeWarehouseCode: [{ required: true, message: '请选择店铺后台仓库名称' }],
        description: [{ required: true, message: '请输入描述' }],
        priority: [{ required: true, message: '请输入匹配优先级' }],
        deliveryWarehouse: [{ required: true, message: '请选择发货仓库' }]
      },
      form: {
        status: 1,
        // divideRule: 1,
        ruleName: '',
        platformCode: [],
        storeCode: [],
        location: '',
        storeWarehouseCode: '',
        deliveryWarehouse: [],
        affixContent: '',
        deliveryChannel: [],
        description: '',
        skuAffixType: '1',
        isVirtual: 0,
        virtualAimCountry: '',
        isMatchStock: true,
        isMatchZip: true,
        priority: ''
      },
      loading: false,
      whcSort: [],
      whcKeyValue: null,
      warehouseWidthId: [],
      platformList: [],
      countryList: [],
      copyCountryList: [],
      storeList: [],
      channelList: [],
      allStore: [],
      isInitData: true
    }
  },
  computed: {
    whcHeight() {
      // const { divideRule, platformCode } = this.form
      // let c = ''
      // if (divideRule === 0) {
      //   c = 'height-510'
      //   if (['WH', 'EB'].includes(platformCode + '')) c = 'height-600'
      // }
      const { platformCode } = this.form
      let c = 'height-510'
      if (['WH', 'EB'].includes(platformCode + '')) c = 'height-600'

      return c
    }
  },
  watch: {
    'form.isVirtual'(val) {
      // !!val || this.$refs.formRef.clearValidate('deliveryWarehouse')
      if (!this.isInitData) {
        this.form.deliveryWarehouse = []
        this.form.virtualAimCountry = ''
      }
      if (val === 1) {
        // this.rules.deliveryWarehouse = [{ required: true, message: '为虚拟仓的必须选择发货仓库' }]
        this.channelList = []
      } else {
        // this.rules.deliveryWarehouse = null
        this.channelList = this.deliveryChannelList
      }
      if (!this.isInitData) this.form.deliveryChannel = []
    },
    'form.deliveryWarehouse'(val, oldVal) {
      if (this.form.isVirtual && val.length > 1) {
        this.$nextTick(() => {
          this.form.deliveryWarehouse = oldVal
        })
        return this.$message.info('虚仓限制选择数量为1。若需要更改已选仓库，请先取消上一个选择。')
      }
      if (this.whcKeyValue !== null) this.getWhcSort(val)
      this.getChannelByServiceArea()
    }
  },
  created() {
    this.getItemList()
    this.channelList = this.deliveryChannelList
    const { id } = this
    if (id) {
      this.loading = true
      getDetails({ id }).then(({ data }) => {
        data.platformCode = JSON.parse(data.platformCode)[0]
        this.getStoreList(data.platformCode)

        Object.keys(this.form).forEach(key => {
          if (key === 'storeCode') {
            if (data[key] === 'ALL') {
              const unwatch = this.$watch('allStore', (val) => {
                if (val.length) {
                  this.form[key] = val
                  unwatch && unwatch()
                }
              }, { immediate: true })
            } else {
              this.form[key] = JSON.parse(data[key])
            }
          } else if (['deliveryChannel'].includes(key)) {
            this.form[key] = JSON.parse(data[key])
          } else this.form[key] = data[key]
        })

        this.form.deliveryWarehouse = (data.warehouseList || []).map(item => item.deliveryWarehouse.split(','))
        this.form.id = id
        this.warehouseWidthId = data.warehouseList
        this.$nextTick(() => {
          this.isInitData = false
        })
      }).finally(() => {
        this.loading = false
      })
    } else this.isInitData = false
  },
  methods: {
    platformChanged(val) {
      if (!this.isInitData) {
        this.form.storeCode = []
        this.form.location = ''
        this.form.storeWarehouseCode = ''
      }
      this.getStoreList(val.value)
    },
    // 自定义搜索国家方法
    filterCountry(val) {
      this.form.virtualAimCountry = val
      if (val) {
        this.countryList = this.copyCountryList.filter(item => item.countryCn.includes(val) || item.countryCode.toUpperCase().includes(val.toUpperCase()))
      } else this.countryList = this.copyCountryList
    },
    getChannelByServiceArea() {
      if (!this.isInitData) this.form.deliveryChannel = []
      const { virtualAimCountry, deliveryWarehouse, isVirtual } = this.form
      if (isVirtual && virtualAimCountry && deliveryWarehouse.length) {
        const data = { virtualWarehouse: 1 }
        data.countryCode = virtualAimCountry
        // data.warehouse = JSON.stringify(deliveryWarehouse.map(item => item[item.length - 1]))
        // 发货仓库改为多选时， 使用上面的注释代码替换data.warehouse。。。。
        data.warehouse = deliveryWarehouse.map(item => item[item.length - 1])[0]
        getChannelByServiceArea(data).then(res => {
          this.channelList = (res.data || []).map(item => {
            item.fullName = item.name + '(' + item.channelCode + ')'
            return item
          })
        })
      }
    },
    getItemList() {
      // 国家list
      baseCountry().then(res => {
        this.countryList = this.copyCountryList = res.data
      })
      // 平台list
      getPlatformList().then(res => {
        this.platformList = (res.data || []).map(item => {
          return {
            label: item.platformName,
            value: item.platformCode
          }
        })
      })
    },
    getStoreList(code) {
      this.allStore = []
      // 根据平台编码获取店铺（wish平台）
      ;(['WH', 'EB'].includes(code)) && getStoreByPlatform(code, undefined, false).then(res => {
        this.storeList = (res.data || []).map(item => {
          this.allStore.push(item.candidateDisplayName)
          return {
            label: item.displayName,
            value: item.candidateDisplayName
          }
        })
      })
    },
    handleClose(tag) {
      this.form.deliveryWarehouse = this.form.deliveryWarehouse.filter(item => item + '' !== tag.id)
    },
    // wareCascader发货仓库列表接口请求成功后
    rendered(list) {
      this.$refs.wc.warehouseList = list.filter(item => item.warehouseCode !== 'VIRTUAL')
      this.whcKeyValue = this.findName(list)
      this.getWhcSort(this.form.deliveryWarehouse)
    },
    // 获取draggable的whcSort
    getWhcSort(val) {
      const mapVal = this.whcKeyValue
      const isAdd = val.length > this.whcSort.length
      const changeArr = val.reduce((pre, cur) => {
        const path = cur.map(item => mapVal[item]).join('/')
        const bool = hasItem(this.whcSort, path)
        if ((!isAdd && bool) || (isAdd && !bool)) {
          pre.push({ id: cur.join(), path })
        }
        return pre
      }, [])

      if (isAdd) this.whcSort.push(...changeArr)
      else this.whcSort = this.whcSort.filter(i => hasItem(changeArr, i.path))

      function hasItem(arr, path) {
        return arr.findIndex(i => i.path === path) > -1
      }
    },
    // 根据发货仓库的tree生成 {key:value}[]
    findName(list = []) {
      const res = {}
      list.forEach(({ warehouseCode, warehouseName, children }) => {
        res[warehouseCode] = warehouseName
        if (children) {
          Object.assign(res, this.findName(children))
        }
      })
      return res
    },
    checkMove(e) {
      e.dragged.classList.add('checked-style')
    },
    moveEnd(e) {
      e.item.classList.remove('checked-style')
    },
    submit() {
      if (this.loading) return
      this.$refs.formRef.validate((bool, obj) => {
        if (!bool) return
        this.loading = true
        const type = this.id === undefined ? 'save' : 'update'
        const { deliveryChannel } = this.form
        const data = { ...this.form, deliveryChannel: JSON.stringify(deliveryChannel) }
        const dw = this.whcSort.reduce((pre, cur) => {
          pre.push(cur.id)
          return pre
        }, [])
        data.warehouseList = dw.map(item => {
          const _item = this.warehouseWidthId.find(_item => _item.deliveryWarehouse === item)
          const id = _item?.id
          return { deliveryWarehouse: item, id }
        })
        data.platformCode = JSON.stringify([data.platformCode])
        data.storeCode = data.storeCode.length && data.storeCode.length === this.allStore.length ? 'ALL' : JSON.stringify(data.storeCode)
        delete data.deliveryWarehouse
        updateRules(data, type).then(res => {
          this.$message.success(res.msg)
          this.close(true)
        }).finally(() => {
          this.loading = false
        })
      })
    },
    close(bool) {
      this.$parent.$emit('close', bool)
    }
  }
}
</script>
<style lang="scss" scoped>
.bg{
  background-color: rgba(236, 245, 255, .2);
}
.drag-wrap{
  height: 420px;
  box-sizing:border-box;
  overflow: auto;
  cursor: default;
  &.height-510{
    height: 510px;
  }
  &.height-600{
    height: 600px;
  }
  .checked-style{
    background-color: rgb(121, 187, 255);
  }
}
</style>
