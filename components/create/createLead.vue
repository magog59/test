 <template>
  <section>
      <div class="row " >
              <div  class="container" style="width: 600px;">
                   <button type="button" class="close" @click="returnTo()" aria-hidden="true" title="ПЕРЕЙТИ В ЭК">×</button>
                      <h3>Создать ЭК</h3>
                      <div style=" font-size: 70%;margin-right:86%;">Дата контакта</div>  
                          <div class="row">
                              <date-picker v-model="form.contactdate" :format="'DD.MM.YYYY mm:ss'" valueType="format" ></date-picker>
                          </div>
                          <div class="row" style="margin-top:40px">
                                <div style=" font-size: 70%;">Источник</div> 
                                <select class="select"  v-model="form.source_id" >
                                    <option  v-for="source in sources" :key="source.id" :value="source.id" >{{source.name}}</option>
                                </select>
                          </div>
                          <div v-if="form.source_id == 15" class="row custom_block" style="margin-top: 30px">
                                <div style="font-size: 70%;text-align:right">От кого</div>
                                <input type="text" class="form-control" v-model="form.from_who" @keydown="changeEditFromWho">
                                <div v-if="isShowListUsers && filtered_users.length != 0" class="custom_list custom_list_edit" style="width: 60%;">
                                    <p @click="setFromWhoName(form.from_who)">{{ form.from_who }}</p>
                                    <p v-for="user in filtered_users" v-show="user.status == 20" @click="setFromWhoName(user.username)" :key="user.id" :value="user.id" >{{ user.username }}</p>
                                </div>
                          </div>
                          <div class="row">
                                <input type="text" class="form-control"  style="margin-top: 30px"  v-model="form.interesttype" placeholder="Тип интереса">  
                          </div>
                          <div class="row">
                                <input type="text" class="form-control"  style="margin-top: 30px"  v-model="form.comment" placeholder="Комментарий">  
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
    mixins: [Acl,dateFunc],
    name: 'createLead',
    data () {
      return {
        form:{
          contactdate: this.inDateTime(new Date()),
          source_id:'',
          interesttype: '',
          comment: '',
          from_who: '',
        },
        search: null,
        page: null,
        edit: null,
        outcall_id: '',
        clients_id: '',
        modelName: null,
        isShowListUsers: false,
      }
    },
    components: {
      DatePicker,
    },
    watch: {
      sourceIdForm() {
          this.form.from_who = ''
      },
    },
    computed: {
      ...Vuex.mapGetters({
          apiUrl: 'app/apiUrl',
          sources: 'source/datalist',
          users: 'app/users',
      }),
      sourceIdForm() {
          return this.form.source_id
      },
      filtered_users() {
          if(!this.form.from_who){
              return [];
          }
          return this.users.filter(user => {
              return user.username.toLowerCase().indexOf(this.form.from_who.toLowerCase()) != -1
          })
      },
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
        save: 'lead/save',
        findSource: 'source/find',
        getUsers: 'app/getUsers',
      }),
      changeEditFromWho() {
            if (this.form.from_who.length >= 2) {
                this.isShowListUsers = true
            }else{
                this.isShowListUsers = false
            }
        },
      setFromWhoName(name) {
            this.form.from_who = name
            setTimeout(() => {
                this.isShowListUsers = false
            }, 100)
        },
      saveData(){
					console.log(this.form)
					if(this.form.source_id === "" || this.form.source_id == null){
						this.setError("Поле источник не может быть пустым!")
						return
					}

					this.setError(null)
					this.save(this.form)
							.then(() => {

									if(this.modelName == 'show'){
												this.$router.push('/clients/show/'+ this.form.clients_id)
									}

									if(this.modelName == 'mybuisness'){
											this.$router.push('../../mybuisness?active=lead')
									}
							})
      },
      returnTo(){
            if(this.modelName == 'show'){
                this.$router.push('/clients/show/'+ this.form.clients_id)
            }
            if(this.modelName == 'mybuisness'){
                this.$router.push('../../mybuisness?active=lead')
            }
      },
      getParams(){
          var obj =  this.$route.params.id
          var arr = obj.split('=')
          this.form.outcall_id = arr[0]
          this.clients_id = arr[1]
          this.form.clients_id = arr[1]
          this.modelName = arr[2]
      },
     
    },
    created() {
      this.setHeader('Cоздать ЭК')
      this.findSource(),
      this.getParams()
      this.getUsers()
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
</style>
