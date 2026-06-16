<template>
  <section>
      <div class="form-row justify-content-end">
           <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:20px"  v-if="edit == null " >
        <tr  v-show="showDecl==false">
            <th></th>
            <th>№</th>
            <th v-if="our_cost">Город</th>
            <th>Дата контакта</th>
            <th>Менеджер</th>
            <th>Организация</th>
            <th>Продукция</th>
            <th>Документ</th>
            <th>Рассчитывает</th>
            <th>Комментарий</th>
            <th>Документы на руки	</th>
            <th>ЛПР</th>
            <th>Др. предложение	</th>
            <th>Для чего документ</th>
            <th>Итого</th>
            <th v-if="our_cost">Себестоимость</th>
            <th v-if="tax" >Маржа</th>
            <th>Источник</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
        <tbody v-for="model in datalist" :key="model.id" >
          <tr  :class="getClassRow(model)"   v-show="showDecl==false">
              <td>
                  <a href="#">
                      <img  src="../../../static/images/iconsColors/eye.svg"
                            style="max-width:20px"
                            @click="showAppls(model)">
                  </a>
              </td>
              <td>{{ model.id}}</td>
              <td v-if="our_cost">{{ getCity(model.city_id).name }}</td>
              <td>{{inDateTime(model.contactdate)}}</td>
              <td>{{ getManager(model.manager_id).username }}</td>
              <td><a  target="_blank"  :href="'/clients/show/'+ model.clients_id+''" >{{model.name}}</a></td>
              <td>{{model.nameproduct}}</td>
              <td>{{getDocumentName(model.document_id).name}}</td>
              <td>{{ getManager(model.countmanager_id).username }}</td>
              <td>{{model.comment}}<a href="#" @click="toComments(model)"><i :class="[model.deleted_at != null ? '' : 'fas fa-comment']" ></i></a></td>
              <td>{{(model.doc_on_hand)}}</td>
              <td>{{getLpr(model.is_lpr).name}}</td>
              <td>{{model.another_offer}}</td>
              <td>{{(model.doc_for_what)}}</td>
              <td >{{model.total}}</td>
              <td v-if="our_cost">{{model.our_cost}}</td>
              <td v-if="tax" >{{ Number(model.total)- Number(model.our_cost) }}</td>
              <td>{{getSource(model.source_id).name}}</td>
              <td  >
                    <a  a href="#"
                        v-if="model.deleted_at == null || model.deleted_at == ''"

                        @click="toChange(model)">
                              <img  src="../../../static/images/iconsColors/edit.png"
                                    title="Редактировать"
                                    style="max-width:20px"
                                    v-if="model.state != 10 && model.state != 20">
                    </a>
              </td>
              <td >
                  <a    href="#"
                        v-if="model.state != 10 && model.state != 20">
                        <i
                              class="fa fa-angle-double-right"
                              title="Создать Коммерческое"
                              @click="toCreateKp(model)"></i>
                  </a>
            </td>
            <td   v-show="model.state == 10 || model.state == 20">
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
            <td v-show="model.state != 10 && model.state != 20">
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
      </tbody>
      <tr  v-if="showDecl==true"   >
            <button type="button" class="close" @click="showDecl=false" aria-hidden="true">×</button>
            <div style="font-size: 70%; text-align:right">Выбирите причины отказа</div>
            <select class="select"  v-model="declinematter_id" >
                  <option  v-for="item in declinematters" :key="item.id" :value="item.id" >{{item.name}}</option>
            </select>
            <button class="btn btn-success"  @click="toClose()">Сохранить</button>
      </tr>
      </table>
         <!----Редактировать заявку---->
            <h4 style="margin: auto"  class="row justify-content-center" v-if="edit != null ">Редактировать заявку</h4>
            <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
            <div class="row justify-content-center" v-if="edit != null">

            <div class="col-1"></div>
            <div class="col-9 ">
                  <div class="row">
                        <!---1part---->
                        <div class="col-5 offset-1">
                              <div class="row" style="margin-top: 30px">
                                    <div style="font-size: 70%; margin-right: 70%">Дата контакта</div>
                                    <date-picker v-model="edit.contactdate"  valueType="format" ></date-picker>
                              </div>
                              <div class="row" style="margin-top: 30px">
                                    <div style="font-size: 70%; margin-right: 60%">Документ нужен на руки</div>
                                    <date-picker v-model="edit.doc_on_hand"  valueType="format" ></date-picker>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%;text-align:right">Рассчитывает</div>
                                    <select class="select"  v-model="edit.countmanager_id" >
                                          <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                    </select>
                              </div>

                              <div class="row"  style="margin-top: 30px">
                                   <div style=" font-size: 70%;margin-right: 90%;">ЛПР</div>
                                    <select  class="select"  v-model="form.is_lpr" >
                                          <option value="10"> Да</option>
                                          <option value="20">Нет</option>
                                    </select>
                              </div>

                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:right">Область применения</div>
                                    <input type="text" class="form-control" v-model="edit.field" >
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:right">Страна заявитель</div>
                                    <input type="text" class="form-control" v-model="edit.countryask" >
                              </div>
                                <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:right;">Страна изготовитель</div>
                                    <input type="text" class="form-control" v-model="edit.countrymade" >
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%;text-align:right">Реальные испытания</div>
                                    <select class="select"  v-model="edit.test" @keypress.enter.prevent="this.edit.test">
                                          <option value="10">ДА</option>
                                          <option value="20">НЕТ</option>
                                    </select>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style=" font-size: 70%;text-align:right">Выезд</div>
                                    <select class="select"  v-model="edit.exittoclient" @keypress.enter.prevent="this.edit.exittoclient">
                                          <option value="10">ДА</option>
                                          <option value="20">НЕТ</option>
                                    </select>
                              </div>
                        </div>
                        <!---2part---->
                        <div class="col-5 offset-1">
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:right">Менеджер</div>
                                    <select class="select"  v-model="edit.manager_id" >
                                          <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                    </select>
                              </div>

                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:right">Др. предложения</div>
                                    <textarea class="form-control"  v-model="edit.another_offer" placeholder="Др. предложения" style="height: 100px;"  ></textarea>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:right">Для чего документ</div>
                                    <textarea class="form-control"  v-model="edit.doc_for_what" placeholder="Для чего документ" style="height: 100px;"  ></textarea>
                              </div>
                                    <div class="row"  style="margin-top: 30px">
                                          <div style="font-size: 70%; text-align:right">ОКП</div>
                                          <input type="text" class="form-control" v-model="edit.okp" >
                                    </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; margin-right: 70%;">ТНВЭД</div>
                                    <input type="text" class="form-control" v-model="edit.tnved" >
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%;text-align:right;">ОКПД2</div>
                                    <input type="text" class="form-control" v-model="edit.okpd2" >
                              </div>

                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:right">По какому документу выпуск</div>
                                    <input type="text" class="form-control" v-model="edit.documentprod" >
                              </div>

                        </div>

                  </div>
                  <div style="margin-top: 10px"  class="row justify-content-center" >
                              <button class="btn btn-success"  @click="update">Сохранить</button>
                        </div>
                  <div style="height: 200px;" ></div>
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
    mixins: [Acl, dateFunc],
    name: 'application',
    props:['our_cost', 'tax',  'mybuisness','panel', 'clients_id'],
    data () {
      return {
        form:{},
          search: null,
          page: null,
          edit: null,
          declinematter_id: null,
          showDecl: false,
          modelClose: null
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
            datalist: 'application/datalist',
            pagination: 'application/pagination',
            storeForm: 'mybuisness/form',
            citys: 'city/datalist',
            users: 'app/users',
            sources: 'source/datalist',
            is_lpr: 'dictionary/is_LprList',
            arrDocAll: 'document/arrDocAll',
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
            save: 'application/save',
            find: 'application/find',
            drop: 'application/delete',
            getSource: 'source/find',
            findCity: 'city/findAll',
            findDoc: 'document/findAll',
            restore: 'application/restore',
            close: 'application/close',
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
      },
      setModelClose(model){
           this.modelClose = Object.assign({}, model)
      },
      toChange(model){
            this.edit = Object.assign({}, model)
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
      getCity(id){
            var result = {}
            this.citys.map((el) => {
            if (id == el.id) {
                  result = el
                }
            })
            return result
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
      getSource(id){
            var result = {}
            this.sources.map((el) => {
            if (id == el.id) {
                  result = el
                }
            })
            return result
      },
      getLpr(id){
        var result = {}
        this.is_lpr.map((el) => {
           if(id == el.id){
             result = el
           }
        })
        return result
      },
      toCreateKp(model){
        this.$router.push('/create/createKp/'+ model.clients_id + '=' + model.id +'='+ this.$route.name)
      },
      toShow(id){
         this.$router.push('../../clients/show/' + id)
      },
      toComments(model){
          this.$store.commit('comments/setValComment', {object_id: model.id ,type:20, component:'application',radom: Math.random().toFixed(2)}, {root: true})
      },
      showAppls(model){
         this.$router.push('/application/showAppls/'+ model.clients_id + '=' + model.id)
      },
      getDocumentName(id){
            if(this.arrDocAll == null){
                  return
            }
            var result = {}
            this.arrDocAll.map((el) => {
                  if(id == el.id){
                  result = el
                  }
            })
            return result
      },
      getClassRow(model){
        return [model.deleted_at != null ? 'disabled' : '' , model.state == 20 ? 'danger' : '', model.state == 10 ? 'success' : '']
      }
    },
    created() {
      this.setHeader('Заявки')
      this.page = this.pagination.page
      this.getSource()
      this.findCity()
      this.findDoc()
      this.declinemFind()

    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
  .green{
    background-color: green
  }
</style>
