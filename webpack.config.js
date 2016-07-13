// webpack.config.js
module.exports = {
    // entry: './entry.js',
	  entry: './entry_demo.js',
  	output: {
    	filename: 'bundle.js'       
  	},
  	module: {
  		loaders: [
  			{
  				test: /\.jsx|js$/,
  				include: __dirname,
  				loader: 'babel'
  			}
  		]
  	}
};