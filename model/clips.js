var mongoose = require( 'mongoose' );
var clipSchema = new mongoose.Schema( {
	identity: String,
	duration: String,
	processed: Boolean
} );
mongoose.model( 'manifest', clipSchema );
