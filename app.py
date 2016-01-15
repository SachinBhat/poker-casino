import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

tables=[]   #list of poker tables
for i in xrange(3):
    table={'id':i,'minBet':5,'players':[],'pot':0,'currMaxBet':0}
    tables.append(table)

players=[] #list of players in casino. userid 0 is user and rest bots
for i in xrange(10):
    player={'id':i,'name':'bot','funds':1000,'sitting':False,'table':-1,'lastResult':'not Started',
    'lastHand':'not Started','bet':0,'currentHand':[],'buyIns':1,'gameCall':'notFold'}
    if(i==0):
        player['name']='user'
    players.append(player)

@app.route('/')
def index():
    return render_template('index.html')

'''
Table apis
'''
#for now, no add/delete table, as table count is fixed 

@app.route('/api/updateTable',methods=['POST'])
def updateTable(): 
    json_data = request.json
    try:
        tables[json_data['id']]=json_data
        status = 'success'
    except:
        status = 'update table error'
    print json_data
    return jsonify({'result':status})

@app.route('/api/getTable',methods=['POST'])
def getTable():
    json_data = request.json
    t = int(json_data['id'])
    try:
        table = tables[t]
    except:
        table = {}
    return jsonify(table)

@app.route('/api/getTablePlayers',methods=['POST'])
def getTablePlayers():
    json_data = request.json
    t = int(json_data['id'])
    try:
        table = tables[t]
        tablePlayers=[]
        for i in table['players']:
            tablePlayers.append(players[i])
    except:
        tablePlayers=[]
    return json.dumps(tablePlayers)

@app.route('/api/updateTablePlayers',methods=['POST'])
def updateTablePlayers():
    json_data = request.json
    try:
        tablePlayers=json_data
        for p in tablePlayers:
            players[p['id']]=p
        status='success'
    except:
        status="tablePlayers update error"
    return jsonify({'result':status})

@app.route('/api/addPlayer',methods=['POST'])
def addPlayer():
    json_data = request.json
    t = int(json_data['tableId'])
    p = int(json_data['playerId'])
    try:
        table = tables[t]
        table['players'].append(p)
        players[p]['sitting']=True
        players[p]['table']=t
        status='success'
    except:
        status="Failed to add/seat player, try again"
    return jsonify({'result':status})

@app.route('/api/removePlayer',methods=['POST'])
def removePlayer():
    json_data = request.json
    t = int(json_data['tableId'])
    p = int(json_data['playerId'])
    try:
        table = tables[t]
        table['players'].remove(p)
        players[p]['table'] = -1
        players[p]['sitting']=False
        players[p]['lastHand']="not Started"
        players[p]['lastResult']="not Started"
        players[p]['gameCall']="notFold"
        players[p]['currentHand']=[]
        players[p]['bet']=0
        status='success'
    except:
        status="Failed to remove/unseat player,try again"
    return jsonify({'result':status})


'''
Player/User apis
'''

@app.route('/api/getUserTable')
def getUserTable():
    return jsonify({'tableId':players[0]['table']})


@app.route('/api/joinTable',methods=['POST'])
def joinTable():
    json_data = request.json
    t = int(json_data['tableId'])
    try:
        table = tables[t]
        p=0
        table['players'].append(p)
        players[p]['sitting']=True
        players[p]['table']=t
        result = players[p]
    except:
        result = {}
    return jsonify(result)

@app.route('/api/leaveTable')
def leaveTable():
    p = 0
    t = players[p]['table']
    try:
        table = tables[t]
        table['players'].remove(p)
        players[p]['table'] = -1
        players[p]['sitting']=False
        players[p]['lastHand']="not Started"
        players[p]['lastResult']="not Started"
        players[p]['gameCall']="notFold"
        players[p]['currentHand']=[]
        players[p]['bet']=0
        status='success'
    except:
        status="Failed to remove/unseat user,try again"
    return jsonify({'result':status})

'''
casino apis
'''

@app.route('/api/getAllTables')
def getAllTables():
    print tables
    return json.dumps(tables)

@app.route('/api/getAllPlayers')
def getAllPlayers():
    return json.dumps(players)



if __name__ == "__main__":
	ctx = app.test_request_context('/')
	ctx.push()
	app.run(debug=True)