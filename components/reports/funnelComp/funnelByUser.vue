<template>
  <tbody  >


          <table class="table table-border table-hover" style="margin-top:30px;text-align: left;" v-for="user in users" :key="user.id">
              <h6>{{user.username}}</h6>
              <tr class="headColor">
                    <th>Показатель</th>
                    <th  v-for="(day, idx) in repDays" :key="idx">{{day}}</th>
                    <th>ИТОГО</th>
              </tr>
             <compFunnel :name="'Эк'" :keyComp="'lead'"  :form="form"  :user_id="user.id"/>
            <compFunnel :name="'Заявки'" :keyComp="'application'" :user_id="user.id" :form="form" />
            <compFunnel :name="'Коммерческие'" :keyComp="'kp'" :user_id="user.id" :form="form" />
            <compFunnel :name="'Договоры'" :keyComp="'agreement'"  :user_id="user.id" :form="form" />
            <compFunnel :name="'Выручка'" :keyComp="'agrpay'" :user_id="user.id" :form="form" />
            <compFunnel :name="'Маржа'" :keyComp="'margin'" :user_id="user.id" :form="form" />
            <compFunnel :name="'Средняя маржа'" :keyComp="'overall'"  :user_id="user.id" :form="form" />
            <compFunnel :name="'Процент маржи'" :keyComp="'procentmarge'" :user_id="user.id" :form="form" />
        
            <!-- <funnelByUser  :form="form" :users="users"/> -->

              
      </table>
          
 
  </tbody>
</template>

<script>
import Vuex from 'vuex'
import compFunnel from '../funnelComp/compFunnel'

 
export default {
    name: 'funnel',
    props:['name', 'keyComp','form', 'users'],
    data () {
      return {
         datalist: null,
         showDetals: false
      }
    },
    components: {
       compFunnel
    },
    watch:{
        form(){
            this.getDataBykeyComp()
        },
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            source: 'source/datalist',
            pagination: 'plan/pagination',
            map: 'dictionary/mapFunnel',
            mapSourse: 'dictionary/mapFunnelElem',
      }),
      rep(){
            var obj = Object.assign({}, this.datalist)
            return obj.rep
      },
      repDays(){
            var obj = Object.assign({}, this.datalist)
            return obj.dateArr
      },
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            find: 'plan/find',
      }),
      findData(){
        this.find()
      },
      getValue(day,key){
          return day[key]
     
      },
      getValueSourse(sourse,id){
            return sourse[id]
            
      },
      getDataBykeyComp(){
          if(this.form != null){
              var obj = Object.assign({}, this.form)  
              obj.key = this.keyComp
              this.$store.dispatch('funnel/find', obj)
                .then((resp)=> {
                      var obj = Object.assign({},resp.data)
                      this.datalist = obj
                })
          }
         
      },
      arrTesF(){
            var obj = Object.assign({}, this.datalist)
            this.arrTest = obj.dateArr
            this.arrTest.splice(0,2, 'Показатель')
      },
    
    },
    created() {
      this.setHeader('Воронка')
      this.getDataBykeyComp() 
   
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
  .headColor{
    background-color:#c5e2ff;  
  }
  .detailColor{
    background-color:#eaf6ff;  
  }   
  .sumColor{
    background-color:#cfe8f5;  
  }

</style>