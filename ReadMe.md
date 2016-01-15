Install requirements
$ pip install flask

Run server
$ python app.py &

To access casino website visit
http://localhost:5000/


Project Objectives
Create a virtual poker casino using Flask and Angular.

The actual poker game should work as follows:
- Each player receives a hand of five cards.
- Each player may choose an amount of money to bet. There is a minimum bet (an ante).
- Once all players have bet, all hands are shown and each player's funds are updated according to the outcome of the hand.

The casino should be populated by some number of computer players and one player controlled by the user of the site.

Your casino should support three main views: a casino overview, table detail view, and a player view

The casino overview should show all of the tables in the casino, including a list of the players sitting at each and each player's current funds. The overview should also display a list of players not sitting at any table. It should be possible from this view to seat a random unseated player at a table, remove a player from the table, deal a hand (executing the three steps above) to the table, or seat the user player at the table, redirecting to the player view.

The table detail view should show the players sitting at the table, each seated player's current funds, and the last hand for each player along with its outcome in terms of money won or lost. It should be possible from this view to deal a hand to the table or seat the user player at the table as well as to return to the overview.

The player view should show the players sitting at the table, each seated player's current funds, and the user player's hand. In addition, if the game is on the "showdown" step, the other players' hands and the outcome in terms of each player's money won or lost should be visible. It should be possible from this view to deal a hand, giving the user player the opportunity to make a bet and then see the outcome of the hand, and to leave the table, redirecting to the casino overview or the table detail view depending on how the user arrived at the player view.

Tips and things to keep in mind:
- Pay special attention to how you design the various components implementing the casino and their interactions. Is common behavior duplicated? Does each class have clear, well-separated responsibilities?
- Your site should handle all conceivable corner cases. Any reasonable response to these situations is fine. Comment your code thoroughly.
- Your site should have unit tests where appropriate.
- The presentation of the site is not important. Your site need not include any graphics. Feel free to represent cards with numbers and letters rather than images.
- It's fine for data to persist only as long as the server process runs, so you do not need a database if you don't want to use one.
- You can assume that there is only one non-computer player, the user of the site. You do not need to implement user accounts or logins.
- It's fine for the computer players to bet randomly rather than according to a strategy.