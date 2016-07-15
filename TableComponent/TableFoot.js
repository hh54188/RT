import React from 'react';
import Pagination from './Pagination';

export default class TableFoot extends React.Component {
	render = () => {
		let columnLength = this.props.columnLength + (this.props.enableRowSelect? 1: 0);
		return (
			<tfoot>
				<tr>
					<th colSpan={columnLength}>
					{
						this.props.enablePagination
						? (
							<Pagination
								onPagePrev={this.props.pagePrevHandler}
								onPageNext={this.props.pageNextHandler}
								onPageByNumber={this.props.pageByNumberHandler}
								totalPage={totalPage}
								curPage={curPage}
							/>
						)
						: ''
					}
					</th>
				</tr>
			</tfoot>
		)
	}
}

TableFoot.propTypes = {
	enableRowSelect: React.PropTypes.bool,
	columnLength: React.PropTypes.number.isRequired,
	enablePagination: React.PropTypes.bool,
	totalPage: React.PropTypes.number,
	curPage: React.PropTypes.number,
	pagePrevHandler: React.PropTypes.func,
	pageNextHandler: React.PropTypes.func,
	pageByNumberHandler: React.PropTypes.func
}

TableFoot.defaultProps = {
	enablePagination: false,
	enableRowSelect: false,
	totalPage: 1,
	curPage: 1,
	pageNextHandler: new Function,
	pagePrevHandler: new Function,
	pageByNumberHandler: new Function
}