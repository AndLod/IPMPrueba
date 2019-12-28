var a_name = new Array();

function get_request(theUrl){    
    var nombre = "";

    var request = new XMLHttpRequest();
    request.open("GET",theUrl, false);
    request.onreadystatechange = function(data){
        if (request.readyState == 4 && request.status==200)
            nombre = request.responseText;
        console.log(request.readyState);
        console.log(request.status);
        
    };
    request.send();
    
    var salida_parseada = JSON.parse(nombre);

    return salida_parseada;

}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

function displayWorkoutsList(){
    var contenido = get_request('http://localhost:5000/get_workouts_name');
    var cont_des = get_request('http://localhost:5000/get_workouts_description');
    var image_wk = get_request('http://localhost:5000/get_workouts_image');    
    var tabla = document.getElementById("wk_table");
   

    for (var i = 0; i < contenido.length; i++) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var name_wk = document.createTextNode(contenido[i].workoutName).textContent;
        var description = document.createTextNode(cont_des[i].workoutDescription).textContent;
        var imageStr = image_wk[i].workoutImage;
        var no_image = new Image();
        var image = new Image();
        no_image.src = "no_image.png";
        no_image.style.height = "50px";
        no_image.style.width = "50px";

        td1.append(name_wk);
        td2.append(description);
        if( imageStr != ""){
            console.log();
            if (imageStr.$binary != null){
                image.src = 'data:image/jpeg;base64,' + atob(decode_utf8(imageStr.$binary));
                image.style.height = "50px";
                image.style.width = "50px";
            }else{
                var pos = String(imageStr).lastIndexOf("\\");
                var aux = String(imageStr).substring(pos+1);
                image.src = aux;
                image.style.height = "50px";
                image.style.width = "50px";
            }
            td3.append(image);
        }else{
            td3.append(no_image);
        }
        
        tr.append(td1);
        tr.append(td2);
        tr.append(td3);
        tabla.appendChild(tr);
    }
}

function displayExercisesList() {
  
    var contenido = get_request('http://localhost:5000/get_exercises');
    var x = document.getElementById("exercise_select");

    for (var i = 0; i < contenido.length; i++) {
        var cell = document.createElement("option");
        var cc = document.createTextNode(contenido[i].exerciseName).textContent;
        cell.text = cc;   
        x.add(cell);
    }       
}

function add_ex(){
    var name_exercise = document.getElementById("exercise_select").value;
    var duration_exercise = document.getElementById("ex_duration").value;
    var tipo_ex= document.getElementById("tipo_ex").value;
    var image_ex = get_request('http://localhost:5000/get_exercises_image');

    if(name_exercise.length>0){
        if(duration_exercise.length>0){
            if(duration_exercise[0]!="-" && duration_exercise[0]!="0"){
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                var td3 = document.createElement("td");                
                var image = new Image();
                var i = 0;
                while (i < image_ex.length){
                    // console.log(i);
                    // console.log(image_ex[i][1].exerciseImage.$binary);
                    if((image_ex[i][0].exerciseName == name_exercise)&&image_ex[i][1].exerciseImage.$binary != null){
                        image.src = 'data:image/jpeg;base64,' + atob(decode_utf8(image_ex[i][1].exerciseImage.$binary));
                        i = image_ex.length;
                    }
                    i = i+1;
                }
                if (i == (image_ex.length)){
                    image.src ="no_image.png";
                }
                image.style.height = "50px";
                image.style.width = "50px";

                td3.append(image);   

                td1.append(name_exercise);

                if("rep"==tipo_ex){
                    td2.append(duration_exercise+" "+tipo_ex);
                }else{
                    td2.append(duration_exercise+tipo_ex);
                }

                tr.append(td1);
                tr.append(td2);                
                tr.append(td3);                

                a_name.push([td1.innerHTML,td2.innerHTML]);

                document.getElementById("ex_table").appendChild(tr);                            
                document.getElementById("ex_duration").value="";
                
            }            
        }        
    }
}

