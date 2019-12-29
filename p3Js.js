var aName = new Array();

function getRequest(theUrl){    
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
    
    var salidaParseada = JSON.parse(nombre);

    return salidaParseada;

}

function decodeUtf8(s) {
    return decodeURIComponent(escape(s));
}

function displayWorkoutsList(){
    var contenido = getRequest('http://localhost:5000/get_workouts_name');
    var contDes = getRequest('http://localhost:5000/get_workouts_description');
    var imageWk = getRequest('http://localhost:5000/get_workouts_image');    
    var tabla = document.getElementById("wk_table");
   

    for (var i = 0; i < contenido.length; i++) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var nameWk = document.createTextNode(contenido[i].workoutName).textContent;
        var description = document.createTextNode(contDes[i].workoutDescription).textContent;
        var imageStr = imageWk[i].workoutImage;
        var noImage = new Image();
        var image = new Image();
        noImage.src = "no_image.png";
        noImage.style.height = "50px";
        noImage.style.width = "50px";

        td1.append(nameWk);
        td2.append(description);
        if( imageStr != ""){
            console.log();
            if (imageStr.$binary != null){
                image.src = 'data:image/jpeg;base64,' + atob(decodeUtf8(imageStr.$binary));
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
            td3.append(noImage);
        }
        
        tr.append(td1);
        tr.append(td2);
        tr.append(td3);
        tabla.appendChild(tr);
    }
}

function displayExercisesList() {
  
    var contenido = getRequest('http://localhost:5000/get_exercises');
    var x = document.getElementById("exercise_select");

    for (var i = 0; i < contenido.length; i++) {
        var cell = document.createElement("option");
        var cc = document.createTextNode(contenido[i].exerciseName).textContent;
        cell.text = cc;   
        x.add(cell);
    }       
}

function addEx(){
    var nameExercise = document.getElementById("exercise_select").value;
    var durationExercise = document.getElementById("ex_duration").value;
    var tipoEx= document.getElementById("tipo_ex").value;
    var imageEx = getRequest('http://localhost:5000/get_exercises_image');

    if(nameExercise.length>0){
        if(durationExercise.length>0){
            if(durationExercise[0]!="-" && durationExercise[0]!="0"){
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                var td3 = document.createElement("td");                
                var image = new Image();
                var i = 0;
                while (i < imageEx.length){
                    // console.log(i);
                    // console.log(imageEx[i][1].exerciseImage.$binary);
                    if((imageEx[i][0].exerciseName == nameExercise)&&imageEx[i][1].exerciseImage.$binary != null){
                        image.src = 'data:image/jpeg;base64,' + atob(decodeUtf8(imageEx[i][1].exerciseImage.$binary));
                        i = imageEx.length;
                    }
                    i = i+1;
                }
                if (i == (imageEx.length)){
                    image.src ="no_image.png";
                }
                image.style.height = "50px";
                image.style.width = "50px";

                td3.append(image);   

                td1.append(nameExercise);

                if("rep"==tipoEx){
                    td2.append(durationExercise+" "+tipoEx);
                }else{
                    td2.append(durationExercise+tipoEx);
                }

                tr.append(td1);
                tr.append(td2);                
                tr.append(td3);                

                aName.push([td1.innerHTML,td2.innerHTML]);

                document.getElementById("ex_table").appendChild(tr);                            
                document.getElementById("ex_duration").value="";
                
            }            
        }        
    }
}

function dataToBinary(data){

    // return window.btoa(unescape(encodeURIComponent( data )));
    var dataString = "";
    for(var i=0; i<data.length; i++){
        dataString += String.fromCharCode(data[i].charCodeAt(0) & 0xff);
    }
    return dataString;
};

function addWorkout(){
    var workName = document.getElementById("work_name").value;
    var description = document.getElementById("des_name").value;    
    var salida = new String();
    var wkImage = new Image();
    var url = 'http://localhost:5000/post_workout';

    salida = document.getElementById("image_wk").value;

    var pos = salida.lastIndexOf("\\");

    wkImage.src = salida.substring(pos+1);
    wkImage.style.height = "50px";
    wkImage.style.width = "50px";

    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");

    td1.append(workName);
    
    var des = new String();
    if (description.length==0){
        des = " ";
    }else{
        des= description;
    }
    
    td2.append(des);
    td3.append(wkImage);

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
    var data=JSON.stringify({"name": workName, "description": description, "image":imagen, "exercises":aName});
    request.send(data);

    showExercise();
    document.getElementById("work_name").value="";
    document.getElementById("des_name").value="";    
    eliminar();

}

// function showBadValueEx(){
//     var bad = document.getElementById("ex_duration_bad");
//     var good = document.getElementById("ex_duration");

//     bad.style.display="block";
//     good.style.display="none";
// }

// function resetBadEx(){
//     var bad = document.getElementById("ex_duration_bad");
//     var good = document.getElementById("ex_duration");

//     bad.style.display="none";
//     good.style.display="block";
// }

function addRest(){
    var durationExercise = document.getElementById("rest_duration").value;
    var tipoEx= document.getElementById("tipo_ex_rest").value;

    if(durationExercise.length>0){
        if(durationExercise[0]!="-" && durationExercise[0]!="0"){
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            var restImage = new Image();

            restImage.src = "relax.png";
            restImage.style.height = "50px";
            restImage.style.width = "50px";

            td1.append("Rest");
            td2.append(durationExercise+tipoEx);
            td3.append(restImage);

            tr.append(td1);
            tr.append(td2);
            tr.append(td3);

            aName.push([td1.innerHTML,td2.innerHTML]);            

            document.getElementById("ex_table").appendChild(tr);        
            document.getElementById("rest_duration").value="";
        }
    }
}

function showRest(valor){
    var rest = document.getElementById("rest_section");
    var exerciseSelection = document.getElementById("ex_section");

    if(valor.value ==="rest"){
        exerciseSelection.style.display="none";        
        document.getElementById("exercise_ch").checked =false;
        rest.style.display="block";        
    }else{
        exerciseSelection.style.display="block";
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

function deleteLast(){        
    if (confirm("Are you sure you want to delete the last exercise?")){
        var table = document.getElementById("ex_table");
        var last = table.rows.length;
        if(last!=1){
            table.deleteRow(last-1);
        }
    }
}

function showExercise() {
    wk = document.getElementById("addExBt_tableWork");
    ex = document.getElementById("ex");
    nameWk = document.getElementById("work_name").value;
    des_wk = document.getElementById("des_name").value;

    if(nameWk.length>0 && des_wk.length>0){
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