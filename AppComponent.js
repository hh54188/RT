import React from 'react';

export default class App extends React.Component {
	render = () => {
		return (
			<h1>Hello World, {this.props.name}</h1>
		)
	}
}

App.propTypes = {
	name: React.PropTypes.string
}

App.defaultProps = {
	name: 'fanwenjuan'
}