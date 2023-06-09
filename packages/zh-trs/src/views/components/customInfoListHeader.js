export const headers = [
  { type: 'selection', width: 50, visible: true },
  { slot: true, slotName: 'indexSlot', filter: true, visible: true, label: '序号', width: 115 },
  { slot: true, slotName: 'purchaseIdSlot', group: '采购及产品信息', filter: true, visible: true, label: '采购编码' },
  { slot: true, slotName: 'skuSlot', group: '采购及产品信息', filter: true, visible: true, label: 'SKU编码' },
  { slot: true, slotName: 'contractIdSlot', filter: true, group: '报关单信息', visible: true, label: '合同协议号' },
  { prop: 'declareProductName', label: '申报品名', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'hsCode', label: 'HS编码', group: '采购及产品信息', filter: true, visible: true },
  { slot: true, slotName: 'demandOrderSlot', filter: true, group: '采购及产品信息', visible: true, label: '需求单号' },
  { prop: 'outputWarehouseOrder', label: '出库单号', group: '出库信息', filter: true, visible: true },
  { prop: 'brand', label: '品牌', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'modelNo', label: '型号', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'quantity', label: '数量', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'unitPriceUsd', label: '单价(USD)', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'unit', label: '单位', group: '采购及产品信息', filter: true, visible: true },
  { slot: true, slotName: 'declareCustomsNoSlot', filter: true, visible: true, label: '报关号' },
  { slot: true, slotName: 'exportDateSlot', group: '报关单信息', filter: true, visible: true, label: '出口日期' },
  { prop: 'statusName', label: '状态', filter: true, visible: true },
  { slot: true, slotName: 'handSlot', label: '操作', visible: true },
  { prop: 'createUserName', label: '创建人', filter: true, visible: true, width: 110 },
  { slot: true, slotName: 'updateTimeSlot', filter: true, visible: true, label: '修改时间' },

  // { slot: true, slotName: 'declareCustomsNoSlot', filter: true, visible: true, label: '报关号' },
  // { prop: 'statusName', label: '状态', filter: true, visible: true },
  // { prop: 'createUserName', label: '创建人', filter: true, visible: true, width: 110 },
  // { slot: true, slotName: 'updateTimeSlot', filter: true, visible: true, label: '修改时间' },

  // { slot: true, slotName: 'contractIdSlot', filter: true, group: '报关单信息', visible: true, label: '合同协议号' },
  { prop: 'itemNo', label: '项号', group: '报关单信息', filter: true, visible: false },
  { prop: 'tradeWay', label: '成交方式', group: '报关单信息', filter: true, visible: false },
  // { slot: true, slotName: 'exportDateSlot', group: '报关单信息', filter: true, visible: true, label: '出口日期' },
  { prop: 'overseaConsignee', label: '境外收货人', group: '报关单信息', filter: true, visible: false },
  { prop: 'currency', label: '币制', group: '报关单信息', filter: true, visible: false },
  { prop: 'tradeCountry', label: '贸易国(地区)', group: '报关单信息', filter: true, visible: false },
  { prop: 'arrivalCountry', label: '运抵国(地区)', group: '报关单信息', filter: true, visible: false },
  { prop: 'transportPort', label: '指运港', group: '报关单信息', filter: true, visible: false },
  { prop: 'purposeCountry', label: '最终目的国(地区)', group: '报关单信息', filter: true, visible: false },
  { prop: 'originProductCountry', label: '原产国(地区)', group: '报关单信息', filter: true, visible: false },
  { prop: 'domesticConsignor', label: '境内发货人', group: '报关单信息', filter: true, visible: false },
  { prop: 'exempteNature', label: '征免性质', group: '报关单信息', filter: true, visible: false },
  { prop: 'domesticSupplyPlace', label: '境内货源地', group: '报关单信息', filter: true, visible: false },
  { prop: 'superviseWay', label: '监管方式', group: '报关单信息', filter: true, visible: false },
  { prop: 'packageType', label: '包装种类', group: '报关单信息', filter: true, visible: false },
  { prop: 'produceSaleUnit', label: '生产销售单位', group: '报关单信息', filter: true, visible: false },
  { prop: 'exempte', label: '征免', group: '报关单信息', filter: true, visible: false },
  { prop: 'transportCost', label: '运费', group: '报关单信息', filter: true, visible: false },
  { prop: 'premium', label: '保费', group: '报关单信息', filter: true, visible: false },

  { prop: 'sellerNameCn', label: '卖方名称(中)', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'sellerNameEn', label: '卖方名称(英)', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'sellerAddrCn', label: '卖方地址(中)', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'sellerAddrEn', label: '卖方地址(英)', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'sellerTel', label: '卖方电话', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'sellerFax', label: '卖方传真', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'buyerNameEn', label: '买方名称(英)', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'buyerAddrEn', label: '买方地址(英)', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'shipTo', label: 'SHIPTO', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'buyerTel', label: '买方电话', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'buyerFax', label: '买方传真', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'invoiceBoxBillDate', label: '发票箱单日期', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'contractSignDate', label: '合同签订日期', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'fobExportStartPlace', label: 'FOB出口起运地', group: '报关合同发票箱单信息', filter: true, visible: false },
  { prop: 'arrivalDate', label: '到达日期', group: '报关合同发票箱单信息', filter: true, visible: false },

  // { slot: true, slotName: 'purchaseIdSlot', group: '采购及产品信息', filter: true, visible: true, label: '采购编码' },
  // { prop: 'quantity', label: '数量', group: '采购及产品信息', filter: true, visible: true },
  // { prop: 'unit', label: '单位', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'includeTaxPurchasPrice', label: '含税采购单价', group: '采购及产品信息', filter: true, visible: false },
  { prop: 'exchangeRate', label: '汇率', group: '采购及产品信息', filter: true, visible: false },
  { prop: 'singleWeight', label: '产品单个净重(g)', group: '采购及产品信息', filter: true, visible: false },
  { prop: 'netWeight', label: '净重(Kg)', group: '采购及产品信息', filter: true, visible: false },
  { prop: 'incomeRateStr', label: '进项税率', group: '采购及产品信息', filter: true, visible: false },
  // { prop: 'unitPriceUsd', label: '单价(USD)', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'totalPriceUsd', label: '总价(USD)', group: '采购及产品信息', filter: true, visible: false },
  // { prop: 'demandOrder', label: '需求单号', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'purchasePeople', label: '采购员', group: '采购及产品信息', filter: true, visible: false },
  // { slot: true, slotName: 'skuSlot', group: '采购及产品信息', filter: true, visible: true, label: 'SKU编码' },
  // { prop: 'declareProductName', label: '申报品名', group: '采购及产品信息', filter: true, visible: true },
  // { prop: 'brand', label: '品牌', group: '采购及产品信息', filter: true, visible: true },
  // { prop: 'modelNo', label: '型号', group: '采购及产品信息', filter: true, visible: true },
  // { prop: 'hsCode', label: 'HS编码', group: '采购及产品信息', filter: true, visible: true },
  { prop: 'rebateRateStr', label: '退税率', group: '采购及产品信息', filter: true, visible: false },
  { prop: 'supplierFullName', label: '供应商全称', group: '采购及产品信息', filter: true, visible: false },
  { prop: 'declareElement', label: '申报要素', group: '采购及产品信息', filter: true, visible: false },

  { prop: 'packageQuantity', label: '件数', group: '出库信息', filter: true, visible: false },
  { prop: 'grossWeight', label: '毛重(Kg)', group: '出库信息', filter: true, visible: false },
  { prop: 'transport', label: '运输方式', group: '出库信息', filter: true, visible: false },
  { prop: 'targetWarehouse', label: '目的仓', group: '出库信息', filter: true, visible: false },
  // { prop: 'outputWarehouseOrder', label: '出库单号', group: '出库信息', filter: true, visible: true },
  { prop: 'goodsCode', label: '货件编号', group: '出库信息', filter: true, visible: false },
  { prop: 'freightForwardCompany', label: '货代公司', group: '出库信息', filter: true, visible: false },
  { prop: 'logisticsSpecialist', label: '物流专员', group: '出库信息', filter: true, visible: false },

  { prop: 'declareCustomsNo', label: '报关单号', group: '退税登记信息', filter: true, visible: false },
  { prop: 'declareDate', label: '申报日期', group: '退税登记信息', filter: true, visible: false },
  { prop: 'declarePort', label: '申报口岸', group: '退税登记信息', filter: true, visible: false },
  { prop: 'departurePort', label: '离境口岸', group: '退税登记信息', filter: true, visible: false },
  { prop: 'exitGate', label: '出境关别', group: '退税登记信息', filter: true, visible: false },
  { prop: 'flightNo', label: '航次号', group: '退税登记信息', filter: true, visible: false },
  { prop: 'ladeTransportNo', label: '提运单号', group: '退税登记信息', filter: true, visible: false },
  { prop: 'declareCustomsCompany', label: '报关公司单位', group: '退税登记信息', filter: true, visible: false },
  { prop: 'transportToolName', label: '运输工具名称', group: '退税登记信息', filter: true, visible: false },
  { prop: 'predictArrivalTime', label: '预计到港时间', group: '退税登记信息', filter: true, visible: false },
  { prop: 'licenseKey', label: '许可证号', group: '退税登记信息', filter: true, visible: false },
  { prop: 'attdocumentsNo', label: '随附单证及编号', group: '退税登记信息', filter: true, visible: false },
  { prop: 'marksRemark', label: '标记唛码及备注', group: '退税登记信息', filter: true, visible: false },
  { prop: 'predictRerateRmb', label: '预测退税金额(RMB)', group: '退税登记信息', filter: true, visible: false },

  { prop: 'auditDate', label: '审核日期', group: '操作日志', filter: true, visible: false },
  { prop: 'forecastDate', label: '预报日期', group: '操作日志', filter: true, visible: false },
  { prop: 'reviewDate', label: '复核日期', group: '操作日志', filter: true, visible: false },
  { prop: 'declareCustomsDate', label: '报关日期', group: '操作日志', filter: true, visible: false },
  { prop: 'preTaxRebateDate', label: '预退税日期', group: '操作日志', filter: true, visible: false }

  // { slot: true, slotName: 'handSlot', label: '操作', visible: true }
]
