window.onload = cargarEventos;
let data = [];
// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
    var indexedDB		= window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
	IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
	baseName 	    = "movDocCuenta",
	storeName 	    = "movdocCuentaTable";

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
			store.createIndex("TipoRegistro", ["TipoRegistro"], { unique: false });
			store.createIndex("CuentaContable", ["CuentaContable"], { unique: false });
			store.createIndex("CuentaContableNombre", ["CuentaContableNombre"], { unique: false });
			store.createIndex("IdInterno", ["IdInterno"], { unique: false });
			store.createIndex("TipoDoc", ["TipoDoc"], { unique: false });
			store.createIndex("Consecutivo", ["Consecutivo"], { unique: false });
			store.createIndex("Fecha", ["Fecha"], { unique: false });
			store.createIndex("CentroCostos", ["CentroCostos"], { unique: false });
			store.createIndex("NIT", ["NIT"], { unique: false });
			store.createIndex("Tercero", ["Tercero"], { unique: false });
			store.createIndex("Debito", ["Debito"], { unique: false });
			store.createIndex("Credito", ["Credito"], { unique: false });
			store.createIndex("Saldo", ["Saldo"], { unique: false });
			store.createIndex("Concepto", ["Concepto"], { unique: false });
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

 async function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    await rawFile.send(null);
}

function cargarEventos () {
    document.getElementById('btnConsultar').addEventListener('click', consultarData, false);
    document.getElementById('btnGuardar').addEventListener('click', guardarData, false);
	readTextFile;
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

async function guardarData() {
	await readTextFile("./src/datos.json", function(text){
		data = JSON.parse(text);
		console.log(data);
	});

	if(data.length > 0)
	{
		for(var i=0; i<=data.length;i++)
		{
			add({
				TipoRegistro: data[i].TipoRegistro,
				CuentaContable: data[i].CuentaContable,
				CuentaContableNombre: data[i].CuentaContableNombre,
				IdInterno: data[i].IdInterno,
				TipoDoc: data[i].TipoDoc,
				Consecutivo:data[i].Consecutivo,
				Fecha: data[i].Fecha,
				CentroCostos: data[i].CentroCostos,
				NIT: data[i].NIT,
				Tercero:data[i].Tercero,
				Debito: data[i].Debito,
				Credito: data[i].Credito,
				Saldo: data[i].Saldo,
				Concepto: data[i].Concepto,
				});
		}
	}

   await consultarData();

};

function eliminarDato(id) {
    del(id);
    getAll(func);
}


function actulizarData(id, item) {
    let idgurdar = id;
    let nombre = document.getElementById('nombreCrud'+item).value;
    let desc = document.getElementById('descCrud'+item).value;
    let valor = document.getElementById('valorCrud'+item).value;

    up({nombres:nombre, descripcion: desc, valor: parseFloat(valor), id:idgurdar});
    get(id, func);
}

function pintarTabla(objeto) {

    var body = document.getElementById('tablaDatosbody');
    var campos = '';

    if (typeof objeto === 'object' && !Array.isArray(objeto) && objeto !== null) {
        campos += "<tr>";
        campos += "<td id='start0'>" + objeto.id + "</td>";
        campos += "<td>" + objeto.TipoRegistro + "</td>";
        campos += "<td>" + objeto.CuentaContable + "</td>";
        campos += "<td>" + objeto.CuentaContableNombre + "</td>";
        campos += "<td>" + objeto.IdInterno + "</td>";
        campos += "<td>" + objeto.TipoDoc + "</td>";
        campos += "<td>" + objeto.Consecutivo + "</td>";
        campos += "<td>" + objeto.Fecha + "</td>";
        campos += "<td>" + objeto.CentroCostos + "</td>";
        campos += "<td>" + objeto.NIT + "</td>";
        campos += "<td>" + objeto.Tercero + "</td>";
        campos += "<td>" + objeto.Debito + "</td>";
        campos += "<td>" + objeto.Credito + "</td>";
        campos += "<td>" + objeto.Saldo + "</td>";
        campos += "<td>" + objeto.Concepto + "</td>";
        //campos += "<td><button type='button' class='btn btn-danger' onclick='eliminarDato(" + objeto.id + ")'><i class='bi bi-x-square'></i>Eliminar</button><button type='button' class='btn btn-primary' onclick='actulizarData(" + objeto.id + ", '')'><i class='bi bi-x-square'></i>Actulizar</button></td>";
        campos += "</tr>"
    } else {
        for (var i = 0; i < objeto.length ; i++ ) {
            campos += "<tr>";
            campos += "<td id='start"+i+"'>" + objeto[i].id + "</td>";
            campos += "<td>" + objeto[i].TipoRegistro + "</td>";
            campos += "<td>" + objeto[i].CuentaContable + "</td>";
            campos += "<td>" + objeto[i].CuentaContableNombre + "</td>";
            campos += "<td>" + objeto[i].IdInterno + "</td>";
            campos += "<td>" + objeto[i].TipoDoc + "</td>";
            campos += "<td>" + objeto[i].Consecutivo + "</td>";
            campos += "<td>" + objeto[i].Fecha + "</td>";
            campos += "<td>" + objeto[i].CentroCostos + "</td>";
            campos += "<td>" + objeto[i].NIT + "</td>";
            campos += "<td>" + objeto[i].Tercero + "</td>";
            campos += "<td>" + objeto[i].Debito + "</td>";
            campos += "<td>" + objeto[i].Credito + "</td>";
            campos += "<td>" + objeto[i].Saldo + "</td>";
            campos += "<td>" + objeto[i].Concepto + "</td>";
            //campos += "<td><button type='button' class='btn btn-danger' onclick='eliminarDato(" + objeto[i].id + ")'><i class='bi bi-x-square'></i>Eliminar</button><button type='button' class='btn btn-primary' onclick='actulizarData(" + objeto[i].id + ", "+[i]+")'><i class='bi bi-x-square'></i>Actulizar</button></td>";
            campos += "</tr>"
        }
    }
    body.innerHTML = campos;
	manejarCampos();
}