var mongoose = require( 'mongoose' );
var clipSchema = new mongoose.Schema( {
<<<<<<< HEAD
	identity: [ String ],
	duration: [ String ],
	aspect: [ String ],
	ratio: [ String ],
	pixel: [ String ],
	calcuated: [ String ],
	size: [ String ]
=======
	identity: String,
	duration: String,
	processed: Boolean
>>>>>>> 7d9911dbe00e77b24b21dd6a3b1c883d9401f677
} );
mongoose.model( 'clips', clipSchema );
