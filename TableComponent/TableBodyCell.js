import React from 'react';

export default class TableBodyCell extends React.Component {
	render = () => {
		const replaceComponent = this.props.replaceComponent;
		const helperFn = this.props.helperFunction;
		const content = helperFn
						? helperFn(this.props.content)
						: this.props.content;

		let cell = replaceComponent
					? React.cloneElement(replaceComponent, {
						'content': content
					})
					: content;

		return (
			<td>{cell}</td>
		)
	}

}