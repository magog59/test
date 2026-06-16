 <template>
  <section>
      <div class="row " >
          <div class="col-2"></div>
              <div  class="col-8">
                     <h3>Перевести в Орк</h3>
                      <button type="button" class="close" @click="returnTo()" aria-hidden="true">×</button>
                     
                          <div class="row" style="margin-top: 30px" >
                                <div style=" font-size: 70%;margin-right: 90%;">Дата контакта</div>
                                <date-picker v-model="form.contactdate" :format="'DD.MM.YYYY mm:ss'"  valueType="format" ></date-picker>
                          </div>
                          <div class="row" style="margin-top: 30px" >
                                <div style=" font-size: 70%;margin-right: 90%;">Дата оплаты</div>
                                <date-picker v-model="form.pay_date" :format="'DD.MM.YYYY'" valueType="format" ></date-picker> 
                          </div>
                          <div style="margin-top: 30px; font-size: 70%;text-align: left">Дата предоставления документов клиентом</div>
                          <div class="row" style="" >
                                <date-picker v-model="form.clientdoc_date" :format="'DD.MM.YYYY'"  valueType="format" ></date-picker>
                          </div>
                          <div style="margin-top: 30px; font-size: 70%;text-align: left">Дата планируемого закрытия</div>
                          <div class="row"  >
                                
                                <date-picker v-model="form.close_date" :format="'DD.MM.YYYY'"  valueType="format" ></date-picker>  
                          </div>
                          <!-- <div class="row" style="margin-top: 30px" > 
                                <div style=" font-size: 70%;text-align: left"> Менеджер</div>
                                <select class="select"  v-model="form.manager_id" >
                                      <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                </select> 
                          </div> -->
                          <div class="row" style="margin-top: 50px">
                                <button class="btn btn-primary" style="width:120px;border-radius: 20px" @click="saveData()"> Дoбавить</button>
                          </div>
                      <div>
                      <div style="height: 200px;"></div>
              </div>
          </div>
          <div class="col-2"></div>   
      </div>
  </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import dateFunck from '../../utils/dateFunc'


export default {
    mixins: [Acl, dateFunck],
    name: 'createOrk',
    data () {
      return {
        form:{
            contactdate: this.inDateTime(new Date()),
            pay_date: this.inDate(new Date()),
            clientdoc_date: this.inDate(new Date()),
            close_date: this.inDate(new Date()),
            manager_id: '',
            agreement_id: ''
        },
        clients_id:'',
        search: null,
        page: null,
        edit: null,
        id:  this.$route.params.id,
        modelName: null
      }
    },
    components: {
        DatePicker,
    
    },
    computed: {
      ...Vuex.mapGetters({
          apiUrl: 'app/apiUrl',
          users: 'app/users',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            save: 'ork/save', 
            getUsers: 'app/getUsers'
      }),
      saveData(){
        this.setError(null)
        this.save(this.form)
            .then(() => {
                this.returnTo()
            })
      },
      returnTo(){
         if(this.modelName == 'show'){
                  this.$router.push('/clients/show/'+ this.clients_id)
            }
            if(this.modelName == 'mybuisness'){
                  this.$router.push('../../mybuisness?active=agreement')
            }
      },
      getUser(){
          var user =  Object.assign({}, this.user)  
          this.userId  = user.id
          this.form.manager_id = user.id
      },
      getParams(){
        var obj = this.$route.params.id
        var arr = obj.split('=')
        this.form.agreement_id = arr[0]
        this.clients_id = arr[1]
        this.modelName = arr[2]
      },
    },
    created() {
      this.setHeader('Перевести в ОРК')
      this.getUser()
      this.getUsers()
      this.getParams()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }

.mx-input-wrapper {
    width: 100% !important;
}
</style>
