import React from 'react';

import TableBodyRow from './TableBodyRow';

export default class TableBody extends React.Component {	
	render = () => {
		let data = this.props.data;

		const displayCountPerPage = this.props.displayCountPerPage;
		const curPage = this.props.curPage;

		return (
			<tbody>
			{
				data.slice((curPage - 1) * displayCountPerPage, curPage * displayCountPerPage).map((item, index) => <TableBodyRow 
					key={index}
					columnOrder={this.props.columnOrder}
					enableRowSelect={this.props.enableRowSelect}
					item={item}
					bodyCellReplacement={this.props.bodyCellReplacement}
					bodyCellHelperFunction={this.props.bodyCellHelperFunction}
					selectBoxChangeHandler={this.props.selectBoxChangeHandler}
				/>)
			}
			</tbody>
		)
	}
}

TableBody.propTypes = {
	columnOrder: React.PropTypes.array.isRequired,
	data: React.PropTypes.array.isRequired,
	enableRowSelect: React.PropTypes.bool,
	bodyCellReplacement: React.PropTypes.element,
	bodyCellHelperFunction: React.PropTypes.func,
	selectBoxChangeHandler: React.PropTypes.func,
	curPage: React.PropTypes.number,
	displayCountPerPage: React.PropTypes.number
}