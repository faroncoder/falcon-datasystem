var mongoose = require( 'mongoose' );
var clipSchema = new mongoose.Schema( {
	identity: [ String ],
	duration: [ String ],
	aspect: [ String ],
	ratio: [ String ],
	pixel: [ String ],
	calcuated: [ String ],
	size: [ String ]
} );
mongoose.model( 'clips', clipSchema );
