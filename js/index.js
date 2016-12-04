$(function(){
	var id = localStorage.getItem("id");


	$.ajax({

                type: "POST",
                url: URL+"/user/getWorkOrder",
                data: {
                    id: id
                },
                success: function(this_data){
                	var this_data = JSON.parse(this_data);
                	
                	var monitor=tree.getAttributeValue("value",this_data,"bzz");
                    $(".monitor").append(monitor);
		            $(".loading").hide();
					$(".loadCeng").hide();
					var tsyq=doT.template($("#special_req").html());
					$("#special_require").html(tsyq(this_data));

                },
                error: function(error){
                	console.log(error);
                    stopWork(error);
                }

            });

	


	
});