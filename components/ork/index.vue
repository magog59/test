 <template>
  <section>
      <div class="row " >
          <div class="col-2"></div>
              <div  class="col-8">
                     <h3>Добавить платеж</h3>
                      <button type="button" class="close" @click="returnTo()" aria-hidden="true">×</button>
                     
                          <div class="row" style="margin-top: 30px" >
                              <div style=" font-size: 70%;margin-right: 89%;">Дата оплаты</div>
                              <date-picker v-model="form.payment_date"  :format="'DD.MM.YYYY mm:ss'"  valueType="format" ></date-picker>
                          </div>
                          <div class="row" style="margin-top: 30px" >
                                <div style=" font-size: 70%;margin-right: 60%;">Номер платежки</div>
                                <input type="text" class="form-control" v-model="form.pay_number" >
                          </div>
                          <div class="row" style="margin-top: 30px" >
                                <div style=" font-size: 70%;margin-right: 70%;">Сумма</div>
                                <input type="text" class="form-control" v-model="form.amount"> 
                          </div>
                          <div class="row" style="margin-top: 50px">
                                <button class="btn btn-primary" style="width:120px;border-radius: 20px" @click="saveData()"> Дoбавить</button>
                          </div>
                      <div>
                <table class="table table-border table-hover" style="margin-top:20px">
                    <tr>
                        <th>Номер платежа </th>  
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Удалить</th>
                    </tr>
                    <tbody v-for="model in datalist" :key="model.id">
                      <tr  v-if="edit == null || edit.id != model.id"  :class="[model.deleted_at != null ? 'disabled' : '']">
                        <td>{{model.pay_number}}</td>
                        <td>{{model.payment_date}}</td>
                        <td>{{model.amount}}</td>
                        <td width="60px;" title="Удалить">
                              <a href="#">
                                  <vue-confirmation-button
                                      v-if="model.deleted_at == null || model.deleted_at == ''"
                                      :css="'fui-trash'"
                                      v-on:confirmation-success="delData(model.id)">
                                  </vue-confirmation-button>
                              </a>
                        </td>
                      </tr>
                    </tbody>
                </table>
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
  import dateFunc from '../../utils/dateFunc'
  import vueConfirmationButton from '../../utils/confirmButton'

export default {
    mixins: [Acl,dateFunc],
    name: '',
    data () {
      return {
        form:{
          payment_date: this.inDateTime(new Date()),
          pay_number: '',
          amount:'',
          agreement_id: ''
        },
        search: null,
        page: null,
        edit: null,
        addModalShow: false,
        params: {},
        modelName: null
      }
    },
    components: {
      DatePicker,
      vueConfirmationButton
    },
    computed: {
      ...Vuex.mapGetters({
          apiUrl: 'app/apiUrl',
          users: 'app/users',
          datalist: 'payment/datalist'
      }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
          save: 'payment/save',
          findData: 'payment/find',
          deleteData: 'payment/delete'
      }),
      getPararms(){
          var obj = this.$route.params.id    
          var arr = obj.split('=')
          this.form.clients_id = arr[0]
          this.form.agreement_id = arr[1]
          this.modelName = arr[2]
      },
      saveData(){
        this.setError(null)
        this.save(this.form)
        .then(() => {
              this.findData({ agreement_id: this.form.agreement_id} )
        })
      },
      returnTo(){
          // this.$router.push('../../mybuisness/')
           if(this.modelName == 'show'){
                  this.$router.push('/clients/show/'+ this.form.clients_id)
            }
            if(this.modelName == 'mybuisness'){
                  this.$router.push('../../mybuisness?active=ork')
            }
      },
      getUser(){
          var user =  Object.assign({}, this.user)  
          this.userId  = user.id
          this.form.manager_id = user.id
      },
      closeAddForm() {
        this.addModalShow = false
      },
      delData(id){
        this.setError(null)
        this.deleteData(id)
            .then(() =>{
              this.findData({ agreement_id: this.form.agreement_id} )
            })
      },
    },
    created() {
      this.getPararms()
      this.findData({ agreement_id: this.form.agreement_id} )
      this.setHeader('Cоздать Платеж')
      this.getUser()
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
