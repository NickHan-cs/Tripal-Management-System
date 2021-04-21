<template>
  <div class="main">
    <div class="header">
    </div>
    <div class="editor-body">
      <div>
        <a-input></a-input>
        <editor :content="content" @Edit="Edit" style=""></editor>
      </div>
    </div>
  </div>
</template>

<script>
import editor from "../../components/editorTool.vue";
export default {
  components: {
    editor,
  },
  data(){
    return{
      content:"",
      isEdit:true
    }
  },
  methods:{
      Edit(data) {
        console.log(data);
      this.content = data;
      this.isEdit=false;
    },
  }
}
</script>
