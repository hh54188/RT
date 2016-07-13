import React from 'react';

export default class SelectRowCheckbox extends React.Component {
	render = () => {
		return (
			<div className="ui checkbox">
				<input checked={this.props.checked} onChange={this.props.changeHandler} type="checkbox"/>
				<label></label>
			</div>
		)
	}
}

SelectRowCheckbox.propTypes = {
	checked: React.PropTypes.bool,
	changeHandler: React.PropTypes.func
}

SelectRowCheckbox.defaultProps = {
	checked: false,
	changeHandler: new Function()
}