// webpack.config.js
module.exports = {
	  entry: './entry.js',
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