var RPSSCRIPT = {
	database: firebase.database(),
	userID: null,
	player1Connected: null,
	p1Choice: null,
	p2Choice: null,
	player2Connected: null,
	state: null,
	wins: 0,
	losses: 0,
	initialize: function (){
		console.log("initialize Entered");
		firebase.database().goOnline();
		// RPSSCRIPT.database.ref().set({
		// 	userCount: 0
		// });
		$("#pSelect").on("click", RPSSCRIPT.paperSelection);
		$("#rSelect").on("click", RPSSCRIPT.rockSelection);
		$("#sSelect").on("click", RPSSCRIPT.scissorSelection);
		$("#pSelect").hide();
		$("#rSelect").hide();
		$("#sSelect").hide();
	},
	userConnect: function(){
		//check players in and call lobby to see if game can start
		RPSSCRIPT.database.ref().once('value', function(snapshot){
			console.log("userConnect async Entered");
			RPSSCRIPT.player1Connected = snapshot.val().player1Connected;
			RPSSCRIPT.player2Connected = snapshot.val().player2Connected;

			if (!RPSSCRIPT.player1Connected){
				let temp = {};
				temp = {
					name: $("#userName").val(),
					choice: null,
					wins: 0,
					losses: 0
				}	
				RPSSCRIPT.database.ref('players/1/').set(temp);
				RPSSCRIPT.database.ref().update({player1Connected:true});
				RPSSCRIPT.userID = 1;
				$('#login').hide();
			} else if (!RPSSCRIPT.player2Connected){
				let temp = {};
				temp = {
					name: $("#userName").val(),
					choice: null,
					wins: 0,
					losses: 0
				}	
				RPSSCRIPT.database.ref('players/2/').set(temp);
				RPSSCRIPT.database.ref().update({player2Connected:true});
				RPSSCRIPT.userID = 2;
				$('#login').hide();
			} else {
			alert("Too many players!");
			}
			console.log("asdfsadfasdfae" +  RPSSCRIPT.player1Connected);
			console.log(RPSSCRIPT.player2Connected);
		});
	},
	userDisconnect: function(){
		//removes player from db
		console.log("userDisconnect entered");
		if (RPSSCRIPT.userID !== null){
			RPSSCRIPT.database.ref('players/'+RPSSCRIPT.userID+'/').remove();
			let temp = {
				state: 'lobby'
			};
			temp['player'+RPSSCRIPT.userID+'Connected'] = false;
			RPSSCRIPT.database.ref().update(temp);
			$('#login').show();
		} else {
			alert("You're not connected!")
		}	
	},
	lobby: function (){
		//checks for both players being connected
		// RPSSCRIPT.database.ref().once('value', function(snapshot){
		// 	RPSSCRIPT.player1Connected = snapshot.val().player1Connected;
		// 	RPSSCRIPT.player2Connected = snapshot.val().player2Connected;

		// 	if(RPSSCRIPT.player1Connected && RPSSCRIPT.player2Connected){
		// 		RPSSCRIPT.round();
		// 	} else {
		// 		$('#gameDisp').text("Waiting for players to connect!");
		// 	}
		// });
	},
	round: function(){
		console.log("round Entered");
		$("#pSelect").show();
		$("#rSelect").show();
		$("#sSelect").show();
	},
	rockSelection: function(){
		console.log("rockSelection Entered");
		if (RPSSCRIPT.userID === 1){
			RPSSCRIPT.p1Choice = 'r';
			RPSSCRIPT.database.ref('players/1/').update({choice: RPSSCRIPT.p1Choice});
			$("#pSelect").hide();
			$("#rSelect").hide();
			$("#sSelect").hide();
		} else {
			RPSSCRIPT.p2Choice = 'r';
			RPSSCRIPT.database.ref('players/2/').update({choice: RPSSCRIPT.p2Choice});
			$("#pSelect").hide();
			$("#rSelect").hide();
			$("#sSelect").hide();
		}
	},
	paperSelection: function(){
		console.log("paperSelection Entered");
		if (RPSSCRIPT.userID === 1){
			RPSSCRIPT.p1Choice = 'p';
			RPSSCRIPT.database.ref('players/1/').update({choice: RPSSCRIPT.p1Choice});
			$("#pSelect").hide();
			$("#rSelect").hide();
			$("#sSelect").hide();
		} else {
			RPSSCRIPT.p2Choice = 'p';
			RPSSCRIPT.database.ref('players/2/').update({choice: RPSSCRIPT.p2Choice});
			$("#pSelect").hide();
			$("#rSelect").hide();
			$("#sSelect").hide();
		}
	},
	scissorSelection: function(){
		console.log("scissorSelection");
		if (RPSSCRIPT.userID === 1){
			RPSSCRIPT.p1Choice = 's';
			RPSSCRIPT.database.ref('players/1/').update({choice: RPSSCRIPT.p1Choice});
			$("#pSelect").hide();
			$("#rSelect").hide();
			$("#sSelect").hide();
		} else {
			RPSSCRIPT.p2Choice = 's';
			RPSSCRIPT.database.ref('players/2/').update({choice: RPSSCRIPT.p2Choice});
			$("#pSelect").hide();
			$("#rSelect").hide();
			$("#sSelect").hide();
		}
	},
	messaging: function(){
		console.log("messaging");
	},
	sendMessage: function(){
		console.log("sendMessage Entered");
	}
}

