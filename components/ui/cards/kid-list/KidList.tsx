import styles from './KidList.module.scss'
import KidCard from '../kid-card/KidCard'
import { KidType } from '@/utils/types/kidType'

function KidList({ kids }: { kids: KidType[] }): JSX.Element {


	return (
		<section className={styles['my-kids']}>
			<h3 className={"text-4xl text-center overflow-ellipsis w-full"}>Мои дети</h3>
			<div className={styles['kid-list']}>
			{kids.map(kid => <KidCard kidData={kid} key={kid.id} />)}
			</div>
		</section>
	)
}

export default KidList
