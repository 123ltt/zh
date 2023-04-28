<template>
  <el-select v-if="col.type==='select'" v-model="model[col.prop]" size="mini" class="w-100" v-bind="col.attrs" v-on="col.events">
    <el-option
      v-for="item in col.items"
      :key="item[col.valueField||'value']"
      :label="item[col.labelField||'label']"
      :value="item[col.valueField||'value']"
    />
  </el-select>
  <g-select v-else-if="col.type==='GSelect'" v-model="model[col.prop]" :items="col.items" v-bind="col.attrs" v-on="col.events" />

  <el-time-select
    v-else-if="col.type==='timeselect'"
    v-model="model[col.prop]"
    size="mini"
    class="w-100"
    v-bind="col.attrs"
    v-on="col.events"
  />

  <el-time-picker
    v-else-if="col.type==='timepicker'"
    v-model="model[col.prop]"
    size="mini"
    class="w-100"
    :type="col.type"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    v-bind="col.attrs"
    v-on="col.events"
  />

  <el-date-picker
    v-else-if="['date','daterange','datetime','datetimerange'].includes(col.type)"
    v-model="model[col.prop]"
    size="mini"
    class="w-100"
    :type="col.type"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :value-format="col.attrs&&col.attrs.valueFormat||'yyyy-MM-dd HH:mm:ss'"
    v-bind="col.attrs"
    v-on="col.events"
  />

  <el-switch
    v-else-if="col.type==='switch'"
    v-model="model[col.prop]"
    v-bind="col.attrs"
    v-on="col.events"
  />

  <el-input v-else-if="col.type==='text'||col.type==='textarea'" v-model="model[col.prop]" :type="col.type" size="mini" v-bind="col.attrs" v-on="col.events" />
  <g-multiple-input v-else-if="col.type==='GMultipleInput'" v-model="model[col.prop]" v-bind="col.attrs" v-on="col.events" />

  <el-checkbox-group v-else-if="col.type==='checkbox'" v-model="model[col.prop]" v-bind="col.attrs" v-on="col.events">
    <el-checkbox v-for="item in col.items"
                 :key="item[col.valueField||'value']"
                 :label="item[col.valueField||'value']"
    >{{ item[col.labelField||'label'] }}</el-checkbox>
  </el-checkbox-group>

  <el-radio-group v-else-if="col.type==='radio'" v-model="model[col.prop]" class="radio-group" v-bind="col.attrs" v-on="col.events">
    <el-radio v-for="item in col.items"
              :key="item[col.valueField||'value']"
              :label="item[col.valueField||'value']"
    >{{ item[col.labelField||'label'] }}</el-radio>
  </el-radio-group>
</template>
<script>
export default {
  name: 'FormItem',
  props: {
    col: {
      type: Object,
      default: () => ({})
    },
    model: Object
  }
}
</script>
