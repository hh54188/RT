import React from 'react';
import md5 from 'blueimp-md5';
import PubSub from 'pubsub-js';

class SelectRowCheckbox extends React.Component {
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

class TableHead extends React.Component {
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

class TableBodyCell extends React.Component {
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
class TableBodyRow extends React.Component {
	render = () => {
		const item = this.props.item;
		const columnOrder = this.props.columnOrder;
		const enableRowSelect = this.props.enableRowSelect;
		const bodyCellReplacement = this.props.bodyCellReplacement || [];
		const bodyCellHelperFunction = this.props.bodyCellHelperFunction;
		const onSelectItem = this.props.onSelectItem;
		const isSelected = item.__selected;

		let selectRowCheckboxRowCell = enableRowSelect
									? (<td className="center aligned">
										<SelectRowCheckbox checked={isSelected}  onChange={onSelectItem.bind(null, item)}  />
									</td>)
									: undefined;
		let selectedBodyRowClassName = item['__selected']? 'positive': '';

		return (
			<tr className={selectedBodyRowClassName}>
			{selectRowCheckboxRowCell}
			{
				columnOrder.map((property, index) => {
					let replacement = bodyCellReplacement.filter((replacement, index) => {
						return replacement.replaceIndex == index 
								|| replacement.replaceProperty == property;
					});


					let replaceComponent = replacement.length
											? replacement[0].replaceComponent
											: undefined;

					let helper = bodyCellHelperFunction.filter((fn, index) => {
						return fn.cellIndex == index
								|| fn.targetProperty == property
					});

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

class TableBody extends React.Component {	
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

class PaginationEllipsis extends React.Component {
	render = ()=> {
		return (
			<a className="item disabled">...</a>
		)
	}
}

class PaginationNumber extends React.Component {
	render = () => {
		const number = this.props.number;
		const active = this.props.active;
		const defaultClassName = 'item';
		let className = active? (defaultClassName + ' active'): defaultClassName;

		return (
		    <a onClick={this.props.onClick} className={className}>{number}</a>
		)
	}
}

class PaginationPrevBtn extends React.Component {
	render = ()=> {
		const disabled = this.props.disabled;
		const defaultClassName = 'icon item';
		let className = defaultClassName + (disabled? ' disabled': '');

		return (
	        <a onClick={this.props.onClick} className={className}>
	          <i className="left chevron icon"></i>
	        </a>			
		)
	}
}

class PaginationNextBtn extends React.Component {
	render = () => {
		const disabled = this.props.disabled;
		let className = 'icon item' + (disabled? ' disabled': '');	
			return (
	        <a onClick={this.props.onClick} className={className}>
	          <i className="right chevron icon"></i>
	        </a>
		)
	}
}

class Pagination extends React.Component {
	initPageArr = (first, count) => {
		let arr = [];
		for (let i = 0; i < count; i++) {
			arr.push(first + i);
		}
		return arr;		
	}
	render = ()=> {
		
		const curPage = this.props.curPage;
		const totalPage = this.props.totalPage;
		const maxPaginationCount = 7;
		const lastPage = totalPage;
		let paginationContent;

		let disablePrevBtn = curPage === 1? true: false;
		let dsiableNextBtn = curPage === lastPage? true: false;

		let goNextPage = this.props.goNextPage;
		let goPrevPage = this.props.goPrevPage;
		let goPage = this.props.goPage;

		const renderPageArr = (pageArr) => {
  			return pageArr.map((page) => {
  				return <PaginationNumber onClick={goPage.bind(null, page)} key={page} number={page} active={page==curPage}/>
  			})			
		}


		// 当页数小于等于7时，显示所有页数按钮
		// 1,2,3,4,5,6,7
		if (totalPage <= maxPaginationCount) {
			let pageArr = this.initPageArr(1, totalPage);
			paginationContent = (
				<div className="ui floated right pagination menu small">
		      		<PaginationPrevBtn onClick={goPrevPage} disabled={disablePrevBtn}/>
		      		{renderPageArr(pageArr)}
			        <PaginationNextBtn onClick={goNextPage} disabled={dsiableNextBtn}/>
		      	</div>
	      	)
		
		// 当页数处于中央，两头省略号都要出现：
		// 1,...5,6,7...10
		} else if (curPage - 1 > 2 
			&& lastPage - curPage > 2) {
			let pageArr = this.initPageArr(curPage - 1, 3);
			paginationContent = (
				<div className="ui floated right pagination menu small">
		      		<PaginationPrevBtn onClick={goPrevPage} disabled={disablePrevBtn}/>
		      		<PaginationNumber onClick={goPage.bind(null, 1)}  number={1}/>
			        <PaginationEllipsis />
			        {renderPageArr(pageArr)}
			        <PaginationEllipsis />
			        <PaginationNumber onClick={goPage.bind(null, lastPage)} number={lastPage}/>
			        <PaginationNextBtn onClick={goNextPage} disabled={dsiableNextBtn} />
		      	</div>
	      	)

		// 当页数比较靠近第一页时
		// 隐藏前置省略号
		// 1,2,3,4...,10
		} else if (curPage - 1 <= 4) {
			let pageArr = this.initPageArr(1, 5);
			paginationContent = (
				<div className="ui floated right pagination menu small">
		      		<PaginationPrevBtn onClick={goPrevPage} disabled={disablePrevBtn}/>
			        {renderPageArr(pageArr)}
			        <PaginationEllipsis />
			        <PaginationNumber onClick={goPage.bind(null, lastPage)}  number={lastPage} />    		
			        <PaginationNextBtn onClick={goNextPage} disabled={dsiableNextBtn} />
		      	</div>
	      	)

		// 当页数比较靠近最后时
		// 隐藏后置省略号
		// 1,...8,9,10
		} else if (lastPage - curPage <= 4) {
			let pageArr = this.initPageArr(lastPage - 4, 5);
			paginationContent = (
				<div className="ui floated right pagination menu small">
		      		<PaginationPrevBtn onClick={goPrevPage} disabled={disablePrevBtn}/>
			        <PaginationNumber onClick={goPage.bind(null, 1)}  number={1} />
			        <PaginationEllipsis />		      		
			        {renderPageArr(pageArr)}		      		
			        <PaginationNextBtn onClick={goNextPage} disabled={dsiableNextBtn} />
		      	</div>
	      	)
		}

		return paginationContent
	}
}

class TableFoot extends React.Component {
	render = () => {
		const enableRowSelect = this.props.enableRowSelect;
		const columnLength = this.props.columnLength + (enableRowSelect? 1: 0);
		const totalPage = this.props.totalPage;
		const curPage = this.props.curPage;

		let goNextPage = this.props.onNextPage;
		let goPrevPage = this.props.onPrevPage;
		let goPage = this.props.onPage;

		return (
			<tfoot>
				<tr>
					<th colSpan={columnLength}>
						<Pagination
							goNextPage={goNextPage}
							goPrevPage={goPrevPage}
							goPage={goPage}
							totalPage={totalPage}
							curPage={curPage}
						/>
					</th>
				</tr>
			</tfoot>
		)
	}
}


export default class Table extends React.Component {
	constructor(props){
		
		super(props);

		let singleSourceOfTruth = this.decorator(this.props.data);
		let displayCountPerPage = this.props.displayCountPerPage || 10;
		let dataLength = singleSourceOfTruth.length;

		let totalPage = Math.ceil(dataLength / displayCountPerPage);
		let curPage = 1;

		this.state = {
			__templates: singleSourceOfTruth.slice(),
			templates: singleSourceOfTruth,
			paginationConfig: {
				displayCountPerPage: displayCountPerPage,
				curPage: curPage,
				totalPage: totalPage				
			},
			filterConfig: {
				keyword: '',
				property: {}
			},
			sortStatus: {
				propertyName: '',
				status: undefined
			}
		}

		PubSub.subscribe(this.props.keywordChangeEventName, (eventName, keyword) => {
			let filterConfig = this.state.filterConfig;
			filterConfig.keyword = keyword;
			this.setState({
				filterConfig: filterConfig
			});

			this.updateTemplates();
		});
	}
	updateTemplates = () => {
		let templates = this.state.__templates;

		templates = this.getTemplatesByKeyword(templates);
		templates = this.getTemplatesBySort(templates);
		this.updatePaginationByTemplates(templates);

		this.setState({
			templates: templates
		});
	}
	updatePaginationByTemplates = (templates) => {

		let templatesLength = templates.length;

		let paginationConfig = this.state.paginationConfig;
		let displayCountPerPage = paginationConfig.displayCountPerPage;

		paginationConfig.totalPage = Math.ceil(templatesLength / displayCountPerPage);
		paginationConfig.curPage = 1;

		this.setState({
			paginationConfig: paginationConfig
		})

	}
	getTemplatesBySort = (templates) => {

		let sortStatus = this.state.sortStatus;
		let propertyName = sortStatus['propertyName'];
		let status = sortStatus['status'];

		if (!propertyName) {
			return templates;
		}
		
		switch (status % 3) {
			case 0: templates = this.ascendingSortByPropery(templates, propertyName); break;
			case 1: templates = this.descendingSortByPropery(templates, propertyName); break;
			case 2: templates = templates;
		}

		return templates;
	}
	goNextPage = () => {

		let paginationConfig = this.state.paginationConfig;
		let curPage = paginationConfig.curPage;
		let totalPage = paginationConfig.totalPage;

		paginationConfig.curPage = (++curPage > totalPage)? totalPage: curPage;

		this.setState({
			paginationConfig: paginationConfig
		});
	}
	goPrevPage = () => {

		let paginationConfig = this.state.paginationConfig;
		let curPage = paginationConfig.curPage;
		let totalPage = paginationConfig.totalPage;

		paginationConfig.curPage = (--curPage < 1)? 1: curPage;

		this.setState({
			paginationConfig: paginationConfig
		});
	}
	goPage = (num) => {
		let paginationConfig = this.state.paginationConfig;
		paginationConfig.curPage = num;

		this.setState({
			paginationConfig: paginationConfig
		});
	}
	getRandomInt = (min, max) => {
  		return Math.floor(Math.random() * (max - min)) + min;
	}
	decorator = (data) => {
		return data.map((item) => {
			item.__selected = false;
			item.__index = md5(this.getRandomInt(0, 10e10));
			return item;
		});
	}
	ascendingSortByPropery = (templates, propertyName) => {
		let propertyVal = templates[0][propertyName];
		let propertyValType = typeof propertyVal;

		switch (propertyValType) {
			case 'string': templates = this.ascendingSortOfString(templates, propertyName); break;
			case 'number': templates = this.ascendingSortOfNumber(templates, propertyName); break;		
			case 'boolean': templates = this.ascendingSortOfBoolean(templates, propertyName); break;
		}

		return templates;
	}
	descendingSortByPropery = (templates, propertyName) => {
		
		let propertyVal = templates[0][propertyName];
		let propertyValType = typeof propertyVal;

		switch (propertyValType) {
			case 'string': templates = this.descendingSortOfString(templates, propertyName); break;
			case 'number': templates = this.descendingSortOfNumber(templates, propertyName); break;
			case 'boolean': templates = this.descendingSortOfBoolean(templates, propertyName); break;
		}

		return templates;
	}
	cancelSort = () => {
		return this.state.templates;
	}
	ascendingSortOfBoolean = () => {

	}
	descendingSortOfBoolean = () => {

	}
	ascendingSortOfString = (data, propertyName) => {
		return data.sort(function (first, second) {
			return first[propertyName].localeCompare(second[propertyName]);
		});
	}
	descendingSortOfString = (data, propertyName) => {
		return data.sort(function (first, second) {
			return second[propertyName].localeCompare(first[propertyName]);
		});
	}
	ascendingSortOfNumber = (data, propertyName) => {
		return data.sort(function (first, second) {
			return first[propertyName] - second[propertyName];

		});
	}
	descendingSortOfNumber = (data, propertyName) => {
		return data.sort(function (first, second) {
			return second[propertyName] - first[propertyName];			
		});
	}			
	sortByProperty = (propertyName) => {

		let sortStatus = this.state.sortStatus;
		let oldPropertyName = sortStatus.propertyName;

		if (oldPropertyName != propertyName) {
			sortStatus.propertyName = propertyName;
			sortStatus.status = -1;
		}
		
		sortStatus.status++;

		this.setState({
			sortStatus: sortStatus
		})

		this.updateTemplates();
	}
	toggleSelectItem = (item, eventObj) => {
		item.__selected = !item.__selected
		this.setState({
			data: this.updateItem(item)
		});
	}
	toggleSelectAllItem = (eventObj) => {
		let selectVal = eventObj.target.checked;
		let templates = this.state.templates;
		templates.forEach(function (item) {
			item.__selected = selectVal
		});
		this.setState({
			templates: templates
		});		
	}
	updateItem = (item) => {
		let templates = this.state.templates;
		for (let i = 0; i < templates.length; i++) {
			if (templates[i].__index === item.__index) {
				templates[i] = item;
				break;
			}
		}
		return templates;
	}
	computedColumnLength = () => {
		const columnOrder = this.props.config.columnOrder;
		return columnOrder.length;
	}
	getTemplatesByKeyword = (templates) => {
		let filterConfig = this.state.filterConfig;
		let keyword = filterConfig.keyword;

		const checkTplHaveKeyword = (tpl, keyword) => {
			if (!keyword) {
				return true;
			}

			let pass = false;

			for (let propertyName in tpl) {
				let propertyVal = tpl[propertyName];
				if (typeof propertyVal == 'string' 
					&& propertyName.indexOf('__') < 0
					&& propertyVal.indexOf(keyword) > -1) {
					pass = true;
				}
			}
			return pass;
		}

		templates = templates.filter((tpl) => {
			return checkTplHaveKeyword(tpl, keyword);
		});

		return templates;
	}
	render = () => {
		// Important:
		const config = this.props.config;
		// Body
		const bodyCellReplacement = config.bodyCellReplacement;
		const bodyCellHelperFunction = config.bodyCellHelperFunction;
		// Table
		const enableSort = config.enableSort;
		const sortConfig = config.sortConfig;
		const columnOrder = config.columnOrder;
		const columnLength = this.computedColumnLength();
		// Head
		const columnName = config.columnName;
		const displayHead = config.displayHead;
		const enableRowSelect = config.enableRowSelect;
		// Foot
		const enablePagination = config.enablePagination;
		// Style and ClassName
		const tableStyle = config.tableStyle;

		let tableHead = displayHead
						? <TableHead
							templates={this.state.templates}
							sortStatus={this.state.sortStatus}
							onSort={this.sortByProperty}
							sortConfig={sortConfig}
							onSelectAll={this.toggleSelectAllItem}
							columnLength={columnLength}
							columnOrder={columnOrder}
							enableSort={enableSort}
							columnName={columnName} 
							enableRowSelect={enableRowSelect}
						/>
						: undefined;
		let tableFoot = enablePagination
						? <TableFoot
							totalPage={this.state.paginationConfig.totalPage}
							curPage={this.state.paginationConfig.curPage}
							onNextPage={this.goNextPage}
							onPrevPage={this.goPrevPage}
							onPage={this.goPage}
							columnLength={columnLength}
							enableRowSelect={enableRowSelect}
						/>
						: undefined;

		return (
			<table style={tableStyle} className="ui celled table">
				{tableHead}
				<TableBody
					displayCountPerPage={this.state.paginationConfig.displayCountPerPage}
					curPage={this.state.paginationConfig.curPage}
					data={this.state.templates}
					bodyCellHelperFunction={bodyCellHelperFunction}
					columnOrder={columnOrder}
					enableRowSelect={enableRowSelect}
					bodyCellReplacement={bodyCellReplacement}
					tableStyle={tableStyle}
					onSelectItem={this.toggleSelectItem}
				/>
				{tableFoot}
			</table>
		)
	}
}

Table.propTypes = {
	data: React.PropTypes.array,
	config: React.PropTypes.object
	// columnOrder: React.PropTypes.array,
	// displayHead: React.PropTypes.bool,
	// columnName: React.PropTypes.object,
	// bodyCellHelperFunction: React.PropTypes.array,
	// bodyCellReplacement: React.PropTypes.array,
	// enableRowSelect: React.PropTypes.bool,
	// enableMultiplyRowSelect: React.PropTypes.bool,
	// enablePagination: React.PropTypes.bool,
	// tableStyle: React.PropTypes.object
}
