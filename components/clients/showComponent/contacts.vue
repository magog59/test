<template>
  <section>
          <div>
              <button class="btn btn-primary" @click="showForm = !showForm" > Добавить контакт</button>
          </div> 
          <div class="form-row"  v-if="showForm" style="margin: 10px 0 10px 0;">
                <div class="col-5" >
                      <div style=" font-size: 70%;text-align: left">Имя</div> 
                      <input type="text" class="form-control" v-model="form.name" >  
                </div>
                <div class="col-3 offset-1"  style="text-align: left;">
                    <div style=" font-size: 70%;">Тип контакта</div> 
                    <select class="select"  v-model="form.contacttype_id"  style=" width: 200px!important;">
                          <option  v-for="(data, id) in dataContractTypes" :key="id"  v-bind:value="data.id" >{{data.name}}</option>
                    </select>
                </div>
          </div>
          <div class="row"  v-if="showForm ">
                <div class="col-3"  style="text-align: left;">
                    <div style=" font-size: 70%;">Телефон</div> 
                    <input type="text" class="form-control" v-model="form.phone" > 
              </div>
              <div class="col-3"  style="text-align: left;">
                    <div style=" font-size: 70%;">Email</div> 
                    <input type="text" class="form-control" v-model="form.email" > 
              </div>
              <div class="col-3"  style="text-align: left;">
                    <div style=" font-size: 70%;">Добавочный</div> 
                    <input type="text" class="form-control" v-model="form.skype" > 
              </div>
          </div>
          <div class="row"  v-if="showForm ">
                <div class="col-8">
                      <div style="font-size: 70%;">Комментарий</div> 
                      <textarea type="text" class="form-control" v-model="form.comment" style="width:500px;height:100px;" ></textarea>
                </div>
          </div>
          <div class="form-row"  v-if="showForm " style="margin-top: 30px">
                <div class="col" style="margin: auto" >
                      <button class="btn btn-success"  @click="saveData()">Сохранить</button> 
                      <button class="btn btn-warning"  @click="form = {};showForm=false ">Отменить</button>   
                </div>
          </div>
          <div class="form-row justify-content-end">
                <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
          </div>
     <table class="table table-border table-hover" style="margin-top:20px">
        <tr  align="left">
            <th>Имя</th> 
            <th>Телефон</th>
            <th>Тип контакта</th>  
            <th>Добавочный</th>
            <th>Email</th>
            <th>Комментарий</th>
            <th></th>
            <th></th>  
        </tr>
        <tbody v-for="model in datalist" :key="model.id" > 
          <tr  v-if="edit == null || edit.id != model.id"  :class="[model.deleted_at != null ? 'disabled' : '']"  v-show="!showComment">
            <td>{{model.name}}</td>
            <td>{{model.phone}}</td>
            <td>{{getContactType(model.contacttype_id).name}} </td>
            <td>{{model.skype}}</td>
            <td>{{model.email}}</td>
            <!-- <td>{{model.comment}}<a href="#" ><i class="fas fa-comment"></i></a></td>  -->
               <td>{{model.comment}}
                      <a
                            href="#"
                            @click="toComments(model.id)">
                                <i :class="[model.deleted_at != null ? '' : 'fas fa-comment']" ></i>
                      </a>
              </td>
             <td >
                  <a  
                        href="#" 
                        v-if="model.deleted_at == null || model.deleted_at == ''" 
                        @click="toChange(model)">
                            <img 
                                src="../../../../static/images/iconsColors/edit.png" 
                                title="Редактировать" 
                                style="max-width:20px">
                              
                  </a>  
              </td>    
            <td width="60px;" >
                  <a href="#">
                      <vue-confirmation-button
                        v-if="model.deleted_at == null || model.deleted_at == ''"
                        :css="'fui-trash'"
                        v-on:confirmation-success="deleteData(model.id)"
                        title="Удалить">
                      </vue-confirmation-button>
                  </a>
              </td>
          </tr>
          <tr v-if="edit != null && edit.id == model.id">
              <td><input type="text" class="form-control" v-model="edit.name" placeholder="Поставлена"></td>
               <td><input type="text" class="form-control" v-model="edit.phone" placeholder=""></td>
              <td> 
                <select class="select"  v-model="edit.contacttype_id"  style=" width: 200px!important;">
                    <option  v-for="(data, id) in dataContractTypes" :key="id"  v-bind:value="data.id" >{{data.name}}</option>
                </select>
              </td>
              <td><input type="text" class="form-control" v-model="edit.skype" placeholder="Skype"></td>
              <td><input type="text" class="form-control" v-model="edit.email" placeholder="Email"></td>
              <td><input type="text" class="form-control" v-model="edit.comment" placeholder="Комментарий "></td>
              <td><a class="fui-check" @click="update"></a></td>
              <td><a class="fui-cross" @click="edit = null"></a></td>
          </tr>
          <!-- <tr v-if="edit != null && edit.id == model.id">
              <textarea  class="form-control"  v-model="form.comment" placeholder="Комментарий"  style="height: 100px;" ></textarea>
              <button class="btn btn-primary" @click="showComment = false;updateCommt()" > Добавить Комментарий</button>
          </tr> -->
        </tbody>
      </table>
        <div class="row"  style="margin-top: 30px" v-if="showComment"> 
          
        </div>
  </section>
