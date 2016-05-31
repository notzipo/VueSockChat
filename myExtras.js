//myExtras module
const fs = require('fs');

exports.startWatchFile = function(){
	fs.watchFile(__dirname + '/public/rtus.json', (curr, prev) => {
	  console.log(`the current mtime is: ${curr.mtime}`);
	  console.log(`the previous mtime was: ${prev.mtime}`);
	});
}