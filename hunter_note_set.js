//----------------------------------------------------------------
// 変数
//----------------------------------------------------------------
let anomalyItems = [];
let anomalyItemMax = 0;

//----------------------------------------------------------------
// 傀異化素材情報登録
//----------------------------------------------------------------
addAnomalyItem('傀異化した骨'   );
addAnomalyItem('傀異化した皮'   );
addAnomalyItem('傀異化した竜骨' );
addAnomalyItem('傀異化した血'   );
addAnomalyItem('傀異化した鱗'   );
addAnomalyItem('傀異化した甲殻' );
addAnomalyItem('傀異化した爪'   );
addAnomalyItem('傀異化した牙'   );
addAnomalyItem('傀異化した凶鱗' );
addAnomalyItem('傀異化した凶骨' );
addAnomalyItem('傀異化した凶角' );

//----------------------------------------------------------------
// JSONからモンスター情報登録
//----------------------------------------------------------------
for(var key in statusList){
    // 入手できる傀異化素材を取得
    var anomalyItem = statusList[key]['anomalyItem'];

    console.log(key);

    if(anomalyItem != ""){
        var id = anomalyItems.find((x) => x.name == anomalyItem).id;

        // HTMLテーブルに追加
        document.getElementById('anomalyItem' + id).insertAdjacentHTML('beforeend',`
            <td onclick="drawStatusTable('` + statusList[key]['name'] + `')">` + statusList[key]['name'] + `</td>
        `);
    }
}

//----------------------------------------------------------------
// 処理：傀異化素材の情報を登録する関数
// 引数：名前
//----------------------------------------------------------------
function addAnomalyItem(name){
    // 必要な情報を定義
    var _anomalyItem = {
        name: name,
        id: anomalyItemMax,
    };

    // HTMLテーブルに追加
    document.getElementById('mainTable').insertAdjacentHTML('beforeend',`
        <tr id=anomalyItem` + _anomalyItem.id + `>
            <th>` + _anomalyItem.name + `</th>
        </tr>
    `);
    
    // リストに追加
    anomalyItems[anomalyItemMax] = _anomalyItem;
    anomalyItemMax ++;
}

//----------------------------------------------------------------
// 処理：傀異化
// 引数：名前
//----------------------------------------------------------------
function drawStatusTable(name){
    var parts = statusList[name]['weak']['parts'];
    var rates = statusList[name]['weak']['rates'];
    var text = `<tr><th></th><th>斬</th><th>打</th><th>弾</th><th>火</th><th>水</th><th>雷</th><th>氷</th><th>龍</th></tr>`;

    for(var i = 0; i < parts.length; i ++){
        text += '<tr><th>' + parts[i] + '</th>';

        for(var j = 0; j < rates[i].length; j ++){
            // 括弧書きの対応
            if(rates[i][j].indexOf('(') != -1){
                var rate1 = rates[i][j].substring(0, rates[i][j].indexOf('('));
                var rate2 = rates[i][j].match(/\((.+)\)/)[1];

                // [!]要修正：ごり押しコード
                // 弱点特効が有効なものに色付け
                if((j < 3 && rate1 >= 45) || (j >= 3 && rate1 >= 20))
                    text += '<td><span style="color:red;">' + rate1 + '</span>';
                else
                    text += '<td>' + rate1;
                // 弱点特効が有効なものに色付け
                if((j < 3 && rate2 >= 45) || (j >= 3 && rate2 >= 20))
                    text += '(<span style="color:red;">' + rate2 + '</span>)</td>';
                else
                    text += '(' + rate2 + ')</td>';
            }
            else{
                // 弱点特効が有効なものに色付け
                if((j < 3 && rates[i][j] >= 45) || (j >= 3 && rates[i][j] >= 20))
                    text += '<td><span style="color:red;">' + rates[i][j] + '</span></td>';
                else
                    text += '<td>' + rates[i][j] + '</td>';
            }
        }

        text += '</tr>'
    }

    document.getElementById('statusTable').innerHTML = text;
}

