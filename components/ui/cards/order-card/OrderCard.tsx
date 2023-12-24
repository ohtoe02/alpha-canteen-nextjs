import styles from './OrderCard.module.scss'

function OrderCard(): JSX.Element {
	return (
		<div className={styles.order}>
			<div className={styles['order-card']}>
				<p className={styles.info}>Заявка №311340 - Ахмад Нигматулин</p>
				<div className={styles['bottom-info']}>
					<h3 className={styles.categories}>Первое - Второе - Напиток</h3>
					<h1 className={styles.price}>59₽</h1>
				</div>
			</div>
			<div className={styles.dishes}>
				<div className={styles['order-dish']}>
					<img
						src='https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
						alt='food'
					/>
					<div className={styles['dish-info']}>
						<p>Категория</p>
						<h3>Название</h3>
					</div>
					<h3>00 ₽</h3>
				</div>
				<div className={styles['order-dish']}>
					<img
						src='https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
						alt='food'
					/>
					<div className={styles['dish-info']}>
						<p>Категория</p>
						<h3>Навзание</h3>
					</div>
					<h3>00 ₽</h3>
				</div>
				<div className={styles['order-dish']}>
					<img
						src='https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
						alt='food'
					/>
					<div className={styles['dish-info']}>
						<p>Категория</p>
						<h3>Навзание</h3>
					</div>
					<h3>00 ₽</h3>
				</div>
				<div className={styles['button-container']}>
					<button className={styles.button + ' ' + styles['cancel-button']}>
						Отменить
					</button>
					<button className={styles.button + ' ' + styles['edit-button']}>
						Изменить
					</button>
				</div>
			</div>
		</div>
	)
}

export default OrderCard;
