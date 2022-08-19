import json
import requests
from bs4 import BeautifulSoup

###############################################################
# 雑にテーブルを探す関数(テーブルリスト、左上の文字列)
###############################################################
def searchTable(tables, text):
    for i, t in enumerate(tables):
        if t.select_one('tr > th').text == text:
            return i
    
    return 0 # バグらせない前提

###############################################################
# 定義
###############################################################
statusList = {} # 全モンスターの情報リスト

###############################################################
# モンスター一覧取得
###############################################################
url = "https://gamewith.jp/mhrize/article/show/312232" # gamewith参照

req = requests.get(url)
bs = BeautifulSoup(req.content, "html.parser")
monsters = bs.select('table.mhrise_monster > tr')

###############################################################
# 各モンスターの情報を取得
###############################################################
for monster in monsters[1:]:

    # 取得するモンスター情報
    status = {
        'name': '', # 名前
        'type': '', # 種族
        'weak': {}, # 弱点
        'effect': [], # 状態異常評価
        'anomalyItem': '', #傀異素材
    }

    # リンクを取得してアクセス
    href = monster.select_one('td > a')
    if href == None:
        continue # 例外をスキップ
    else:
        link = href.get('href')
    req = requests.get(link)
    bs = BeautifulSoup(req.content, "html.parser")

    # 名前を取得
    status['name'] = bs.select_one('h1._title').text.split('】')[1].split('の')[0].split('(')[0]

    # テーブル情報を集める
    tableA = bs.select('.mhrise_footer')
    tableB = bs.select('.mhrise_taisei')

    # 種族を取得
    status['type'] = tableA[searchTable(tableA, '種族')].select('tr')[1].select_one('td').text

    # 弱点肉質を取得
    parts = []
    rates = []

    for y in tableA[searchTable(tableA, '')].select('tr')[1:]:
        parts.append(y.select_one('th').text) # 部位
        rate = []

        for x in y.select('td'):
            rate.append(x.text.replace('\n', '')) # 割合
        
        rates.append(rate)

    status['weak']['parts'] = parts
    status['weak']['rates'] = rates

    # 状態異常耐性を取得
    for effects in tableB[searchTable(tableB, '毒')].select('tr')[1:4:2]:
        for td in effects.select('td > span'):
            if td.text == '◎':
                status['effect'].append(4)
            elif td.text == '◯':
                status['effect'].append(3)
            elif td.text == '▲':
                status['effect'].append(2)
            elif td.text == '△':
                status['effect'].append(1)
            else:
                status['effect'].append(0)

    # リストに登録
    statusList[status['name']] = status
    #print(status) # debug

###############################################################
# 傀異化素材の情報を取得
###############################################################
url = "https://gamewith.jp/mhrize/article/show/350235" # gamewith参照

req = requests.get(url)
bs = BeautifulSoup(req.content, "html.parser")
items = bs.select_one('div.mhrise_kaika')

for item in items.select('tr')[1:]:
    anomalyItem = item.select_one('td > a').text # 傀異化素材の名前を取得
    
    for name in item.select('td')[1].select('a'):
        statusList[name.text]['anomalyItem'] = anomalyItem # 対象のモンスターリストに登録

###############################################################
# jsonファイルに出力
###############################################################
file = open('./hunter_note.json', 'w', encoding='utf-8')
json.dump(statusList, file, ensure_ascii=False)
file.close()

