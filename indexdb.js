window.onload = cargarEventos;

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
    var indexedDB		= window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
	IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
	baseName 	    = "cajaMenorjs",
	storeName 	    = "cajamenortabla";

    var j,x,i;
    var pval;

function logerr(err){
	console.log(err);
}

function connectDB(f){
	// Open (or create) the database
	var request = indexedDB.open(baseName, 1);
	request.onerror = logerr;
	request.onsuccess = function(){
		f(request.result);
	}
	request.onupgradeneeded = function(e){
		//console.log("running onupgradeneeded");
		var Db = e.currentTarget.result;//var Db = e.target.result;
		
		//uncomment if we want to start clean
		//if(Db.objectStoreNames.contains(storeName)) Db.deleteObjectStore("note");
		
		//Create store
		if(!Db.objectStoreNames.contains(storeName)) {
			var store = Db.createObjectStore(storeName, {keyPath: "id", autoIncrement:true});  
			    store.createIndex("Nombres", ["nombres"], { unique: false });
                store.createIndex("Descripcion", ["descripcion"], { unique: false });
                store.createIndex("Valor", ["valor"], { unique: false });

		}
		connectDB(f);
	}
}

function get(id,f){
	connectDB(function(db){
		var transaction = db.transaction([storeName], "readonly").objectStore(storeName).get(id);
		transaction.onerror = logerr;
		transaction.onsuccess = function(){
			f(transaction.result ? transaction.result : -1);
		}
	});
}

function getAll(f){
	connectDB(function(db){
		var rows = [],
			store = db.transaction([storeName], "readonly").objectStore(storeName);

		if(store.mozGetAll)
			store.mozGetAll().onsuccess = function(e){
				f(e.target.result);
			};
		else
			store.openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor){
					rows.push(cursor.value);
					cursor.continue();
				}
				else {
					f(rows);
				}
			};
	});
}

function up(obj){//obj with id
	del(obj.id,'up');
	add(obj,'up');
}

function add(obj,info){
	info = typeof info !== 'undefined' ? false : true;
	
    connectDB(function(db){
		var transaction = db.transaction([storeName], "readwrite");
		var objectStore = transaction.objectStore(storeName);
		var objectStoreRequest = objectStore.add(obj);
		objectStoreRequest.onerror = logerr;
		objectStoreRequest.onsuccess = function(){
			if(info)
				{console.log("Registro creado correctamente.");}
			else
				{console.log("Registro creado correctamente.");}
			console.info(objectStoreRequest.result);
		}
	});
}

function del(id,info){
	info = typeof info !== 'undefined' ? false : true;
	connectDB(function(db){
		var transaction = db.transaction([storeName], "readwrite");
		var objectStore = transaction.objectStore(storeName);
		var objectStoreRequest = objectStore.delete(id);
		objectStoreRequest.onerror = logerr;
		objectStoreRequest.onsuccess = function(){
			if(info)
				alert("El registro ha sido eliminado: ", id);
		}
	});
}


//get data
 func=function(result){
 	//console.log(result);
    pintarTabla(result);
 };


function cargarEventos () {
    document.getElementById('btnConsultar').addEventListener('click', consultarData, false);
    document.getElementById('btnGuardar').addEventListener('click', guardarData, false);
};

async function consultarData () {
    let idConsulta = document.getElementById('idregistro').value;
	let loading = document.getElementById('Loading');
	loading.style.display = 'inline-block';
    if(idConsulta != "") {
        await get(parseInt(idConsulta, 10), func);
    } else {
        await getAll(func);
    }
	setTimeout(function(){ 
		loading.style.display = 'none';
	}, 2000)
	
};

function guardarData() {
    let nombreg;
    let descripciong;
    let valorg
    
    nombreg = document.getElementById('nombre').value;
    descripciong = document.getElementById('descripcion').value;
    valorg = document.getElementById('valor').value;

  //for(var i = 0; i <= 1000; i++){
    add({
        nombres: nombreg, //+ i,
        descripcion: descripciong,// + i,
        valor: valorg// + i
    });
//}
    getAll(func);

};

