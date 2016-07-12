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

export default class Pagination extends React.Component {
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