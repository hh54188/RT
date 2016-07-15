import React from 'react';

class PaginationEllipsis extends React.Component {
	render = ()=> {
		return (
			<a className="item disabled">...</a>
		)
	}
}

class PaginationNumber extends React.Component {
	render = () => {
		const defaultClassName = 'item';
		let className = this.props.active? (defaultClassName + ' active'): defaultClassName;

		return (
		    <a onClick={this.props.onClick} className={className}>{this.proprs.number}</a>
		)
	}
}

class PaginationPrevBtn extends React.Component {
	render = ()=> {
		const defaultClassName = 'icon item';
		let className = defaultClassName + (this.props.disabled? ' disabled': '');

		return (
	        <a onClick={this.props.onClick} className={className}>
	          <i className="left chevron icon"></i>
	        </a>			
		)
	}
}

class PaginationNextBtn extends React.Component {
	render = () => {
		let className = 'icon item' + (this.props.disabled? ' disabled': '');	
		return (
	        <a onClick={this.props.onClick} className={className}>
	          <i className="right chevron icon"></i>
	        </a>
		)
	}
}

export default class Pagination extends React.Component {
	initPageArr = (first, count) => {
		let arr = [];
		for (let i = 0; i < count; i++) {
			arr.push(first + i);
		}
		return arr;		
	}
	render = ()=> {
		
		let curPage = this.props.curPage;
		let totalPage = this.props.totalPage;
		let maxPaginationItemCount = 7;
		let lastPage = totalPage;
		let paginationContent;

		let disablePrevBtn = curPage === 1? true: false;
		let dsiableNextBtn = curPage === lastPage? true: false;

		let pageNextHandler = this.props.pageNextHandler;
		let pagePrevHandler = this.props.pagePrevHandler;
		let pageByNumberHandler = this.props.pageByNumberHandler;

		const renderPageArr = (pageArr) => {
  			return pageArr.map((page) => {
  				return <PaginationNumber onClick={pageByNumberHandler.bind(null, page)} key={page} number={page} active={page==curPage}/>
  			})			
		}


		// 当页数小于等于7时，显示所有页数按钮
		// 1,2,3,4,5,6,7
		if (totalPage <= maxPaginationItemCount) {
			let pageArr = this.initPageArr(1, totalPage);
			paginationContent = (
				<div className="ui floated right pagination menu small">
		      		<PaginationPrevBtn onClick={pagePrevHandler} disabled={disablePrevBtn}/>
		      		{renderPageArr(pageArr)}
			        <PaginationNextBtn onClick={pageNextHandler} disabled={dsiableNextBtn}/>
		      	</div>
	      	)
		
		// 当页数处于中央，两头省略号都要出现：
		// 1,...5,6,7...10
		} else if (curPage - 1 > 2 
			&& lastPage - curPage > 2) {
			let pageArr = this.initPageArr(curPage - 1, 3);
			paginationContent = (
				<div className="ui floated right pagination menu small">
		      		<PaginationPrevBtn onClick={pagePrevHandler} disabled={disablePrevBtn}/>
		      		<PaginationNumber onClick={pageByNumberHandler.bind(null, 1)}  number={1}/>
			        <PaginationEllipsis />
			        {renderPageArr(pageArr)}
			        <PaginationEllipsis />
			        <PaginationNumber onClick={pageByNumberHandler.bind(null, lastPage)} number={lastPage}/>
			        <PaginationNextBtn onClick={pageNextHandler} disabled={dsiableNextBtn} />
		      	</div>
	      	)

		// 当页数比较靠近第一页时
		// 隐藏前置省略号
		// 1,2,3,4...,10
		} else if (curPage - 1 <= 4) {
			let pageArr = this.initPageArr(1, 5);
			paginationContent = (
				<div className="ui floated right pagination menu small">
		      		<PaginationPrevBtn onClick={pagePrevHandler} disabled={disablePrevBtn}/>
			        {renderPageArr(pageArr)}
			        <PaginationEllipsis />
			        <PaginationNumber onClick={pageByNumberHandler.bind(null, lastPage)}  number={lastPage} />    		
			        <PaginationNextBtn onClick={pageNextHandler} disabled={dsiableNextBtn} />
		      	</div>
	      	)

		// 当页数比较靠近最后时
		// 隐藏后置省略号
		// 1,...8,9,10
		} else if (lastPage - curPage <= 4) {
			let pageArr = this.initPageArr(lastPage - 4, 5);
			paginationContent = (
				<div className="ui floated right pagination menu small">
		      		<PaginationPrevBtn onClick={pagePrevHandler} disabled={disablePrevBtn}/>
			        <PaginationNumber onClick={pageByNumberHandler.bind(null, 1)}  number={1} />
			        <PaginationEllipsis />		      		
			        {renderPageArr(pageArr)}		      		
			        <PaginationNextBtn onClick={pageNextHandler} disabled={dsiableNextBtn} />
		      	</div>
	      	)
		}

		return paginationContent;
	}
}

Pagination.propTypes = {
	curPage: React.PropTypes.number,
	totalPage: React.PropTypes.number,
	pageNextHandler: React.PropTypes.func,
	pagePrevHandler: React.PropTypes.func,
	pageByNumberHandler: React.PropTypes.func
}

Pagination.defaultProps = {
	curPage: 1,
	totalPage: 1,
	pagePrevHandler: new Function,
	pagePrevHandler: new Function,
	pageByNumberHandler: new Function
}