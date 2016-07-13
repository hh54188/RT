import React from 'react';

class Example extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 100
		}
	}
	render = () => {
		return (
			<div>
				<h2>{this.state.counter}</h2>
				<button onClick={this.props.clickHandler.bind(this)}>Click</button>
			</div>
		)
	}
}

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 0
		}
	}
	addCounter = () => {
		this.setState({
			counter: ++this.state.counter
		})
	}
	render = () => {
		return (
			<div>
				<h1>{this.state.counter}</h1>
				<Example clickHandler={this.addCounter} />
			</div>
		)
	}
}