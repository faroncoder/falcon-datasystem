var express = require( 'express' );
var router = express.Router();
var mongoose = require( 'mongoose' ); //mongo connection
var bodyParser = require( 'body-parser' ); //parses information from POST
var methodOverride = require( 'method-override' ); //used to manipulate POST
router.use( bodyParser.urlencoded( { extended: true } ) )
router.use( methodOverride( function( req, res ) {
		if( req.body && typeof req.body === 'object' && '_method' in req.body ) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method
			delete req.body._method
			return method
		}
	} ) )
	//build the REST operations at the base for blobs
	//this will be accessible from http://127.0.0.1:3000/blobs if the default route for / is left unchanged
router.route( '/' )
	//GET all blobs
	.get( function( req, res, next ) {
		//retrieve all blobs from Monogo
		mongoose.model( 'clips' ).find( {}, function( err, clips ) {
			if( err ) {
				return console.error( err );
			} else {
				//respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
				res.format( {
					//HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
					html: function() {
						res.render( 'clips/index', {
							title: 'All my Clips',
							"clips": clips
						} );
					},
					//JSON response will show all blobs in JSON format
					json: function() {
						res.json( clipinfo );
					}
				} );
			}
		} );
	} )
	//POST a new blob
	.post( function( req, res ) {
		// Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
		var identity = req.body.identity;
		var ratio = req.body.ratio;
		var aspect = req.body.aspect;
		var pixel = req.body.pixel;
		var calcuated = req.body.calcuated;
		var size = req.body.size;
		var duration = req.body.duration;
		var processed = req.body.processed;
		//var id = req.body._id;
		//call the create function for our database
		mongoose.model( 'clips' ).create( {
			identity: identity,
			duration: duration,
			processed: processed,
			aspect: aspect,
			ratio: ratio,
			aspect: aspect,
			pixel: pixel,
			calcuated: calcuated,
			size: size
		}, function( err, clip ) {
			if( err ) {
				res.send( "There was a problem adding the information to the database." );
			} else {
				//Blob has been created
				console.log( 'POST creating new clip: ' + clip );
				res.format( {
					//HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
					html: function() {
						// If it worked, set the header so the address bar doesn't still say /adduser
						res.location( "clips" );
						// And forward to success page
						res.redirect( "/clips" );
					},
					//JSON response will show the newly created blob
					json: function() {
						res.json( clip );
					}
				} );
			}
		} )
	} );
/* GET New Blob page. */
router.get( '/new', function( req, res ) {
	res.render( 'clips/new', { title: 'Add New Clip' } );
} );
// route middleware to validate :id
router.param( 'id', function( req, res, next, id ) {
	console.log( 'validating ' + id + ' exists' );
	//find the ID in the Database
	mongoose.model( 'clips' ).findById( id, function( err, clip ) {
		//if it isn't found, we are going to repond with 404
		if( err ) {
			console.log( id + ' was not found' );
			res.status( 404 )
			var err = new Error( 'Not Found' );
			err.status = 404;
			res.format( {
				html: function() {
					next( err );
				},
				json: function() {
					res.json( { message: err.status + ' ' + err } );
				}
			} );
			//if it is found we continue on
		} else {
			//uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
			console.log( clip );
			// once validation is done save the new item in the req
			req.id = id;
			// go to the next thing
			next();
		}
	} );
} );
router.route( '/:id' ).get( function( req, res ) {
	mongoose.model( 'clips' ).findById( req.id, function( err, clip ) {
		if( err ) {
			console.log( 'GET Error: There was a problem retrieving: ' + err );
		} else {
			console.log( 'GET Retrieving ID: ' + clip._id );
			//var clip = blob.dob.toISOString();
			//blobdob = blobdob.substring( 0, blobdob.indexOf( 'T' ) )
			res.format( {
				html: function() {
					res.render( 'clips/show', {
						"clip": clip
					} );
				},
				json: function() {
					res.json( clip );
				}
			} );
		}
	} );
} );
//GET the individual blob by Mongo ID
router.get( '/:id/edit', function( req, res ) {
	//search for the blob within Mongo
	mongoose.model( 'clips' ).findById( req.id, function( err, clip ) {
		if( err ) {
			console.log( 'GET Error: There was a problem retrieving: ' + err );
		} else {
			//Return the blob
			console.log( 'GET Retrieving ID: ' + clip._id );
			//format the date properly for the value to show correctly in our edit form
			//var blobdob = blob.dob.toISOString();
			//blobdob = blobdob.substring( 0, blobdob.indexOf( 'T' ) )
			res.format( {
				//HTML response will render the 'edit.jade' template
				html: function() {
					res.render( 'clips/edit', {
						title: 'Clip ' + clip._id,
						"clip": clip
					} );
				},
				//JSON response will return the JSON output
				json: function() {
					res.json( clip );
				}
			} );
		}
	} );
} );
//PUT to update a blob by ID
router.put( '/:id/edit', function( req, res ) {
	// Get our REST or form values. These rely on the "name" attributes
	var identity = req.body.identity;
	var ratio = req.body.ratio;
	var aspect = req.body.aspect;
	var pixel = req.body.pixel;
	var calcuated = req.body.calcuated;
	var size = req.body.size;
	var duration = req.body.duration;
	var processed = req.body.processed;
	//find the document by ID
	mongoose.model( 'clips' ).findById( req.id, function( err, clip ) {
		//update it
		clip.update( {
			identity: identity,
			duration: duration,
			processed: processed,
			aspect: aspect,
			ratio: ratio,
			aspect: aspect,
			pixel: pixel,
			calcuated: calcuated,
			size: size
		}, function( err, clipID ) {
			if( err ) {
				res.send(
					"There was a problem updating the information to the database: " +
					err );
			} else {
				//HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
				res.format( {
					html: function() {
						res.redirect( "/clips/" + clip._id );
					},
					//JSON responds showing the updatedd values
					json: function() {
						res.json( clip );
					}
				} );
			}
		} )
	} );
} );
//DELETE a Blobby ID
router.delete( '/:id/edit', function( req, res ) {
	//find blob by ID
	mongoose.model( 'clips' ).findById( req.id, function( err, clip ) {
		if( err ) {
			return console.error( err );
		} else {
			//remove it from Mongo
			clip.remove( function( err, clip ) {
				if( err ) {
					return console.error( err );
				} else {
					//Returning success messages saying it was deleted
					console.log( 'DELETE removing ID: ' + clip._id );
					res.format( {
						//HTML returns us back to the main page, or you can create a success page
						html: function() {
							res.redirect( "/clips" );
						},
						//JSON returns the item with the message that is has been deleted
						json: function() {
							res.json( {
								message: 'deleted',
								item: clip
							} );
						}
					} );
				}
			} );
		}
	} );
} );
module.exports = router;
