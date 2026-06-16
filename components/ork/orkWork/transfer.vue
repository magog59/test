<template>
    <section>
     
        <div class="form-row justify-content-end" v-if="mybuisness">     
            <div class="col-4"></div> 
            <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
        </div>
        
      <table class="table table-border table-hover" style="margin-top:20px"  v-if="edit == null || datalist.length > 0">
        <tr  align="left"  v-show="showDecl==false">

            <th>ID</th> 
            <th>Статус</th> 
            <th>Дата  контакта</th> 
            <th> Дата просрока </th> 
            <th>Организация</th> 
            <th>Город</th> 
            <th> № заявки </th>
            <th>Дата закрытия</th>  
            <th>Документ</th>
            <th>Поставщик</th>
            <th>Дата выдачи</th>  
            <th>Срок действия</th>
            <th>Дата забора</th>
            <th>Дата прихода</th>
            <th>Комментарий	</th>
            <th>	</th>
            <th>	</th>
       
        </tr>
        <tbody v-for="model in datalist" :key="model.id"> 
          <tr  v-if="edit == null || edit.id != model.id"  :class="getClassRow(model)"  v-show="showDecl==false">

                <td style="font-size: 12px">{{model.id}}</td>
                <td style="font-size: 12px">{{getStatusOrk(model.state).name}}</td>
                <td>{{inDateTime(model.contactdate)}}</td>
                <td>{{computedDate( plusDay( inDate(model.status_date) , model.state ))}}</td>
                <td><a  target="_blank"  :href="'/clients/show/'+ model.clients_id+''" >{{model.name}}</a></td>     
                <td>{{getCity(model.city_id).name}}</td>  

                <td>
                    <a href="#">
                        <img  src="../../../../static/images/iconsColors/eye.svg"   
                                style="max-width:20px"
                                @click="showAppls(model)">
                    </a>{{model.application_id}}
                </td> 

                <td> {{model.enddate}}</td>  
                <td>{{getDocumentName(model.document_id).name}}</td> 
                <td>{{getProviderName(model.provider_id).name}}</td> 
             
                <!-- <td></td> -->
                <td>{{inDateTime(model.date_vidachi)}}</td>
                <td>{{(model.period_validity)}}</td>
                <!-- <td></td> -->
                <td>{{inDateTime(model.date_zabora)}}</td>
                <td>{{inDateTime(model.date_prihod)}}</td>
                 <td  >{{model.comment}}
                    <a href="#" 
                            @click="toComments(model)"><i :class="[model.deleted_at != null ? '' : 'fas fa-comment']" ></i>
                    </a>
                </td>
                <td>
                  <a 
                       href="#" v-if="model.deleted_at == null || model.deleted_at == ''" 
                       @click="toChange(model)">
                            <img  
                                  src="../../../../static/images/iconsColors/edit.png" 
                                  title="Редактировать"
                                  style="max-width:20px"
                            >
                  </a>
                </td>
                <td>
                   <a href="#"
                    v-if="model.deleted_at == null || model.deleted_at == ''">
                            <i   class="fa fa-angle-double-right" 
                                  title="Работа закрыта" 
                                  @click="toCreateNewStateOrk(model)" 
                                  style="max-width:20px; margin-left:7px"
                            >
                            </i>
                    </a>
              </td>
          </tr >
          
        </tbody>
       
      </table>
       <!----Редактировать орк---->
        <div class="row" v-if="edit != null">
              <div class="col-1"></div>
              <div class="col-9 ">
                    <div class="row">
                        <!---1part---->
                        <div class="col-5 offset-1">
                                   
                                    <div class="row" style="margin-top: 30px"> 
                                            <div style="font-size: 70%; margin-right: 70%;">Дата контакта</div>
                                            <date-picker v-model="edit.contactdate"     valueType="format"   ></date-picker>
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 70%;">Дата оплаты</div>
                                        <date-picker v-model="edit.pay_date"   valueType="format" ></date-picker>
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 50%;">Дата предоставления документов клиентом</div>
                                        <date-picker v-model="edit.clientdoc_date"  valueType="format" ></date-picker>
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 50%;">Дата планируемого закрытия</div>
                                        <date-picker v-model="edit.close_date"  valueType="format" ></date-picker>
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 70%;">Дата выдачи</div>
                                        <date-picker v-model="edit.date_vidachi"  valueType="format" ></date-picker>
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 70%;">Дата забора</div>
                                        <date-picker v-model="edit.date_zabora"  valueType="format" ></date-picker>
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 70%;">Дата прихода</div>
                                        <date-picker v-model="edit.date_prihod"  valueType="format" ></date-picker>
                                    </div>
                            </div>
                            <!---2part----> 
                          <div class="col-5 offset-1">
                                <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 70%;">Менеджер</div>
                                    <select class="select"  v-model="edit.manager_id" >
                                        <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                    </select>
                                </div>
                                <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 70%;">Статус</div>
                                    <select class="select"  v-model="edit.state" >
                                            <option value="100">Доставка оригиналов из ОС</option>
                                   </select>
                                </div>
                                <div class="row"  style="margin-top: 30px"> 
                                    <div style=" font-size: 70%;margin-right: 60%;">Акт подписан</div>
                                    <select class="select"  v-model="edit.signact" @keypress.enter.prevent="edit.signact">
                                            <option value="10">ДА</option>
                                            <option value="20">НЕТ</option>
                                    </select>
                                </div> 
                                <div class="row"  style="margin-top: 30px"> 
                                    <div style=" font-size: 70%;margin-right: 60%;">Договор подписан</div>
                                    <select class="select"  v-model="edit.signagree" @keypress.enter.prevent="edit.signagree">
                                            <option value="10">ДА</option>
                                            <option value="20">НЕТ</option>
                                    </select>
                                </div> 
                                <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 70%;">Номер акта</div>
                                    <input type="text" class="form-control" v-model="edit.act_num" > 
                                </div>
                              
                                <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 70%;">Срок действия</div>
                                    <input type="text" class="form-control" v-model="edit.period_validity" > 
                                </div>
                                 <div class="row"  style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 70%;">Долг поставщику</div>
                                        <input type="text" class="form-control" v-model="edit.provider_debt" >  
                                </div>
                        </div>
                    </div>
                    <div style="margin-top: 20px"  class="row justify-content-center" >
                        <button class="btn btn-success"  @click="update">Сохранить</button>
                    </div>
                    <div style="height: 200px;" ></div>
              </div>
              <div class="col-1">
                <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
              </div>
        </div>
  </section>
