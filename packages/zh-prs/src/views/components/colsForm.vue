<template>
  <el-form ref="formRef" size="mini" :model="formInfo" :label-width="labelWidth" class="form-col" :class="{'no-message':!messageStyle}">
    <el-row>
      <el-col v-for="(item,index) in formItem" :key="item.prop" :span="24/cols">
        <el-form-item
          v-if="item.type!=='slot'"
          :prop="item.prop"
          :label="item.label"
          :rules="item.rules"
          :style="{width:item.formWidth}"
        >
          <el-input v-if="item.type==='input'"
                    v-model.trim="formInfo[item.prop]"
                    class="small"
                    :style="{width:item.width}"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder||`请输入${item.label}`"
                    clearable
                    v-bind="item.attrs"
                    v-on="item.events"
          />
          <el-radio-group v-if="item.type==='radio'" v-model="formInfo[item.prop]">
            <el-radio-button v-for="radioItem in itemOptions" :key="radioItem.prop" :label="radioItem.prop" />
          </el-radio-group>
          <el-date-picker
            v-if="item.type==='datePicker'"
            v-model="formInfo[item.prop]"
            :type="item.dateType||'daterange'"
            :value-format="item.valueFormat||'yyyy-MM-dd HH:mm:ss'"
            range-separator="至"
            :start-placeholder="'开始日期'"
            :end-placeholder="'结束日期'"
            v-bind="item.attrs"
            v-on="item.events"
          />
          <el-input
            v-if="item.type === 'textarea'"
            v-model.trim="formInfo[item.prop]"
            type="textarea"
            :style="{ width: item.width }"
            :disabled="item.disabled"
            v-bind="item.attrs"
            :placeholder="item.placeholder||`请输入${item.label}`"
            v-on="item.events"
          />
          <el-input-number
            v-if="item.type === 'inputNumber'"
            v-model="formInfo[item.prop]"
            controls-position="right"
            :min="item.min || 0"
            :max="item.max || 10000"
            :placeholder="item.placeholder||`请输入${item.label}`"
          />
          <el-select v-if="item.type==='select'"
                     v-model.trim="formInfo[item.prop]"
                     filterable
                     clearable
                     :placeholder="item.placeholder||`请选择${item.label}`"
                     :style="{ width: item.width }"
                     :disabled="item.disabled"
                     v-bind="item.attrs"
                     v-on="item.events"
          >
            <!-- 默认是用业务字典dictKey dicValue格式 -->
            <el-option v-for="selectItem in item.options" :key="selectItem[item.optionValue]||selectItem.dictKey||selectItem.key" :value="selectItem[item.optionValue]||selectItem.dictKey||selectItem.key" :label="selectItem[item.optionLabel]||selectItem.dictValue||selectItem.value" />
          </el-select>
          <!-- 当数据格式[value1,value2] -->
          <el-select v-if="item.type==='bselect'"
                     v-model.trim="formInfo[item.prop]"
                     filterable
                     clearable
                     :placeholder="item.placeholder||`请选择${item.label}`"
                     :style="{ width: item.width }"
                     :disabled="item.disabled"
                     v-bind="item.attrs"
                     v-on="item.events"
          >
            <el-option v-for="selectItem in item.options" :key="selectItem" :value="selectItem" :label="selectItem" />
          </el-select>
          <!-- 数据量比较大使用 -->
          <g-select v-if="item.type==='gselect'"
                    v-model="formInfo[item.prop]"
                    :items="item.options"
                    :key-field="item.optionValue||'key'"
                    :value-field="item.optionValue||'key'"
                    :label-field="item.optionLabel||'value'"
                    :placeholder="item.placeholder||`请选择${item.label}`"
                    v-bind="item.attrs"
                    v-on="item.events"
          />
          <!-- 分页加载下拉框 -->
          <remote-select v-if="item.type==='rselect'" v-model="formInfo[item.prop]" :fetch="item.fetch" :prop="item.prop" :option-value="item.optionValue" :option-label="item.optionLabel" v-bind="item.attrs" v-on="item.events" />
          <!-- 最后一项如果是slot就不显示 -->
          <template v-if="formItem.length===index+1&&item.type!=='slot'">
            <el-button v-for="itemHandle in formHandler" :key="itemHandle.label" :type="itemHandle.type||'primary'" :icon="itemHandle.icon" @click="itemHandle.handler&&itemHandle.handler()">{{ itemHandle.label }}</el-button>
          </template>
        </el-form-item>
        <!-- 垂直列表按钮 -->
        <slot v-else :name="item.slotName" />
        <el-form-item v-if="formItem.length===index+1">
          <el-button v-for="itemHandle in formHandlerPre" :key="itemHandle.label" :type="itemHandle.type||'primary'" @click="itemHandle.handler&&itemHandle.handler()">{{ itemHandle.label }}</el-button>
        </el-form-item>
        <!-- 信息提示 -->
        <slot v-if="formItem.length===index+1" name="tips" />
      </el-col>
    </el-row>

  </el-form>
