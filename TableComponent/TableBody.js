import React from 'react';

import TableBodyRow from './TableBodyRow';

export default class TableBody extends React.Component {	
	render = () => {
		let data = this.props.data;
		const columnOrder = this.props.columnOrder;
		const enableRowSelect = this.props.enableRowSelect;
		const bodyCellReplacement = this.props.bodyCellReplacement;
		const bodyCellHelperFunction = this.props.bodyCellHelperFunction;
		const onSelectItem = this.props.onSelectItem;

		let displayCountPerPage = this.props.displayCountPerPage;
		let curPage = this.props.curPage;

		return (
			<tbody>
			{
				data.slice((curPage - 1) * displayCountPerPage, curPage * displayCountPerPage).map((item, index) => <TableBodyRow 
					key={index}
					columnOrder={columnOrder}
					enableRowSelect={enableRowSelect}
					item={item}
					bodyCellReplacement={bodyCellReplacement}
					bodyCellHelperFunction={bodyCellHelperFunction}
					onSelectItem={onSelectItem}
				/>)
			}
			</tbody>
		)
	}
}