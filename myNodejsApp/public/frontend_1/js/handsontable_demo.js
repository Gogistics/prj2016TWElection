/* handsontable for demo */
$(function(){
  // data handler
  var data_handler = {
    is_update_mechanism_triggered: false,
    data: {},
    update_demo_data: function(){
      if(!this.is_update_mechanism_triggered){
        $("#preloader").delay(50).fadeIn("slow");
        this.is_update_mechanism_triggered = true;
        // update by ajax
        $.ajax({
          data: {
            updated_demo_data : this.data
          },
          type: 'POST',
          url: '/services/update_demo_data_of_index_page',
          success: function(res){
            if(res.req_status === true){
              console.log('successfully updated demo data');
            }
            this.is_update_mechanism_triggered = false;
            $("#preloader").delay(100).fadeOut("slow");
          }
        });
      }
    }
  };
  //
  $.ajax({ // create an AJAX call...
      data: {
          req_purpose : 'get_demo_data'
      },
      type: 'POST', // GET or POST
      url: '/services/get_demo_data', // the file to call
      success: function(res) { // on success..
        // console.log(res);
        if(res.req_status === true){
          var finance_data = res.index_data;
          var container = document.getElementById('finance_example');
          var hot = new Handsontable(container, {
            data: finance_data,
            height: 396,
            colHeaders: ["Price", "Date", "1D Chg", "YTD Chg", "Vol BTC"],
            rowHeaders: true,
            stretchH: 'all',
            columnSorting: true,
            contextMenu: true,
            columns: [
              {type: 'text', format: '$0,0.00', validator: Handsontable.NumericValidator},
              {type: 'date', dateFormat: 'DD/MM/YYYY', correctFormat: true},
              {type: 'text', format: '0.00%', validator: Handsontable.NumericValidator},
              {type: 'text', format: '0.00%', validator: Handsontable.NumericValidator},
              {type: 'text', format: '0.00', validator: Handsontable.NumericValidator}
            ],
            afterChange: function(changes, source){
              // get current edited cell and values
              if(changes){
                console.log(changes);
              }
            }
          });

          // click listener (incomplete)
          $('#btn_update_demo_data').click(function(e){
            e.preventDefault();
            data_handler.data = finance_data;
            data_handler.update_demo_data();
          });

        }else{
          throw "fail to get data from mongodb";
        };

        // fade out popup cover
        $("#preloader").delay(100).fadeOut("slow");
      }
  });
});