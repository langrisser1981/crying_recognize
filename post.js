const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const baseUrl = '140.125.179.126/api/'
const cid =  '7018883e11b96b5b265b092f16daf5ea'

let token;
let url;
let config;
//axios.defaults.baseURL = baseUrl;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const getToken = async () => {
	try {
		url = `http://${baseUrl}company/${cid}/token`;
		console.log(url);
		let response = await axios.get(url);
		let data = response.data.data;
		token = data.token;
		config = {headers:{Authorization:`Bearer ${token}`}};

		const email = 'D3PA853WRF3MSG6GUH7J@compal.com'
		url =`http://${baseUrl}/members?email=${email}`;
		console.log(url);
		response = await axios.get(url, config);
		data = response.data.data;
		member_id = data[0].member_id;
		member_id = '9a3364d9455eda042faf4e026c41bead90b1b507';

		url =`http://${baseUrl}/member/${member_id}/infants`;
		console.log(url);
		response = await axios.get(url, config);
		data = response.data.data;
		if (!data) {console.log('沒有寶寶'); return;}
		infant_id = data[0].infant_id;

		url =`http://${baseUrl}/recognize`;
		console.log(url);
		let form = new FormData();
		form.append('infant_id', infant_id);
		let src = 'C://Users/lenny_cheng/Desktop/git_test/crying_samples/D3PA853WRF3MSG6GUH7J@compal.com/Diper/cry_2019_07_17_08_40_56.wav';
		form.append('file', fs.createReadStream(src));
		config = {headers:{ ...config.headers , 'Content-Type':`multipart/form-data; boundary=${form._boundary}`}};
		response = await axios.post(url, form, config);
		data = response.data.data;
		result = data.recognizeResult.split('@');
		label = result[0];
		coef = result[1].substr(1, result[1].length-2).split(' ').map(item=>{
			let n = parseInt(item);
			return n;
		});

		console.log(`標籤:${label}, 百分比:${coef}, 原始回傳:${result}, 檔名:${src}`);
	} catch (error) {
		console.log(error);
	}
};

getToken();