</template>
<script>
import remoteSelect from './remoteSelect'
export default {
  name: 'ColsForm',
  provide: {
    colsForm: this
  },
  components: { remoteSelect },
  props: {
    // 默认是no-message样式
    messageStyle: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    cols: {
      type: Number,
      default: 2
    },
    formInfo: {
      type: Object,
      default: () => ({})
    },
    formItem: {
      type: Array,
      default: () => []
    },
    formHandler: {
      type: Array,
      default: () => []
    },
    formHandlerPre: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      type_msg: {

        input: '请输入',
        inputNumber: '请输入',
        radio: '请选择',
        select: '请选择',
        gselect: '请选择',
        bselect: '请选择',
        upload: '请上传'
      }
    }
  },
  computed: {
    colsForm() {
      return this.$refs.formRef
    }
  },
  watch: {
    formItem: {
      handler(newValue) {
        this.initformInfo()
      },
      immediate: true
    }
  },
  methods: {
    filterData(data, headers = []) {
      if (Object.prototype.toString.call(data) === '[object Object]') {
        throw new Error('请传入数组')
      } else {
        data.length && data.forEach(item => {
          for (const i in item) {
            if (item[i] === '' || item[i] === null) {
              item[i] = '--'
            }
            var bool = item[i].toString().indexOf('.')
            if (!isNaN(item[i]) && bool !== -1) {
              item[i] = Number(item[i])
              // item[i] = Number(item[i]).toFixed(2)
            }
          }
          // 如果返回的数据没有heades对应项就默认设置--
          headers.forEach(ele => {
            item[ele.prop] ?? (item[ele.prop] = '--')
          })
        })
      }
    },
    resetForm() {
      this.$refs.formRef.resetFields()
    },
    initformInfo() {
      this.formItem.forEach(item => {
        // rules 规则
        if (item.required) { this.rules(item) }
        // 自定义检验规则
        if (item.validator) { item.rules = item.validator }
      })
    },
    rules(item) {
      const requiredRules = [{ required: true, message: item.required_msg || `${this.type_msg[item.type]}${item.label}`, trigger: 'blur' }]
      // 其他的 rules 规则
      if (item.rules && item.rules.length > 0) {
        item.rules = requiredRules.concat(item.rules)
      } else {
        item.rules = requiredRules
      }
    }

  }

}
</script>

<style scoped lang="scss">
$colsWidth:245px;
.small{
  width:$colsWidth;
}
.g-select {
 width:$colsWidth;
}
.el-select{
  width:$colsWidth;
}
.el-date-editor--daterange.el-input__inner,.el-date-editor--monthrange.el-input__inner{
   width: $colsWidth;
 }
.el-textarea{
   width: $colsWidth
};

</style>
