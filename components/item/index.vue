<template>
  <section >
      <h5>Состав</h5>
      <div class="col-1">
            <button class="btn btn-primary"  v-if="showButton" @click="showForm=true">Добавить</button>
      </div>
        <button type="button" class="close" @click="returnTo()" aria-hidden="true"  v-if="edit == null "  title="Закрыть" >×</button>
      <div class="form-row" v-if="edit == null">
          <div class="col-8"></div>
          <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" v-if="edit == null && showForm==false" >  
            <tr>
                  <th>Документ</th>
                  <th>Название</th>
                  <th>Тип</th>
                  <th>Срок оформления</th>
                  <th>Количество</th>
                  <th>Сумма договора до НДС</th>
                  <th>Поставщик</th>
                  <th>Стоимость от поставщика</th>
                  <th>Сумма договора с НДС клиенту</th>
                  <th>Себестоимость</th>
                  <th>Себестоимость факт</th>
                  <th>Маржа</th>
                  <th></th>
                  <th></th>
                  <th></th>
            </tr>
            <tbody v-for="model in datalist" :key="model.id">
                  <tr  v-if="edit == null || edit.id != model.id"  :class="[model.deleted_at != null ? 'disabled' : '']" align="left">
                        <td>{{getDocumentName(model.document_id).name}}</td>
                        <td>{{model.nameproduct}}</td>
                        <td>{{model.typemarkmodel}}</td>
                        <td>{{ getTimelineStatus(model.timeline).name ? getTimelineStatus(model.timeline).name : 'не задано' }}</td>
                        <td>{{model.quantity}}</td>
                        <td>{{ model.cost ? getCost(model) : 'не задано'}}</td>
                        <td >{{ getProviders(model.provider_id).name ? getProviders(model.provider_id).name : 'не задано' }}</td>
                        <td>{{ getOurCost(model) }}</td>
                        <td>{{ ( model.cost_with_nds ? model.cost_with_nds : (model.cost * 1.05).toFixed(2) ) }}</td>
                        <td>{{ model.selfcost ? model.selfcost : getSelfCost(model) }}</td>
                        <td :class="getRedClass(model.our_cost_fact)">{{ model.our_cost_fact ? model.our_cost_fact : 'не задано' }}</td>  

                        <td>{{ ( model.margin ? model.margin : getMargin(model) ) }}</td>

                        <td >
                              <a  
                                    href="#" 
                                    v-if="model.deleted_at == null || model.deleted_at == ''" 
                                    @click="toChange(model)">
                                          <img src="../../../static/images/iconsColors/edit.png" 
                                          title="Редактировать" style="max-width:20px">
                              </a>  
                        </td>
                        <td >
                        <a  
                              href="#" 
                              v-if="model.deleted_at == null || model.deleted_at == ''" 
                              @click="toCopy(model)">
                                    <img src="../../../static/images/iconsColors/copy.png" 
                                    title="Копировать" style="max-width:20px">
                        </a>  
                        </td>
                        <td width="60px;"><vue-confirmation-button
                              v-if="model.deleted_at == null || model.deleted_at == ''"
                              :css="'fui-trash'"
                              v-on:confirmation-success="deleteData(model.id)">
                        </vue-confirmation-button>
                        </td>
            </tr>
            <tr v-if="edit != null && edit.id == model.id ">
                   <td>
                        <select class="select"  v-model="edit.document_id" >
                            <option  v-for="document in arrDocAll" :key="document.id" :value="document.id" >{{document.name}}</option>
                        </select>
                  </td>
                  <td><input type="text" class="form-control" v-model="edit.nameproduct" placeholder="Название"></td>  
                  <td><input type="text" class="form-control" v-model="edit.typemarkmodel" placeholder="Тип"></td>  
                  <td><input type="text" class="form-control" disabled></td>  
                  <td><input type="text" class="form-control" v-model="edit.quantity" placeholder="Количество"></td>  
                  <td><input type="text" class="form-control" v-model="edit.cost" placeholder="Стоимость"></td>  
                  <td>
                        <select class="select"  v-model="edit.provider_id" >
                            <option  v-for="provider in providers" :key="provider.id" :value="provider.id" >{{provider.name}}</option>
                        </select>
                  </td>
                  <td><input type="text" class="form-control" v-model="edit.discount" placeholder="Скидка"></td>  
                  <td><input type="text" class="form-control" v-model="edit.our_cost" placeholder="Себестоимость ед"></td>  
                  <td><input type="text" class="form-control" v-model="edit.control" placeholder="Инспекционный контроль"></td> 
                     <td>
                        <select class="select" style="width:100px !important" v-model="edit.pionhand" >
                            <option  value="10">ДА</option>
                            <option  value="20">НЕТ</option>
                        </select>
                  </td>
                     <td>
                         <select class="select" style="width:100px !important" v-model="edit.control" >
                            <option  value="10">ДА</option>
                            <option  value="20">НЕТ</option>
                        </select>
                  </td> 
                  <td><a class="fui-check" @click="update"></a></td>
                  <td><a class="fui-cross" @click="edit = null"></a></td>
              </tr>
          </tbody>
      </table>
       <!----Добавить позицию---->
       <div class="row " v-if="showForm">
              <div  class="container" style="width: 1000px;">

                  <h4 align="center" >Добавить позицию</h4> 
                  <div class="col">
                        <button type="button" class="close" @click="showForm=false" aria-hidden="true">×</button>
                  </div> 
                  <div class="row">
                        <!---1part---->
                        <div class="col-5 offset-1">
                            <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 50%;">Документ</div>
                                          <select class="select"  v-model="form.document_id" >
                                                <option  v-for="document in arrDocAll" :key="document.id" :value="document.id" >{{document.name}}</option>
                                          </select>  
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 70%;">Название</div>
                                          <textarea class="form-control"  v-model="form.nameproduct" placeholder="Название" style="height: 134px;"></textarea>
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 70%;">Тип</div>
                                          <input type="text" class="form-control" v-model="form.typemarkmodel" >
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 40%;">Срок оформления(число)</div>
                                          <input type="text" class="form-control" v-model="form.days" >
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 50%;">Время</div>
                                          <select class="select"  v-model="form.timeline" >
                                                <option  v-for="item in timeline" :key="item.id" :value="item.id" >{{item.name}}</option>
                                          </select>
                                    </div>
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:rigth">ПИ на руки</div>
                                          <select class="select"  v-model="form.pionhand" @keypress.enter.prevent="this.form.pionhand">
                                                <option value="10">ДА</option>
                                                <option value="20">НЕТ</option>
                                          </select>
                                    </div> 
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:rigth">Инспекционный контроль</div>
                                          <select class="select"  v-model="form.control" @keypress.enter.prevent="this.form.control">
                                                <option value="10">ДА</option>
                                                <option value="20">НЕТ</option>
                                          </select>
                                    </div> 
                            </div>
                            <!---2part----> 
                            <div class="col-5 offset-1" style="display: flex;flex-direction: column;justify-content: space-between;">
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:rigth">Сумма договора до НДС</div>
                                          <input type="text" class="form-control" v-model="form.cost" >
                                    </div> 
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style="font-size: 70%; text-align:rigth">Поставщик</div>
                                          <select class="select"  v-model="form.provider_id" >
                                                <option  v-for="provider in providers" :key="provider.id" :value="provider.id" >{{provider.name}}</option>
                                          </select>
                                    </div>
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style="font-size: 70%; text-align:rigth">Сумма договора с НДС клиенту</div>
                                          <input type="text" class="form-control" v-model="form.cost_with_nds" placeholder="Сумма договора с НДС клиенту" readonly style="color: #666161;">
                                    </div>
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:rigth">Стоимость от поставщика</div>
                                          <input type="text" class="form-control" v-model="form.our_cost" >
                                    </div> 
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:right">Себестоимость</div>
                                          <input type="text" class="form-control" v-model="form.selfcost" placeholder="Себестоимость" readonly style="color: #666161;">
                                    </div> 
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 40%;">Маржа</div>
                                          <input type="text" class="form-control" v-model="form.margin" placeholder="Маржа" readonly style="color: #666161;">
                                    </div>
                            </div>
                      </div>
                      <!----endForm-----> 
                      <div class="row justify-content-center"  style="margin-top: 30px" >
                            <button class="btn btn-success"  @click="saveData();showForm=false">Сохранить</button>
                      </div>
                      <div style="height: 200px;"></div>
                   
                </div>
                <!----endContainer-----> 
       </div>
        
        <!----Изменить позицию---->
          <div class="row " v-if="edit != null">
               <div  class="container" style="width: 1000px;">

                  <h4 align="center" >Изменить позицию</h4> 
                  <div class="col">
                        <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
                  </div> 
                  <div class="row">
                        <!---1part---->
                        <div class="col-5 offset-1">
                            <div class="row"  style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 50%;">Документ</div>
                                          <select class="select"  v-model="edit.document_id" >
                                                <option  v-for="document in arrDocAll" :key="document.id" :value="document.id" >{{document.name}}</option>
                                          </select>  
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 70%;">Название</div>
                                          <textarea class="form-control"  v-model="edit.nameproduct" placeholder="Название" style="height: 100px;"></textarea>
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 70%;">Тип</div>
                                          <input type="text" class="form-control" v-model="edit.typemarkmodel" >
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 40%;">Срок оформления</div>
                                          <input type="text" class="form-control" v-model="edit.days" >
                                    </div>
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 50%;">Время</div>
                                          <select class="select"  v-model="edit.timeline" >
                                                <option  v-for="item in timeline" :key="item.id" :value="item.id" >{{item.name}}</option>
                                          </select>
                                    </div>
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:right">ПИ на руки</div>
                                          <select class="select"  v-model="edit.pionhand" @keypress.enter.prevent="this.edit.pionhand">
                                                <option value="10">ДА</option>
                                                <option value="20">НЕТ</option>
                                          </select>
                                    </div> 
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:right">Инспекционный контроль</div>
                                          <select class="select"  v-model="edit.control" @keypress.enter.prevent="this.edit.control">
                                                <option value="10">ДА</option>
                                                <option value="20">НЕТ</option>
                                          </select>
                                    </div>
                            </div>
                            <!---2part----> 
                            <div class="col-5 offset-1" style="display: flex;flex-direction: column;justify-content: space-between;">
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:right">Сумма договора до НДС</div>
                                          <input type="text" class="form-control" v-model="edit.cost" >
                                    </div> 
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style="font-size: 70%; text-align:right">Поставщик</div>
                                          <select class="select"  v-model="edit.provider_id" >
                                                <option  v-for="provider in providers" :key="provider.id" :value="provider.id" >{{provider.name}}</option>
                                          </select>
                                    </div>
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style="font-size: 70%; text-align:right">Сумма договора с НДС клиенту</div>
                                          <input type="text" class="form-control" v-model="edit.cost_with_nds" placeholder="Сумма договора с НДС клиенту" readonly style="color: #666161;">
                                    </div>
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:right">Стоимость от поставщика</div>
                                          <input type="text" class="form-control" v-model="edit.our_cost">
                                    </div> 
                                    <div class="row"  style="margin-top: 30px"> 
                                          <div style=" font-size: 70%;text-align:right">Себестоимость</div>
                                          <input type="text" class="form-control" v-model="edit.selfcost" placeholder="Себестоимость" readonly style="color: #666161;">
                                    </div> 
                                    <div class="row" style="margin-top: 30px"> 
                                          <div style="font-size: 70%; margin-right: 40%;">Маржа</div>
                                          <input type="text" class="form-control" v-model="edit.margin" placeholder="Маржа" readonly style="color: #666161;">
                                    </div>
                            </div>
                      </div>
                      <!----endForm-----> 
                      <div class="row justify-content-center"  style="margin-top: 30px" >
                            <button class="btn btn-success"  @click="update">Сохранить</button>
                      </div>
                      <div style="height: 200px;"></div>
                   
                </div>
                <!----endContainer-----> 
          </div>
          <div style="height: 200px;"></div>
    </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import vueConfirmationButton from '../../utils/confirmButton'
  import pagination from "../../utils/pagination"

  export default {
    mixins: [Acl],
    name: 'item',
    props:['application_id', 'showButton', 'kpId', 'agreementId', 'orkId', 'clients_id', 'panel','mybuisness'],
      data () {
            return {
                  form:{
                        name: 'Hoвая',
                        application_id: this.application_id
                  },
                  showForm:false,
                  search: null,
                  page: null,
                  edit: null,
                  applicationId: null,
                  ork_id: null,
                  agreement_id: null,
                  kp_id: null,
            }
      },
    components: {
      VueConfirmationButton: vueConfirmationButton,
      pagination,
    },
    computed: {
      ...Vuex.mapGetters({   
          apiUrl: 'app/apiUrl', 
          pagination: 'item/pagination', 
          datalist: 'item/datalist',
          timeline: 'dictionary/timelineStatus',  
          yesNo: 'dictionary/yesNoList',
          providers: 'provider/datalist',
          users: 'app/users',
          storeForm: 'mybuisness/form',
          arrDocAll: 'document/arrDocAll',
      }),
      formCost() {
            let cost = null
            if (this.form != null) {
                  cost = this.form.cost
            }
            return cost
      },
      formOurCost() {
            let cost = null
            if (this.form != null) {
                  cost = this.form.our_cost
            }
            return cost 
      },
      editCost() {
            let cost = null
            if (this.edit != null) {
                  cost = this.edit.cost
            }
            return cost
      },
      editOurCost() {
            let cost = null
            if (this.edit != null) {
                  cost = this.edit.our_cost
            }
            return cost 
      },
    },
    watch: {
            formCost(val) {
                  if (val) {
                        this.form.cost_with_nds = val * 1.05
                        this.form.cost_with_nds = this.form.cost_with_nds.toFixed(2)
                        this.form.nds = this.form.cost_with_nds - this.form.cost
                        this.form.selfcost = Number(this.form.our_cost) + Number(this.form.nds)
                        if (isNaN(this.form.selfcost)) {
                              this.form.selfcost = null
                        }
                        this.form.margin = this.form.cost - this.form.our_cost
                        if (isNaN(this.form.margin) || Math.sign(this.form.margin) == -1) {
                              this.form.margin = null
                        }
                  }
            },
            formOurCost(val) {
                  if (val) {
                        this.form.nds = this.form.cost_with_nds - this.form.cost
                        this.form.selfcost = Number(this.form.our_cost) + Number(this.form.nds)
                        if (isNaN(this.form.selfcost)) {
                              this.form.selfcost = null
                        }
                        this.form.margin = this.form.cost - this.form.our_cost
                        if (isNaN(this.form.margin) || Math.sign(this.form.margin) == -1) {
                              this.form.margin = null
                        }
                  }
            },
            editCost(val) {
                  if (val) {
                        this.edit.cost_with_nds = val * 1.05
                        this.edit.cost_with_nds = this.edit.cost_with_nds.toFixed(2)
                        this.edit.nds = this.edit.cost_with_nds - this.edit.cost
                        this.edit.selfcost = Number(this.edit.our_cost) + Number(this.edit.nds)
                        if (isNaN(this.edit.selfcost)) {
                              this.edit.selfcost = null
                        }
                        this.edit.margin = this.edit.cost - this.edit.our_cost
                        if (isNaN(this.edit.margin) || Math.sign(this.edit.margin) == -1) {
                              this.edit.margin = null
                        }
                  }
            },
            editOurCost(val) {
                  if (val) {
                        this.edit.nds = this.edit.cost_with_nds - this.edit.cost
                        this.edit.selfcost = Number(this.edit.our_cost) + Number(this.edit.nds)
                        if (isNaN(this.edit.selfcost)) {
                              this.edit.selfcost = null
                        }
                        this.edit.margin = this.edit.cost - this.edit.our_cost
                        if (isNaN(this.edit.margin) || Math.sign(this.edit.margin) == -1) {
                              this.edit.margin = null
                        }
                  }
            },
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            save: 'item/save',
            find: 'item/find',
            drop: 'item/delete',
            findAllDocument: 'document/findAll',
            findAllProviders: 'provider/findAll',
            findOrk: 'ork/find',
            findKp: 'kp/find',
            findAgreement: 'agreement/find',
            copy: 'item/copy'
      }),
      getSelfCost(item) {
            let selfcost_t = 0
            let selfcost = item.selfcost
            let nds = item.nds
            let our_cost = item.our_cost
            if (!selfcost) {
                  if (nds) {
                        selfcost_t = Number(our_cost) + Number(nds)
                  }else{
                        nds = item.cost * 1.05
                        selfcost_t = Number(our_cost) + Number(nds)
                  }
            }else{
                  selfcost_t = selfcost
            }
            return selfcost_t.toFixed(2)
      },
      getMargin(item) {
            let margin = 0
            if (item.margin) {
                  margin = item.margin
            }else{
                  if (isNaN(item.cost - item.our_cost) || Math.sign(item.cost - item.our_cost) != -1) {
                        margin = item.cost - item.our_cost
                  }
            }
            return margin.toFixed(2)
      },
      getOurCost(item) {
            let our_cost = item.our_cost
            if (our_cost != 0 && our_cost != null) {
                  our_cost = Number(our_cost).toFixed(2)
            }
            return our_cost
      },
      getCost(item) {
            let cost = item.cost
            if (cost != 0 && cost != null) {
                  cost = Number(cost).toFixed(2)
            }
            return cost
      },
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
                    if(this.mybuisness==true){
                        this.findOrk(this.storeForm)
                        this.findKp(this.storeForm)
                        this.findAgreement(this.storeForm)      
                  }
                  if(this.panel==true){
                        this.findOrk({clients_id:this.clients_id})
                        this.findKp({clients_id:this.clients_id})
                        this.findAgreement({clients_id:this.clients_id})
                  }
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
            if(this.kp_id == null){
                 this.kp_id = this.kpId
            }
            if(this.agreement_id == null){
                 this.agreement_id = this.agreementId
            }
             if(this.ork_id == null){
                 this.ork_id = this.orkId
            }
            this.find({  
                       page:this.page, 
                       query: this.search,
                       application_id: this.application_id ,
                       ork_id: this.ork_id, 
                       agreement_id: this.agreement_id, 
                       kp_id: this.kp_id,
                  })  
      },
      getDocumentName(id){
            var result = {}
            this.arrDocAll.map((el) => {
                  if(id == el.id){
                        result = el
                  }
            })
            return result
      },
      getProviders(id){
          var result = {}
          this.providers.map((el) => {
              if(id == el.id){
              result = el
              }
          })
          return result
      },
      getTimelineStatus(id){  
          var result = {}
          this.timeline.map((el) => {
              if(id == el.id){
              result = el
              }
          })
          return result
      },
      yesNoList(id){
          var result = {}
          this.yesNo.map((el) => {
              if(id == el.id){
              result = el
              }
          })
          return result     
      },
      getParams(){
         this. kp_id = this.$route.query.kp_id
         this.agreement_id = this.$route.query.agreement_id
         this.ork_id = this.$route.query.ork_id
      },
      returnTo(){
            this.$store.commit('item/setShowItem', false)
      },
      toCopy(model){
            this.copy({id: model.id})
                 .then(() =>{
                        this.edit = null
                        if(this.mybuisness==true){
                              this.findOrk(this.storeForm)
                              this.findKp(this.storeForm)
                              this.findAgreement(this.storeForm)      
                        }
                        if(this.panel==true){
                              this.findOrk({clients_id:this.clients_id})
                              this.findKp({clients_id:this.clients_id})
                              this.findAgreement({clients_id:this.clients_id})   
                        }
                        this.findData()
                 })
      },
      getRedClass(val){
         return  val ? val : 'red'
      }
    },
 
    created() {
      this.setHeader('Элемент')
      this.page = this.pagination.page 
      this.findAllDocument()
      this.findAllProviders()
      this.getParams()  
      this.findData()
  
    
   
    }
  }
</script>  
<style>
  .disabled {
    color:lightgrey;
  }
  
</style>
