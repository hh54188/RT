import React from 'react';
import md5 from 'blueimp-md5';
import PubSub from 'pubsub-js';

import TableHead from './TableHead';
import TableBody from './TableBody';
import TableFoot from './TableFoot';

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
		const columnOrder = this.props.config.columnOrder || [];
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
		const config = this.props.config || {};
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
