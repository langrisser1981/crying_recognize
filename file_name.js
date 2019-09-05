const path = require('path');
/*
let info =  [ 'DVPA9X2CUFLW9GPGUHFJ',
	'27',
	'Unwell',
	'Sleepy',
	'',
	'',
	'0722',
	'211349' ];
	*/

const id = `${info[0]}@compal.com`;
const raw_type = ['Unwell', 'Hungry', 'Unwell', 'Sleepy', 'Unknown'];
const _type = ['Diper', 'Hungry', 'Pain', 'Sleepy', 'Unknown'];
let type = _type[raw_type.indexOf(info[2])];

let day = info[6];
let time = info[7];
let mm = day.substr(0,2);
let dd = day.substr(2,2);
let hh = time.substr(0,2);
let MM = time.substr(2,2);
let ss = time.substr(4,2);
let fileName = `cry_2019_${mm}_${dd}_${hh}_${MM}_${ss}.wav`

const directoryPath = path.join(__dirname, id, type, fileName);
console.log(directoryPath);

