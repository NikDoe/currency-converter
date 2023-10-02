import { ChangeEvent, useEffect, useState } from "react";

const initialCurrencyData = {
	amount: "1",
	convertFrom: "USD",
	convertTo: "EUR",
};

function App() {
	const [currencies, setCurrencies] = useState<string[]>([]);
	const [formData, setFormData] = useState(initialCurrencyData);
	const [convertedValue, setConvertedValue] = useState<null | number>(null);

	const { amount, convertFrom, convertTo } = formData;

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { value, name } = e.target;

		setFormData({
			...formData,
			[name]: value
		});
	};

	useEffect(() => {
		const fetchCurrencieData = async function () {
			try {
				const response = await fetch(
					`https://api.frankfurter.app/currencies`
				);
				const data = await response.json();
				
				setCurrencies(Object.keys(data));
			} catch (error) {
				console.log(`При загрузке валют произошла ошибка : ${error}`);
			}
		};

		fetchCurrencieData();
	}, []);

	const queryString = `amount=${amount}&from=${convertFrom}&to=${convertTo}`;

	useEffect(() => {
		const fetchConvertData = async function () {
			try {
				const response = await fetch(
					`https://api.frankfurter.app/latest?${queryString}`
				);

				const data = await response.json();

				setConvertedValue(data.rates[convertTo]);
			} catch (error) {
				console.log(`При конвертации произошла ошибка : ${error}`);
			}
		};

		if(!amount) {
			return;
		}

		if(convertFrom !== convertTo) fetchConvertData();

		setConvertedValue(+amount);
	}, [queryString, convertTo, amount, convertFrom]);

	const currencyOptions = Array.from({ length : currencies.length }, (_, index) =>
		<option key={index}>{currencies[index]}</option>);

	const convertedValueString = `${amount} ${convertFrom} равно ${convertedValue?.toFixed(2)} ${convertTo}`;

	return (
		<>
			<h1>currency converter 💵</h1>
			<input 
				type="text"
				name="amount"
				value={amount}
				onChange={handleChange}
			/>
			<select 
				name="convertFrom"
				value={convertFrom}
				onChange={handleChange}
			>
				{currencyOptions}
			</select>
			<select 
				name="convertTo"
				value={convertTo}
				onChange={handleChange}
			>
				{currencyOptions}
			</select>
			<h1>{convertedValue && amount && convertedValueString}</h1>
		</>
	);
}

export default App;
