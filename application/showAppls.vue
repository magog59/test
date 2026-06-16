<template>
    <section>
        <div style="text-align: left"  v-if="appl != null && (edit == null || edit.id != appl.id)">
            <div class="row" >
                <div class="col-1"></div>
                <div class="col-10 "  :class="getClassRow(appl)" >
                    <p>Заявка № {{appl.id}} ,клиент: <a href="#" @click="showCompany(appl.clients_id)">{{appl.name}}</a><button type="button" class="close" @click="returnTo()" aria-hidden="true">×</button></p>
                </div>
            </div>
            <div class="row" v-if="edit == null || edit.id != appl.id"  style="font-size: 14px" >
                    <div class="col-1"></div>
                    <div class="col-3" style="" >
                            <b>Дата контакта: </b>{{inDate(appl.contactdate) }}<br>
                            <b>Менеджер :</b>{{ getUser(appl.manager_id).username }}<br>
                            <b>Рассчитывает: </b>{{ getUser(appl.countmanager_id).username }}<br>
                            <b>Документ нужен на руки: </b>{{ inDate(appl.doc_on_hand)}}<br>
                            <b>ЛПР: </b>{{ getYesNoList(appl.is_lpr).name}}<br>
                    </div>
                    <div class="col-3 ">
                            <b>Др. предложения: </b>{{ appl.another_offer}}<br>
                            <b>Для чего документ: </b>{{ appl.doc_for_what }}<br>
                            <b>ОКП: </b>{{ appl.okp }}<br>
                            <b>ОКПД2: </b>{{ appl.okpd2 }}<br>
                            <b>ТНВЭД: </b>{{ appl.tnved }}<br>
                    </div>
                    <div class="col-3 ">
                        <b>По какому документу выпуск: </b>{{ appl.documentprod }}<br>
                        <b>Область применения: </b>{{ appl.field }}<br>
                        <b>Страна изготовитель: </b>{{ appl.countrymade }}<br>
                        <b>Страна заявитель: </b>{{ appl.countryask }}<br>
                        <b>Выезд: </b>{{ getYesNoList(appl.exittoclient).name }}<br>
                        <b>Реальные испытания: </b>{{ getYesNoList(appl.test).name }}<br>
                    </div>
                    <div class="col-1"></div>
            </div>
        </div>
          <!----icon pensil---->
        <div class="row">
            <div class="col-1 offset-1 justify-content-right">
                <a href="#"  >
                      <img
                            src="../../../static/images/iconsColors/edit.png"
                            title="Редактировать"
                            style="max-width:20px"
                            @click="toChange(appl)"
                            v-if="edit == null"
                      >
                </a>
            </div>
        </div>
           <!----Редактировать заявку---->
          <h4 style="margin: auto" v-if="edit != null">Редактировать заявку</h4>
          <div class="row justify-content-center " v-if="edit != null">
                    <div class="row">
                          <!---1part---->
                          <div class="col-5 offset-1" style="margin-top: 30px">
                              <div class="row" >
                                <div style="font-size: 70%; margin-right: 70%;">Дата контакта</div>
                                  <date-picker v-model="edit.contactdate" :format="'DD.MM.YYYY mm:ss'" valueType="format" ></date-picker>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">Рассчитывает</div>
                                    <select class="select"  v-model="edit.countmanager_id" >
                                        <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                    </select>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">ОКП</div>
                                    <input type="text" class="form-control" v-model="edit.okp" >
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">ТНВЭД</div>
                                    <input type="text" class="form-control" v-model="edit.tnved" >
                              </div>
                                <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">ОКПД2</div>
                                    <input type="text" class="form-control" v-model="edit.okpd2" >
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">По какому документу выпуск</div>
                                    <input type="text" class="form-control" v-model="edit.documentprod" >
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">Область применения</div>
                                    <input type="text" class="form-control" v-model="edit.field" >
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">Страна заявитель</div>
                                    <input type="text" class="form-control" v-model="edit.countryask" >
                              </div>
                                <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">Страна изготовитель</div>
                                    <input type="text" class="form-control" v-model="edit.countrymade" >
                              </div>

                          </div>
                          <!---2part---->
                          <div class="col-5 offset-1">
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">Менеджер</div>
                                    <select class="select"  v-model="edit.manager_id" >
                                        <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                    </select>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%;margin-right: 60%;">Документ нужен на руки</div>
                                    <date-picker v-model="edit.doc_on_hand" :format="'DD.MM.YYYY mm:ss'" valueType="format" ></date-picker>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">Др. предложения</div>
                                    <textarea class="form-control"  v-model="edit.another_offer" placeholder="Для чего документ" style="height: 100px;"  ></textarea>
                              </div>
                               <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth">ЛПР</div>
                                    <textarea class="form-control"  v-model="edit.is_lpr" placeholder="Для чего документ" style="height: 100px;"  ></textarea>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; text-align:rigth;">Для чего документ</div>
                                    <textarea class="form-control"  v-model="edit.doc_for_what" placeholder="Для чего документ" style="height: 100px;"  ></textarea>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                  <div style=" font-size: 70%;text-align:rigth">Выезд</div>
                                  <select class="select"  v-model="form.exittoclient" @keypress.enter.prevent="this.form.exittoclient">
                                          <option value="10">ДА</option>
                                          <option value="20">НЕТ</option>
                                  </select>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                      <div style=" font-size: 70%;text-align:rigth">Реальные испытания</div>
                                      <select class="select"  v-model="form.test" @keypress.enter.prevent="this.form.test">
                                              <option value="10">ДА</option>
                                              <option value="20">НЕТ</option>
                                      </select>
                              </div>
                          </div>
                          <div class="col-3" style="margin-top: 30px" >
                              <button class="btn btn-success"  @click="update">Сохранить</button>
                          </div>

                          <div style="height: 200px;"></div>
                    </div>
                    <div class="col-1">
                          <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
                    </div>
                </div>
        <!-----endForm----->

        <div class="row" style="margin-top: 30px"  v-if="edit == null || edit.id != appl.id">
                <div class="col-1"></div>
                <div class="col-10">
                    <div class="panel row">
                        <div class="col" >
                            <a href="#" @click="showComponent('commentVar')" >Комментарии</a>
                        </div>
                        <div class="col">
                            <a href="#" @click="showComponent('itemVar')" >Расчеты </a>
                        </div>
                        <div class="col">
                            <a href="#" @click="showComponent()"  >Файлы</a>
                        </div>
                        <div class="col">
                            <a href="#" @click="lead=showComponent()"  >Почта</a>
                        </div>
                    </div>
              </div>
        </div>
        <div class="row"  v-if="edit == null || edit.id != appl.id">
              <div class="col-1"></div>
              <div class="col-10" >
                  <commentAppl  v-show="commentVar" :application_id="application_id"  ></commentAppl>
                  <item v-show="itemVar" :application_id ="application_id"  :showButton="true"  ></item>
              </div>
              <div  class="col-1"></div>
        </div>
    </section>
