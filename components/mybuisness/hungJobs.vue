<template>
  <section>
      <div class="form-row justify-content-end">
        <div class="col-4"></div>
        <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:20px"  v-if="edit == null">
        <tr  align="left"  v-show="showDecl==false">
            <th class="custom_padding"></th>
            <th>#</th>
            <th class="custom_padding">№<br>договора</th>
            <th>Дата<br>контакта</th>
            <th>Дата<br>старта</th>
            <th class="custom_padding">Город</th>
            <th>Cтатус</th>
            <th class="custom_padding">Долг<br>клиента</th>
            <th class="custom_padding">Долг<br>поставщику</th>
            <th>Дата<br>оплаты</th>
            <th class="custom_padding">Стоимость</th>
            <th class="custom_padding">Маржа</th>
            <th>Дата<br>пред. док.</th>
            <th>Дата<br>план. закр</th>
            <th>Менеджер</th>
            <th>Комментарий	</th>
            <th>Организация</th>
            <th>Заявка	</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <!-- <th></th> -->
        </tr>
        <tbody v-for="model in datalist" :key="model.id">
          <tr  v-if="edit == null || edit.id != model.id"  :class="getClassRow(model)"  v-show="showDecl==false">
             <td>
                  <a  target="_blank"  :href="'/ork/showOrk/'+ model.clients_id+'='+ model.id+ ''">
                      <img  src="../../../static/images/iconsColors/eye.svg"
                            style="max-width:20px"
                            @click="panel==true? setReturnStore('panel'):setReturnStore('mybuisness')"

                            >
                  </a>
              </td>
              <th>{{ model.id}}</th>
              <td>{{model.agreement_id}}</td>
              <td>{{inDateTime(model.contactdate)}}</td>
              <td>{{inDateTime(model.startdate)}}</td>
              <td>{{getCity(model.city_id).name}}</td>
              <td>{{getStatusOrk(model.state).name}}</td>
              <td>{{model.debt ? model.debt : 0 }}</td>
              <td>{{model.provider_debt ? model.provider_debt : 0}}</td>
              <td>{{ inDate(model.pay_date) }}</td>
              <td>{{ model.total }}</td>
              <td>{{ Number(model.total) - Number(model.our_cost) }}</td>
              <td>{{ inDate(model.clientdoc_date) }}</td>
              <td>{{ inDate(model.close_date) }}</td>
              <td>{{getManager(model.manager_id).username}}</td>
              <td style="width: 20% " >{{model.comment}}
                  <a href="#"
                        @click="toComments(model)"><i :class="[model.deleted_at != null ? '' : 'fas fa-comment']" ></i>
                  </a>
              </td>
              <td>
                      <a    target="_blank"  :href="'/clients/show/'+ model.clients_id+''"
                            v-if="model.deleted_at == null || model.deleted_at === ''"

                      >{{model.name}}</a>
              </td>
              <td>
                  <a href="#">
                      <img  src="../../../static/images/iconsColors/eye.svg"
                            style="max-width:20px"
                            @click="showAppls(model)">
                  </a>{{ model.application_id}}
              </td>
              <td>
                   <a   href="#"
                        v-if="model.deleted_at == null || model.deleted_at === ''"
                        @click="showItem(model)">
                            <img
                                  src="../../../static/images/iconsColors/user-interface.svg"
                                  title="Состав"
                                  style="max-width:20px;"
                            >
                    </a>
              </td>
              <td>
                    <a
                          href="#"
                          v-if="model.deleted_at == null || model.deleted_at === ''"
                          @click="toPayment(model)">
                              <img
                                    src="../../../static/images/iconsColors/card.svg"
                                    title="Оплата"
                                    style="max-width:20px"
                              >
                    </a>
              </td>
              <td>
                  <a
                       href="#" v-if="model.deleted_at == null || model.deleted_at === ''"
                       @click="toChange(model)">
                            <img
                                  src="../../../static/images/iconsColors/edit.png"
                                  title="Редактировать"
                                  style="max-width:20px"
                            >
                  </a>
              </td>
              <td v-if="model.state === constStatusOrk['Завершен'] || model.state === constStatusOrk['Отказ'] ">
                  <a
                       href="#" v-if="model.deleted_at == null || model.deleted_at === ''"
                       @click="toUploadDoc(model)">
                            <img
                                  src="../../../static/images/iconsColors/upload.svg"
                                  title="Занести документы"
                                  style="max-width:20px">
                  </a>
              </td>
              <td v-show="model.state !== constStatusOrk['Завершен'] && model.state !== constStatusOrk['Отказ']"></td>
              <td v-show="model.state === constStatusOrk['Завершен'] || model.state === constStatusOrk['Отказ']">
                  <a
                      href="#"
                      v-if="model.deleted_at == null || model.deleted_at === ''"
                      @click="toRestore(model)">
                          <img
                                src="../../../static/images/iconsColors/pencils.svg"
                                title="Восстановить"
                                style="max-width:20px">
                  </a>
              </td>
              <td v-show="model.state !== constStatusOrk['Завершен'] && model.state !== constStatusOrk['Отказ']">
                <a
                      href="#"
                      v-if="model.deleted_at == null || model.deleted_at === ''"
                      @click="showDecl=true;setModelClose(model)">
                          <img
                                src="../../../static/images/iconBest/canc.png"
                                title="Отказ"
                                style="max-width:20px">
                </a>
              </td>
              <td width="60px;">
                <a href="#">
                    <vue-confirmation-button
                        v-if="model.deleted_at == null || model.deleted_at === ''"
                        :css="'fui-trash'"
                        v-on:confirmation-success="deleteData(model.id)"  title="Удалить">
                    </vue-confirmation-button>
                </a>
              </td>
              <!-- <td></td> -->
          </tr >
        </tbody>
         <tr  v-if="showDecl === true"   >
           <button type="button" class="close" @click="showDecl=false" aria-hidden="true">×</button>
            <div style="font-size: 70%; text-align:right">Выбирите причины отказа</div>
            <select class="select"  v-model="declinematter_id">
                <option  v-for="item in declinematters" :key="item.id" :value="item.id" >{{item.name}}</option>
                <option  value="">Выберите причину отказа</option>
            </select>
             <button class="btn btn-success"  @click="toClose()">Сохранить</button>
        </tr>
         <tr style="text-align: left"  v-show="!showDecl" v-if="mybuisness" >
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
              <th v-if="mybuisness" style="width: 70px">{{getSumm('total')}}</th>
              <th  v-if="mybuisness" style="width: 70px">{{getMarge('total') - getMarge('our_cost') }}</th>
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
          </tr>
      </table>
       <!----Редактировать зависшие работы---->
        <div class="row" v-if="edit != null">
              <div class="col-1"></div>
              <div class="col-9 ">
                    <div class="row">
                        <!---1part---->
                        <div class="col-5 offset-1">
                            <div class="row"  style="margin-top: 30px">
                                  <div style="font-size: 70%; margin-right: 70%;">Долг поставщику</div>
                                        <input type="text" class="form-control" v-model="edit.provider_debt" >
                                  </div>
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
                                  <div style="margin-top: 30px" >
                                      <button class="btn btn-success"  @click="update">Сохранить</button>
                                  </div>
                            </div>
                            <!---2part---->
                          <div class="col-5 offset-1">
                              <div class="row"  style="margin-top: 30px" >
                                    <div style="font-size: 70%; margin-right: 70%;">Менеджер</div>
                                    <select class="select"  v-model="edit.manager_id" >
                                        <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                    </select>
                              </div>
                              <div class="row"  style="margin-top: 30px">
                                    <div style="font-size: 70%; margin-right: 70%;">Статус</div>
                                    <select class="select"  v-model="edit.state" >
                                        <option  v-for="stat in statusOrk" :key="stat.id" :value="stat.id" >{{stat.name}}</option>
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
  import dateFunc from '../../utils/dateFunc'
  import Vuex from 'vuex'
  import vueConfirmationButton from '../../utils/confirmButton'
  import pagination from "../../utils/pagination"
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'

  export default {
    mixins: [Acl, dateFunc],
    name: 'hundJobs',
    props:['panel', 'mybuisness','clients_id'],
    data () {
      return {
        form: {},
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
          datalist: 'hungJobs/ork',
          pagination: 'hungJobs/pagination',
          storeForm: 'mybuisness/form',
          citys: 'city/datalist',
          users: 'app/users',
          statusOrk:'dictionary/newStatusOrk',
					constStatusOrk:'dictionary/constStatusOrk',
          declinematters: 'declinematter/datalist',
          varReturnStore: 'ork/returnStore'
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
          save: 'hungJobs/save',
          find: 'hungJobs/find',
          drop: 'hungJobs/delete',
          findCity: 'city/findAll',
          restore: 'hungJobs/restore',
          close: 'hungJobs/close',
          declinemFind: 'declinematter/find'
      }),
      saveData(){
        this.setError(null)
        this.save(this.form)
                .then(() =>{
                      if(this.mybuisness===true){
                            this.find(this.storeForm)
                      }
                      if(this.panel===true){
                          this.find({clients_id: this.clients_id})
                      }
                })
      },
      update() {
        this.setError(null)
        this.save(this.edit)
                .then(() =>{
                  this.edit = null
                      if(this.mybuisness===true){
                            this.find(this.storeForm)
                      }
                      if(this.panel===true){
                          this.find({clients_id: this.clients_id})
                      }
                })
      },
      deleteData(id){
        this.setError(null)
        this.drop(id)
                .then(() =>{
                      if(this.mybuisness===true){
                            this.find(this.storeForm)
                      }
                      if(this.panel===true){
                          this.find({clients_id: this.clients_id})
                      }
                })
      },
      toRestore(model){
        this.restore({id: model.id})
              if(this.mybuisness===true){
                    this.find(this.storeForm)
              }
              if(this.panel===true){
                    this.find({clients_id: this.clients_id})
              }

      },
      toClose(){
          this.close({id: this.modelClose.id, declinematter_id: this.declinematter_id})
              if(this.mybuisness===true){
                  this.find(this.storeForm)
              }
              if(this.panel===true){
                this.find({clients_id: this.clients_id})
              }
          this.showDecl = false

      },
      setModelClose(model){
           this.modelClose = Object.assign({}, model)
      },
      setReturnVar(){
          if(this.mybuisness===true){
              this.setReturnStore('mybuisness')

          }
          if(this.panel===true){
              this.setReturnStore('panel')
          }

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
              if (id === el.id) {
                  result = el
              }
          })
          return result
      },
      getManager(id){
          var result = {}
          this.users.map((el) => {
              if (id === el.id) {
                  result = el
              }
          })
          return result
      },
      getStatusOrk(id){
          var result = {}
          this.statusOrk.map((el) => {
              if (id === el.id) {
                  result = el
              }
          })
          return result
      },
      toComments(model){
            this.$store.commit('comments/setValComment', {object_id: model.id, type:60, component:'ork', radom: Math.random().toFixed(2)}, {root: true})
      },
      toShow(id){
          this.$router.push('../../../clients/show/' + id)
      },
      toUploadDoc(model){
          this.$router.push('../../../ork/itemDoc/'+ model.clients_id + '=' + model.id+'='+ this.$route.name )
      },
      toPayment(model){
          var agreement_id = model.agreement_id
          var clients_id = model.clients_id
          this.$router.push('../../../ork/'+clients_id+'='+agreement_id +'='+this.$route.name)
      },
      getSumm(column){
        var summ = 0
          this.datalist.map(elem => {
              //console.log(this.getStatusOrk(elem.state).name)
								summ += +elem[column]
          })

          return summ
      },
			getMarge(column){
				var summ = 0
				this.datalist.map(elem => {
					//console.log(this.getStatusOrk(elem.state).name)
					if (elem.state !== this.constStatusOrk['Доставка оригиналов из ОС']
							&& elem.state !== this.constStatusOrk['Доставка оригинала клиенту']
							&& elem.state !== this.constStatusOrk['Обзвон по качеству']
							&& elem.state !== this.constStatusOrk['Зависшая работа']
							&& elem.state !== this.constStatusOrk['Занесение документов в СРМ']
					) {
						summ += +elem[column]
					}
				})

				return summ
			},
      getClassRow(model){
          return [model.deleted_at != null ? 'disabled' : '' , model.state === 160 ? 'danger' : '', model.state === 150 ? 'success' : '']
      },
      showOrk(model){
          this.$router.push('/ork/showOrk/'+ model.clients_id + '=' + model.id)
      },
      showItem(model){
          this.$store.commit('item/setShowItem', {state:true, ork_id: model.id})
      },
      showAppls(model){
         this.$router.push('/application/showAppls/'+ model.clients_id + '=' + model.application_id)
      },
    },

    created() {
      this.setHeader('Зависшие работы')
      this.page = this.pagination.page
      this.findCity()
      this.declinemFind()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
  .custom_padding{
    padding: 0.75rem 0.25rem !important;
  }
</style>
