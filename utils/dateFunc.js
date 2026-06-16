

export default {
    methods: {
         //получаем  текущий месяц/год  MM.YYYY 
         inDateMounthYear (val) { 
          if (val == null || val == "") {
            return
          }
          var d = new Date(val);
          
          var dat = ("0"+(d.getMonth()+1)).slice(-2) + "/" 
          +d.getFullYear();
        
          return dat
         },
        //получаем  текущий месяц DD.MM.YYYY 
        inDate (val) { 
            if (val == null || val == "") {
              return
            }
            var d = new Date(val);
            
            var dat = ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." 
            +d.getFullYear();
          
            return dat
        },
        //получаем  текущий месяц DD.MM.YYYY mm:ss
        inDateTime (val) {   
            if (val == null || val == "") {
                return
            }
            var d  = this.convertDate(val)
            d = new Date(val);
            
            var dat = ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." 
            +d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
          
            return dat
        },
        //получаем 01 число текущего месяца
        firstDayMonth(val){  
          var str = this.inDate(val)
          var arr = str.split('.')
          arr[0] = '01'
          return arr.join('.')
        },
        //получаем дату формата 2020-12-21
        convertDate(ara){
          var a = new Date(ara);

            var res = [
                a.getFullYear(),
                this.addLeadZero(a.getMonth() + 1),
                this.addLeadZero(a.getDate()),
                
            ].join('-');

            return res
        },
        addLeadZero(val) {
          if (+val < 10) return '0' + val;
          return val;
        },
        //добавляем 0 к дате
        plusByDayMonth(str){  
        
          var arr = str.split('.')

          if(arr[0].length == 1){
              arr[0] = '0' + arr[0]
          }
          return arr.join('.')
      },
      // сегодня
      today(){
            var d = new Date();
          
          var dat = ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." 
          +d.getFullYear();
          return dat
      },
       // сегодня
       now(){
        return new Date().toLocaleDateString()
    },
    } 
  } 