function eliminarDato(id) {
    del(id);
    getAll(func);
}

obtData = function(result){		///verificar datos para actulizar 
	//if (columna === "1") {
		//up({nombres:valor, descripcion: result.descripcion, valor: result.valor,  id:idgurdar});
	//}

};

async function actulizarData(id, columna, valor) {
    let idgurdar = id;
	await get(id, obtData(columna, valor));///verificar datos para actulizar 
}

function pintarTabla(objeto) {

    var body = document.getElementById('tablaDatosbody');
    var campos = '';

	if (typeof objeto === 'object' && !Array.isArray(objeto) && objeto !== null) {
        campos += "<tr>";
        campos += "<td>" + objeto.id + "</td>";
        campos += "<td id='start'>" + objeto.nombres + "</td>";
        campos += "<td>" + objeto.descripcion + "</td>";
        campos += "<td>" + objeto.valor + "</td>";
        campos += "<td><button type='button' class='btn btn-danger' onclick='eliminarDato(" + objeto.id + ")'><i class='bi bi-x-square'></i>Eliminar</button><button type='button' class='btn btn-primary' onclick='actulizarData(" + objeto.id + ", '')'><i class='bi bi-x-square'></i>Actulizar</button></td>";
        campos += "</tr>"
    } else {
        for (var i = 0; i < objeto.length ; i++ ) {
            campos += "<tr>";
            campos += "<td id='start"+[i]+"' idobjeto='" + objeto[i].id + "' tdMod='1'>" + objeto[i].nombres + "</td>";
            campos += "<td                   idobjeto='" + objeto[i].id + "' tdMod='2'>" + objeto[i].descripcion + "</td>";
            campos += "<td 					 idobjeto='" + objeto[i].id + "' tdMod='3'>" + objeto[i].valor + "</td>";
            campos += "<td><button type='button' class='btn btn-danger' onclick='eliminarDato(" + objeto[i].id + ")'><i class='bi bi-x-square'></i>Eliminar</button></td>";
            campos += "</tr>"
        }
    }
    

    // if (typeof objeto === 'object' && !Array.isArray(objeto) && objeto !== null) {
    //     campos += "<tr>";
    //     campos += "<td>" + objeto.id + "</td>";
    //     campos += "<td><input type='text' class='form-control'  value='" + objeto.nombres + "' id='nombreCrud'/></td>";
    //     campos += "<td><input type='text' class='form-control'  value='" + objeto.descripcion + "' id='descCrud'/></td>";
    //     campos += "<td><input type='number' class='form-control'  value='" + objeto.valor + "' id='valorCrud'/></td>";
    //     campos += "<td><button type='button' class='btn btn-danger' onclick='eliminarDato(" + objeto.id + ")'><i class='bi bi-x-square'></i>Eliminar</button><button type='button' class='btn btn-primary' onclick='actulizarData(" + objeto.id + ", '')'><i class='bi bi-x-square'></i>Actulizar</button></td>";
    //     campos += "</tr>"
    // } else {
    //     for (var i = 0; i < objeto.length ; i++ ) {
    //         campos += "<tr>";
    //         campos += "<td>" + objeto[i].id + "</td>";
    //         campos += "<td><input type='text' class='form-control'  value='" + objeto[i].nombres + "'     id='nombreCrud"+[i]+"'/></td>";
    //         campos += "<td><input type='text' class='form-control'  value='" + objeto[i].descripcion + "' id='descCrud"+[i]+"'/></td>";
    //         campos += "<td><input type='number' class='form-control'  value='" + objeto[i].valor + "' id='valorCrud"+[i]+"'/></td>";
    //         campos += "<td><button type='button' class='btn btn-danger' onclick='eliminarDato(" + objeto[i].id + ")'><i class='bi bi-x-square'></i>Eliminar</button><button type='button' class='btn btn-primary' onclick='actulizarData(" + objeto[i].id + ", "+[i]+")'><i class='bi bi-x-square'></i>Actulizar</button></td>";
    //         campos += "</tr>"
    //     }
    // }
    
    

    body.innerHTML = campos;
	manejarCampos();
}



