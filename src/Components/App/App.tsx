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
	number: yup.number().typeError('Введите число').min(9999).max(1000000),
	date: yup
		.date()
		.typeError('Выберите корректную дату')
		.min(new Date(), 'Дата не может быть меньше этого дня')
		.when('number', {
			is: (val: number | undefined) => !!val === true,
			then: yup.date().required('Поле обязательно'),
		}),
	names: yup.array().of(yup.string().required('Поле обязательно')),
})
function App() {
	const { handleSubmit, control } = useForm<Form>({
		resolver: yupResolver(validate) as unknown,
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
					render={({ field: { onChange, value } }) => (
						<TextField
							variant='outlined'
							type='number'
							defaultValue={value}
							onChange={onChange}
						/>
					)}
				/>
				<Controller
					control={control}
					name='date'
					render={({ field: { onChange, value } }) => (
						<TextField
							variant='outlined'
							type='date'
							defaultValue={value}
							onChange={onChange}
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
								render={({ field: { onChange } }) => (
									<TextField
										variant='outlined'
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
