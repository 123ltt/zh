<template>
  <el-form-item
    :prop="'skuList.' + index + '.multiAttrValue.' + i + '.value'"
    :rules="attr.multiAttrKey?{required: true, validator: validAttr(row, index, i), trigger: 'blur'}:{required: false}"
    class="el-form-item_no-lable"
  >
    <template v-if="row.multiAttrValue[i] && row.multiAttrValue[i].children">
      <div v-for="(child, cIndex) in row.multiAttrValue[i].children" :key="cIndex">
        <el-row v-if="!child.enums">
          <el-col :span="24">
            <el-input v-if="child.type === 'string'"
                      v-model="child.value"
                      size="mini"
                      :placeholder="child.title"
                      @change="mulValChange(child.value, index, i)"
            />
          </el-col>
          <el-col :span="24">
            <!-- 只能输整数 -->
            <el-input v-if="child.type === 'integer'"
                      v-model="child.value"
                      v-input.positive.numeric
                      size="mini"
                      :placeholder="child.title"
                      @change="mulValChange(child.value, index, i)"
            />
          </el-col>
          <el-col :span="24">
            <!-- 可输数字（包含小数） -->
            <el-input v-if="child.type === 'number'"
                      v-model="child.value"
                      v-input.positive
                      size="mini"
                      :placeholder="child.title"
                      @change="mulValChange(child.value, index, i)"
            />
          </el-col>
          <!-- 多输 -->
          <template v-if="child.type === 'array'">
            <span v-for="(tItem, tIndex) in child.value" :key="tIndex">
              <el-col :span="17">
                <el-input v-model="child.value[tIndex]" size="mini" :placeholder="child.title" @change="mulValChange(tItem, index, i)" />
              </el-col>
              <el-col :span="6" class="plus-minus">
                <el-button v-if="tIndex === 0" size="mini" icon="el-icon-plus" class="icon-btn" @click="addAttr(index,i)" />
                <el-button v-if="tIndex > 0" size="mini" icon="el-icon-minus" class="icon-btn" @click="removeAttr(index,i,tIndex)" />
              </el-col>
            </span>
          </template>
        </el-row>
        <el-select v-if="child.enums && ['string', 'array'].includes(child.type)"
                   v-model="child.value"
                   :multiple="Boolean(child.type === 'array')"
                   size="mini"
                   filterable
                   :placeholder="child.title"
                   @change="mulValChange(child.value, index, i)"
        >
          <el-option v-for="(v, j) in JSON.parse(child.enums)" :key="j" :label="v" :value="v" />
        </el-select>
      </div>
    </template>
    <template v-else>
      <el-row v-if="row.multiAttrValue[i] && !row.multiAttrValue[i].enums">
        <el-col :span="24">
          <el-input v-if="row.multiAttrValue[i].type === 'string'"
                    v-model="row.multiAttrValue[i].value"
                    size="mini"
                    @change="mulValChange(row.multiAttrValue[i].value, index, i)"
          />
        </el-col>
        <el-col :span="24">
          <!-- 只能输整数 -->
          <el-input v-if="row.multiAttrValue[i].type === 'integer'"
                    v-model="row.multiAttrValue[i].value"
                    v-input.positive.numeric
                    size="mini"
                    @change="mulValChange(row.multiAttrValue[i].value, index, i)"
          />
        </el-col>
        <el-col :span="24">
          <!-- 可输数字（包含小数） -->
          <el-input v-if="row.multiAttrValue[i].type === 'number'"
                    v-model="row.multiAttrValue[i].value"
                    v-input.positive
                    size="mini"
                    @change="mulValChange(row.multiAttrValue[i].value, index, i)"
          />
        </el-col>
        <!-- 多输 -->
        <template v-if="row.multiAttrValue[i].type === 'array'">
          <span v-for="(tItem, tIndex) in row.multiAttrValue[i].value" :key="tIndex">
            <el-col :span="17">
              <el-input v-model="row.multiAttrValue[i].value[tIndex]" size="mini" @change="mulValChange(tItem, index, i)" />
            </el-col>
            <el-col :span="6" class="plus-minus">
              <el-button v-if="tIndex === 0" size="mini" icon="el-icon-plus" class="icon-btn" @click="addAttr(index,i)" />
              <el-button v-if="tIndex > 0" size="mini" icon="el-icon-minus" class="icon-btn" @click="removeAttr(index,i,tIndex)" />
            </el-col>
          </span>
        </template>
      </el-row>
      <el-select v-if="row.multiAttrValue[i] && row.multiAttrValue[i].enums && ['string', 'array'].includes(row.multiAttrValue[i].type)"
                 v-model="row.multiAttrValue[i].value"
                 :multiple="Boolean(row.multiAttrValue[i].type === 'array')"
                 size="mini"
                 filterable
                 @change="mulValChange(row.multiAttrValue[i].value, index, i)"
      >
        <el-option v-for="(v, j) in JSON.parse(row.multiAttrValue[i].enums)" :key="j" :label="v" :value="v" />
      </el-select>
    </template>
  </el-form-item>
</template>

<script>
export default {
  name: 'DynamicForm',
  props: {
    row: Object,
    index: Number,
    i: Number,
    attr: Object,
    skuList: Array
  },
  methods: {
    validAttr(row, index, i) {
      return (rule, value, callback) => {
        const attr = row.multiAttrValue[i]
        const mulSel = attr.type === 'array' && attr.enums && !attr.value.length // 多选
        const mulInput = attr.type === 'array' && !attr.enums && !attr.value[0] // 多输
        const str = attr.type !== 'object' && !attr.value
        const obj = attr.type === 'object' && attr.children.some(its => !its.value) // 子属性
        if (mulSel || mulInput || str || obj) {
          callback(new Error('属性不能为空'))
        } else {
          callback()
        }
      }
    },
    // 多属性有值取消校验
    mulValChange(value, index, i) {
      value && this.$emit('dynamicChange', value, index, i)
    },
    addAttr(index, i) {
      this.skuList[index].multiAttrValue[i].value.push('')
      this.$emit('update:skuList', this.skuList)
    },
    removeAttr(index, i, tIndex) {
      this.skuList[index].multiAttrValue[i].value.splice(tIndex, 1)
      this.$emit('update:skuList', this.skuList)
    }
  }
}
</script>
