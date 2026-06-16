 <template>
  <section>
      <div class="row " >
              <div class="container" style="width: 700px;">
                     <h3>Создать Коммерческое</h3>
                     <button type="button" class="close" @click="returnTo()" aria-hidden="true">×</button>
                          <div class="row" >
                              <div style=" font-size: 70%;margin-right: 87%;">Дата контакта</div>
                              <date-picker v-model="form.contactdate" :format="'DD.MM.YYYY mm:ss'"  valueType="format" ></date-picker>
                          </div>
                          <div class="row">
                                <input type="text" class="form-control"  style="margin-top: 30px"  v-model="form.client_name" placeholder="И.О. Клиента">  
                          </div>
                          <div class="row" style="margin-top: 50px">
                              <button class="btn btn-primary" style="width:120px;border-radius: 20px" @click="saveData()"> Дoбавить</button>
                          </div>
                      <div>
              </div>
          </div>   
      </div>
  </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import dateFunc from '../../utils/dateFunc'
 

export default {
    mixins: [Acl, dateFunc],
    name: 'createKp',
    data () {
      return {
        form:{
          contactdate: this.inDateTime(new Date()),
          client_name:'',
          state: 10,
          source_id: 10,
          application_id: '',
          clients_id:''
        },
        search: null,
        page: null,
        edit: null,
        id:   this.$route.params.id,
        modelName: null
      }
    },
    components: {
      DatePicker
   
    },
    computed: {
      ...Vuex.mapGetters({
          apiUrl: 'app/apiUrl'
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
      }),
      saveData(){
        this.setError(null)
        this.save(this.form)
          .then(() => {
                 if(this.modelName == 'show'){
                        this.$router.push('/clients/show/'+ this.form.clients_id)
                  }
                  if(this.modelName == 'mybuisness'){
                        this.$router.push('../../mybuisness?active=kp')
                  }
          })
      },
      returnTo(){
              if(this.modelName == 'show'){
                    this.$router.push('/clients/show/'+ this.form.clients_id)
              }
              if(this.modelName == 'mybuisness'){
                    this.$router.push('../../mybuisness?active=kp')
              }
      },
      getParams(){
        var obj = this.$route.params.id
        var arr = obj.split('=')
        this.form.clients_id = arr[0]
        this.form.application_id  = arr[1]
        this.modelName = arr[2]
      },
    },
    created() {
      this.setHeader('Cоздать Коммерческое')
      this.getParams()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
  select {
    display: block   ;
    width: 100% !important;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}
.mx-input-wrapper {
    width: 100% !important;
}
</style>
