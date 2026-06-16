<template>
    <section>
        <div v-show="showDecl == false">
            <button class="btn btn-primary" @click="showForm = !showForm"  v-if="showButtonForm">Добавить ЭК</button>
        </div>
        <div class="form-row" v-if="showForm" style="margin: 10px 0 10px 0;">
            <div :class="form.source_id == 15 ? 'col-2' : 'col-3'" style="padding: 0">
                <div style=" font-size: 70%;">Дата контакта</div>
                <date-picker  v-model="form.contactdate" valueType="format" :format="'DD.MM.YYYY'" ></date-picker>
            </div>
            <div :class="form.source_id == 15 ? 'col-2' : 'col-3'" style="padding: 0; padding-right: 20px;">
                <div style=" font-size: 70%;">Источник</div>
                <select class="select"  v-model="form.source_id">
                    <option  v-for="(source, id) in sources" :key="id"  v-bind:value="source.id" >{{source.name}}</option>
                </select>
            </div>
            <div v-if="form.source_id == 15" class="col-2 custom_block" style="padding: 0; padding-right: 20px;">
                <div style="font-size: 70%;">От кого</div>
                <input type="text" class="form-control" v-model="form.from_who">
                <div v-if="isShowListUsers && filtered_users.length != 0" class="custom_list">
                    <p @click="setFromWhoName(form.from_who)">{{ form.from_who }}</p>
                    <p v-for="user in filtered_users" v-show="user.status == 20" @click="setFromWhoName(user.username)" :key="user.id" :value="user.id" >{{ user.username }}</p>
                </div>
            </div>
            <div class="col-3" style="padding-right: 20px">
                <div style=" font-size: 70%;">Описание задачи</div>
                <input type="text" class="form-control" v-model="form.comment">
            </div>
            <div class="col-3" style="margin: auto" >
                <button class="btn btn-success" @click="saveData()">Сохранить</button>
                <button class="btn btn-warning" @click="form = {};showForm=false ">Отменить</button>
            </div>
        </div>
        <div class="form-row justify-content-end">
            <div class="col-4"></div>
            <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page" v-if="!isEdit"></pagination>
        </div>
        <table class="table table-border table-hover" style="margin-top:20px" v-if="!isEdit">
            <tr  v-show="showDecl==false">
                <th>Дата контакта</th>
                <th>Интерес</th>
                <th>Комментарий</th>
                <th>Менеджер</th>
                <th>Организация</th>
                <th>Город</th>
                <th>Состояние</th>
                <th>Источник</th>
                <th style="width: 200px">Дата</th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
            </tr>
          <tbody v-for="model in datalist" :key="model.id">
            <tr
                  v-if="isEdit || edit.id != model.id"
                  :class="getClassRow(model)"
                   v-show="showDecl==false"
            >
                <td>{{inDateTime(model.contactdate)}}</td>
                <td>{{model.interesttype}}</td>
                <td>{{model.comment}}
                    <a href="#" @click="toComments(model.id)">
                        <i :class="[model.deleted_at != null ? '' : 'fas fa-comment']"></i>
                    </a>
                </td>
                <td>{{getManager(model.manager).username}}</td>
                <td><a  target="_blank"  :href="'/clients/show/'+ model.clients_id+''" >{{model.name}}</a></td>
                <td>{{getCity(model.city_id).name}}</td>
                <td>{{getStatus(model.state).name}}</td>
                <td>{{ model.source_id == 15 && (model.from_who != '' && model.from_who != null) ? getSources(model.source_id).name + ': ' + model.from_who : getSources(model.source_id).name}}</td>
                <td>{{inDateTime(model.contactdate)}}</td>
                <td >
                    <a  href="#"
                            v-if="model.deleted_at == null || model.deleted_at == ''"

                            @click="toChange(model)">

                                <img   src="../../../static/images/iconsColors/edit.png"
                                      title="Редактировать"
                                      style="max-width:20px"
                                      v-if="model.state != 50 && model.state != 60">
                    </a>
              </td>
                <td>
                    <a href="#"
                        v-show="model.state != 50 && model.state != 60">
                        <i
                            class="fa fa-angle-double-right"
                            title="Создать Заявку"
                            @click="toCreateAppls(model)">
                        </i>
                    </a>
                </td>
                <td  v-show="model.state == 50 || model.state == 60">
                    <a
                        href="#"
                        v-if="model.deleted_at == null || model.deleted_at == ''"
                        @click="toRestore(model)">
                            <img
                                    src="../../../static/images/iconsColors/pencils.svg"
                                    title="Восстановить"
                                    style="max-width:20px">
                    </a>
                </td>
                <td v-show="model.state != 50 && model.state != 60">
                    <a
                        href="#"
                        v-if="model.deleted_at == null || model.deleted_at == ''"
                        @click="showDecl=true;setModelClose(model)"
                    >
                        <img
                            src="../../../static/images/iconBest/canc.png"
                            title="Отказ"
                            style="max-width:20px"
                        >
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
          </tbody>
          <tr  v-if="showDecl==true"   >
              <button type="button" class="close" @click="showDecl=false" aria-hidden="true">×</button>
              <div style="font-size: 70%; text-align:right">Выбирите причины отказа</div>
              <select class="select"  v-model="declinematter_id">
                    <option  v-for="item in declinematters" :key="item.id" :value="item.id" >{{item.name}}</option>
              </select>
              <button class="btn btn-success"  @click="toClose()">Сохранить</button>
          </tr>
        </table>
          <!----Редактировать заявку---->
          <div class="row justify-content-center" style="margin-top: 30px" v-if="isEdit">
              <h4>Редактировать ЭК</h4>
          </div>
          <div class="row justify-content-center" v-if="isEdit">
                  <div class="row container" >
                      <div class="col-4 offset-4">
                          <div class="row" style="margin-top: 30px">
                              <div style="font-size: 70%; margin-right: 70%;">Дата контакта</div>
                              <date-picker v-model="edit.contactdate"  valueType="format" ></date-picker>
                          </div>
                          <div class="row"  style="margin-top: 30px">
                                <div style="font-size: 70%; text-align:right">Менеджер</div>
                                <select class="select"  v-model="edit.manager" >
                                    <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                </select>
                          </div>
                          <div class="row"  style="margin-top: 30px">
                                <div style="font-size: 70%;text-align:right">Источник</div>
                                <select class="select"  v-model="edit.source_id" @change="editingSource()">
                                    <option  v-for="status in sources" :key="status.id" :value="status.id" >{{status.name}}</option>
                                </select>
                          </div>
                          <div v-if="edit.source_id == 15" class="row custom_block" style="margin-top: 30px">
                                <div style="font-size: 70%;text-align:right">От кого</div>
                                <input type="text" class="form-control" v-model="edit.from_who" @keydown="changeEditFromWho">
                                <div v-if="isShowListUsers && filtered_edit_users.length != 0" class="custom_list custom_list_edit">
                                    <p @click="setEditFromWhoName(edit.from_who)">{{ edit.from_who }}</p>
                                    <p v-for="user in filtered_edit_users" v-show="user.status == 20" @click="setEditFromWhoName(user.username)" :key="user.id" :value="user.id" >{{ user.username }}</p>
                                </div>
                          </div>
                           <div class="row"  style="margin-top: 30px">
                                <div style="font-size: 70%; text-align:right;">Состояние</div>
                                <select class="select"  v-model="edit.state">
                                    <option  v-for="status in statusLead" :key="status.id" :value="status.id" >{{status.name}}</option>
                                </select>
                          </div>
                          <div class="row"  style="margin-top: 30px">
                                  <div style="font-size: 70%; text-align:right;">Интерес</div>
                                  <input type="text" class="form-control" v-model="edit.interesttype">
                          </div>
                          <div style="height: 200px;margin-top: 30px">
                                <button class="btn btn-success"  @click="update">Сохранить</button>
                          </div>
                    </div>
                    <div class="col-1">
                        <button type="button" class="close" @click="closeEdit" aria-hidden="true">×</button>
                    </div>
              </div>
          </div>
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
    name: 'lead',
    props:['showButtonForm','clients_id', 'mybuisness','panel'],
    data () {
        return {
            showForm: false,
            form:{
                clients_id: this.clients_id,
                contactdate: this.inDate(new Date()),
                manager: '',
                comment: '',
                status_id: 1,
                description: '',
                source_id: '',
                from_who: '',
            },
            search: null,
            page: null,
            edit: {},
            isEdit: false,
            declinematter_id: null,
            showDecl: false,
            modelClose: null,
            isShowListUsers: false,
        }
    },
    components: {
        VueConfirmationButton: vueConfirmationButton,
        pagination,
        DatePicker
    },
    watch: {
        sourceIdForm() {
            this.form.from_who = ''
        },
        fromWhoForm(val) {
            if (val.length >= 2) {
                this.isShowListUsers = true
            }else{
                this.isShowListUsers = false
            }
        },
    },
    computed: {
        ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'lead/datalist',
            pagination: 'lead/pagination',
            storeForm: 'mybuisness/form',
            users: 'app/users',
            citys: 'city/datalist',
            sources: 'source/datalist',
            createLead: 'app/createLead',
            statusLead: 'dictionary/statusLead',
            declinematters: 'declinematter/datalist'
        }),
        sourceIdForm() {
            return this.form.source_id
        },
        fromWhoForm() {
            return this.form.from_who
        },
        editFromWhoForm() {
            return this.edit.from_who
        },
        filtered_users() {
            if(!this.form.from_who){
                return [];
            }
            return this.users.filter(user => {
                return user.username.toLowerCase().indexOf(this.form.from_who.toLowerCase()) != -1
            })
        },
        filtered_edit_users() {
            if(!this.edit.from_who){
                return [];
            }
            return this.users.filter(user => {
                return user.username.toLowerCase().indexOf(this.edit.from_who.toLowerCase()) != -1
            })
        },
    },
    methods: {
        ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader'
        }),
        ...Vuex.mapActions({
            save: 'lead/save',
            find: 'lead/find',
            drop: 'lead/delete',
            findSource: 'source/find',
            restore: 'lead/restore',
            close: 'lead/close',
            declinemFind: 'declinematter/find'
        }),
        closeEdit() {
            this.edit = {}
            this.isEdit = false
        },
        changeEditFromWho() {
            if (this.edit.from_who.length >= 2) {
                this.isShowListUsers = true
            }else{
                this.isShowListUsers = false
            }
        },
        setFromWhoName(name) {
            this.form.from_who = name
            setTimeout(() => {
                this.isShowListUsers = false
            }, 100)
        },
        setEditFromWhoName(name) {
            this.edit.from_who = name
            setTimeout(() => {
                this.isShowListUsers = false
            }, 100)
        },       
        editingSource() {
            this.edit.from_who = ''
        },
        saveData(){
            if (this.form.source_id == 15 && this.form.from_who == '') {
                this.setError('Вы выбрали источник "По рекомендации", но не выбрали от кого!')
                return
            }

            this.setError(null)
            if(this.form.clients_id == null){
                this.form.clients_id = this.clients_id
            }
            this.save(this.form)
                .then(() =>{
                    this.showForm = false
                    this.form.comment = ''
                    this.form.description = ''
                    this.form.source_id = ''

                    if(this.mybuisness == true){
                        this.find(this.storeForm)
                    }

                    if(this.panel == true){
                        this.find({clients_id: this.clients_id})
                    }
                })
        },
        update() {
            if (this.edit.source_id == null) {
                this.setError("Поле источник не может быть пустым!")
                return
            }

            if (this.edit.source_id == 15 && this.edit.from_who == '') {
                this.setError('Вы выбрали источник "По рекомендации", но не выбрали от кого!')
                return
            }

            this.setError(null)
            this.save(this.edit)
                .then(() =>{
                    this.edit = {}
                    this.isEdit = false
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
            this.isEdit = true
        },
        setPage(i){
          this.page = i
          if(this.clients_id){
              this.find({page: this.page,clients_id: this.clients_id})
          }else{
              this.storeForm.page = this.page
              this.find(this.storeForm)
          }
          
        },
        toCreateAppls(model){
            this.$router.push('/create/createAppls/'+ model.id +'='+ model.clients_id +'='+this.$route.name)
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
        getSources(id){
            var result = {}
            this.sources.map((el) => {
                if (id == el.id) {
                    result = el
                }
            })
            return result
        },
      toComments(id){
          this.$store.commit('comments/setValComment', { object_id:id, type:10, component:'lead', radom: Math.random().toFixed(2)}, {root: true})
      },
      toShow(id){
          this.$router.push('../../clients/show/' + id)
      },
      getStatus(id){
          var result = {}
          this.statusLead.map((el) => {
              if(id == el.id){
                  result = el
              }
          })
          return result
      },
      getClassRow(model){
          return [model.deleted_at != null ? 'disabled' : '' , model.state == 50 ? 'danger' : '', model.state == 60 ? 'success' : '']
      }
    },
    created() {
        this.setHeader('ЭК')
        this.page = this.pagination.page
        this.findSource()
        this.declinemFind()
    }
  }
</script>
<style>
    .disabled {
      color:lightgrey;
    }
    .custom_block{
        position: relative;
    }

    .custom_block .custom_list{
        position: absolute;
        background-color: white;
        border: 1px solid grey;
        border-radius: 4px;
        width: 100%;
        max-height: 300px;
        overflow-x: auto;
        z-index: 100;
    }

    .custom_block .custom_list p{
        margin-bottom: 0px;
        padding: 10px;
        font-size: 15px;
    }

    .custom_block .custom_list p:hover{
        cursor: pointer;
        background-color: rgb(202, 202, 202);
    }

    .custom_list_edit{
        top: 62px;
    }
</style>