</template>

<script>
  import Acl from '../../../utils/acl'
  import dateFunc from '../../../utils/dateFunc'
  import Vuex from 'vuex'
//   import vueConfirmationButton from '../../../utils/confirmButton'     
  import pagination from "../../../utils/pagination"
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'

  export default {
    mixins: [Acl, dateFunc],
    name: 'ork',
    props:[],
    data () {
        return {
            form: {},
            search: null,
            page: null,
            edit: null,
            declinematter_id: null,
            showDecl: false,
            modelClose: null,
            showFiltr: false,
            mybuisness: false
        }
        },
        components: { 
        pagination,
        DatePicker
        },
        computed: {
        ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'ork/datalist',
            pagination: 'ork/pagination',
            storeForm: 'mybuisness/form',
            citys: 'city/datalist',
            users: 'app/users',
            statusOrk:'dictionary/newStatusOrk',
            declinematters: 'declinematter/datalist',
            varReturnStore: 'ork/returnStore',
            arrDocAll: 'document/arrDocAll',
            providers: 'provider/datalist',
            dateOrkDelay:'ork/dateOrkDelay'
        }),
        },
        methods: {
        ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader',
            setReturnStore: 'ork/setReturnStore'
        }),
        ...Vuex.mapActions({
            save: 'ork/save',
            find: 'ork/newQuery',
            drop: 'ork/delete',   
            findCity: 'city/findAll',
            findItem: 'item/find',
            restore: 'ork/restore',
            close: 'ork/close',
            declinemFind: 'declinematter/find',
            createNewState: 'ork/createNewState',
            findOrkNotice: 'ork/findOrkNotice' ,
            findDoc: 'document/findAll',
            findAllProviders: 'provider/findAll',
        }),
        findData(){
            var obj = {}
            obj = Object.assign({}, this.storeForm)

            obj.transfer = 1
            obj.decorateDoc = null
            obj.collectDoc = null
            obj.analysis = null
            obj.start = null
            obj.workClose = null
            obj.transferClient = null
            this.find( obj)
        },
       
        update() {
            this.setError(null)
            this.save(this.edit)
                   .then(() =>{
                        this.edit = null
                        this.findData()
                        this.findOrkNotice(this.storeForm)
                    })
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
        getProviderName(id){
            if(this.providers == null){
                  return
            }
            var result = {}
            this.providers.map((el) => {
                  if(id == el.id){
                  result = el
                  }
            })
            return result
        },
        toChange(model){
            this.edit = Object.assign({}, model)
        },
        setPage(i){
            this.page = i
            this.storeForm.page =  this.page
            this.find(this.storeForm )
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
        getStatusOrk(id){
            var result = {}
            this.statusOrk.map((el) => {
                if (id == el.id) {
                    result = el
                }
            })
            return result
        },
        toComments(model){
                this.$store.commit('comments/setValComment', {object_id: model.id, type:60, component:'transfer', radom: Math.random().toFixed(2)}, {root: true})  
        },
        toShow(id){
            this.$router.push('../../../clients/show/' + id)
        },
        getSumm(column){
            var summ = 0
            this.datalist.map(elem => {
                summ += +elem[column]
            })
            return summ
        },
         getClassRow(model){
                return [this.dateOrkDelay[model.state] > model.status_date ? 'danger' : '']
        },
        showOrk(model){
            this.$router.push('/ork/showOrk/'+ model.clients_id + '=' + model.id)
        },
        showItem(model){
            this.$store.commit('item/setShowItem', {state:true, ork_id: model.id})
        },
        toCreateNewStateOrk(model){
            var obj = {}
            obj = Object.assign({}, model)
            obj.state = 110
            this.createNewState(obj)
            this.$emit('close', 'transferClient')
        },
        showAppls(model){
           this.$router.push('/application/showAppls/'+ model.clients_id + '=' + model.application_id)
        },
        getItem(){
            this.findItem(this.form)
        },
        plusDay(data, state){
            if(data == null || data == ''){
                return
            }

            var day = 0
            state == 100 ? day = 10 : ''

            data = data.split('.');
            data = new Date(data[2], +data[1]-1, +data[0]+day, 0, 0, 0, 0);
            data = [data.getDate(),data.getMonth()+1,data.getFullYear()];
            data = data.join('.').replace(/(^|\/)(\d)(?=\/)/g,"$10$2"); 
            //+0 with date
            var arr = data.split('.')

            if(arr[0].length == 1){
                arr[0] = '0' + arr[0]
            }
            return arr.join('.')
        },
        now(){
            return new Date().toLocaleDateString()
        },
        computedDate(d1){
            if(d1 == null || d1 == 'undefined'){
                return
            }
          
            var parts = d1.split('.');
            var date1 = new Date( parts[2], parts[1] - 1,parts[0]); 

            var parts1 = this.now().split('.');
            var date2 = new Date( parts1[2], parts1[1] - 1,parts1[0]); 

            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
            
            if(date2 < date1 || diffDays == 0){
                return  diffDays
            }else{
                return '-' + diffDays
            }
        }
    },
    created() {
        this.setHeader('Доставка из органа')
        this.page = this.pagination.page
        this.findCity()
        this.declinemFind()
        this.findOrkNotice(this.storeForm)
        this.findDoc()
        this.findAllProviders()
        this.findData()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
</style>

 