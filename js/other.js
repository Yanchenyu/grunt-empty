$(function(){
    var flag=0;
    var list_template;
    var data_list="";
    var newData=[];
    localStorage.setItem("firstData",JSON.stringify([]));
    localStorage.setItem("secondData",JSON.stringify([]));
    localStorage.removeItem("newCopyOrder");




    $("nav li").click(function(){
        $("nav li").css({
            "color":"#000000",
            "border-bottom":"5px solid #f0f2f5"
        })
        $(this).css({
            "color":"#00b9ff",
            "border-bottom":"5px solid #00b9ff"
        });
    });

    $("#board_button").click(function(){
        window.location.href="boardMachine.html";
    });

    

                checkMes();

        

    $.ajax({
                headers: {AppSession: getcookie("sessionId")},
                url: URL + '/user/getWorkOrders',
                type: "post",
                data: {
                    "status": "unconfirmed"
                },
                dataType: "json",
                json: "callback",
                success: function (data) {
  

                    if(data.length>0){
                        var id = data[0]._id;
                        localStorage.setItem("id",id);
                    };
                    

            var n = data.length;
                    var newData=[];
            for(var i=0;i<n;i++){
                if(data[i].status!="completed"&&data[i].status!="suspended"){
                    newData.push(data[i]);
                    
                }
            };

            var checkNum = newData.length;
            $(".checkNum").html(checkNum);
            if(checkNum>0){
                $(".checkNum").show()
            };
            

                },
                error: function (err) {
                    console.log(err);
                    
                    stopWork(error);
                }
            });


    


       


       $("#undesignated").click(function(){
            localStorage.setItem("orderStatus","undesignated");
            $(".beforeChoose").show();
        $(".assign_button").show();
        $(".board_button").hide();
            $.ajax({
                headers: {AppSession: getcookie("sessionId")},
                url: URL + '/user/getWorkOrders',
                type: "post",
                data: {
                    isAssigned: "false",
                    notInStatus:JSON.stringify(["completed","suspended"])
                },
                dataType: "json",
                json: "callback",
                success: function (data) {

                    localStorage.setItem("firstData",JSON.stringify(data));


                    
                    if(data.length>0){
                        var id = data[0]._id;
                        localStorage.setItem("id",id);
                    };

                    var n = data.length;
                    var newData=[];
            for(var i=0;i<n;i++){
                if(data[i].status!="completed"&&data[i].status!="suspended"){
                    newData.push(data[i]);
                    
                }
            }

            list_template=doT.template($("#listTmpl").html());
            $("#listOrder").html(list_template(newData));

            var nowHeight = window.screen.availHeight;
            
            for(var i=6;i<$(".list").length+1;i++){
                nowHeight += 35;
                
            };
            $(".wrapper").css("height",nowHeight+"px");

            for(var i = 0;i<$(".list").length;i++){
                var isLight = $(".isLight").eq(i).html();
                if($(".orderType").html()!=='ls_work_order'){
                    var nx = $(".direction").eq(i).html();
                    $(".direction").eq(i).html(nx.toUpperCase());
                };
                if(isLight=="true"){
                    $(".list").eq(i).find(".list_3").css("color","red");
                }else{
                    $(".list").eq(i).find(".list_3").css("color","#000");
                };
            };

            $(".chooseOrder").click(function(event){
                if($(this).attr("data-isSelect")=="false"){
                    
                    $(this).addClass("selectAfter_1");
                    $(this).removeClass("selectBefore_1");
                    $(this).attr("data-isSelect","true");
                    $(".beforeChoose").hide();
                    $(".assign_button").show();
                    event.stopPropagation();
                }else if($(this).attr("data-isSelect")=="true"){
                    
                    $(this).addClass("selectBefore_1");
                    $(this).removeClass("selectAfter_1");
                    $(this).attr("data-isSelect","false");

                    var selectNum = $(".selectAfter_1").length;
                    if(selectNum==0){
                        $(".beforeChoose").show();
                    $(".assign_button").hide();
                    };

                    event.stopPropagation();
                }
            });


            $("#assign_button").click(function(){
                var firstData = JSON.parse(localStorage.getItem("firstData"));
                var secondData = JSON.parse(localStorage.getItem("secondData"));
                var allData = firstData.concat(secondData);
                console.log(allData);
                
                var assignData = [];
                for(var i=0;i<$(".list").length;i++){
            if($(".list").eq(i).find(".chooseOrder").attr("data-isSelect")=="true"){
                var thisId = $(".list").eq(i).find(".list_id").html();
                for(var n=0;n<allData.length;n++){
                    var assignEachData = {};
                    if(thisId==allData[n]._id){
                        assignEachData.id=allData[n]._id;
                        assignEachData.jth=allData[n].jth.value;


                       
                        
                           if(allData[n].wsxmcLimit){
                                assignEachData.wsxmc = allData[n].wsxmcLimit;
                                
                           }else{
                                
                                assignEachData.wsxmc = "0"
                           };


                        

                        assignData.push(assignEachData);

                        
                    }
                }



            }
        };



            
            localStorage.setItem("assignData",JSON.stringify(assignData));

                window.location.href="assignJockey.html";
            });

                },
                error: function (err) {
                    console.log(err);

                    stopWork(err);
                }
            });
        });

        $("#designated").click(function(){
            $(".beforeChoose").show();
        $(".assign_button").show();
        $(".board_button").hide();
            localStorage.setItem("orderStatus","designated");
            $.ajax({
                headers: {AppSession: getcookie("sessionId")},
                url: URL + '/user/getWorkOrders',
                type: "post",
                data: {
                    isAssigned: "true",
                    notInStatus:JSON.stringify(["completed","suspended"])
                },
                dataType: "json",
                json: "callback",
                success: function (data) {

                    localStorage.setItem("secondData",JSON.stringify(data));
                 
                    if(data.length>0){
                        var id = data[0]._id;
                        localStorage.setItem("id",id);
                    };

                    var n = data.length;
                    var newData=[];
            for(var i=0;i<n;i++){
                if(data[i].status!="completed"&&data[i].status!="suspended"){
                    newData.push(data[i]);
                    
                }
            }

            list_template=doT.template($("#listTmpl").html());
            $("#listOrder").html(list_template(newData));

            var nowHeight = window.screen.availHeight;
            
            for(var i=6;i<$(".list").length+1;i++){
                nowHeight += 35;
                
            };
            $(".wrapper").css("height",nowHeight+"px");

            for(var i = 0;i<$(".list").length;i++){
                var isLight = $(".isLight").eq(i).html();
                if($(".orderType").html()!=='ls_work_order'){
                    var nx = $(".direction").eq(i).html();
                    $(".direction").eq(i).html(nx.toUpperCase());
                };
                if(isLight=="true"){
                    $(".list").eq(i).find(".list_3").css("color","red");
                }else{
                    $(".list").eq(i).find(".list_3").css("color","#000");
                };
            };

            $(".chooseOrder").click(function(event){
                if($(this).attr("data-isSelect")=="false"){
                    
                    $(this).addClass("selectAfter_1");
                    $(this).removeClass("selectBefore_1");
                    $(this).attr("data-isSelect","true");
                    $(".beforeChoose").hide();
                    $(".assign_button").show();
                    event.stopPropagation();
                }else if($(this).attr("data-isSelect")=="true"){
                    
                    $(this).addClass("selectBefore_1");
                    $(this).removeClass("selectAfter_1");
                    $(this).attr("data-isSelect","false");

                    var selectNum = $(".selectAfter_1").length;
                    if(selectNum==0){
                        $(".beforeChoose").show();
                    $(".assign_button").hide();
                    };

                    event.stopPropagation();
                }
            });


            $("#assign_button").click(function(){
                var firstData = JSON.parse(localStorage.getItem("firstData"));
                var secondData = JSON.parse(localStorage.getItem("secondData"));
                var allData = firstData.concat(secondData);
                console.log(allData);
                var assignData = [];
                for(var i=0;i<$(".list").length;i++){
            if($(".list").eq(i).find(".chooseOrder").attr("data-isSelect")=="true"){
                var thisId = $(".list").eq(i).find(".list_id").html();
                for(var n=0;n<allData.length;n++){
                    var assignEachData = {};
                    if(thisId==allData[n]._id){
                        assignEachData.id=allData[n]._id;
                        assignEachData.jth=allData[n].jth.value;

                        if(allData[n].wsxmcLimit){
                                assignEachData.wsxmc = allData[n].wsxmcLimit;
                                
                           }else{
                                
                                assignEachData.wsxmc = "0"
                           };

                        assignData.push(assignEachData);

                        
                    }
                }



            }
        };



            
            localStorage.setItem("assignData",JSON.stringify(assignData));

                window.location.href="assignJockey.html";
            });

            
                },
                error: function (err) {
                    console.log(err);
                   
                    stopWork(err);
                }
            });
        });


        $("#unchecked").click(function(){
            $(".beforeChoose").show();
        $(".assign_button").show();
        $(".board_button").hide();
            localStorage.setItem("orderStatus","unchecked");
            $.ajax({
                headers: {AppSession: getcookie("sessionId")},
                url: URL + '/user/getWorkOrders',
                type: "post",
                data: {
                    "status": "unconfirmed"
                },
                dataType: "json",
                json: "callback",
                success: function (data) {

                    
                    if(data.length>0){
                        var id = data[0]._id;
                        localStorage.setItem("id",id);
                    };

            var n = data.length;
                    var newData=[];
            for(var i=0;i<n;i++){
                if(data[i].status!="completed"&&data[i].status!="suspended"){
                    newData.push(data[i]);
                    
                }
            };
            var checkNum = newData.length;
            $(".checkNum").html(checkNum);
            $(".checkNum").hide();
            if(checkNum>0){
                $(".checkNum").show()
            };

            list_template=doT.template($("#listTmpl").html());
            $("#listOrder").html(list_template(newData));

            var nowHeight = window.screen.availHeight;
            
            for(var i=6;i<$(".list").length+1;i++){
                nowHeight += 35;
                
            };
            $(".wrapper").css("height",nowHeight+"px");

            for(var i = 0;i<$(".list").length;i++){
                
                var isLight = $(".isLight").eq(i).html();
                if($(".orderType").html()!=='ls_work_order'){
                    var nx = $(".direction").eq(i).html();
                    $(".direction").eq(i).html(nx.toUpperCase());
                };
                
                if(isLight=="true"){
                    $(".list").eq(i).find(".list_3").css("color","red");
                }else{
                    $(".list").eq(i).find(".list_3").css("color","#000");
                };
            };

            $(".chooseOrder").click(function(event){
                if($(this).attr("data-isSelect")=="false"){
                    
                    $(this).addClass("selectAfter_1");
                    $(this).removeClass("selectBefore_1");
                    $(this).attr("data-isSelect","true");
                    $(".beforeChoose").hide();
                    $(".assign_button").show();
                    event.stopPropagation();
                }else if($(this).attr("data-isSelect")=="true"){
                    
                    $(this).addClass("selectBefore_1");
                    $(this).removeClass("selectAfter_1");
                    $(this).attr("data-isSelect","false");

                    var selectNum = $(".selectAfter_1").length;
                    if(selectNum==0){
                        $(".beforeChoose").show();
                    $(".assign_button").hide();
                    };

                    event.stopPropagation();
                }
            });


            $("#assign_button").click(function(){
                var firstData = JSON.parse(localStorage.getItem("firstData"));
                var secondData = JSON.parse(localStorage.getItem("secondData"));
                var allData = firstData.concat(secondData);
                console.log(allData);
                var assignData = [];
                for(var i=0;i<$(".list").length;i++){
            if($(".list").eq(i).find(".chooseOrder").attr("data-isSelect")=="true"){
                var thisId = $(".list").eq(i).find(".list_id").html();
                for(var n=0;n<allData.length;n++){
                    var assignEachData = {};
                    if(thisId==allData[n]._id){
                        assignEachData.id=allData[n]._id;
                        assignEachData.jth=allData[n].jth.value;

                        if(allData[n].wsxmcLimit){
                                assignEachData.wsxmc = allData[n].wsxmcLimit;
                                
                           }else{
                                
                                assignEachData.wsxmc = "0"
                           };

                        assignData.push(assignEachData);

                        
                    }
                }



            }
        };



            
            localStorage.setItem("assignData",JSON.stringify(assignData));

                window.location.href="assignJockey.html";
            });

                },
                error: function (err) {
                    console.log(err);
                    
                    stopWork(err);
                }
            });
        });






    if(!localStorage.getItem("orderStatus")||localStorage.getItem("orderStatus")=="undesignated"){

        $("#undesignated").css({
            "color":"#00b9ff",
            "border-bottom":"5px solid #00b9ff"
        });

        $.ajax({
                headers: {AppSession: getcookie("sessionId")},
                url: URL + '/user/getWorkOrders',
                type: "post",
                data: {
                    isAssigned: "false",
                    notInStatus:JSON.stringify(["completed","suspended"])
                },
                dataType: "json",
                json: "callback",
                success: function (data) {

                    

                    localStorage.setItem("firstData",JSON.stringify(data));
                  
         
                    if(data.length>0){
                        var id = data[0]._id;
                        localStorage.setItem("id",id);
                    };

                    var n = data.length;
                    var newData=[];
            for(var i=0;i<n;i++){
                if(data[i].status!="completed"&&data[i].status!="suspended"){
                    newData.push(data[i]);
                    
                }
            }

            list_template=doT.template($("#listTmpl").html());
            $("#listOrder").html(list_template(newData));

            var nowHeight = window.screen.availHeight;
            
            for(var i=6;i<$(".list").length+1;i++){
                nowHeight += 35;
                
            };
            $(".wrapper").css("height",nowHeight+"px");

            for(var i = 0;i<$(".list").length;i++){
                var isLight = $(".isLight").eq(i).html();
                if($(".orderType").html()!=='ls_work_order'){
                    var nx = $(".direction").eq(i).html();
                    $(".direction").eq(i).html(nx.toUpperCase());
                };
                if(isLight=="true"){
                    $(".list").eq(i).find(".list_3").css("color","red");
                }else{
                    $(".list").eq(i).find(".list_3").css("color","#000");
                };
            };

           

            

            $(".loading").hide();
            $(".loadCeng").hide();

            $(".chooseOrder").click(function(event){
                if($(this).attr("data-isSelect")=="false"){
                    
                    $(this).addClass("selectAfter_1");
                    $(this).removeClass("selectBefore_1");
                    $(this).attr("data-isSelect","true");
                    $(".beforeChoose").hide();
                    $(".assign_button").show();
                    event.stopPropagation();
                }else if($(this).attr("data-isSelect")=="true"){
                    
                    $(this).addClass("selectBefore_1");
                    $(this).removeClass("selectAfter_1");
                    $(this).attr("data-isSelect","false");

                    var selectNum = $(".selectAfter_1").length;
                    if(selectNum==0){
                        $(".beforeChoose").show();
                    $(".assign_button").hide();
                    };

                    event.stopPropagation();
                }
            });


            $("#assign_button").click(function(){
                var firstData = JSON.parse(localStorage.getItem("firstData"));
                var secondData = JSON.parse(localStorage.getItem("secondData"));
                var allData = firstData.concat(secondData);
                console.log(allData);
                var assignData = [];
                for(var i=0;i<$(".list").length;i++){
            if($(".list").eq(i).find(".chooseOrder").attr("data-isSelect")=="true"){
                var thisId = $(".list").eq(i).find(".list_id").html();
                for(var n=0;n<allData.length;n++){
                    var assignEachData = {};
                    if(thisId==allData[n]._id){
                        assignEachData.id=allData[n]._id;
                        assignEachData.jth=allData[n].jth.value;

                        if(allData[n].wsxmcLimit){
                                assignEachData.wsxmc = allData[n].wsxmcLimit;
                                
                           }else{
                                
                                assignEachData.wsxmc = "0"
                           };

                        assignData.push(assignEachData);

                        
                    }
                }



            }
        };



            
            localStorage.setItem("assignData",JSON.stringify(assignData));

                window.location.href="assignJockey.html";
            });


            
                },
                error: function (err) {
                    console.log(err);
                    
                    stopWork(err);
                }
            });


    }else if(localStorage.getItem("orderStatus")=="designated"){

        $("#designated").css({
            "color":"#00b9ff",
            "border-bottom":"5px solid #00b9ff"
        });

        $.ajax({
                headers: {AppSession: getcookie("sessionId")},
                url: URL + '/user/getWorkOrders',
                type: "post",
                data: {
                    isAssigned: "true",
                    notInStatus:JSON.stringify(["completed","suspended"])
                },
                dataType: "json",
                json: "callback",
                success: function (data) {

                    localStorage.setItem("secondData",JSON.stringify(data));
       
                    
                    if(data.length>0){
                        var id = data[0]._id;
                        localStorage.setItem("id",id);
                    };

                    var n = data.length;
                    var newData=[];
            for(var i=0;i<n;i++){
                if(data[i].status!="completed"&&data[i].status!="suspended"){
                    newData.push(data[i]);
                    
                }
            }

            list_template=doT.template($("#listTmpl").html());
            $("#listOrder").html(list_template(newData));

            var nowHeight = window.screen.availHeight;
            
            for(var i=6;i<$(".list").length+1;i++){
                nowHeight += 35;
                
            };
            $(".wrapper").css("height",nowHeight+"px");

            for(var i = 0;i<$(".list").length;i++){
                var isLight = $(".isLight").eq(i).html();
                if($(".orderType").html()!=='ls_work_order'){
                    var nx = $(".direction").eq(i).html();
                    $(".direction").eq(i).html(nx.toUpperCase());
                };
                if(isLight=="true"){
                    $(".list").eq(i).find(".list_3").css("color","red");
                }else{
                    $(".list").eq(i).find(".list_3").css("color","#000");
                };
            };
            

            $(".loading").hide();
            $(".loadCeng").hide();

            $(".chooseOrder").click(function(event){
                if($(this).attr("data-isSelect")=="false"){
                    
                    $(this).addClass("selectAfter_1");
                    $(this).removeClass("selectBefore_1");
                    $(this).attr("data-isSelect","true");
                    $(".beforeChoose").hide();
                    $(".assign_button").show();
                    event.stopPropagation();
                }else if($(this).attr("data-isSelect")=="true"){
                    
                    $(this).addClass("selectBefore_1");
                    $(this).removeClass("selectAfter_1");
                    $(this).attr("data-isSelect","false");

                    var selectNum = $(".selectAfter_1").length;
                    if(selectNum==0){
                        $(".beforeChoose").show();
                    $(".assign_button").hide();
                    };

                    event.stopPropagation();
                }
            });


            $("#assign_button").click(function(){
                var firstData = JSON.parse(localStorage.getItem("firstData"));
                var secondData = JSON.parse(localStorage.getItem("secondData"));
                var allData = firstData.concat(secondData);
                console.log(allData);
                var assignData = [];
                for(var i=0;i<$(".list").length;i++){
            if($(".list").eq(i).find(".chooseOrder").attr("data-isSelect")=="true"){
                var thisId = $(".list").eq(i).find(".list_id").html();
                for(var n=0;n<allData.length;n++){
                    var assignEachData = {};
                    if(thisId==allData[n]._id){
                        assignEachData.id=allData[n]._id;
                        assignEachData.jth=allData[n].jth.value;

                        if(allData[n].wsxmcLimit){
                                assignEachData.wsxmc = allData[n].wsxmcLimit;
                                
                           }else{
                                
                                assignEachData.wsxmc = "0"
                           };

                        assignData.push(assignEachData);

                        
                    }
                }



            }
        };



            
            localStorage.setItem("assignData",JSON.stringify(assignData));

                window.location.href="assignJockey.html";
            });


            

            
                },
                error: function (err) {
                    console.log(err);
                   
                    stopWork(err);
                }
            });

    }else if(localStorage.getItem("orderStatus")=="unchecked"){

        $("#unchecked").css({
            "color":"#00b9ff",
            "border-bottom":"5px solid #00b9ff"
        });

        $.ajax({
                headers: {AppSession: getcookie("sessionId")},
                url: URL + '/user/getWorkOrders',
                type: "post",
                data: {
                    "status": "unconfirmed"
                },
                dataType: "json",
                json: "callback",
                success: function (data) {

                    
                    if(data.length>0){
                        var id = data[0]._id;
                        localStorage.setItem("id",id);
                    };

            var n = data.length;
                    var newData=[];
            for(var i=0;i<n;i++){
                if(data[i].status!="completed"&&data[i].status!="suspended"){
                    newData.push(data[i]);
                    
                }
            };
            var checkNum = newData.length;
            $(".checkNum").html(checkNum);
            $(".checkNum").hide();
            if(checkNum>0){
                $(".checkNum").show()
            };

            list_template=doT.template($("#listTmpl").html());
            $("#listOrder").html(list_template(newData));

            var nowHeight = window.screen.availHeight;
            
            for(var i=6;i<$(".list").length+1;i++){
                nowHeight += 35;
                
            };
            $(".wrapper").css("height",nowHeight+"px");

            for(var i = 0;i<$(".list").length;i++){
                var isLight = $(".isLight").eq(i).html();
                if($(".orderType").html()!=='ls_work_order'){
                    var nx = $(".direction").eq(i).html();
                    $(".direction").eq(i).html(nx.toUpperCase());
                };
                if(isLight=="true"){
                    $(".list").eq(i).find(".list_3").css("color","red");
                }else{
                    $(".list").eq(i).find(".list_3").css("color","#000");
                };
            };
            

            $(".loading").hide();
            $(".loadCeng").hide();

            $(".chooseOrder").click(function(event){
                if($(this).attr("data-isSelect")=="false"){
                    
                    $(this).addClass("selectAfter_1");
                    $(this).removeClass("selectBefore_1");
                    $(this).attr("data-isSelect","true");
                    $(".beforeChoose").hide();
                    $(".assign_button").show();
                    event.stopPropagation();
                }else if($(this).attr("data-isSelect")=="true"){
                    
                    $(this).addClass("selectBefore_1");
                    $(this).removeClass("selectAfter_1");
                    $(this).attr("data-isSelect","false");

                    var selectNum = $(".selectAfter_1").length;
                    if(selectNum==0){
                        $(".beforeChoose").show();
                    $(".assign_button").hide();
                    };

                    event.stopPropagation();
                }
            });


            $("#assign_button").click(function(){
                var firstData = JSON.parse(localStorage.getItem("firstData"));
                var secondData = JSON.parse(localStorage.getItem("secondData"));
                var allData = firstData.concat(secondData);
                console.log(allData);
                var assignData = [];
                for(var i=0;i<$(".list").length;i++){
            if($(".list").eq(i).find(".chooseOrder").attr("data-isSelect")=="true"){
                var thisId = $(".list").eq(i).find(".list_id").html();
                for(var n=0;n<allData.length;n++){
                    var assignEachData = {};
                    if(thisId==allData[n]._id){
                        assignEachData.id=allData[n]._id;
                        assignEachData.jth=allData[n].jth.value;

                        if(allData[n].wsxmcLimit){
                                assignEachData.wsxmc = allData[n].wsxmcLimit;
                                
                           }else{
                                
                                assignEachData.wsxmc = "0"
                           };

                        assignData.push(assignEachData);

                        
                    }
                }



            }
        };



            
            localStorage.setItem("assignData",JSON.stringify(assignData));

                window.location.href="assignJockey.html";
            });


            

                },
                error: function (err) {
                    console.log(err);

                    stopWork(err);
                }
            });

    };


       

    
        



   




    
    


   
    



    
});

