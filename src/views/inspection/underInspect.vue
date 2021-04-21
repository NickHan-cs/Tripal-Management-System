<template>
<div style="text-align:left;margin:10px 0">
  <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit" hide-add>
    <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
      <div v-if="pane.key === '0'">
          <a-input-search placeholder="input search text" style="width: 300px;margin:0px 10px 15px 0px"  @search="onSearch" />
          <a-button style="margin:0 5px" type="primary" @click="add">查看</a-button>
          <a-button style="margin:0 5px" type="primary" @click="pass">通过</a-button>
          <a-button  style="margin:0 5px" @click="fail">不通过</a-button>
          <a-table :row-selection="rowSelection" :columns="columns" :data-source="pane.data">
            <a slot="titleName" slot-scope="text, record" @click="addSingle(record)">{{ text }} </a>
            <template v-slot:action>
              <a-button style="margin-right:10px" size="small" type="primary">通过</a-button>
               <a-button size="small" >不通过</a-button>
            </template>
          </a-table>
      </div>
      <div v-else style="margin:10px 0 10px 15px;">
        <a-descriptions title="Record Info">
        <a-descriptions-item label="Title">
          {{data[pane.key-1].titleName}}
        </a-descriptions-item>
        <a-descriptions-item label="Username">
          {{data[pane.key-1].username}}
        </a-descriptions-item>
        <a-descriptions-item label="Remark">
          empty
        </a-descriptions-item>
        <a-descriptions-item label="Reason">
         {{data[pane.key-1].reason}}
        </a-descriptions-item>
      </a-descriptions>
      </div>
   
    </a-tab-pane>
  </a-tabs>
  </div>
</template>
<script>
const columns = [
  {
    title: 'Title',
    dataIndex: 'titleName',
    scopedSlots: { customRender: 'titleName' },
  },
  {
    title: 'Username',
    dataIndex: 'username',
    scopedSlots: { customRender: 'username' },
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
  },{
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [
  {
    key: '1',
    titleName: 'paper 1',
    username: "lucy",
    reason: 'do not understand what you are doing',
  },
  {
    key: '2',
    titleName: 'paper 2',
    username: "lucy",
    reason: 'do not understand what you are doing',
  },{
    key: '3',
    titleName: 'paper 3',
    username: "lucy",
    reason: 'do not understand what you are doing',
  },{
    key: '4',
    titleName: 'paper 4',
    username: "lucy",
    reason: 'do not understand what you are doing',
  },
];

export default {
  name:"user",
  data() {
    const panes = [
      { title: '待审核', data:[],  key: '0' ,closable: false },
    ];
    return {
      data,
      columns,
      activeKey: panes[0].key,
      panes,
      selectedRows:[],
      selectedRowKeys:[]
    };
  },
  computed:{
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRows = selectedRows;
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            title: record.title,
          },
        }),
      };
    },
  },
  mounted(){
    this.panes[0].data = this.data;
    console.log(this.data)
  },
  methods: {
    fail(){
      console.log("fail")
    },
    pass(){
      console.log("pass")
    },
    onSearch(value){
      console.log(value);
    },
    callback(key) {
      console.log(key);
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
      console.log("targetKey:"+targetKey);
      console.log("action:"+action);
      console.log(this.panes);
    },
    addSingle(record){
      const panes = this.panes;
        let flag = 0;
        let item = record;
        for(let j = 0; j<panes.length;j++){
          if(panes[j].key == item.key){
            console.log("item.key:"+item.key);
            flag = 1;
            break;
          }
        }
        if(flag == 0){
          panes.push({ title: item.titleName, data:item.data, key: item.key });
         
        }
         this.activeKey = item.key;
         this.panes = panes;
    },
    add() {
      const panes = this.panes;
      // const activeKey = `newTab${this.newTabIndex++}`;
      let i = 0;
      this.selectedRows.forEach((item)=>{
        let flag = 0;
        for(let j = 0; j<panes.length;j++){
          if(panes[j].key == item.key){
            console.log("item.key:"+item.key);
            flag = 1;
            break;
          }
        }
        console.log("flag:"+flag);
        if(flag == 0){
          panes.push({ title: item.titleName, data:item.data, key: item.key });
          i=item.key;
          console.log(i);
          this.activeKey = i;
        }
      })
      this.panes = panes;
    },
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.panes.filter(pane => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.panes = panes;
      this.activeKey = activeKey;
    },
  },
};
</script>