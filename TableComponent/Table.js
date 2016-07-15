import React from 'react';
import md5 from 'blueimp-md5';
import PubSub from 'pubsub-js';

import TableHead from './TableHead';
import TableBody from './TableBody';
import TableFoot from './TableFoot';

import * as util from './utility';

export default class Table extends React.Component {
	constructor(props){
		super(props);

		let singleSourceOfTruth = this.decorator(this.props.data);
		let displayCountPerPage = this.props.displayCountPerPage || 10;
		let dataLength = singleSourceOfTruth.length;

		let totalPage = Math.ceil(dataLength / displayCountPerPage);
		let curPage = 1;

		this.state = {
			__data: singleSourceOfTruth.slice(),
			data: singleSourceOfTruth,
			paginationConfig: {
				displayCountPerPage: displayCountPerPage,
				curPage: curPage,
				totalPage: totalPage				
			},
			filterConfig: {
				keyword: ''
			},
			sortStatus: {
				propertyName: '',
				status: undefined
			}
		}
		
		PubSub.subscribe(this.props.updateTemplatesEventName, (eventName, templates) => {
			this.setState({
				__templates: templates,
				templates: templates
			});

			this.updateTemplates();
		});

		PubSub.subscribe(this.props.keywordChangeEventName, (eventName, keyword) => {
			let filterConfig = this.state.filterConfig;
			filterConfig.keyword = keyword;
			this.setState({
				filterConfig: filterConfig
			});

			this.updateData();
		});
	}
	updateData = () => {
		let data = this.state.__data;

		data = this.getDataByKeyword(data);
		data = this.getDataBySort(data);
		this.updatePaginationByData(data);

		this.setState({
			data: data
		});
	}
	updatePaginationByData = (data) => {

		let dataLength = data.length;
		let paginationConfig = this.state.paginationConfig;

		paginationConfig.totalPage = Math.ceil(dataLength / paginationConfig.displayCountPerPage);
		paginationConfig.curPage = 1;

		this.setState({
			paginationConfig: paginationConfig
		})

	}
	getDataBySort = (data) => {

		let sortStatus = this.state.sortStatus;
		let propertyName = sortStatus['propertyName'];
		let status = sortStatus['status'];

		if (!propertyName) {
			return data;
		}
		
		switch (status % 3) {
			case 0: data = this.ascendingSortByPropery(data, propertyName); break;
			case 1: data = this.descendingSortByPropery(data, propertyName); break;
			case 2: data = data;
		}

		return data;
	}
	pageNextHandler = () => {

		let paginationConfig = this.state.paginationConfig;
		let curPage = paginationConfig.curPage;
		let totalPage = paginationConfig.totalPage;

		paginationConfig.curPage = (++curPage > totalPage)? totalPage: curPage;

		this.setState({
			paginationConfig: paginationConfig
		});
	}
	pagePrevHandler = () => {

		let paginationConfig = this.state.paginationConfig;
		let curPage = paginationConfig.curPage;
		let totalPage = paginationConfig.totalPage;

		paginationConfig.curPage = (--curPage < 1)? 1: curPage;

		this.setState({
			paginationConfig: paginationConfig
		});
	}
	pageByNumberHandler = (num) => {
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

		this.updateData();
	}
	toggleSelectItem = (item) => {
		item.__selected = !item.__selected
		this.setState({
			data: this.updateItem(item)
		});
	}
	toggleSelectAllItem = (eventObj) => {
		let selectVal = eventObj.target.checked;
		let data = this.state.data;

		data.forEach(function (item) {
			item.__selected = selectVal
		});

		this.setState({
			data: data
		});		
	}
	updateItem = (item) => {
		let data = this.state.data;
		for (let i = 0; i < data.length; i++) {
			if (data[i].__index === item.__index) {
				data[i] = item;
				break;
			}
		}
		return data;
	}
	computedColumnLength = () => {
		const columnOrder = this.props.config.columnOrder || [];
		return columnOrder.length;
	}
	getDataByKeyword = (data) => {
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

		data = data.filter((tpl) => {
			return checkTplHaveKeyword(tpl, keyword);
		});

		return data;
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
							data={this.state.data}
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
			<table className="ui celled table">
				{tableHead}
				<TableBody
					displayCountPerPage={this.state.paginationConfig.displayCountPerPage}
					curPage={this.state.paginationConfig.curPage}
					data={this.state.data}
					bodyCellHelperFunction={bodyCellHelperFunction}
					columnOrder={columnOrder}
					enableRowSelect={enableRowSelect}
					bodyCellReplacement={bodyCellReplacement}
					onSelectItem={this.toggleSelectItem}
				/>
				{tableFoot}
			</table>
		)
	}
}

// Table.propTypes = { initialCount: React.PropTypes.number };
// Table.defaultProps = { initialCount: 0 };