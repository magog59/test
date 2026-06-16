<template>
    <section>
        <div style="text-align: left"  v-if="edit == null || edit.id != appl.id">
            <div class="row" >
                <div class="col-1"></div>
                <div class="col-9 " style="background-color: #bdccd7">
                    <p>ОРК № {{appl.id}} ,клиент: <a  target="_blank"  :href="'/clients/show/'+ clients_id+''" >{{nameCompany}}</a></p>
                </div>
                <div class="col-1">
                    <button type="button" class="close" @click="returnTo()" aria-hidden="true">×</button>
                </div>
            </div>  
            <div class="row" v-if="edit == null || edit.id != appl.id" >
                    <div class="col-1"></div>
                    <div class="col-5" style="" >
                            <b>Дата контакта: </b>{{inDate(appl.contactdate) }}<br>  			         
                            <b>Менеджер :</b>{{ getUser(appl.manager_id).username }}<br> 	  
                            <b>Дата оплаты: </b>{{ inDate(appl.pay_date) }}<br> 	  
                            <b>Дата предоставления док-тов клиентом: </b>{{ inDate(appl.clientdoc_date)}}<br> 
                            <b>Дата планируемого закрытия: </b>{{ inDate(appl.close_date)}}<br> 
                    </div>
                    <div class="col-5 offset-1 ">
                            <b>Номер сертификата: </b>{{ appl.sert_num}}<br>
                            <b>Срок действия: </b>{{ appl.license_to }}<br> 
                            <b>Дата получения: </b>{{ inDate(appl.get_date) }}<br> 
                            <b>Номер акта: </b>{{ appl.act_num }}<br> 
                            <b>Выдавший орган: </b>{{ appl.act_organ }}<br> 
                    </div>
                  
                    <div class="col-1"></div>
            </div>
        </div> 
           <!----Редактировать ОРК---->
          <h4 style="margin: auto" v-if="edit != null">Редактировать ОРК</h4>
          <div class="row justify-content-center " v-if="edit != null">
                    <div class="row">
                          <!---1part---->
                        <div class="col-5 offset-1">
                            <div class="row" style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 50%;">Дата контакта</div>
                                    <date-picker v-model="edit.contactdate"  valueType="format" ></date-picker>
                            </div>
                            <div class="row" style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 50%;">Дата оплаты</div>
                                    <date-picker v-model="edit.pay_date"  valueType="format" ></date-picker>
                            </div>
                            <div class="row" style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 30%;">Дата предоставления док-тов клиентом</div>
                                    <date-picker v-model="edit.clientdoc_date"  valueType="format" ></date-picker>
                            </div>
                              <div class="row" style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 50%;">Дата планируемого закрытия</div>
                                    <date-picker v-model="edit.close_date"  valueType="format" ></date-picker>
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; text-align:rigth">Номер акта</div>
                                    <input type="text" class="form-control" v-model="edit.act_num" > 
                            </div>
                        </div>
                        <!---2part---->
                        <div class="col-5 offset-1">
                            <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; text-align:rigth">Договор подписан</div>
                                    <select class="select"  v-model="edit.signagree" >
                                        <option  v-for="status in yesNoList" :key="status.id" :value="status.id" >{{status.name}}</option>
                                    </select>
                            </div>
                             <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; text-align:rigth">Акт подписан</div>
                                    <select class="select"  v-model="edit.signact" >
                                        <option  v-for="status in yesNoList" :key="status.id" :value="status.id" >{{status.name}}</option>
                                    </select>
                            </div>
                             <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; text-align:rigth">Менеджер</div>
                                    <select class="select"  v-model="edit.manager_id" >
                                        <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                    </select>
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; text-align:rigth">Статус</div>
                                    <select class="select"  v-model="edit.state" >
                                        <option  v-for="status in statusOrk" :key="status.id" :value="status.id" >{{status.name}}</option>
                                    </select>
                            </div>
                        </div>
                        <!---2part end---->
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
        <div class="row" style="margin-top: 30px"  v-if="edit == null || edit.id != appl.id">
                <div class="col-1"></div>
                <div class="col-10">
                    <div class="panel row">
                        <div class="col" >
                            <a href="#" @click="commentVar =! commentVar" >Комментарии</a>
                        </div>
                    </div>
              </div>     
        </div> 
        <div class="row"  style="margin-top: 30px;"  v-if="edit == null || edit.id != appl.id">
              <div class="col-1"></div>
              <div class="col-10" >
                  <commentOrk  v-show="commentVar" :ork_id="ork_id" ></commentOrk>
     
              </div>
              <div  class="col-1"></div>
        </div> 
    </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import commentOrk from './commentOrk'  
  import dateFunc from '../../utils/dateFunc'
  import goTo from '../../utils/goTo'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'

export default {
    mixins: [Acl, dateFunc,goTo],
    name: 'showOrk',
    data () {
      return {
        commentVar: false,
        itemVar: false,
        form:{},
        ork_id: null,
        clients_id:null,
        search: null,
        page: null,
        edit: null,
        user: null,
      }
    },
    components: {
      commentOrk:commentOrk,
      DatePicker,
    },
    computed: {
        ...Vuex.mapGetters({
              apiUrl: 'app/apiUrl',
              appls: 'ork/datalist',
              users: 'app/users',
              yesNoList: 'dictionary/yesNoList',
              clientType:'dictionary/clientType',
              statusOrk:'dictionary/statusOrk',
              varTest: 'ork/test',
        }),
        appl(){
            var obj =  Object.assign({}, this.appls)
            return obj[0]
        },
        nameCompany(){
            var obj =  Object.assign({}, this.appls)
            return obj.name
        },
    },
    methods: {
      ...Vuex.mapMutations({
          setMessage: 'app/setMessage',
          setError: 'app/setError',
          setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
           find: 'ork/findOnId',
           save: 'ork/save',
           findUsers: 'app/getUsers'
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
        this.find(this.ork_id)  
      },
      returnTo(){
        this.$router.push('../../mybuisness/')  
              // if(this.mybuisness==true){
              //     this.find(this.storeForm)
              // }
              // if(this.panel==true){
              //     this.find({clients_id: this.clients_id})
              // }
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
      getParams(){
          var obj = this.$route.params.id
          var arr = obj.split('=')
          this.clients_id = arr[0]
          this.ork_id = arr[1]
      },
    },
    created() {
      this.getParams()
      this.findData()
      this.setHeader('ОРК')
      this.findUsers()
     
    }
  }
</script>