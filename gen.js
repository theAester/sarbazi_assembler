function generate_input(){
	var pbox = document.getElementById("prog_box");
	const ind = formats.length;
	var cont = document.createElement('div');
	cont.classList.add('format-cont');
	var innercont = document.createElement('div');
	innercont.classList.add('format-wrapper');
	innercont.setAttribute('data-count', 1);
	var box = document.createElement('div');
	box.classList.add('format-box');
	box.setAttribute('data-index', 0);
	var sel = document.createElement('select');
	opts.forEach(x=>{
		var opt = document.createElement('option');
		opt.innerHTML = x.title;
		opt.value=x.disp;
		sel.appendChild(opt);
	});
	sel.onchange = function(e){
		var box = this.parentElement;
		var index = box.getAttribute('data-index')*1;
		var format = formats[ind];
		format.boxes[index].type = this.value;
		var cont = box.parentElement;
		var temp=0;
		for(var i=0;i<format.boxes.length;i++){
			if(format.boxes[i].type == 'r') temp++;
		}
		format.regs = temp;
		if(this.value == 'r') format.boxes[index].name = 'r'+temp;
		var temp=0;
		for(var i=0;i<format.boxes.length;i++){
			if(format.boxes[i].type == 'address') temp++;
		}
		format.addrs = temp;
		if(this.value == 'address') format.boxes[index].name = 'address'+temp;
		var temp=0;
		for(var i=0;i<format.boxes.length;i++){
			if(format.boxes[i].type == 'immediate') temp++;
		}
		format.imms = temp;
		if(this.value == 'immediate') format.boxes[index].name = 'imm'+temp;

		var temp=0;
		for(var i=0;i<format.boxes.length;i++){
			if(format.boxes[i].type == 'mnemonic') temp++;
		}
		if(temp != 1) cont.parentElement.classList.add('mnem-error');
		else cont.parentElement.classList.remove('mnem-error');
		if(this.value == 'mnemonic') format.boxes[index].name = 'mnemonic';
		update_preview(ind1);
	}
	box.appendChild(sel);
	var inpt = document.createElement('input');
	inpt.type = "number";
	inpt.value=4;
	inpt.onchange = function(e){
		formats[ind].boxes[0].length = this.value*1;
		var temp =0;
		for(var i=0;i<formats[ind].count;i++){
			temp += formats[ind].boxes[i].length;
		}
		formats[ind].total_bytes=temp;
		update_preview(ind);
	}
	box.appendChild(inpt);
	var close = document.createElement('span');
	close.onclick=function(e){
		var box = this.parentElement;
		var index = box.getAttribute('data-index')*1;
		remove_box(ind1, index);
	};
	close.innerHTML = "&times;";
	innercont.appendChild(box);
	box.appendChild(close);
	cont.appendChild(innercont);
	var butt = document.createElement('button');
	butt.innerHTML = '+';
	butt.onclick = x=>{add_box(ind);};
	cont.appendChild(butt);
	pbox.appendChild(cont);
	var newform = {'count':1, 'total_bytes':4, 'regs':0, 'addrs':0, 'imms':0, 'boxes':[
		{'index':0 ,'length':4, 'type':'mnemonic', 'name':'mnemonic'}
	]};
	formats.push(newform);
	create_format();
}
generate_input();
function add_box(ind){
	var cont = document.getElementsByClassName('format-wrapper')[ind];
	const ind1 = ind;
	const ind2 = cont.getAttribute('data-count')*1;
	var box = document.createElement('div');
	box.classList.add('format-box');
	box.setAttribute('data-index', ind2);
	var sel = document.createElement('select');
	opts.forEach(x=>{
		var opt = document.createElement('option');
		opt.innerHTML = x.title;
		opt.value=x.disp;
		sel.appendChild(opt);
	});
	sel.onchange = function(e){
		var box = this.parentElement;
		var index = box.getAttribute('data-index')*1;
		var format = formats[ind];
		format.boxes[index].type = this.value;
		var cont = box.parentElement;
		var temp=0;
		for(var i=0;i<format.boxes.length;i++){
			if(format.boxes[i].type == 'r') temp++;
		}
		format.regs = temp;
		if(this.value == 'r') format.boxes[index].name = 'r'+temp;
		var temp=0;
		for(var i=0;i<format.boxes.length;i++){
			if(format.boxes[i].type == 'address') temp++;
		}
		format.addrs = temp;
		if(this.value == 'address') format.boxes[index].name = 'address'+temp;
		var temp=0;
		for(var i=0;i<format.boxes.length;i++){
			if(format.boxes[i].type == 'immediate') temp++;
		}
		format.imms = temp;
		if(this.value == 'immediate') format.boxes[index].name = 'imm'+temp;

		var temp=0;
		for(var i=0;i<format.boxes.length;i++){
			if(format.boxes[i].type == 'mnemonic') temp++;
		}
		if(temp != 1) cont.parentElement.classList.add('mnem-error');
		else cont.parentElement.classList.remove('mnem-error');
		if(this.value == 'mnemonic') format.boxes[index].name = 'mnemonic';
		update_preview(ind1);
	}
	sel.value = "r";
	box.appendChild(sel);
	var inpt = document.createElement('input');
	inpt.type = "number";
	inpt.value=4;
	inpt.onchange = function(e){
		var box = this.parentElement;
		var index = box.getAttribute('data-index')*1;
		formats[ind].boxes[index].length = this.value*1;
		var temp =0;
		for(var i=0;i<formats[ind].count;i++){
			temp += formats[ind].boxes[i].length;
		}
		formats[ind].total_bytes=temp;
		update_preview(ind);
	}
	box.appendChild(inpt);
	var close = document.createElement('span');
	close.onclick=function(e){
		var box = this.parentElement;
		var index = box.getAttribute('data-index')*1;
		remove_box(ind1, index);
	};
	close.innerHTML = "&times;";
	box.appendChild(close);
	cont.appendChild(box);
	cont.setAttribute('data-count',ind2+1);
	formats[ind].boxes.push({'length':4, 'type':'r','name':'r'+ind2});
	formats[ind].count++;
	formats[ind].total_bytes+=4;
	formats[ind].regs++;
	update_preview(ind);
}
function remove_box(ind1, ind2){
	var inner = document.getElementsByClassName('format-wrapper')[ind1];
	inner.querySelector('.format-box[data-index="'+ind2+'"]').remove();
	formats[ind1].boxes.splice(ind2,1);
	formats[ind1].count--;
	var temp =0;
	for(var i=0;i<formats[ind1].count;i++){
		temp += formats[ind1].boxes[i].length;
	}
	formats[ind1].total_bytes=temp;
	for(var i=0;i<inner.children.length;i++){
		inner.children[i].setAttribute('data-index',i);
	}
	update_preview(ind1);
}
