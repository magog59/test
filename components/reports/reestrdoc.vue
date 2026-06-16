<template>
    <section>
        <h4>Реестр выданных документов</h4>
        <div class="form-row" >
            <div class="col-2">
                <div style=" font-size: 70%;">Дата от</div> 
                <date-picker v-model="form.from" :format="'DD.MM.YYYY'" valueType="format" ></date-picker>    
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Дата до</div> 
                <date-picker  v-model="form.to" valueType="format" :format="'DD.MM.YYYY '" ></date-picker>  
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Менеджер</div> 
                <select class="select"  v-model="form.manager_id" >
                    <option value="" >Все </option>
                    <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                </select>
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Компания</div>
                <input type="text" class="form-control" v-model="form.name" >
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Название продукции</div>
                <input type="text" class="form-control" v-model="form.product" >
            </div>
       </div>
       <div class="form-row" style="margin-top: 20px">
            <div class="col-2">
                <div style=" font-size: 70%;">Номер договора</div>
                <input type="text" class="form-control" v-model="form.agreenum" >
            </div>
          
            <div class="col-2">
                <div style=" font-size: 70%;">Номер акта</div>
                <input type="text" class="form-control" v-model="form.actnum" >
            </div>
             <div class="col-2">
                <div style=" font-size: 70%;">Орган</div>
                <input type="text" class="form-control" v-model="form.organ" >
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Номер сертификата</div>
                <input type="text" class="form-control" v-model="form.sertnum" >
          </div>
          <div class="col" style="margin: auto" >
                <button class="btn btn-success"  @click="findData()">Получить</button>
          </div>
            <div class="col-2">
                 <a   
                      target="_blank" 
                      class="btn btn-success upload" 
                      style="border-radius: 6px;"  
                      :href="apiUrl + 'funnel/downloadlist?from='+form.from 
                                    +'&to='+ form.to
                                    +'&manager_id='+form.manager_id
                                    +'&name='+form.name 
                                    +'&product='+form.product 
                                    +'&agreenum='+form.agreenum 
                                    +'&actnum='+form.actnum 
                                    +'&organ='+form.organ 
                                    +'&sertnum='+form.sertnum" 

                    >CКАЧАТЬ Excel</a>
            </div>
      </div>
      <div class="form-row justify-content-end" style="margin-top:60px">
            <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      
      <table class="table table-border table-hover" >
        <tr>
            <th class="thirdColor">Дата запуска</th>
            <th class="thirdColor">Компания</th>
            <th class="secondColor" >Номер договора</th>
            <th class="firstColor" >Выданный документ</th>
            <th  class="secondColor">Название продукции</th>
            <th class="firstColor">Менеджер ОРК</th>
            <th  class="secondColor">Номер акта</th>
            <th class="firstColor">Акт подписан клиентом</th>
            <th  class="secondColor">Договор подписан</th>
            <th class="firstColor">Выдан</th>
            <th  class="secondColor">Действует до</th>
            <th class="firstColor">Месяц/год окончания</th>
            <th  class="secondColor">Орган</th>
            <th class="firstColor">№ Сертификата</th>
            <th  class="secondColor">Сумма</th>
            <th  class="firstColor">Маржа</th>
            <th  class="secondColor">Менеджер договора</th>
        </tr>
        <tbody v-for="model in reestrdoc" :key="model.idx">
            <tr  v-if="edit == null || edit.id != model.id"  :class="[model.deleted_at != null ? 'disabled' : '']">
                  <td class="thirdColor" >{{inDate(model.startdate)}}</td>
                  <td>
                        <a   target="_blank" :href="'/clients/show/'+ model.clients_id+''" >{{model.name}}</a>
                  </td>
                  <td class="firstColor" >{{model.numberagree}}</td>
                  <td class="thirdColor">{{getDocumentName( model.document_id).name}}</td>
                  <td class="firstColor">{{model.prod_name}}</td>
                  <td class="thirdColor">{{getManager(model.manager_id).username}}</td>  
                  <td class="firstColor">{{model.act_num}}</td> 
                  <td class="thirdColor">{{NoList(model.signact).name}}</td>
                  <td class="firstColor">{{NoList(model.signagree).name}}</td>
                  <td class="thirdColor">{{inDate(model.get_date)}}</td>
                  <td class="firstColor">{{inDate(model.license_to)}}</td>
                  <td class="thirdColor" >{{inDateMounthYear(model.license_to)}}</td>
                  <td class="firstColor">{{model.act_organ}}</td>
                  <td class="thirdColor">{{model.sert_num}}</td>
                  <td class="firstColor">{{model.total}}</td>
                  <td class="thirdColor">{{model.total - model.our_cost}}</td>
                  <td class="firstColor">{{getManager(model.a_man).username}}</td>
                </tr>
        </tbody>

      </table>
    </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import pagination from "../../utils/pagination"
   import DateFunc from '../../utils/dateFunc'

  export default {
    mixins: [Acl, DateFunc],
    name: '',
    data () {
      return {
        form:{
            from: this.firstDayMonth(new Date()), 
            to: this.inDateTime(new Date()),
            manager_id: '',
            name :  '',
            product :  '',
            agreenum :  '',
            actnum :  '',
            sertnum:  '',
            organ:''
        },
        search: null,
        page: null,
        edit: null,
        showForm: false
      }
    },
    components: {
      DatePicker,
      pagination 
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            pagination: 'reports/pagination',
            users: 'app/users',
            documents: 'document/arrDocAll',
            reestrdoc: 'reports/reestrdoc',
            yesNoList: 'dictionary/yesNoList'
      }),
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            find: 'reports/findReestrdoc', 
            findUsers:'app/getUsers',
            findAllDocument: 'document/findAll',
      }),
      setPage(i){
        this.page = i
        this.form.page = i
        this.findData()
      },
      findData(){
        this.find(this.form)
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
      NoList(id){
        var result = {}
        this.yesNoList.map((el) => {
           if(id == el.id){
             result = el
           }
        })
        return result     
      },
      getDocumentName(id){
            var result = {}
            this.documents.map((el) => {
                  if(id == el.id){
                        result = el
                  }
            })
            return result
      },
    },
    created() {
      this.setHeader('План')
      this.page = this.pagination.page
      this.findAllDocument()
      this.findData()
      this.findUsers()
      
    }
  }
</script>
<style scope>
  .disabled {
    color:lightgrey;
  }
  .firstColor{
      background-color:#d9d9fd    
  }
  .secondColor{
      background-color:#bfbebe
  }
  .thirdColor{
      background-color:#e8e8f7
  }
</style>

