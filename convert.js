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
	var q = document.getElementById('addr-u').value*1;
	var tar = document.getElementById('address-bits').value*1;
	e /= q;
	var num = e.toString(16);
	var len = num.length;
	var str = "";
	for(var i=0;i<tar-len;i++){
		str+='0';
	}
	return str+num;
}

function format_addr_b(e){
	var q = document.getElementById('addr-u').value*1;
	var tar = document.getElementById('address-bits').value*1;
	e /= q;
	var num = e.toString(2);
	var len = num.length;
	var str = "";
	for(var i=0;i<tar-len;i++){
		str+='0';
	}
	return str+num;;
}
function format_hex(e, n){
	var num =  parseInt(e,2).toString(16);
	if(n==-1) return num;
	var tar = Math.ceil(n/4);
	var len = num.length;
	var str = "";
	for(var i=0;i<tar-len;i++){
		str+='0';
	}
	return str+num;
}

function format_b(e, tar){
	var len = e.length;
	var str = "";
	for(var i=0;i<tar-len;i++){
		str += '0';
	}
	return str+e;
}

symbols = [];

function convert(){
	var inpt = document.getElementById('code-in').value;
	var outpt = document.getElementById('code-out');
	outpt.value="";
	var txt ="";
	var lines = inpt.split('\n');
	var address = 0;
	for(var i=0;i<lines.length;i++){
		var temp = lines[i].trim().replaceAll('\t',' ').replaceAll(/\s+/g,' ');
		if(temp.startsWith('org')){
			var pp = temp.matchAll(/org (\d+)h/g).next();
			if(pp.done == false){
				address = parseInt(pp.value[1],16);
				continue;
			}
		}
		var templn = "";
		var form = undefined;
		for(var j=0;j<instructions.length;j++){
			var pp = temp.matchAll(RegExp(instructions[j].exp,'g')).next();
			if(pp.done == false){
				caught = true;
				form = formats[instructions[j].format*1];
				address += form.total_bytes*1;
				break;
			}
		}
		if(form == undefined){ // other symbols
			var parts = temp.split(' ');
			if(parts[0].endsWith(':')){
				var symname = parts[0].substring(0,parts[0].length-1);
				var entry = {'sym':symname, 'addr':address};
				symbols.push(entry);
			}
		}	
	}
	address = 0;
	templn = "";
	var outpttext="";
	for(var i=0;i<lines.length;i++){
		outpttext= "";
		var temp = lines[i].trim().replaceAll('\t',' ').replaceAll(/\s+/g,' ');
		if(temp == "") continue;
		if(temp.startsWith('org')){
			var pp = temp.matchAll(/org (\d+)h/g).next();
			if(pp.done == false){
				address = parseInt(pp.value[1],16);
				continue;
			}
		}
		var templn = "";
		var form = undefined;
		outpttext += format_addr(address) + "\t";
		for(var j=0;j<instructions.length;j++){
			var pp = temp.matchAll(RegExp(instructions[j].exp,'g')).next();
			if(pp.done == false){
				var atl = instructions[j].atlas;
				form = formats[instructions[j].format*1];
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
					}else{ // address
						var sym = pp.value[atl[k-1]];
						var entry = symbols.find(x=>x.sym == sym);
						if(entry == undefined){
							if(!isNaN(sym*1)){
								templn += format_b(format_addr_b(sym*1), box.length);
							}else{
								// error
							}
						}else
							templn += format_b(format_addr_b(entry.addr), box.length);
					}
				}
				address += form.total_bytes*1;
				break;
			}
		}
		if(form == undefined){ // other symbols
			var parts = temp.split(' ');
			if(parts[0].endsWith(':')){
				var size;
				if(parts[1] == 'db'){
					size = 8;
				}else if(parts[1] == 'dw'){
					size = 32;
				}else{
					continue;f

				}
				var nums = parts.splice(2).join();
				var dups = nums.match(/(\d+) dup\((\d+)\)/g);
				var sizee = 0;
				if(dups == null){
					nums = nums.split(',');
					for(var k=0;k<nums.length;k++){
						if(nums[k].endsWith('h')){
							var num = parseInt(nums[k],16).toString(2);
							templn += fromat_b(num, size);
						}else{
							var num = parseInt(nums[k]).toString(2);
							templn += format_b(num, size);
						}
						sizee += size;
					}
				outpttext += format_hex(templn, sizee) + "\t;\t"+ templn+"\t;\t"+temp+"\n";
				}else{
					outpttext += "; "+nums;
					var countt = parseInt(dups[2]);
					sizee += size*countt;
				}
				address += sizee;
			}
		}else
			outpttext += format_hex(templn, form.total_bytes*1) + "\t;\t"+ templn+"\t;\t"+temp+"\n";
		outpt.value += outpttext;
	}
}
