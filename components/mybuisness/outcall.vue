<template>
  <section>
      <div  v-show="showDecl==false">
          <button class="btn btn-primary" @click="showForm = !showForm;setParams()"  v-if="showButtonForm"> Добавить звонок</button>
      </div> 
      <div class="form-row"  v-if="showForm" style="margin: 10px 0 10px 0;">
            <div class="col-3"  style="text-align: left;">
                  <div style=" font-size: 70%;">Дата контакта</div> 
                  <date-picker  v-model="form.contactdate"   :format="'DD.MM.YYYY mm:ss'" valueType="format" ></date-picker>  
            </div>
            <div class="col">
                  <div style=" font-size: 70%;">Комментарий</div> 
                  <textarea type="text" class="form-control" v-model="form.comment" style="width: 500px"></textarea>
            </div>
            <div class="col-3 " style="margin: auto" >
                  <button class="btn btn-success"  @click="saveData()">Сохранить</button>   
                  <button class="btn btn-warning"  @click="form = {};showForm=false ">Отменить</button> 
            </div>
      </div>
      <div class="form-row justify-content-end">
          <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
    <table class="table table-border table-hover" style="margin-top:20px">
        <tr  v-show="showDecl==false">
            <th>Дата контакта</th> 
            <th>Комментарий</th>
            <th>Менеджер</th>
            <th>Организация</th>
            <th>Город</th>
            <th>Состояние</th>  
            <th>Дата</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
        <tbody v-for="model in datalist" :key="model.id"> 
          <tr 
              v-if="edit == null || edit.id != model.id"  
              :class="getClassRow(model)"  
              v-show="showDecl==false" >

                <td>{{inDateTime(model.contactdate)}}</td>
                <td>{{model.comment}}
                    <a 
                        href="#"
                        @click="toComments(model.id)">
                            <i :class="[model.deleted_at != null ? '' : 'fas fa-comment']"></i>
                    </a>
                </td>
                <td>{{getManager(model.user_id).username}}</td>
                <td><a   target="_blank"  :href="'/clients/show/'+ model.clients_id+''"   >{{model.name}}</a></td>
                <td>{{getCity(model.city_id).name}}</td>
                <td>{{getStatus(model.status)}}</td>
                <td>{{inDateTime(model.startdate)}}</td>
                <td >
                      <a href="#" v-show="model.status != 20 && model.status != 30"
                            v-if="model.deleted_at == null || model.deleted_at == '' || model.status != 20 && model.status != 30" 
                            @click="toChange(model)">
                                <img src="../../../static/images/iconsColors/edit.png" title="Редактировать" style="max-width:20px">
                      </a>
                </td> 
                <td >
                      <a href="#" v-if="model.status != 20 && model.status != 30">
                            <i  class="fa fa-angle-double-right"
                                v-if="model.deleted_at == null || model.deleted_at == ''" 
                                title="Создать ЭК" 
                                @click="toCreateLead(model)">
                            </i>
                      </a>
                </td> 
              <td v-show="model.status == 30 || model.status == 20">
                    <a 
                          href="#" 
                          v-if="model.deleted_at == null || model.deleted_at == ''" 
                          @click="toRestore(model)">
                              <img  
                                    src="../../../static/images/iconsColors/pencils.svg" 
                                    title="Восстановить"
                                    style="max-width:20px"
                              >                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    </a>
                </td> 
                <td v-show="model.status != 30 && model.status != 20">  
                    <a 
                          href="#" 
                          v-if="model.deleted_at == null || model.deleted_at == ''" 
                          @click="showDecl=true;setModelClose(model)">
                              <img  
                                    src="../../../static/images/iconBest/canc.png" 
                                    title="Отказ"
                                    style="max-width:20px">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    </a>
                </td>  
                <td width="60px;" title="Удалить" >
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
              <td><date-picker v-model="edit.contactdate" :format="'DD.MM.YYYY mm:ss'"  valueType="format"  ></date-picker></td>
              <td><input type="text" class="form-control " disabled="disabled" ></td>
              <td>
                  <select class="select"  v-model="edit.user_id" >
                      <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                  </select>
              </td>
              <td><input type="text" class="form-control" disabled="disabled"></td>
              <td><input type="text" class="form-control" disabled="disabled"></td>
              <td><input type="text" class="form-control" disabled="disabled"></td>
              <td><input type="text" class="form-control" disabled="disabled"></td>
              <td><a class="fui-check" @click="update"></a></td>
              <td><a class="fui-cross" @click="edit = null"></a></td>
          </tr>
        </tbody>
         <tr  v-if="showDecl==true"   >
              <button type="button" class="close" @click="showDecl=false" aria-hidden="true">×</button>
              <div style="font-size: 70%; text-align:rigth">Выбирите причины отказа</div>
              <select class="select"  v-model="declinematter_id">
                    <option  v-for="item in declinematters" :key="item.id" :value="item.id" >{{item.name}}</option>
              </select>
              <button class="btn btn-success"  @click="toClose()">Сохранить</button>
          </tr>
     </table>
  </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import vueConfirmationButton from '../../utils/confirmButton'     
  import pagination from "../../utils/pagination"
   import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import dateFunc from '../../utils/dateFunc'

  export default {
    mixins: [Acl,dateFunc],
    name: 'outcall',
    props:['showButtonForm', 'clients_id', 'mybuisness','panel'],
    data () {
      return {
        showForm: false,
        form:{
          clients_id: this.clients_id,  
          contactdate: this.inDateTime(new Date()),
          startdate: this.inDateTime(new Date()),
          manager_id: this.userId,
          comment: '',
          user_id: this.userId,
          status: 10,
          description: ''
        },
        search: null,
        page: null,
        edit: null,
        declinematter_id: null,
        showDecl: false,
        modelClose: null
      }
    },
     watch:{
        edit(){
            if(this.edit != null){
                this.edit.contactdate = this.inDateTime(new Date())
            }
        }
    },
    components: {
        VueConfirmationButton: vueConfirmationButton,
        pagination,
        DatePicker
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'outcall/datalist',
            pagination: 'outcall/pagination',
            storeForm: 'mybuisness/form',
            clients: 'clients/datalist',
            users: 'app/users',
            user: 'auth/user',
            citys: 'city/datalist',
            callsStatus: 'dictionary/callsStatus',
            declinematters: 'declinematter/datalist' 
      }),
    },
    methods: {
          ...Vuex.mapMutations({
                setMessage: 'app/setMessage',
                setError: 'app/setError',
                setHeader:'app/setCurrentPageHeader'
          }),
          ...Vuex.mapActions({
                save: 'outcall/save',
                find: 'outcall/find',
                drop: 'outcall/delete',
                findCity: 'city/findAll',  
                restore: 'outcall/restore',
                close: 'outcall/close',
                declinemFind: 'declinematter/find'
          }),
          saveData(){
            this.setError(null)
            this.save(this.form)
                    .then(() =>{
                      if(this.mybuisness==true){
                          this.find(this.storeForm)
                      }
                      if(this.panel==true){
                          this.find({clients_id: this.clients_id})
                      }

                    })
          },
          update() {
            this.setError(null)
            this.save(this.edit)
                .then(() =>{
                  this.edit = null
                    if(this.mybuisness==true){
                        this.find(this.storeForm)
                    }
                    if(this.panel==true){
                      this.find({clients_id: this.clients_id})
                    }
                })
          },
          deleteData(id){
            this.setError(null)
            this.drop(id)
                .then(() =>{
                    if(this.mybuisness==true){
                        this.find(this.storeForm)
                    }
                    if(this.panel==true){
                      this.find({clients_id: this.clients_id})
                    }
                })
          },
          toRestore(model){
              this.restore({id: model.id})
                  if(this.mybuisness==true){
                      this.find(this.storeForm)
                  }
                  if(this.panel==true){
                      this.find({clients_id: this.clients_id})
                  }
                  
          },
          toClose(){
              this.close({id: this.modelClose.id, declinematter_id: this.declinematter_id})
                    if(this.mybuisness==true){
                    this.find(this.storeForm)
                    }
                    if(this.panel==true){
                    this.find({clients_id: this.clients_id})
                    }
              this.showDecl = false
              this.declinematter_id = null   
          },
          setModelClose(model){
                this.modelClose = Object.assign({}, model)  
          },
          toChange(model){
            this.edit = Object.assign({}, model)
          },
          setPage(i){
            this.page = i
            this.storeForm.page = this.page 
            this.find(this.storeForm )
          },
          toComments(id){
              this.$store.commit('comments/setValComment', {object_id:id, type:30, component:'outcall', radom: Math.random().toFixed(2)}, {root: true})
          },
          toShow(model){
              // localStorage.setItem('clientsModel', JSON.stringify(model) )
              localStorage.setItem('storeForm', JSON.stringify(this.storeForm) )
              this.$router.push('../../clients/show/' + model.id)
            
          },
          toCreateLead(model){
              this.$router.push('/create/createLead/' + model.id +'='+ model.clients_id +'='+this.$route.name )  
          },
          getManager(id){
                var result = {}
                this.users.map((el) => {
                if (id == el.id) {
                      result = el
                    }
                })
                return result
          },
          getCity(id){
              var result = {}
              this.citys.map((el) => {
              if (id == el.id) {
                    result = el
                  }
              })
              return result
          },
          getStatus(id){
              var result = {}
              this.callsStatus.map((el) => {
                if(id == el.id){
                  result = el.name
                }
              })
            return result
          },
          setParams(){
              var obj = Object.assign({}, this.user)
              this.form.manager_id = obj.id,
              this.form.user_id = obj.id,
              this.form.clients_id = this.clients_id,
              this.form.startdate = this.inDateTime(new Date()),
              this.contactdate = this.inDateTime(new Date()),
              this.form.status = 10
          },
          getClassRow(model){
              return [model.deleted_at != null ? 'disabled' : '' , model.status == 20 ? 'danger' : '', model.status == 30 ? 'success' : '']
          }
    },
    created() {
      this.setHeader('Звонки')
      this.page = this.pagination.page
      this.setParams()
      this.findCity()
      this.declinemFind()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
</style>