</template>
<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import commentAppl from './components/commentAppl'
  import Item from '../item/index'
  import dateFunc from '../../utils/dateFunc'
  import goTo from '../../utils/goTo'
   import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'

export default {
    mixins: [Acl, dateFunc,goTo],
    name: 'showAppls',
    data () {
      return {
        commentVar: false,
        itemVar: false,
        form:{},
        application_id: null,
        clients_id:null,
        search: null,
        page: null,
        edit: null,
        user: null,
        // object_id: null,
        // id: this.$route.params.id
      }
    },
    components: {
      commentAppl:commentAppl,
      Item,
      DatePicker,
    },
    computed: {
      ...Vuex.mapGetters({
          apiUrl: 'app/apiUrl',
          appls: 'application/datalist',
          users: 'app/users',
          yesNoList: 'dictionary/yesNoList',
          clientType:'dictionary/clientType',
          arrDocAll: 'document/arrDocAll',
      }),
      appl(){
          var obj =  Object.assign({}, this.appls)
          return obj[0]
      },
    },
    methods: {
      ...Vuex.mapMutations({
          setMessage: 'app/setMessage',
          setError: 'app/setError',
          setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
           find: 'application/findOnId',
           save: 'application/save',
           findUsers: 'app/getUsers',
            findAllDocument: 'document/findAll',
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
        this.find(this.application_id)
      },
      returnTo(){
        this.$router.push('../../clients/show/'+ this.clients_id)
      },
      getUser(id) {
          var result = {}
          this.users.map((el) => {
              if (id == el.id) {
                result = el
              }
          })
          return result
      },
      getYesNoList(id){
          var res = {}
          this.yesNoList.map((el) => {
            if(id == el.id){
                res = el
            }
          })
          return res
      },
      getClientType(id){
          var res = {}
          this.clientType.map((el) => {
            if(id == el.id){
                res = el
            }
          })
          return res
      },
      showComponent(comp){
            this.itemVar = false
            this.commentVar = false

            if(comp != null && comp != '') {
                this[comp] = true
            }
        },
        getParams(){
          var obj = this.$route.params.id
          var arr = obj.split('=')
          this.clients_id = arr[0]
          this.application_id = arr[1]
      },
      getClassRow(model){
            return [model.deleted_at != null ? 'disabled' : '' , model.state == 20 ? 'danger' : '', model.state == 10 ? 'success' : '', model.state == null  ? 'grey ': '']
      }
    },
    created() {
      this.findAllDocument()
      this.getParams()
      this.findData()
      this.setHeader('Заявка')
      this.findUsers()

    }
  }
</script>
<style >
.grey{
  background-color: #bdccd7
}
</style>
