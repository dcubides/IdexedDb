

function manejarCampos() {
   
	let start;
	let isEditing = false;
	let kc = 0; //Key Code
	let tableDT;

    $("body input").prop("autocomplete", false);
    $("table").focus();
    //tableDT = $('#example').DataTable();

    start = $('[id=start0]');
    start.addClass('cell-focus');

    document.onkeydown = checkKey;
    document.onclick = deleteInput;




  //Bloque para mover las celdas activas
  function checkKey(e) {
    if (isEditing) return;
    e = e || window.event;
    kc = e.keyCode;
    if (kc === 38) {
        // up arrow
        doTheNeedful($(start.parent().prev().find('td')[start.index()]));
    } else if (kc === 40) {
        // down arrow
        doTheNeedful($(start.parent().next().find('td')[start.index()]));
    } else if (kc === 37) {
        // left arrow
        doTheNeedful(start.prev());
    } else if (kc === 39) {
        // right arrow
        doTheNeedful(start.next());
    }else if (kc === 13) {
        // Enter
        replacedByAnInputText(e);
    }else if (kc === 9) {
        //Tab
        if (e.shiftKey){
            if (start.prev().length === 0){
                doTheNeedful($(start.parent().prev().children().last()));
            }else{
                doTheNeedful(start.prev());
            }
        } else{
            if (start.next().length === 0){
                doTheNeedful($(start.parent().next().children()[0]));
            }else{
                doTheNeedful(start.next());
            }
        }
        e.stopPropagation();
        e.preventDefault();
    }
}

function deleteInput(e) {
    console.log(start)
}

$("#example tr").on('dblclick',function(e) {
    replacedByAnInputText(e)
}).on('click', function(e) {
    if ($(e.target).closest('td')) {
        start.removeClass('cell-focus');
        if (start.find('input').length>0){
            start.html($(start.find('input')[0]).val()).removeClass("p-0");
            isEditing = false;
        }
        start = $(e.target);
        start.addClass('cell-focus');
        e.stopPropagation();
    }
}).on('keydown', "#editing", function (e) {
    e = e || window.event;
    kc = e.keyCode;
    if (kc === 13 || kc === 27){
        if (start.find('input').length>0){
            start.html($(start.find('input')[0]).val()).removeClass("p-0");
            doTheNeedful(start);
            isEditing = false;
            //tableDT.ajax.reload();
            e.stopPropagation();
            e.preventDefault();
        }
    }else if (kc == 9){
        start.html($(start.find('input')[0]).val()).removeClass("p-0");
        //doTheNeedful(start);
        isEditing = false;
        //tableDT.ajax.reload();
        if (e.shiftKey){
            if (start.prev().length === 0){
                doTheNeedful($(start.parent().prev().children().last()));
            }else{
                doTheNeedful(start.prev());
            }
        } else{
            if (start.next().length === 0){
                doTheNeedful($(start.parent().next().children()[0]));
            }else{
                doTheNeedful(start.next());
            }
        }
        e.stopPropagation();
        e.preventDefault();
    }
});

function replacedByAnInputText(e) {
    start.removeClass('cell-focus').addClass("p-0");
   
    let input = $('<input class="form-control rounded-0 form-control-sm" type="text" id="editing" value="' + start.html() + '">');
    start.html(input);
    $(start.find('input')[0]).select().focus();
    e.preventDefault();
    e.stopPropagation();
    isEditing = true;
    
}

function doTheNeedful(sibling) {
    if (sibling.length === 1) {
        start.removeClass('cell-focus');
        sibling.addClass('cell-focus');
        start = sibling;
        actulizarData(start.attr('idobjeto'), start.attr('tdMod'), $(start.find('input')[0]).val());
    }
}

};
