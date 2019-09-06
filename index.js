//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const json2csv = require('json2csv');

const axios = require('axios');
const FormData = require('form-data');
const baseUrl = '140.125.179.126/api/'
const cid =  '7018883e11b96b5b265b092f16daf5ea'

let token;
let config;
const raw_type = ['Wet diaper', 'Hungry', 'Unwell', 'Sleepy', 'Unknown'];
const _type = ['Diper', 'Hungry', 'Pain', 'Sleepy', 'Unknown'];

const getToken = async ()=>{
	try {
		let url = `http://${baseUrl}company/${cid}/token`;
		let response = await axios.get(url);
		let data = response.data.data;
		token = data.token;
		config = {headers:{Authorization:`Bearer ${token}`}};
		console.log(`金鑰:${token}`);
		return Promise.resolve(token);
	} catch (error) {
		console.log(error);
	}
};

const recognize = async (email, filePath) => {
	try {
		url =`http://${baseUrl}/members?email=${email}`;
		//console.log(url);
		response = await axios.get(url, config);
		data = response.data.data;
		member_id = data[0].member_id;
		member_id = '9a3364d9455eda042faf4e026c41bead90b1b507';

		url =`http://${baseUrl}/member/${member_id}/infants`;
		//console.log(url);
		response = await axios.get(url, config);
		data = response.data.data;
		if (!data) {console.log('沒有寶寶'); return;}
		infant_id = data[0].infant_id;

		url =`http://${baseUrl}/recognize`;
		//console.log(url);
		let form = new FormData();
		form.append('infant_id', infant_id);
		form.append('file', fs.createReadStream(filePath));
		config = {headers:{ ...config.headers , 'Content-Type':`multipart/form-data; boundary=${form._boundary}`}};
		response = await axios.post(url, form, config);
		data = response.data.data;
		result = data.recognizeResult.split('@');
		label = result[0];
		coef = result[1].substr(1, result[1].length-2).split(' ').map(item=>{
			let n = parseFloat(item);
			return n;
		});

		str = `標籤:${label}, 百分比:${coef}, 原始回傳:${result}, 檔名:${filePath}`
		//console.log(str);
		let res = [label, coef];
		return Promise.resolve(res);

	} catch (error) {
		console.log(error);
	}
};

const readCSV = async ()=>{
	return new Promise((resolve, reject)=>{
		let csvData=[];
		fs.createReadStream('data.csv')
			.pipe(parse({delimiter: ','}))
			.on('data', function(csvrow) {
				//console.log(csvrow);
				//do something with csvrow

				let id = `${csvrow[0]}@compal.com`;
				let type = _type[raw_type.indexOf(csvrow[2])];
				let userAns = _type[raw_type.indexOf(csvrow[3])];

				let day = csvrow[6];
				let time = csvrow[7];
				let mm = day.substr(0,2);
				let dd = day.substr(2,2);
				let hh = time.substr(0,2);
				let MM = time.substr(2,2);
				let ss = time.substr(4,2);
				let fileName = `cry_2019_${mm}_${dd}_${hh}_${MM}_${ss}.wav`

				if(id && type && fileName){
					let directoryPath = path.join(__dirname, 'crying_samples', id, type, fileName);
					//console.log(directoryPath);
					let email = id;
					let src = directoryPath;
					csvData.push({
						email:email,
						src:src,
						prevAns:type,
						userAns:userAns,
						newAns:''
					});        
				}
			})
			.on('end',function() {
				//do something with csvData
				return resolve(csvData);
			});
	});
}

const writeCSV = async (data)=>{
	const fields = ['email', 'src', 'prevAns', 'userAns', 'newAns'];
	const csv = json2csv.parse(data, fields);
	fs.writeFile('clearData.csv', csv, (err)=>{
		if(err) throw err;
		//console.log(csvData);
		console.log('file saved');
	});
}

(async function(){
	let token = await getToken();
	let csvData = await readCSV();
	console.log(csvData);

	csvData.reduce(async(promise, item)=>{
		return promise.then(async()=>{
			let email = item.email;
			let src = item.src;
			//console.log(`email:${email}, src:${src}`);
			email = 'D3PA853WRF3MSG6GUH7J@compal.com'
			try{
				let res = await recognize(email, src);
				console.log(`標籤:${res[0]}, 百分比:${res[1]}, 原始答案:${item.prevAns}, 使用者答案:${item.userAns}, 新答案:${_type[res[0]]}`)
				item.newAns = res[0];
			}catch(error){
				console.log(error);
			}

			return Promise.resolve();

		});
	},Promise.resolve());
	/*
	*/
	writeCSV(csvData);
})()

