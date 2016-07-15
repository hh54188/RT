import React from 'react';

import SelectRowCheckbox from './SelectRowCheckbox';
import TableBodyCell from './TableBodyCell';

export default class TableBodyRow extends React.Component {
	render = () => {
		const item = this.props.item;
		const enableRowSelect = this.props.enableRowSelect;
		const bodyCellReplacement = this.props.bodyCellReplacement;
		const bodyCellHelperFunction = this.props.bodyCellHelperFunction;
		const isSelected = item.__selected;

		let selectRowCheckboxRowCell = this.props.enableRowSelect
									? (<td className="center aligned">
										<SelectRowCheckbox checked={isSelected}  changeHandler={this.props.selectBoxChangeHandler.bind(null, item)}  />
									</td>)
									: undefined;
		let selectedBodyRowClassName = item['__selected']? 'positive': '';

		return (
			<tr className={selectedBodyRowClassName}>
			{selectRowCheckboxRowCell}
			{
				this.props.columnOrder.map((property, index) => {
					let replacement = [];
					if (bodyCellReplacement) {
						replacement = bodyCellReplacement.filter((replacement, index) => {
							return replacement.replaceIndex == index 
									|| replacement.replaceProperty == property;
						});						
					}


					let replaceComponent = replacement.length
											? replacement[0].replaceComponent
											: undefined;

					let helper = [];
					if (bodyCellHelperFunction) {
						helper = bodyCellHelperFunction.filter((fn, index) => {
							return fn.cellIndex == index
									|| fn.targetProperty == property
						});
					}

					let helperFunction = helper.length
											? helper[0].fn
											: undefined;


					let content = item[property];

					return <TableBodyCell 
						key={index} 
						content={content}
						replaceComponent={replaceComponent}
						helperFunction={helperFunction}
					/>
				})
			}
			</tr>
		)
	}
}

TableBodyRow.propTypes = {
	item: React.PropTypes.object.isRequired,
	columnOrder: React.PropTypes.array.isRequired,
	enableRowSelect: React.PropTypes.bool,
	bodyCellReplacement: React.PropTypes.element,
	bodyCellHelperFunction: React.PropTypes.func,
	selectBoxChangeHandler: React.PropTypes.func
}