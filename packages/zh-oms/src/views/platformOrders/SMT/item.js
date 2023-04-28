export default [
  {
    title: '订单信息',
    items: [
      { label: '销售平台', prop: 'platformCode', value: '速卖通' },
      { label: '平台单号', prop: 'platOrderId' },
      { label: 'OMS单号', prop: 'omOrderId', path: 'oms/orderManagement/details' },
      { label: '订单来源', prop: 'orderTypeName' },
      { label: '销售店铺', prop: 'storeName' },
      { label: '平台订单状态', prop: 'orderStatus' },
      { label: 'OMS订单状态', prop: 'omOrderStatus' }
    ]
  },
  {
    title: '费用详情',
    items: [
      { label: '订单总金额', prop: 'orderAmount', isPrice: true },
      { label: '平台交易费', prop: 'platformTradeAmount', isPrice: true },
      { label: '买家实付金额', prop: 'paymentAmount', isPrice: true },
      { label: '卖家实收金额（除税）', prop: 'sellerIncomeAmount', labelWidth: '120px', isPrice: true },
      { label: '平台优惠金额', prop: 'platPreferential', isPrice: true },
      { label: '卖家优惠金额', prop: 'promotionDiscountTotal', isPrice: true },
      { label: '税费', prop: 'taxAmount', isPrice: true },
      { label: '客付运费', prop: 'freightChargesAmount', labelWidth: '120px', isPrice: true },
      { label: '调整金额', prop: 'decimal', isPrice: true },
      { label: '交易号', prop: 'transaction_id' },
      { label: '付款方式', prop: 'paymentType' }
    ]
  },
  {
    title: '收货地址',
    items: [
      { label: '收件人', prop: 'contactPerson' },
      { label: '国家', prop: 'countryName' },
      { label: '省/州', prop: 'province' },
      { label: '城市', prop: 'city' },
      { label: '移动电话', prop: 'mobileNo' },
      { label: '固定电话', prop: 'phoneNumber' },
      { label: '邮编', prop: 'zip' },
      { label: '买家邮箱', prop: 'buyerEmail', value: '' },
      { label: '地址一', prop: 'address1' },
      { label: '地址二', prop: 'address2' }
    ]
  },
  {
    title: '物流信息',
    items: [
      { label: '客选物流', prop: 'guestChooseFreight' },
      { label: '平台物流渠道', prop: 'logisticsChannel' },
      { label: '跟踪号1', prop: 'trackingNumber1' },
      { label: '跟踪号2', prop: 'trackingNumber2' }
    ]
  },
  {
    title: '时间信息',
    items: [
      { label: '订单创建时间', prop: 'purchaseDate' },
      { label: '订单付款时间', prop: 'payTime' },
      { label: '抓单时间', prop: 'firstGrabDate' },
      { label: '平台订单最后更新时间', prop: 'lastUpdateDate', labelWidth: '120px' },
      { label: '标记时间', prop: 'omsMarkDate' },
      { label: '实际发货时间', prop: 'deliverDate' }
    ]
  },
  {
    title: '商品信息',
    type: 'table',
    key: 'goods',
    items: [
      { label: '商品图片', prop: 'productImgUrl', type: 'image', width: 80 },
      {
        label: '商品信息',
        type: 'table',
        width: 200,
        itemData: [
          { label: '在线SKU', prop: 'sellerSku', labelWidth: '50px', type: 'text' },
          { label: '商品名称', prop: 'productName', labelWidth: '50px', type: 'text' },
          { label: 'ItemID', prop: 'productId', labelWidth: '50px', type: 'text' }
        ]
      },
      { label: '单价', prop: 'productUnitPrice', type: 'money', width: 130 },
      { label: '数量', prop: 'productCount', type: 'text', width: 120 },
      { label: '销售金额', prop: 'productAmount', type: 'money', width: 120 }
    ]
  }
]
