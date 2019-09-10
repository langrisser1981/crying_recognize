### 使用說明
```
npm install
node idnex.js
```

### 主要功能
1. 讀入data.csv
2. 根據data.csv的資訊(email, filename)重複送出音檔至雲端判斷取得結果
3. 最後再將新結果一併寫入cleardata.csv

##### clearData.csv欄位格式定義為

. email:使用者信箱
. src:檔名，但因為是在我的機器上，所以前面的路徑可以忽略
. prevAns:舊server給出的答案(svn)
. userAns:使用者給出的答案
. newAns:新server給出的答案(deep-learning)

