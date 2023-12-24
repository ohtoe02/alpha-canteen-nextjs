import { Spinner } from '@nextui-org/spinner'

function Loading(): JSX.Element {
	return <div className={'flex justify-center items-center w-full h-[80%]'}>
		<Spinner label='Загрузка...' color='primary' size={'lg'} className={'scale-150'} />
	</div>
}

export default Loading