// RPSSCRIPT.database.ref('players/').remove();
// RPSSCRIPT.database.ref().update({player1Connected:false, player2Connected:false});
// RPSSCRIPT.database.ref().update({state: 'lobby'});
RPSSCRIPT.initialize();
$('#gameDisp').html("Login!");
$('window').on('beforeunload', RPSSCRIPT.userDisconnect);
$("#lginBtn").on("click", RPSSCRIPT.userConnect);
$("#quit").on("click", RPSSCRIPT.userDisconnect);

RPSSCRIPT.database.ref().on("value", function(snapshot){
	console.log("onValue entered");
	RPSSCRIPT.player1Connected = snapshot.val().player1Connected;
	RPSSCRIPT.player2Connected = snapshot.val().player2Connected;
	RPSSCRIPT.state = snapshot.val().state;
	console.log(snapshot.val());
	RPSSCRIPT.p1Choice = snapshot.val().players[1].choice;
	RPSSCRIPT.p2Choice = snapshot.val().players[2].choice;

	if (RPSSCRIPT.player1Connected === true){
		console.log("p1 connection check");
		$('#p1Disp').html(snapshot.val().players[1].name + "<br>Wins: " +
											snapshot.val().players[1].wins + "<br>Losses: " +
											snapshot.val().players[1].losses);
	} else {
		console.log("p1 connection check");
		$('#p1Disp').html("Not connected");
	}

	if (RPSSCRIPT.player2Connected === true){
		console.log("p2 connection check");
		$('#p2Disp').html(snapshot.val().players[2].name + "<br>Wins: " +
											snapshot.val().players[2].wins + "<br>Losses: " +
											snapshot.val().players[2].losses);
	} else {
		console.log("p2 connection check");
		$('#p2Disp').html("Not connected");
	}

	if(RPSSCRIPT.state === 'lobby'){
		RPSSCRIPT.messaging();
		$("#pSelect").hide();
		$("#rSelect").hide();
		$("#sSelect").hide();
		if(RPSSCRIPT.player1Connected === true && RPSSCRIPT.player2Connected === true){
			console.log("onValue if lobby entered");
			RPSSCRIPT.state = 'round';
			RPSSCRIPT.round();
			RPSSCRIPT.database.ref().update({state: RPSSCRIPT.state});
		}
	// } else if (RPSSCRIPT.state === 'tie'){

	// }	else if (RPSSCRIPT.state === 'p1wins'){
	// } else if (RPSSCRIPT.state === 'p2wins'){
	} else if (RPSSCRIPT.state === 'round'){
		RPSSCRIPT.round();
		RPSSCRIPT.messaging();
		if (RPSSCRIPT.player1Connected === true && RPSSCRIPT.player2Connected === true){
			console.log("onValue if round entered");
			if(RPSSCRIPT.p1Choice !== undefined && RPSSCRIPT.p2Choice !== undefined){
				if (RPSSCRIPT.p1Choice === RPSSCRIPT.p2Choice){
					RPSSCRIPT.p1Choice = null;
					RPSSCRIPT.p2Choice = null;
					$("#gameDisp").text("Tie!");
					RPSSCRIPT.round();
					console.log("Tie");
				} else if ((RPSSCRIPT.p1Choice === 'p' && RPSSCRIPT.p2Choice === 'r') || (RPSSCRIPT.p1Choice === 'r' && RPSSCRIPT.p2Choice === 's') || (RPSSCRIPT.p1Choice === 's' && RPSSCRIPT.p2Choice === 'p')){
					RPSSCRIPT.p1Choice = null;
					RPSSCRIPT.p2Choice = null;
					$("#gameDisp").text(snapshot.val().players[1].name + " Wins!");
					if (RPSSCRIPT.userID === 1){
						RPSSCRIPT.wins = snapshot.val().players[1].wins;
						RPSSCRIPT.wins++;
						RPSSCRIPT.losses = snapshot.val().players[2].losses;
						RPSSCRIPT.losses++;
						RPSSCRIPT.round();
						RPSSCRIPT.database.ref().update({
							'players/1/choice': RPSSCRIPT.p1Choice, 
							'players/1/wins': RPSSCRIPT.wins,
							'players/2/choice': RPSSCRIPT.p2Choice,
							'players/2/losses': RPSSCRIPT.losses
						});
						
					}
					console.log("Win");
				} else {
					RPSSCRIPT.p1Choice = null;
					RPSSCRIPT.p2Choice = null;
					$("#gameDisp").text(snapshot.val().players[2].name + " Wins!");
					if (RPSSCRIPT.userID === 2){
						RPSSCRIPT.wins = snapshot.val().players[2].wins;
						RPSSCRIPT.wins++;
						RPSSCRIPT.losses = snapshot.val().players[1].losses;
						RPSSCRIPT.losses++;
						RPSSCRIPT.round();
						RPSSCRIPT.database.ref().update({
							'players/1/choice': RPSSCRIPT.p1Choice, 
							'players/2/wins': RPSSCRIPT.wins,
							'players/2/choice': RPSSCRIPT.p2Choice,
							'players/1/losses': RPSSCRIPT.losses
						});					
					}
					console.log("Lose");
				}
			} else{
					console.log("Waiting for both players");
					//$("#gameDisp").html("Waiting for both players");
					// RPSSCRIPT.state = 'lobby';
					// RPSSCRIPT.database.ref().update({state: RPSSCRIPT.state});
			}	
		} else {
			RPSSCRIPT.state = 'lobby';
			RPSSCRIPT.database.ref().update({state: RPSSCRIPT.state});
		} 
	}
});
