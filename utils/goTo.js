export default {
    methods: {
      showCompany(id){
        this.$router.push('../../clients/show/' + id)   
      },
      showComponent(comp){ 
        this.task = false
        this.outcall = false
        this.lead = false
        this.application = false  
        this.kp = false
        this.agreement = false    
        this.ork = false
        this.item = false  
        this.start = false
        this.collectDoc = false   
        this.analysis = false
        this.decorateDoc = false 
        this.workClose = false
        this.transfer = false
        this.transferClient = false
         
        if(comp != null && comp != '') {
            this[comp] = true
        }
    },
    } 
  } 