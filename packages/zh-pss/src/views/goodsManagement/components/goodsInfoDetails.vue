<template>
  <basic-container>
    <div class="openBox">
      <div v-loading="loading" class="fubox">
        <header class="header">
          <p class="title">商品信息详情</p>
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
              <el-form size="mini" label-width="100px" class="no-message">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="供应商名称:">
                      <el-input :value="detail.supplierName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品类目:">
                      <el-input :value="detail.category" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品名称:">
                      <el-input :value="detail.goodsName" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="商品链接:">
                      <el-tooltip effect="dark" :content="detail.goodsUrl" placement="top">
                        <p class="urlClass" @click="getUrl">{{ detail.goodsUrl }}</p>
                      </el-tooltip>
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
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="商品毛重(kg):">
                      <el-input :value="detail.goodsWeight" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品产地:">
                      <el-input :value="detail.goodsPlace" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="尺寸(CM):">
                      <span class="content"> 长: {{ detail.goodsLength }} 宽: {{ detail.goodsWidth }} 高: {{ detail.goodsHeight }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="是否带包装:">
                      <el-input :value="packagedType" disabled />
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
              <span>商品信息</span>
            </div>
            <section class="imgList">
              <ul class="imgBox">
                <li v-for="(item,index) in imgList" :key="index">
                  <el-image
                    :src="item.link"
                    :preview-src-list="[item.link]"
                    style="width: 140px; height: 100px;border: 1px solid #ccc;"
                  />
                </li>
              </ul>
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
                class="g-table"
                size="mini"
                style="width: 100%"
                border
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
import { getDetail } from '@/api/goodsManagement/goodsInfo.js'
export default {
  name: 'GoodsInfoDetails',
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
      imgList: [],
      recordData: [],
      loading: false,
      packagedType: ''
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
        this.detail.supplierFileVO.forEach(item => {
          this.imgList.push({ link: item.link })
        })
        if (this.detail.isPackaged === 1) {
          this.packagedType = '是'
        } else if (this.detail.isPackaged === 2) {
          this.packagedType = '否'
        }
        this.recordData = this.detail.supplierGoodsHisVOList
        this.loading = false
      })
    },
    getUrl() {
      window.open(this.detailData.goodsUrl, '_blank')
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
                    align-content: space-between;
                    li{
                        list-style: none;
                        margin-right: 10px;
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

.urlClass{
  margin: 0;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  cursor: pointer;
}

</style>
