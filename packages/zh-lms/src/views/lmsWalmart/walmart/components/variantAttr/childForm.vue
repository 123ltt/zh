<template>
  <el-form-item
    :rules="{required: true, message: '属性不能为空', trigger: 'blur'}"
    class="el-form-item_no-lable"
  >
    <template v-if="cItem.children">
      <div v-for="(child, chIndex) in cItem.children" :key="chIndex">
        <el-row v-if="!child.enums">
          <el-col :span="24">
            <el-input v-if="child.type === 'string'"
                      v-model="child.value"
                      size="mini"
                      clearable
                      :placeholder="child.title"
                      @change="mulValChange(child.value)"
            />
          </el-col>
          <el-col :span="24">
            <!-- 只能输整数 -->
            <el-input v-if="child.type === 'integer'"
                      v-model="child.value"
                      v-input.positive.numeric
                      size="mini"
                      clearable
                      :placeholder="child.title"
                      @change="mulValChange(child.value)"
            />
          </el-col>
          <el-col :span="24">
            <!-- 可输数字（包含小数） -->
            <el-input v-if="child.type === 'number'"
                      v-model="child.value"
                      v-input.positive
                      size="mini"
                      clearable
                      :placeholder="child.title"
                      @change="mulValChange(child.value)"
            />
          </el-col>
          <!-- 多输 -->
          <template v-if="child.type === 'array'">
            <span v-for="(tItem, tIndex) in child.value" :key="tIndex">
              <el-col :span="17">
                <el-input v-model="child.value[tIndex]" size="mini" :placeholder="child.title" clearable @change="mulValChange(tItem)" />
              </el-col>
              <el-col :span="6" class="plus-minus">
                <el-button v-if="tIndex === 0" size="mini" icon="el-icon-plus" class="icon-btn" @click="addAttr(index,cIndex)" />
                <el-button v-if="tIndex > 0" size="mini" icon="el-icon-minus" class="icon-btn" @click="removeAttr(index,cIndex,tIndex)" />
              </el-col>
            </span>
          </template>
        </el-row>
        <el-select v-if="child.enums && ['string', 'array'].includes(child.type)"
                   v-model="child.value"
                   :multiple="Boolean(child.type === 'array')"
                   size="mini"
                   filterable
                   clearable
                   :placeholder="child.title"
                   @change="mulValChange(child.value)"
        >
          <el-option v-for="(v, j) in JSON.parse(child.enums)" :key="j" :label="v" :value="v" />
        </el-select>
      </div>
    </template>
    <template v-else>
      <el-row v-if="!cItem.enums">
        <el-col :span="24">
          <el-input v-if="cItem.type === 'string'"
                    v-model="row.childValue[cIndex].value"
                    size="mini"
                    clearable
                    @change="mulValChange(row.childValue)"
          />
        </el-col>
        <el-col :span="24">
          <!-- 只能输整数 -->
          <el-input v-if="cItem.type === 'integer'"
                    v-model="row.childValue[cIndex].value"
                    v-input.positive.numeric
                    size="mini"
                    clearable
                    @change="mulValChange(row.childValue)"
          />
        </el-col>
        <el-col :span="24">
          <!-- 可输数字（包含小数） -->
          <el-input v-if="cItem.type === 'number'"
                    v-model="row.childValue[cIndex].value"
                    v-input.positive
                    size="mini"
                    clearable
                    @change="mulValChange(row.childValue)"
          />
        </el-col>
        <!-- 多输 -->
        <template v-if="cItem.type === 'array'">
          <span v-for="(tItem, tIndex) in row.childValue[cIndex].value" :key="tIndex">
            <el-col :span="17">
              <el-input v-model="row.childValue[cIndex].value[tIndex]" size="mini" clearable @change="mulValChange(tItem)" />
            </el-col>
            <el-col :span="6" class="plus-minus">
              <el-button v-if="tIndex === 0" size="mini" icon="el-icon-plus" class="icon-btn" @click="addAttr(index,cIndex)" />
              <el-button v-if="tIndex > 0" size="mini" icon="el-icon-minus" class="icon-btn" @click="removeAttr(index,cIndex,tIndex)" />
            </el-col>
          </span>
        </template>
      </el-row>
      <el-select v-if="cItem.enums && ['string', 'array'].includes(cItem.type)"
                 v-model="row.childValue[cIndex].value"
                 :multiple="Boolean(cItem.type === 'array')"
                 size="mini"
                 filterable
                 clearable
                 @change="mulValChange(cItem.value)"
      >
        <el-option v-for="(v, j) in JSON.parse(cItem.enums)" :key="j" :label="v" :value="v" />
      </el-select>
    </template>
  </el-form-item>
</template>

<script>
export default {
  name: 'ChildForm',
  props: {
    row: Object,
    index: Number,
    cIndex: Number,
    cItem: Object,
    skuList: Array
  },
  methods: {
    // 多属性有值取消校验
    mulValChange(value) {
      value && this.$emit('childFormChange', value)
    },
    addAttr(index, i) {
      this.skuList[index].childValue[i].value.push('')
      this.$emit('update:skuList', this.skuList)
    },
    removeAttr(index, i, tIndex) {
      this.skuList[index].childValue[i].value.splice(tIndex, 1)
      this.$emit('update:skuList', this.skuList)
    }
  }
}
</script>
