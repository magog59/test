<template>
  <section >
      <div class="form-row justify-content-end" v-if="edit == null || isChangeComment">
         <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:20px"  v-if="edit == null || isChangeComment">
        <tr  v-show="showDecl==false">
            <th>#</th>
            <th>Заявка</th>
            <th>Cтатус</th>
            <th>Город</th>
            <th>Дата контакта</th>
            <th>Менеджер</th>
            <th>Документы на руки</th>
            <th>ЛПР</th>
            <th>Организация</th>
            <th>Продукция</th>
            <th>Комментарий</th>
            <th>Документ</th>
            <th>Итого</th>
            <th v-if="panel">Себестоимость</th>
            <th >Маржа</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
        <tbody v-for="model in datalist" :key="model.idx">
            <tr v-if="(edit == null || edit.id != model.id) || isChangeComment"
                   :class="getClassRow(model)"
                   v-show="showDecl==false"
            >
              <td>{{model.id}}</td>
              <td>{{model.application_id}}</td>
              <td>{{getStatus(model.state).name}}</td>
              <td>{{getCity(model.city_id).name}}</td>
              <td>{{inDate(model.contactdate)}}</td>
              <td>{{getManager(model.manager_id).username}}</td>
              <td>{{ (model.doc_on_hand) }}</td>
              <td>{{getLpr(model.is_lpr).name}}</td>
              <td>
                    <a   target="_blank"  :href="'/clients/show/'+ model.clients_id+''"
                          v-if="model.deleted_at == null || model.deleted_at == ''"
                          >{{model.name}}

                    </a>
              </td>
              <td>{{model.nameproduct}}</td>
              <td @click="openChangeComment(model)" style="cursor: pointer;">
                <p v-if="!isChangeComment" style="font-size: 15px; margin-bottom: 0;">
                    {{model.comment}}
                </p>
                <input type="text" v-if="isChangeComment" @keypress.enter="closeChangeComment" v-model="edit.comment">
                </td>
              <td>{{getDocumentName(model.document_id).name}}</td>
              <td>{{model.total}}</td>
              <td v-if="panel">{{model.our_cost}}</td>
               <td >{{ Number(model.total)- Number(model.our_cost) }} </td>
              <td>
                  <a
                      href="#"
                      v-if="model.deleted_at == null || model.deleted_at == ''"
                      @click="showItem(model)">
                        <img  src="../../../static/images/iconsColors/user-interface.svg"
                            title="Состав"
                            style="max-width:20px"
                        >
                  </a>
              </td>
              <td>
                    <a
                        v-if="model.deleted_at == null || model.deleted_at == ''"
                        target="_blank" :href="'https://api.srcert.ru/index.php/kp/print?id='+ model.id+''"
                        >
                        <img   src="../../../static/images/iconsColors/printer.svg"
                                title="Напечатать "
                                style="max-width:20px"
                                >
                    </a>
              </td>
              <td>
                  <a
                        href="#"
                        v-if="model.deleted_at == null || model.deleted_at == ''"
                        @click="toSendMail(model.id)">
                        <img  src="../../../static/images/iconsColors/mail.svg"
                              title="Отправить"
                              style="max-width:17px"
                        >
                  </a>
              </td>
              <td>
                  <a    href="#"
                        v-if="model.deleted_at == null || model.deleted_at == ''">
                        <i
                            class="fa fa-angle-double-right"
                            title="Создать Договор"
                            @click="toCreateСontract(model)"
                            v-if="model.state != 40 && model.state != 50">
                        </i>
                  </a>
              </td>
              <td >
                    <a
                        href="#"
                        v-if="model.deleted_at == null || model.deleted_at == ''"
                        @click="toChange(model)"
                    >
                            <img
                                src="../../../static/images/iconsColors/edit.png"
                                title="Редактировать"
                                style="max-width:20px"
                                v-if="model.state != 40 && model.state != 50"
                            >
                  </a>
            </td>
            <td   v-show="model.state == 50 || model.state == 40">
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
             <td v-show="model.state != 50 && model.state != 40">
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
        </tbody>
         <tr  v-if="showDecl==true"   >
              <button type="button" class="close" @click="showDecl=false" aria-hidden="true">×</button>
               <div style="font-size: 70%; text-align:rigth">Выбирите причины отказа</div>
              <select class="select"  v-model="declinematter_id">
                  <option  v-for="item in declinematters" :key="item.id" :value="item.id" >{{item.name}}</option>
              </select>
              <button class="btn btn-success"  @click="toClose()">Сохранить</button>
        </tr>
           <tr style="text-align: left" v-if="mybuisness"  v-show="showDecl==false">
              <th>Итого</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th v-if=" mybuisness" style="width: 70px">{{getSumm('total')}}</th>
              <th v-if=" mybuisness" style="width: 70px">{{getSumm('total') -getSumm('our_cost') }}</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>

          </tr>
      </table>
        <div class="row" v-if="edit != null && !isChangeComment">
              <h4 style="margin: auto">Редактировать коммерческие</h4>
              <div class="col-1"></div>
              <div class="col-9 ">
                     <!----Редактировать компанию---->
                    <div class="row">
                        <!---1part---->
                        <div class="col-5 offset-4">
                           <div class="row" style="margin-top: 30px">
                                  <div style="font-size: 70%; margin-right: 70%;">Дата контакта</div>
                                  <date-picker v-model="edit.contactdate"   valueType="format" ></date-picker>
                            </div>
                            <div class="row"  style="margin-top: 30px">
                                  <div style="font-size: 70%; margin-right: 70%;">Менеджер</div>
                                  <select class="select"  v-model="edit.manager_id" >
                                      <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                  </select>
                            </div>
                             <div class="row"  style="margin-top: 30px">
                                  <div style="font-size: 70%; margin-right: 70%;">Состояние</div>
                                  <select class="select"  v-model="edit.state" >
                                      <option  v-for="status in statuses" :key="status.id" :value="status.id" >{{status.name}}</option>
                                  </select>
                            </div>
                            <div class="row"  style="margin-top: 30px">
                                <div style="font-size: 70%; margin-right: 70%;">И.О.клиента</div>
                                <input type="text" class="form-control" v-model="edit.client_name" >
                            </div>
                            <div style="margin-top: 30px" >
                                <button class="btn btn-success"  @click="update">Сохранить</button>
                            </div>

                        </div>
                    </div>
              </div>
              <div class="col-1">
                  <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
              </div>
        </div>
  </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import vueConfirmationButton from '../../utils/confirmButton'
  import pagination from "../../utils/pagination"
  import dateFunc from '../../utils/dateFunc'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'


  export default {
    mixins: [Acl, dateFunc],
    name: 'kp',
    props:['panel', 'mybuisness', 'clients_id'],
    data () {
      return {
          form:{},
          search: null,
          page: null,
          edit: null,
          declinematter_id: null,
          showDecl: false,
          modelClose: null,
          isChangeComment: false,
      }
    },
    components: {
      VueConfirmationButton: vueConfirmationButton,
      pagination,
      DatePicker,
    },
    computed: {
      ...Vuex.mapGetters({
          apiUrl: 'app/apiUrl',
          datalist: 'kp/datalist',
          pagination: 'kp/pagination',
          storeForm: 'mybuisness/form',
          users: 'app/users',
          citys: 'city/datalist',
          statuses: 'dictionary/kpStatuses',
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
                save: 'kp/save',
                find: 'kp/find',
                drop: 'kp/delete',
                findDoc: 'document/findAll',
                restore: 'kp/restore',
                close: 'kp/close',
                declinemFind: 'declinematter/find'
        }),
        openChangeComment(model) {
            this.isChangeComment = true
            this.edit = Object.assign({}, model)
        },
        closeChangeComment() {
            this.setError(null)
            this.save(this.edit)
            .then(() =>{
                this.edit = null
                this.isChangeComment = false
                if(this.mybuisness==true){
                    this.find(this.storeForm)
                }
                if(this.panel==true){
                    this.find({clients_id: this.clients_id})
                }
            })
        },
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
            this.storeForm.page = this.page
            this.find(this.storeForm)
        },
        getManager(id){
            var result = {}
            this.users.map((el) => {
                    if(id == el.id){
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
            this.statuses.map((el) => {
                if(id == el.id){
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
        toCreateСontract(model){
            this.$router.push('/create/createContract/'+ model.clients_id + '=' + model.id+'='+ this.$route.name)
        },
        toComments(model){
            this.$store.commit('comments/setValComment', {object_id: model.id, type: 40, component:'kp', radom: Math.random().toFixed(2) }, {root: true})
        },
        toShow(id){
            this.$router.push('../../clients/show/' + id)
        },
        toPrintKp(id){
            return "https://api.srcert.ru/index.php/kp/print?id="+ id
        },
        showItem(model){
            this.$store.commit('item/setShowItem', {state:true, kp_id: model.id})
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
        getSumm(column){
        var summ = 0
            this.datalist.map(elem => {
            summ += +elem[column]
            })
            return summ
        },
        getClassRow(model){
            return [model.deleted_at != null ? 'disabled' : '' , model.state == 50 ? 'danger' : '', model.state == 40 ? 'success' : '']
        }
    },
  created() {
        this.setHeader('Коммерческие')
        this.page = this.pagination.page
        this.findDoc()
        this.declinemFind()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
</style>
