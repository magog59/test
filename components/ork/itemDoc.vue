<template>
      <section>
      <div class="form-row" style="margin-top: 40px">
         
          <div class="col-4"></div>
          <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      
      </div> 
          <button type="button" class="close" @click="returnTo()" aria-hidden="true" title="Вернутся в мои дела">×</button>
      <table class="table table-border table-hover">
        <tr>
            <th>Документ</th>
            <th>Продукция	</th>
            <th>Номер сертификата</th>
            <th>Дата получения</th>
            <th>Дата окончания документа</th>
            <th>Выдал</th>
            <th></th>
            <th></th>
        </tr>
        <tbody v-for="model in datalist" :key="model.id">
          <tr  v-if="edit == null || edit.id != model.id "  :class="[model.deleted_at != null ? 'disabled' : ''] ">
              <td>{{getDocumentName(model.document_id).name}}</td>
              <td>{{model.nameproduct}}</td>
              <td>{{model.sert_num}}</td>
              <td>{{model.get_date}}</td>
              <td>{{model.license_to}}</td>
              <td>{{model.act_organ}}</td>
              <td>
                  <a 
                       href="#" v-if="model.deleted_at == null || model.deleted_at == ''" 
                       @click="toChange(model)">
                            <img  
                                  src="../../../static/images/iconsColors/edit.png" 
                                  title="Редактировать"
                                  style="max-width:20px">
                  </a>
              </td>
              <td width="60px;">
                  <vue-confirmation-button
                        v-if="model.deleted_at == null || model.deleted_at == ''"
                        :css="'fui-trash'"
                        v-on:confirmation-success="deleteData(model.id)"
                        title="Удалить" >
                  </vue-confirmation-button>
              </td>
          </tr>
          <tr v-if="edit != null && edit.id == model.id ">
              <td><input type="text" class="form-control" disabled></td>
              <td><input type="text" class="form-control" disabled></td>
              <td><input type="text" class="form-control" v-model="edit.sert_num" placeholder="Номер сертификата"></td>
              <td><date-picker v-model="edit.get_date"  valueType="format"  :format="'DD.MM.YYYY mm:ss'"></date-picker></td> 
              <td><date-picker v-model="edit.license_to"  valueType="format"  :format="'DD.MM.YYYY mm:ss'"></date-picker></td> 
      
              <!-- <td><input type="text" class="form-control" v-model="edit.act_organ" placeholder="Выдал"></td>  -->
              <td > 
                    <select class="select"  v-model="edit.act_organ" style="width: 200px!important">
                          <option  v-for="provider in providers" :key="provider.idx" :value="provider.name" >{{provider.name}}</option>
                    </select>
              </td> 
              <td><a class="fui-check" @click="update" title="Сохранить"></a></td>
              <td><a class="fui-cross" @click="edit = null" title="Отменить"></a></td>
          </tr>
        </tbody>

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

  export default {
    mixins: [Acl],
    name: 'itemDoc',
    data () {
      return {
        form:{
          name: '',
        },
        ork_id: null,
        search: null,
        page: null,
        edit: null,
        modelName: null,
        clients_id: null
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
            datalist: 'ork/itemDoc',
            pagination: 'ork/pagination',
            arrDocAll: 'document/arrDocAll',
            providers: 'provider/datalist',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
          setMessage: 'app/setMessage',
          setError: 'app/setError',
          setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
          save: 'ork/itemDoc',
          find: 'ork/itemDoc',
          findDoc: 'document/findAll',
          findAllProviders: 'provider/findAll',
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
        this.save({ get_date: this.edit.get_date,
                    license_to: this.edit.license_to,
                    sert_num: this.edit.sert_num,
                    act_organ: this.edit.act_organ,
                    id: this.edit.id,
                    ork_id: this.ork_id    
                  })
                .then(() =>{
                    this.edit = null
                    this.find({ork_id: this.ork_id})
                   
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
        this.edit.ork_id = this.ork_id
        this.edit.update = 1
      },
      setPage(i){
        this.page = i
        this.findData()
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
      findData(){
        this.find({
                page: this.page, 
                ork_id: this.ork_id, 
        })
      },
      getParams(){
          var obj =  this.$route.params.id
          var arr = obj.split('=')
          this.clients_id =  arr[0]
          this.ork_id =  arr[1]
          this.modelName = arr[2]
      },
      returnTo(){

             if(this.modelName == 'show'){
                    this.$router.push('/clients/show/'+ this.clients_id)
              }
              if(this.modelName == 'mybuisness'){
                    this.$router.push('../../mybuisness?active=application')
              }
      },
    },
    created() {
      this.setHeader('Занести документы')
      this.findDoc()
      this.findAllProviders()
      this.page = this.pagination.page
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