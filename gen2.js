instructions=[];
formats = [];
var opts = [{'title':'mnemonic', 'disp':'mnemonic', 'short':'mnec.'}
	, {'title':'register', 'disp':'r', 'short':'r'}
	, {'title':'immediate data', 'disp':'immediate', 'short':'data'}
	, {'title':'address', 'disp':'address', 'short':'addr'} ];


function create_format(){
	var xxx = document.getElementById('op_box');
	var div = document.createElement('div');
	const ind = formats.length-1;
	div.classList.add('op-row');
	var lab= document.createElement('span');
	lab.classList.add('op-row-label');
	lab.innerHTML = "format "+(ind+1);
	var div1 = document.createElement('div');
	div1.classList.add('op-preview');
	var div2 = document.createElement('div');
	div2.classList.add('op-spec');
	div2.setAttribute('data-index', ind);
	div2.setAttribute('data-count', 1);
	div.appendChild(lab);
	div.appendChild(div1);
	div.appendChild(div2);
	xxx.appendChild(div);
	
	update_preview(ind);
	
	var div3 = document.createElement('div');
	div3.classList.add('op-spec-wrapper');
	var butt = document.createElement('button');
	butt.innerHTML = '+';
	
	butt.onclick=function(){
		var par = this.parentElement;
		var ind1 = par.getAttribute('data-index');
		var ind2 = par.getAttribute('data-count');
		add_instruction(ind1,ind2);
		par.setAttribute('data-count', ind2+1);
	}
	div2.appendChild(div3);
	div2.appendChild(butt);
	
	add_instruction(ind, 0);
}

function update_preview(ind){
	var lst = document.getElementsByClassName('op-row')[ind];
	var left = lst.querySelector('.op-preview');

	while(left.children.length !=0)
		left.children[0].remove();

	var format = formats[ind];
	for(var i=0;i<format.boxes.length;i++){
		var box = document.createElement('div');
		box.classList.add('format-box');
		box.classList.add('format-box-arrow');
		
		var label = document.createElement('span');
		label.classList.add('format-box-label');
		label.innerHTML = format.boxes[i].length;
		box.appendChild(label);

		var desc = document.createElement('span');
		desc.classList.add('format-box-desc');
		desc.innerHTML = format.boxes[i].name;
		box.appendChild(desc);

		left.appendChild(box);
	}
}

function add_instruction(ind1, ind2){
	var lst = document.getElementsByClassName('op-row')[ind1];
	var right = lst.querySelector('.op-spec .op-spec-wrapper');
	

	var inpt1 = document.createElement('input');
	inpt1.type="number";
	inpt1.value="0000";
	inpt1.name="inst-op-"+ind1+"-"+ind2;
	inpt1.onchange=function(){
		var par = this.parentElement;
		var index = par.getAttribute('data-index');
		instructions[index].opcode = this.value;
	}

	var label1 = document.createElement('label');
	label1.innerHTML = "opcode";
	label1.for = inpt1.name;

	var inpt2 = document.createElement('input');
	inpt2.type="text";
	inpt2.value="instruction assembly";
	inpt2.name="inst-exp-"+ind1+"-"+ind2;
	inpt2.onchange=function(){
		var par = this.parentElement;
		var index = par.getAttribute('data-index');
		var reg, atl;
		[reg, atl] = get_regex(instructions[index].format*1, this.value);
		instructions[index].raw_exp = this.value;
		instructions[index].exp = "^"+reg+"$";
		instructions[index].atlas = atl;
	}

	var label2 = document.createElement('label');
	label2.innerHTML = "capture exp";
	label2.for = inpt2.name;

	var div = document.createElement('div');
	div.classList.add('spec-box');
	div.setAttribute('data-index', instructions.length);
	div.appendChild(label1);
	div.appendChild(inpt1);
	div.appendChild(label2);
	div.appendChild(inpt2);

	right.appendChild(div);
	var reg;
	var atlas;
	[reg, atlas] = get_regex(ind1, inpt2.value);

	var new_inst = {'format':ind1, 'raw_exp':inpt2.value, 'exp':reg, 'opcode':inpt1.value, 'atlas':atlas};
	instructions.push(new_inst);
}

function get_regex(ind, exp){
	var format = formats[ind];
	var reg_exp = document.getElementById('register-capt').value;
	var imm_exp = document.getElementById('immediate-capt').value;

	if(reg_exp == "")
		document.getElementById('register-capt').classList.add('empty-error');
	else
		document.getElementById('register-capt').classList.remove('empty-error');
	if(imm_exp == "")
		document.getElementById('immediate-capt').classList.add('empty-error');
	else
		document.getElementById('immediate-capt').classList.remove('empty-error');

	exp = exp.replace('(',"\\(");
	exp = exp.replace(')',"\\)");
	var atlas = [];
	for(var i=0;i<format.boxes.length;i++){
		if(format.boxes[i].type == 'r' || format.boxes[i].type == 'immediate'
					       || format.boxes[i].type == 'address'){
			var f = exp.indexOf(format.boxes[i].name);
			atlas.push([f, i]);
		}
	}
	atlas.sort((x,y)=>(x[0]-y[0]));
	for(var i=0;i<atlas.length;i++){
		atlas[i][0] = i;
	}
	atlas.sort((x,y)=>(x[1]-y[1]));
	var retatl = [];
	atlas.forEach(x=>{retatl.push(x[0]+1)});
	for(var i=0;i<format.boxes.length;i++){
		if(format.boxes[i].type == 'r'){
			exp = exp.replace(format.boxes[i].name, reg_exp);
		}else if(format.boxes[i].type=='immediate'){
			exp = exp.replace(format.boxes[i].name, imm_exp);
		}else if(format.boxes[i].type == 'address'){
			exp = exp.replace(format.boxes[i].name, '(.+)');
		}
	}	
	return [exp, retatl];
}


