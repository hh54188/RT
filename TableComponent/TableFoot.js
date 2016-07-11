import React from 'react';

export default class TableFoot extends React.Component {
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