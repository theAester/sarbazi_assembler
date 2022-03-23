// converting functionality
// extern formats
// extern instructions


function format_op(e, tar){
	var len = e.length;
	var str = "";
	for(var i=0;i<tar-len;i++){
		str+='0';
	}
	return str+e;

}

function format_nb(e,tar){
	var num = parseInt(e).toString(2);
	var len = num.length;
	var str = "";
	for(var i=0;i<tar-len;i++){
		str+='0';
	}
	return str+num;
}

function format_addr(e){
	var tar = document.getElementById('address-bits').value*1;
	var num = e.toString(16);
	var len = num.length;
	var str = "";
	for(var i=0;i<tar-len;i++){
		str+='0';
	}
	return str+num;
}

function format_hex(e, n){
	var num =  parseInt(e,2).toString(16);
	var tar = Math.ceil(n/4);
	var len = num.length;
	var str = "";
	for(var i=0;i<tar-len;i++){
		str+='0';
	}
	return str+num;
}

function convert(){
	var inpt = document.getElementById('code-in').value;
	var outpt = document.getElementById('code-out');
	outpt.value="";
	var txt ="";
	var lines = inpt.split('\n');
	var address = 0;
	for(var i=0;i<lines.length;i++){
		var temp = lines[i].trim().replaceAll('\t',' ');
		if(temp.startsWith('org')){
			var pp = temp.matchAll(/org (\d+)h/g).next();
			if(pp.done == false){
				address = parseInt(pp.value[1],16);
			}
		}
		var templn = "";
		outpt.value += format_addr(address) + "\t";
		for(var j=0;j<instructions.length;j++){
			var pp = temp.matchAll(RegExp(instructions[j].exp,'g')).next();
			if(pp.done == false){
				var atl = instructions[j].atlas;
				var form = formats[instructions[j].format*1];
				if(!form){}
				var boxes = form.boxes;
				for(var k=0;k<boxes.length;k++){
					var box = boxes[k];
					if(box.name == 'mnemonic'){
						templn += format_op(instructions[j].opcode, box.length);
						//templn += " ";
					}else if(box.type !="address"){
						templn+=format_nb(pp.value[atl[k-1]], box.length);
						//templn += " ";
					}else{

					}
				}
				address += form.total_bytes*1;
			}
		}
		outpt.value += format_hex(templn, form.total_bytes*1) + "\t;\t"+ templn+"\t;\t"+temp+"\n";
	}
}
