import React from 'react';
import ReactDOM from 'react-dom';

import Table from './TableComponent/Table';

const data = [
	{
		name: 'liguanyi',
		age: 22,
		gender: 'male'
	},
	{
		name: 'fanwenjuan',
		age: 30,
		gender: 'female'
	},
	{
		name: 'guimiao',
		age: 27,
		gender: 'female'
	},
	{
		name: 'qianxiaoli',
		age: 32,
		gender: 'female'
	}
]

const config = {
	columnOrder: ['name', 'age', 'gender']
};

class App extends React.Component {
	render = () => {
		return (
			<div>
				<Table data={data} config={config} />				
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('container')
);