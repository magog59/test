 <template>
  <section>
      <div class="row " >
              <div class="container" style="width: 700px;">
                     <h3>Оформить Контракт</h3>
                     <button type="button" class="close" @click="returnTo()" aria-hidden="true">×</button>
                            <div class="row" >
                                  <div style=" font-size: 70%;margin-right: 80%;">Дата контакта</div>
                                  <date-picker v-model="form.contactdate" :format="'DD.MM.YYYY mm:ss'" valueType="format" ></date-picker>
                            </div>
                            <div  class="row" style="margin-top: 30px" >
                                <div style=" font-size: 70%;margin-right: 80%;">НДС</div>
                                <select class="select"  v-model="form.tax" >
                                    <option value="20">ИП Филимонов</option>
                                    <option value="10"> ООО Современные решения</option>
                                    <option value="30"> ООО Современные решения(Киров)</option>
                                </select>
                            </div>

                            <div class="row" style="margin-top: 30px">
                                  <div style=" font-size: 70%;text-align:left;">Подпись</div>
                                  <input type="text" class="form-control"    v-model="form.short_person" >
                            </div>
                            <div class="row" style="margin-top: 30px">
                                  <div style=" font-size: 70%;text-align:left;">В лице</div>
                                  <input type="text" class="form-control"  v-model="form.person" >
                            </div>
                            <div class="row" style="margin-top: 30px">
                                  <div style=" font-size: 70%;text-align:left;">На основании</div>
                                  <input type="text" class="form-control"    v-model="form.basement" >
                            </div>
                             <div class="row"  style="margin-top: 30px">
                                  <textarea class="form-control"  v-model="form.options" placeholder="Для чего документ" style="height: 100px;"  ></textarea>
                            </div>
                            <!-- <div class="row"  style="margin-top: 30px">
                                 <vue-editor v-model="edit.basement" style=" height: 100px;" ></vue-editor>
                            </div>  -->
                            <div class="row" style="margin-top: 50px">
                                <button class="btn btn-primary" style="width:120px;border-radius: 20px" @click="saveData()"> Дoбавить</button>
                            </div>
                            <div style="height: 200px;"></div>
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
   //import { VueEditor } from "vue2-editor"

  export default {
    mixins: [Acl,dateFunc],
    name: 'createKp',
    data () {
      return {
        form:{
            contactdate: this.inDateTime(new Date()),
            person: '',
            short_person:'',
            basement: '',
            kp_id: '',
            clients_id:'',
            options: "СТОРОНЫ установили срок вышеуказанной услуги в течение 15 (пятнадцати) рабочих дней с" +
                " момента оплаты 100 % суммы договора и согласования с Исполнителем полного пакета документов:" +
                " -Учредительные документы (копии ИНН, ОГРН, Устав) -Заявка -Нормативный документ, по которому " +
                "выпускается продукция (ГОСТ, ТУ, СТО и т.п.) -Эксплуатационная документация (РЭ, ПС) " +
                "-Обоснование безопасности (ОБ)"
        },
        search: null,
        page: null,
        edit: null,
        id:   this.$route.params.id,
        modelName: null
      }
    },
    components: {
        DatePicker,
        //VueEditor
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
            save: 'agreement/save',
      }),
      saveData(){
        this.setError(null)
        this.save(this.form)
         .then(() => {
              if(this.modelName == 'show'){
                    this.$router.push('/clients/show/'+ this.form.clients_id)
              }
              if(this.modelName == 'mybuisness'){
                    this.$router.push('../../mybuisness?active=agreement')
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
          this.form.clients_id  = arr[0]
          this.form.kp_id = arr[1]
          this.modelName = arr[2]
      },
    },
    created() {
      this.setHeader('Cоздать Договор')
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
