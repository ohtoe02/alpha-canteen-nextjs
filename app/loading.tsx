import { Spinner } from '@nextui-org/spinner'

function loading(): JSX.Element {
	return <div className={'flex justify-center items-center w-full h-[70dvh]'}>
		<Spinner label='Загрузка...' color='primary' size={'lg'} className={'scale-150'} />
	</div>
}

export default loading
