<template>
  <section>
        <div class="row " >
            <div  class="container" style="width: 700px;">
                  <h3>Создать Заявку</h3>
                  <button type="button" class="close" @click="returnTo()" aria-hidden="true">×</button>
                   <div class="row" style="margin-top: 30px"> 
                        <div style=" font-size: 70%;margin-right: 70%;">Дата контакта</div>
                        <date-picker v-model="form.contactdate" :format="'DD.MM.YYYY mm:ss'" valueType="format" ></date-picker>
                    </div>
                    <div class="row" style="margin-top: 30px"> 
                          <div style=" font-size: 70%;margin-right: 70%;">Расчитывает</div>
                          <select class="select"  v-model="form.countmanager_id" >
                              <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                          </select> 
                    </div>
                    <div class="row" style="margin-top: 30px"> 
                          <div style=" font-size: 70%;margin-right: 70%;">Документ нужен на руки</div>
                          <date-picker v-model="form.doc_on_hand"  valueType="format"  :format="'DD.MM.YYYY mm:ss'"></date-picker>
                    </div>
                    <div class="row"  style="margin-top: 30px"> 
                          <div style=" font-size: 70%;margin-right: 90%;">ЛПР</div>
                          <select  class="select"  v-model="form.is_lpr" >
                              <option value="10"> Да</option>
                              <option value="20">Нет</option>
                            </select>  
                    </div>
                     <div class="row"  style="margin-top: 30px"> 
                        <textarea  class="form-control"  v-model="form.another_offer" placeholder="Другие предложения"  style="height: 100px;" ></textarea>
                    </div>
                     <div class="row"  style="margin-top: 30px"> 
                        <textarea class="form-control"  v-model="form.doc_for_what" placeholder="Для чего документ" style="height: 100px;"  ></textarea>
                    </div>
                     <div class="row"  style="margin-top: 30px"> 
                        <input type="text" class="form-control"  v-model="form.okp" placeholder="ОКП">
                    </div> 
                    <div class="row"  style="margin-top: 30px"> 
                        <input type="text" class="form-control"  v-model="form.okpd2" placeholder="ОКПД2"> 
                    </div>
                     <div class="row"  style="margin-top: 30px"> 
                        <input type="text" class="form-control"  v-model="form.tnved" placeholder="ТНВЭД">
                    </div> 
                     <div class="row"  style="margin-top: 30px"> 
                        <input type="text" class="form-control"  v-model="form.documentprod" required placeholder="По какому документу выпуск - обязательное поле">
                    </div> 
                     <div class="row"  style="margin-top: 30px"> 
                        <input type="text" class="form-control"  v-model="form.field" placeholder="Область применения">
                    </div> 
                     <div class="row"  style="margin-top: 30px"> 
                        <input type="text" class="form-control"  v-model="form.countrymade" placeholder="Страна изготовитель">
                    </div> 
                     <div class="row"  style="margin-top: 30px"> 
                        <input type="text" class="form-control"  v-model="form.countryask" placeholder="Страна заявитель">
                    </div> 
                    <div class="row"  style="margin-top: 30px"> 
                        <div style=" font-size: 70%;margin-right: 90%;">Выезд</div>
                        <select class="select"  v-model="form.exittoclient" @keypress.enter.prevent="this.form.exittoclient" >
                                <option value="10">ДА</option>
                                <option value="20">НЕТ</option>
                        </select>
                    </div> 
                    <div class="row"  style="margin-top: 30px"> 
                         <div style=" font-size: 70%;margin-right: 70%;">Реальные испытания</div>
                         <select class="select"  v-model="form.test" @keypress.enter.prevent="this.form.test">
                                <option value="10">ДА</option>
                                <option value="20">НЕТ</option>
                        </select>
                    </div> 
                     <div class="row" style="margin-top: 30px;margin-bottom: 50px;heigth:200px">
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
  import DateFunc from '../../utils/dateFunc'

  export default {
    mixins: [Acl, DateFunc],
    name: 'createAppls',
    data () {
      return {
        form:{
            contactdate: this.inDateTime(new Date()),
            nameproduct: '',
            doc_on_hand:this.inDateTime(new Date()),
            is_lpr: '',
            another_offer:'',
            doc_for_what:'',
            okp:'',
            okpd2:'',
            tnved:'',
            documentprod:'',
            field:'',
            countrymade:'',
            countryask:'',
            exittoclient: 0,
            test: 0,
            manager_id:'',
            total:0,
            our_cost:0,
            lead_id: '',
            clients_id: ''
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
          apiUrl: 'app/apiUrl',
          users: 'app/users'
      }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
          save: 'application/save'
      }),
      saveData(){
          this.setError(null)
          this.save(this.form)
              .then(() => {
                    if(this.modelName == 'show'){
                          this.$router.push('/clients/show/'+ this.form.clients_id)
                    }
                     if(this.modelName == 'mybuisness'){
                         this.$router.push('../../mybuisness?active=application')
                    }
                    
              })
      },
      returnTo(){
              if(this.modelName == 'show'){
                    this.$router.push('/clients/show/'+ this.form.clients_id)
              }
              if(this.modelName == 'mybuisness'){
                    this.$router.push('../../mybuisness?active=application')
              }
      },
        getParams(){
          var obj =  this.$route.params.id
          var arr = obj.split('=')
          this.form.lead_id = arr[0]
          this.form.clients_id = arr[1]
          this.modelName = arr[2]
      },
    },
    created() {
      this.setHeader('Создать заявку')
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
.mx-input{
  width: 100%;
}
</style>
