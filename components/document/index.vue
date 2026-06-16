<template>
  <section>
          <div class="form-row"   style="margin: 10px 0 10px 0;">
                <div class="col-3" v-if="showForm==false " >
                    <input class="form-control" @keyup="findData()" @change="findData()" v-model="search" type="text" placeholder="Поиск">
                </div>
                <div class="col-3 offset-1">
                    <button class="btn btn-primary" @click="showForm = !showForm"  v-if="showForm==false  "> Добавить документ</button>
                </div> 
          </div>
          <!--ADD----> 
              <div class="form-row"  v-if="showForm" style="margin: 10px 0 10px 0;">
                    <div class="col-4" >
                          <div style=" font-size: 70%;text-align: left">Название</div> 
                          <input type="text" class="form-control" v-model="form.name" >  
                    </div>
              </div>
              <div class="row"  v-if="showForm " >
                    <div class="col-3"  style="text-align: left;">
                        <div style=" font-size: 70%;">Полное название</div> 
                        <textarea type="text" class="form-control" v-model="form.fullname" style="width:300px;height:70px;" ></textarea> 
                  </div>
                  <div class="col-3"  style="text-align: left;">
                        <div style=" font-size: 70%;">Для документов</div> 
                        <textarea type="text" class="form-control" v-model="form.for_doc" style="width:300px;height:70px;" ></textarea>
                </div>
              </div>
              <div class="row"  v-if="showForm ">
                    <div class="col-3 "  style="text-align: left;">
                        <div style=" font-size: 70%;">Протокол в документах</div> 
                        <select class="select"  v-model="form.is_include" >
                            <option  value="10" >ДА</option>
                            <option  value="20" >НЕТ</option>
                        </select>
                    </div>
                    <div class="col-3 "  style="text-align: left;">
                        <div style=" font-size: 70%;">Инспекционный контроль</div> 
                        <select class="select"  v-model="form.is_control" >
                            <option  value="10" >ДА</option>
                            <option  value="20" >НЕТ</option>
                        </select>
                    </div>
              </div>
              <div class="form-row"  v-if="showForm " style="margin-top: 30px">
                    <div class="col" style="margin: auto" >
                          <button class="btn btn-success"  @click="saveData()">Сохранить</button> 
                          <button class="btn btn-warning"  @click="form = {};showForm=false ">Отменить</button>   
                    </div>
              </div>
           
          <!-----END ADD--->
   
      <div class="form row justify-content-end" style="margin-top: 50px">
          <pagination class="col-4" style="padding: 100% left" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover">
        <tr  align="left">
            <th>Название</th> 
            <th>Полное название</th>
            <th>Для документов</th>
            <th>Протокол в документах</th>
            <th>Инспекционный контроль</th>
            <th></th>
            <th></th>
        </tr>
        <tbody v-for="model in datalist" :key="model.id"> 
          <tr  v-if="edit == null || edit.id != model.id"  :class="[model.deleted_at != null ? 'disabled' : '']" align="left">
            <td>{{model.name}}</td>
            <td>{{model.fullname}}</td>
            <td>{{model.for_doc}}</td>
            <td>{{getYesNoList(model.is_include).name}}</td>
            <td>{{getYesNoList(model.is_control).name}}</td>

            <td  >
                    <a  a href="#" 
                        v-if="model.deleted_at == null || model.deleted_at == ''"
                    
                        @click="toChange(model)">
                              <img  src="../../../static/images/iconsColors/edit.png" 
                                    title="Редактировать" 
                                    style="max-width:20px"
                              >
                    </a>
              </td> 
              <td width="60px;" title="Удалить">
                  <a href="#">
                      <vue-confirmation-button
                          v-if="model.deleted_at == null || model.deleted_at == ''"
                          :css="'fui-trash'"
                          v-on:confirmation-success="deleteData(model.id)">
                      </vue-confirmation-button>
                  </a>
              </td>  
          </tr>
          <tr v-if="edit != null && edit.id == model.id">
              <td><input type="text" class="form-control" v-model="edit.name" placeholder="Название"></td>
              <td><input type="text" class="form-control" v-model="edit.fullname" placeholder="Полное название"></td>
              <td><input type="text" class="form-control" v-model="edit.for_doc" placeholder="Для документов"></td>
              <td>
                 <select class="select"  v-model="edit.is_include" >
                      <option  value="10" >ДА</option>
                      <option  value="20" >НЕТ</option>
                  </select>
              </td>
              <td> 
                <select class="select"  v-model="edit.is_control" >
                      <option  value="10" >ДА</option>
                      <option  value="20" >НЕТ</option>
                  </select>
              </td>
              <td><a class="fui-check" @click="update"></a></td>
              <td><a class="fui-cross" @click="edit = null"></a></td>
          </tr>
        </tbody>
      
      </table>
  </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import vueConfirmationButton from '../../utils/confirmButton'     
  import pagination from "../../utils/pagination";

  export default {
    mixins: [Acl],
    name: '',
    data () {
      return {
        form:{
          name: '',
          fullname: '',
          for_doc: '',
          is_include: 1,
          is_control: 2
        },
        search: null,
        page: null,
        edit: null,
        showForm: false
      }
    },
    components: {
      VueConfirmationButton: vueConfirmationButton,
      pagination
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'document/datalist',   
            pagination: 'document/pagination',
            yesNoList: 'dictionary/yesNoList',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
        save: 'document/save',
        find: 'document/find',
        drop: 'document/delete'
      }),
      saveData(){
        this.setError(null)
        this.save(this.form)
                .then(() =>{
                  this.findData()
                })
      },
      update() {
        this.setError(null)
        this.save(this.edit)
                .then(() =>{
                  this.edit = null
                  this.findData()
                })
      },
      deleteData(id){
        this.setError(null)
        this.drop(id)
                .then(() =>{
                  this.findData()
                })
      },
      toChange(model){
        this.edit = Object.assign({}, model)
      },
      setPage(i){
        this.page = i
        this.findData()
      },
      findData(){
        this.find({page:this.page, query: this.search})
      },
      getYesNoList(id){
        var result = {}
        this.yesNoList.map((el) => {
           if(id == el.id){
             result = el
           }
        })
        return result
      },
    },
    created() {
      this.setHeader('Документ')
      this.page = this.pagination.page
      this.findData()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
</style>
