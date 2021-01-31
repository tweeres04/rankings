# rankings

This is a little set of tools to help me with my fantasy hockey league

The main tool is `findAvailablePlayers.js`, which hits the Yahoo Fantasy Sports API and finds the best players still available in my league based on a rankings CSV list I have.

There's also `getMyTeam.js`, which hits the API and gives me my team and the stats from the rankings CSV so that I can cross reference with the available players in order to decide what players to go for.

There's a `getPlayers.js`, which just seeds a little JSON file with all the players in the NHL with their relevant Yahoo API ID

## Yahoo Fantasy API

The Yahoo Fantasy API was a pain in the ass to use. It's XML and isn't well documented, so it was a lot of trial and error. But I ended up figuring it out. Was a good learning experience though.