</template>

<script>
  import Acl from '../../../utils/acl'
  import Vuex from 'vuex'
  import vueConfirmationButton from '../../../utils/confirmButton'             
  import pagination from "../../../utils/pagination"

  export default {
    mixins: [Acl],
    name: 'contacts',
    props: ['clients_id'],
    data () {
      return {
        form:{
            clients_id: '',
            contacttype_id:'',
            name:'',
            email:'',
            phone:'',
            skype:'' ,
            comment: '' 
        },
        search: null,
        page: null,
        edit: null,
        showForm: false,
        showComment: false
      }
    },
    components: {
      pagination,
      vueConfirmationButton
    },
    computed: {
      ...Vuex.mapGetters({
        apiUrl: 'app/apiUrl',
        datalist: 'contacts/datalist',
        dataContractTypes: 'contacttype/datalist',
        pagination: 'contacts/pagination',
        callsStatus: 'dictionary/callsStatus',
        storeForm: 'mybuisness/form',
        user: 'auth/user',  
      }),  

    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            save: 'contacts/save',
            find: 'contacts/find',
            drop: 'contacts/delete',
            findContactsType: 'contacttype/find',
            calls: 'calls/calls',
      }),
      saveData(){
        this.setError(null)
        if(this.form.clients_id == null){
          this.form.clients_id = this.clients_id
        }
        this.save(this.form)
                .then(() =>{
                  this.find({clients_id:this.clients_id})  
                  this.form = {}
                  this.showForm=false
                })
      },
      update() {
        this.setError(null)
        this.save(this.edit)
                .then(() =>{
                    this.edit = null
                    this.find({clients_id:this.clients_id})
                })
      },
      deleteData(id){
          this.setError(null)
          this.drop(id)
                .then(() =>{
                    this.find({clients_id:this.clients_id})
                })
      },
      toChange(model){
          this.edit = Object.assign({}, model)
      },
      setPage(i){
          this.page = i
          this.storeForm.page = this.page 
          this.find(this.storeForm )
      },
      findData(){
          if(this.clients_id != null && this.clients_id != ''){
              this.find({clients_id:this.clients_id})
          }
     
      },
      updateCommt(model){
          this.edit = Object.assign({}, model)
               this.setError(null)
                this.save(this.edit)
                        .then(() =>{
                            this.edit = null
                            this.find({clients_id:this.clients_id})
                        })
      },
      getContactType(id){
          var result = {}
          this.dataContractTypes.map((el) => {
            if(id == el.id){
              result = el
            }
          })
          return result
        },
      toCall(model){
          console.log(model)
          this.calls({id:model.id})
      },
      getClientsId(){
          // var obj = this.clients_id
          var obj = Object.assign( this.clients_id)
          this.form.clients_id = obj
      },
      toComments(id){
          this.$store.commit('comments/setValComment', {object_id:id, type: 90,  component:'contacts',  radom: Math.random().toFixed(2) }, {root: true})
      },
     },
    created() {
      this.setHeader('Контакты')
      this.page = this.pagination.page
      this.getClientsId()
      this.findContactsType()
   
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }


</style>
