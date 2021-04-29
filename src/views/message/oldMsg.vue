<template>
  <div style="text-align:left;margin:10px 0">
    <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit" hide-add>
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        <div v-if="pane.key === '0'">
          <!-- <a-input-search placeholder="input search text" style="width: 300px;margin:0px 10px 15px 0px"  @search="onSearch" />
          <a-button style="margin:0 5px" type="primary" @click="add">查看</a-button> -->
          <a-button style="margin:0px 10px 15px 0px" type="primary" @click="add">查看</a-button>
          <!-- <a-button style="margin:0 5px" @click="deleteMsgs">删除</a-button> -->
          <a-table :row-selection="rowSelection" :columns="columns" :data-source="pane.data"  :pagination="false">
            <a slot="id" slot-scope="text, record" @click="addSingle(record)">{{ text}}</a>
          </a-table>
          <br>
          <a-pagination show-quick-jumper :page-size="1" :total="pageNum" @change="onPageChange" />
        </div>
        <div v-else style="margin:10px 0 10px 15px;">
          <a-descriptions title="User Info">
          <a-descriptions-item label="UserName">
            {{data[pane.key-1].name}}
          </a-descriptions-item>
          <a-descriptions-item label="Age">
            {{data[pane.key-1].age}}
          </a-descriptions-item>
          <a-descriptions-item label="Remark">
            empty
          </a-descriptions-item>
          <a-descriptions-item label="Address">
          {{data[pane.key-1].address}}
          </a-descriptions-item>
        </a-descriptions>
        </div>
    
      </a-tab-pane>
    </a-tabs>
    <a-modal
        title="提示"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
      <p>{{ ModalText }}</p>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '信息编号',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' },
    width: '80px',
  },
  {
    title: '发送时间',
    dataIndex: 'createTime',
    width: '160px',
  },
  {
    title: '信息内容',
    dataIndex: 'content',
    width: '300px',
    ellipsis: true,
  }
];

// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//   },
//   {
//     key: '4',
//     name: 'Disabled User',
//     age: 99,
//     address: 'Sidney No. 1 Lake Park',
//   },
// ];

export default {
  name:"oldMsg",
  data() {
    const panes = [
      { title: '信息管理', data:[],  key: '0' ,closable: false },
    ];
    return {
      data:[],
      columns,
      activeKey: panes[0].key,
      panes,
      selectedRows:[],
      selectedRowKeys:[],
      newTabIndex: 0,
      page: 1,
      pageNum: 1,
      visible: false,
      confirmLoading: false,
      ModalText: '您的登录信息已过期，请重新登录'
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
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            title: record.id,
          },
        }),
      };
    },
  },
  mounted(){
    this.getMsgs({"page":"1"});
  },
  methods: {
    getMsgs(p) {
      this.$axios({
        method: "get",
        url: "api/admin/messages/",
        params: p,
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: {},
      }).then((res) => {
        this.data = res.data.results;
        this.pageNum = res.data.pages;
        let key = 1;
        this.data.forEach((item)=>{
          item.key = key + '';
          key = key + 1;  
          let time_array = item.time.split("T");
          item.createTime = time_array[0] + " " + time_array[1].split(".")[0];
        })
        this.panes[0].data = this.data;
      }).catch((error) => {
        console.log(error);
        if (error.response.status == 403) {
          console.log(localStorage.getItem('Authorization'))
          this.visible = true;
        }
      });
    },
    // deleteMsgs(msgId) {
    //   this.$axios({
    //     method: "delete",
    //     url: "api/admin/messages/" + msgId + "/",
    //     params: {},
    //     headers: {
    //       Authorization: localStorage.getItem('Authorization')
    //     },
    //     data: {},
    //   }).then((res) => {
    //     console.log(res);
    //   }).catch((error) => {
    //     if (error.response.status == 403) {
    //       this.visible = true;
    //     }
    //   });
    // },
    handleOk() {
      this.ModalText = '该对话框将在2秒后关闭';
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
        this.$router.push('/login');
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
    },
    // handleChange(value) {
    //   this.searchType = value;
    // },
    // onSearch(value){
    //   console.log(value);
    // },
    onPageChange(page) {
      this.getMsgs({"page": page});
    },
    // deleteMsgs() {
    //   this.selectedRows.forEach((item)=>{
    //     this.deleteMsgs(item.id);
    //     this.remove(item.key);
    //   });
    //   this.getMsgs({"page":"1"});
    //   this.selectedRows = [];
    //   this.selectedRowKeys = [];
    // },
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
      console.log(record);
      const panes = this.panes;
        let flag = 0;
        let item = record;
        console.log(item);
        for(let j = 0; j<panes.length;j++){
          if(panes[j].key == item.key){
            console.log("item.key:"+item.key);
            flag = 1;
            break;
          }
        }
        if(flag == 0){
          panes.push({ title: item.name, data:item.data, key: item.key });
         
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
          panes.push({ title: item.name, data:item.data, key: item.key });
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