function refresh(){
    window.location.reload();
}


function getOrdermes(obj){
   
                var id = $(obj).find(".list_id").text();
                localStorage.setItem("id", id);
                var id = localStorage.getItem("id");
                localStorage.removeItem("chooseData");
                
 
                window.location.href="monitor_pagetwo.html";

}

function boardMachine(obj){
    var statu = $(obj).next().html();
    if(statu=="original"||statu=="adjusting"||statu=="pauseAdjust"||statu=="adjusted"){
        if($(obj).attr("data-check")=="false"){
        $(".list_2").attr("data-check","false");
        $(".list_2").css("color","#000");
        $(obj).css("color","red");
        $(".beforeChoose").hide();
        $(".assign_button").hide();
        $(".board_button").show();
        var id = $(obj).parent().parent().find(".list_id").text();
        localStorage.setItem("boardId", id);
        $(obj).attr("data-check","true");
    }else if($(obj).attr("data-check")=="true"){
        $(".list_2").attr("data-check","true");
        $(obj).css("color","#000");
        $(".beforeChoose").show();
        $(".assign_button").show();
        $(".board_button").hide();
        localStorage.removeItem("boardId");
        $(obj).attr("data-check","false");
    }
    }
    
    
    event.stopPropagation();
    event.preventDefault();

}
