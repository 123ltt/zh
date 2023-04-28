<template>
  <basic-container>
    <div class="openBox">
      <div v-loading="loading" class="fubox">
        <header class="header">
          <p class="title">商品报价详情</p>
          <div
            @click="doclose()"
          >
            <el-button
              size="mini"
              type="primary"
            >返回</el-button>
          </div>
        </header>
        <main class="main">
          <el-card>
            <div slot="header">
              <span>基本信息</span>
            </div>
            <section class="basic">
              <el-form size="mini" label-width="90px" class="no-message">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="供应商名称:">
                      <el-input :value="detail.supplierName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品名称:">
                      <el-input :value="detail.goodsName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品类目:">
                      <el-input :value="detail.category" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品编号:">
                      <el-input :value="detail.goodsCode" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品品牌:">
                      <el-input :value="detail.goodsBrand" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="是否含税:">
                      <el-input :value="detail.taxDesc" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品报价:">
                      <el-input :value="detail.price" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="报价币种:">
                      <el-input :value="detail.currencyDesc" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="创建人:">
                      <el-input :value="detail.createUserName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="创建时间:">
                      <el-input :value="detail.createTime" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最后修改人:">
                      <el-input :value="detail.updateUserName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最后修改时间:">
                      <el-input :value="detail.updateTime" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </section>
          </el-card>
          <el-card>
            <div slot="header">
              <span>操作记录</span>
            </div>
            <section class="record">
              <el-table
                :data="recordData"
                max-height="400px"
                stripe
                style="width: 100%"
                border
                class="g-table"
                size="mini"
              >
                <el-table-column
                  prop="updateUserName"
                  label="操作人"
                  align="center"
                  min-width="100"
                />
                <el-table-column
                  prop="updateTime"
                  label="操作时间"
                  align="center"
                  min-width="150"
                />
                <el-table-column
                  prop="record"
                  label="操作记录"
                  align="center"
                  min-width="300"
                  show-overflow-tooltip
                />
              </el-table>
            </section>
          </el-card>
        </main>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/goodsManagement/goodsAuotation.js'
export default {
  name: 'GoodsAuotationDetail',
  props: {
    detailData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      detail: {},
      recordData: [],
      loading: false
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        const data = res.data
        this.detail = data
        if (this.detail.goodsBrand === '') {
          this.detail.goodsBrand = '无'
        }
        if (this.detail.itemName === '') {
          this.detail.itemName = '无'
        }
        this.recordData = this.detail.supplierGoodsPriceHisVOList
        this.loading = false
      })
    },
    doclose() {
      this.$emit('close')
      this.close()
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
    box-sizing: border-box;
}
.openBox{
    width: 100%;
    // height: 600px;
    overflow: auto;
    .fubox{
        .header {
        box-sizing: border-box;
        padding: 0 20px;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #cccccc;
        .title {
            font-size: 14px;
        }
        }
        .main {
        width: 100%;
        padding-top: 20px;
        padding-right: 20px;
            .mainHeader{
                width: 100%;
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
                background-color: #409eff;
                color: #fff;
            }
            .basic{
                width: 100%;
                // padding:20px ;
                overflow: hidden;
                span{
                    display: inline-block;
                }
                .introduce{
                    width: 120px;
                }
                .content{
                    img{
                        width: 300px;
                        height: 200px;
                    }
                }
            }
            .record{
                // padding: 20px;
                    ::v-deep .el-table td, .el-table th{
                    padding: 5px 0;
                }
            }
            .imgList{
                // padding: 20px;
                .imgBox{
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-content: space-between;
                    li{
                        list-style: none;
                    }
                }
            }
        }
        .footer {
        text-align: center;
        //   margin-top: 30px;
        padding-bottom: 40px;
        }
    }
}
</style>
