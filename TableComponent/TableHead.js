import React from 'react';

import SelectRowCheckbox from './SelectRowCheckbox';

export default class TableHead extends React.Component {
	render = () => {
		let data = this.props.data;

		let curDataAreSelected = data.every((item) => {
			return item.__selected == true;
		});

		// data在空数组的情况下，every返回的结果默认为true
		// 所以要通过判断data长度修正这个问题
		if (!data.length) {
			curDataAreSelected = false;
		}

		let selectAllCheckboxRowCell = this.props.enableRowSelect
									? (<th className="one wide center aligned">
										<SelectRowCheckbox  
											checked={curDataAreSelected} 
											changeHandler={this.props.selectBoxChnageHandler} 
										/>
									</th>)
									: undefined;

		const iconOfSort = <i className="sort icon"></i>;
		const iconOfAscending = <i className="sort ascending icon"></i>;
		const iconOfDescending = <i className="sort descending icon"></i>;

		return (
			<thead>
				<tr>
					{selectAllCheckboxRowCell}
					{
						this.props.columnOrder.map((propertyName, index) => {
							// 如果有对应中文名，则取对应的中文名
							// 如果没有中文名，则取属性英文名
							// 如果有对于中文名，但中文名为undefined，则返回undefined
							// 如果没有属性名，则返回undefined
							let columnName = this.props.columnName;
							let name = propertyName
										? columnName[propertyName]
											? columnName[propertyName]
											: columnName[propertyName] == undefined
												? undefined
												: propertyName
										: undefined;
							let sortIcon;

							if (this.props.enableSort && name) {
								let sortStatus = this.props.sortStatus;
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
								<th onClick={this.props.sortHandler.bind(null, propertyName)} key={index}>
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

TableHead.propTypes = {
	columnName: React.PropTypes.object,
	columnOrder: React.PropTypes.array.isRequired,
	enableRowSelect: React.PropTypes.bool,
	enableSort: React.PropTypes.bool,
	data: React.PropTypes.array,
	selectBoxChnageHandler: React.PropTypes.func,
	sortHandler: React.PropTypes.func,
	sortStatus: React.PropTypes.object
}

TableHead.defaultProps = {
	columnName: {},
	columnOrder: [],
	enableRowSelect: false,
	enableSort: false,
	data: [],
	selectBoxChnageHandler: new Function(),
	sortHandler: new Function(),
	sortStatus: {}
}