import React from 'react';

export default class SelectRowCheckbox extends React.Component {
	render = () => {
		let onChangeHandler = this.props.onChange;
		return (
			<div className="ui checkbox">
				<input checked={this.props.checked} onChange={onChangeHandler} type="checkbox" name="checkbox-select-row" />
				<label htmlFor="checkbox-select-row"></label>
			</div>
		)
	}
}