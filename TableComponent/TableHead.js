import React from 'react';

import SelectRowCheckbox from './SelectRowCheckbox';

export default class TableHead extends React.Component {
	render = () => {
		const columnName = this.props.columnName || {};
		const columnOrder = this.props.columnOrder;
		const columnLength = this.props.columnLength;
		const enableRowSelect = this.props.enableRowSelect;
		const enableSort = this.props.enableSort;
		const onSelectAll = this.props.onSelectAll;
		let templates = this.props.templates;

		let curTemplatesAreSelected = templates.every((item) => {
			return item.__selected == true;
		});

		// templates在空数组的情况下，every返回的结果默认为true
		// 所以要通过判断templates长度修正这个问题
		if (!templates.length) {
			curTemplatesAreSelected = false;
		}

		let selectAllCheckboxRowCell = enableRowSelect
									? <th className="one wide center aligned"><SelectRowCheckbox  checked={curTemplatesAreSelected} onChange={onSelectAll} /></th>
									: undefined;

		const iconOfSort = <i className="sort icon"></i>;
		const iconOfAscending = <i className="sort ascending icon"></i>;
		const iconOfDescending = <i className="sort descending icon"></i>;

		let sortHandler = this.props.onSort;
		let sortStatus = this.props.sortStatus;
		let sortConfig = this.props.sortConfig;

		return (
			<thead>
				<tr>
					{selectAllCheckboxRowCell}
					{
						columnOrder.map((propertyName, index) => {
							// 如果有对应中文名，则取对应的中文名
							// 如果没有中文名，则取属性英文名
							// 如果有对于中文名，但中文名为undefined，则返回undefined
							// 如果没有属性名，则返回undefined
							let name = propertyName
										? columnName[propertyName]
											? columnName[propertyName]
											: columnName[propertyName] == undefined
												? undefined
												: propertyName
										: undefined;
							let sortIcon;

							if (enableSort && name) {
								let sortStatusCode;

								if (sortStatus['propertyName'] === propertyName) {
									sortStatusCode = sortStatus['status'];
								}
								
								if (sortStatusCode == undefined) {
									sortIcon = iconOfSort;
								} else {
									switch (sortStatusCode % 3) {
										case 0: sortIcon = iconOfAscending; break;
										case 1: sortIcon = iconOfDescending; break;
										case 2: sortIcon = iconOfSort
									}								
								}

							}

							return (
								<th onClick={sortHandler.bind(null, propertyName)} key={index}>
									<span>{name}</span>
									{sortIcon}
								</th>
							)
						})
					}
				</tr>
			</thead>
		)
	}
}