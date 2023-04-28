// 条件数据
export default [
  {
    ruleTypes: [1],
    field: 'channelCode',
    dbField: 'channel_code',
    fieldName: '物流渠道',
    opList: [{ type: 'equal', name: '等于', dbkeyword: '=' }, { type: 'notequal', name: '不等于', dbkeyword: '!=' }, { type: 'in', name: '包含', dbkeyword: 'IN' }, { type: 'notin', name: '不包含', dbkeyword: 'NOT IN' }],
    inputType: 3
  },
  {
    ruleTypes: [1],
    field: 'total_amount',
    dbField: 'total_amount',
    fieldName: '总金额',
    opList: [{ type: 'equal', name: '等于', dbkeyword: '=' }, { type: 'notequal', name: '不等于', dbkeyword: '!=' }, { type: 'in', name: '包含', dbkeyword: 'IN' }, { type: 'notin', name: '不包含', dbkeyword: 'NOT IN' }],
    inputType: 5
  },
  {
    ruleTypes: [1],
    field: 'warehouseCode',
    dbField: 'warehouse_code',
    fieldName: '仓库',
    opList: [{ type: 'equal', name: '等于', dbkeyword: '=' }, { type: 'notequal', name: '不等于', dbkeyword: '!=' }, { type: 'in', name: '包含', dbkeyword: 'IN' }, { type: 'notin', name: '不包含', dbkeyword: 'NOT IN' }],
    inputType: 4
  },
  {
    ruleTypes: [1, 2],
    field: 'receiveCountryCode',
    dbField: 'receive_country_code',
    fieldName: '收货国家',
    opList: [{ type: 'equal', name: '等于', dbkeyword: '=' }, { type: 'notequal', name: '不等于', dbkeyword: '!=' }, { type: 'in', name: '包含', dbkeyword: 'IN' }, { type: 'notin', name: '不包含', dbkeyword: 'NOT IN' }],
    inputType: 3
  },
  {
    ruleTypes: [1, 2],
    field: 'crateTime',
    dbField: 'crate_time',
    fieldName: '创建时间',
    opList: [{ type: 'equal', name: '等于', dbkeyword: '=' }, { type: 'notequal', name: '不等于', dbkeyword: '!=' }, { type: 'greater', name: '大于', dbkeyword: '>' }, { type: 'greaterorequal', name: '大于等于', dbkeyword: '>=' }, { type: 'less', name: '小于', dbkeyword: '<' }, { type: 'lessorequal', name: '小于等于', dbkeyword: '<=' }],
    inputType: 2
  },
  {
    ruleTypes: [1, 2],
    field: 'payTime',
    dbField: 'pay_time',
    fieldName: '付款时间',
    opList: [{ type: 'equal', name: '等于', dbkeyword: '=' }, { type: 'notequal', name: '不等于', dbkeyword: '!=' }, { type: 'greater', name: '大于', dbkeyword: '>' }, { type: 'greaterorequal', name: '大于等于', dbkeyword: '>=' }, { type: 'less', name: '小于', dbkeyword: '<' }, { type: 'lessorequal', name: '小于等于', dbkeyword: '<=' }],
    inputType: 2
  }]
