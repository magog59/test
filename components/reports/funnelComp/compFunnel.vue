<template>
    <tbody >
        <tr >
             
                <th  class="sumColor" @click="showDetals=!showDetals">{{name}}</th>
                <th  v-for="(day, idx) in rep" :key="idx"  class="sumColor" >
                      <a  v-if="keyComp != 'overall' && keyComp != 'procentmarge'  " target="_blank"  :href="'/reports/funnelComp/detailFunnel/'+idx+'='+keyComp+'='+0+'='+ user_id+''" >
                          {{getValue(day,'count')}} 
                          
                      </a>
                      <a v-else>{{getValue(day,'count')}}  </a>  
                </th>   
                <th v-if="keyComp != 'overall' && keyComp != 'procentmarge'" class="sumColor" >
                       <a  v-if="keyComp != 'overall' && keyComp != 'procentmarge'  " target="_blank"  :href="'/reports/funnelComp/detailFunnel/'+form.from+'='+keyComp+'='+0+'='+ user_id+'='+form.to +'='+'total'">
                            {{sourcetotal.count}}
                       </a>      
                </th> 
                <th v-if="keyComp == 'overall' || keyComp == 'procentmarge'" class="sumColor">0</th> 

        </tr>
        
        <tr   v-for="model in mapSourse" :key="model.id" class="detailColor"  >
            <th v-if="showDetals" >{{model.name}}</th>
            <th  v-for="(sourse, day) in rep" :key="day" v-show="showDetals" >
                  <a  target="_blank"  :href="'/reports/funnelComp/detailFunnel/' +day +'='+keyComp+'='+ model.id+'='+ user_id+''" >
                      {{getValueSourse(sourse , model.id)}}
                  </a>
            </th>  
            <th v-if=" showDetals && (keyComp != 'overall' && keyComp != 'procentmarge')  ">{{sourcetotal[model.id]}}</th> 
            <th v-if=" showDetals && (keyComp == 'overall' || keyComp == 'procentmarge')  "></th> 
        </tr>
  
    </tbody>
</template>

<script>
   import Vuex from 'vuex'
 
export default {
    name: 'funnel',
    props:['name', 'keyComp','form', 'user_id'],
    data () {
      return {
         datalist: null,
         showDetals: false,
         keys: null,
         keysRepDays: null,
         sourcetotal: {}
      }
    },
    components: {
       
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
    watch:{
      form(){
          this.getDataBykeyComp()
      },
      rep(){
          if(this.rep != null ){
              var key = Object.keys(this.rep)
              this.keys = key
          }
       },
      repDays(){
          if(this.repDays != null ){
              var key = Object.keys(this.repDays)
              this.keysRepDays = key
          }
       }

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
              if(this.user_id != null){
                    obj.userId = this.user_id
              }
              this.$store.dispatch('funnel/find', obj)
                .then((resp)=> {
                      var obj = Object.assign({},resp.data)
                      this.datalist = obj
                      this.$emit('sendReport', obj)
                      this.getSumm()
                })
                
          }
         
      },
      getSumm(){
            this.sourcetotal =  {}; 
            for(var i = 0; i< this.repDays.length; i++){
              var dt = this.repDays[i]
              var keys = Object.keys(this.rep[dt])
              keys.map(e => {
                if (this.sourcetotal[e] == null) {
                  this.sourcetotal[e] =  +this.rep[dt][e]
                } else {
                  this.sourcetotal[e] +=  +this.rep[dt][e]
                }
              })
            } 
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