function dataToBinary(data){

    // return window.btoa(unescape(encodeURIComponent( data )));
    var data_string = "";
    for(var i=0; i<data.length; i++){
        data_string += String.fromCharCode(data[i].charCodeAt(0) & 0xff);
    }
    return data_string;
};

function add_workout(){
    var work_name = document.getElementById("work_name").value;
    var description = document.getElementById("des_name").value;    
    var salida = new String();
    var wk_image = new Image();
    var url = 'http://localhost:5000/post_workout';

    salida = document.getElementById("image_wk").value;

    var pos = salida.lastIndexOf("\\");

    wk_image.src = salida.substring(pos+1);
    wk_image.style.height = "50px";
    wk_image.style.width = "50px";

    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");

    td1.append(work_name);
    
    var des = new String();
    if (description.length==0){
        des = " ";
    }else{
        des= description;
    }
    
    td2.append(des);
    td3.append(wk_image);

    tr.append(td1);
    tr.append(td2);
    tr.append(td3);    

    document.getElementById("wk_table").appendChild(tr);

    
    var request = new XMLHttpRequest();
    request.open("POST",url, false);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = function(data){
        if (request.readyState == 4 && request.status==200)
            nombre = request.responseText;
        console.log(request.readyState);
        console.log(request.status);
        
    };    
    
    var imagen = dataToBinary(salida);
    var data=JSON.stringify({"name": work_name, "description": description, "image":imagen, "exercises":a_name});
    request.send(data);

    show_exercise();
    document.getElementById("work_name").value="";
    document.getElementById("des_name").value="";    
    eliminar();

}

function show_bad_value_ex(){
    var bad = document.getElementById("ex_duration_bad");
    var good = document.getElementById("ex_duration");

    bad.style.display="block";
    good.style.display="none";
}

function reset_bad_ex(){
    var bad = document.getElementById("ex_duration_bad");
    var good = document.getElementById("ex_duration");

    bad.style.display="none";
    good.style.display="block";
}

function add_rest(){
    var duration_exercise = document.getElementById("rest_duration").value;
    var tipo_ex= document.getElementById("tipo_ex_rest").value;

    if(duration_exercise.length>0){
        if(duration_exercise[0]!="-" && duration_exercise[0]!="0"){
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            var rest_image = new Image();

            rest_image.src = "relax.png";
            rest_image.style.height = "50px";
            rest_image.style.width = "50px";

            td1.append("Rest");
            td2.append(duration_exercise+tipo_ex);
            td3.append(rest_image);

            tr.append(td1);
            tr.append(td2);
            tr.append(td3);

            a_name.push([td1.innerHTML,td2.innerHTML]);            

            document.getElementById("ex_table").appendChild(tr);        
            document.getElementById("rest_duration").value="";
        }
    }
}

function show_rest(valor){
    var rest = document.getElementById("rest_section");
    var exercise_selection = document.getElementById("ex_section");

    if(valor.value ==="rest"){
        exercise_selection.style.display="none";        
        document.getElementById("exercise_ch").checked =false;
        rest.style.display="block";        
    }else{
        exercise_selection.style.display="block";
        rest.style.display="none";
        document.getElementById("rest_ch").checked =false;
    }
}

function eliminar(){
    var tableHeaderRowCount = 1;
    var table = document.getElementById("ex_table");
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

function delete_last(){        
    if (confirm("Are you sure you want to delete the last exercise?")){
        var table = document.getElementById("ex_table");
        var last = table.rows.length;
        if(last!=1){
            table.deleteRow(last-1);
        }
    }
}

function show_exercise() {
    wk = document.getElementById("addExBt_tableWork");
    ex = document.getElementById("ex");
    name_wk = document.getElementById("work_name").value;
    des_wk = document.getElementById("des_name").value;

    if(name_wk.length>0 && des_wk.length>0){
        if(wk.style.display==="none"){
            wk.style.display = "block";
            ex.style.display = "none";            
        }else{
            wk.style.display = "none";
            ex.style.display = "block";
            displayExercisesList();            
        }      
    }
}


function imageWorkLoad(){
    document.getElementById("image_wk").click();
}

function imageEXLoad(){
    document.getElementById("image_ex").click();

}