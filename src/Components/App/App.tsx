import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Paper, TextField } from '@material-ui/core'
import {
	Controller,
	SubmitHandler,
	useFieldArray,
	useForm,
} from 'react-hook-form'
import * as yup from 'yup'
import { Form } from '../../Types/types'
import './App.css'

const validate = yup.object().shape({
	number: yup
		.number()
		.typeError('Введите число')
		.min(10000)
		.max(1000000)
		.required('Поле должно содержать число от 10000 до 1000000'),
	date: yup
		.date()
		.typeError('Выберите корректную дату')
		.min(new Date(), 'Дата не может быть меньше этого дня')
		.when('number', (number, schema) => {
			return number ? schema.required('Поле обязательно') : schema
		}),
	names: yup.array().of(yup.string().required('Поле обязательно')),
})
function App() {
	const { handleSubmit, control } = useForm<Form>({
		resolver: yupResolver(validate),
	})

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: 'names',
	})

	const onSubmit: SubmitHandler<Form> = data => {
		console.log(data)
	}
	return (
		<Paper className='form'>
			<h2>Form</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					control={control}
					name='number'
					render={({
						field: { onChange, value },
						fieldState: { invalid, error },
					}) => (
						<TextField
							variant='outlined'
							type='number'
							label={error ? error.message : ''}
							defaultValue={value}
							onChange={onChange}
							error={invalid}
						/>
					)}
				/>
				<Controller
					control={control}
					name='date'
					render={({
						field: { onChange, value },
						fieldState: { invalid, error },
					}) => (
						<TextField
							variant='outlined'
							type='date'
							defaultValue={value}
							onChange={onChange}
							label={error ? error.message : ''}
							error={invalid}
						/>
					)}
				/>

				<div>
					<label>Набор полей</label>
					{fields.map((field, index) => (
						<div key={field.id}>
							<Controller
								control={control}
								name={`names.${index}`}
								render={({
									field: { onChange },
									fieldState: { error, invalid },
								}) => (
									<TextField
										variant='outlined'
										label={error ? error.message : ''}
										error={invalid}
										type='text'
										onChange={onChange}
									/>
								)}
							/>
							<button type='button' onClick={() => remove(index)}>
								Удалить
							</button>
						</div>
					))}
					<button type='button' onClick={() => append({ value: '' })}>
						Добавить
					</button>
				</div>
				<Button variant='outlined' type='submit'>
					Send
				</Button>
			</form>
		</Paper>
	)
}

export default App
