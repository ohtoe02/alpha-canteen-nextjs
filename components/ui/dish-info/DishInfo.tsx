import styles from "./DishInfo.module.scss"

function DishInfo(): JSX.Element {
    return <div className={styles['info-wrapper']}>
        <img alt={'desc'}/>
        <div>
            <h2>Food naming</h2>
            <p>Weight</p>
            <h6>Хорошо сочетается с</h6>
            <section>Секция</section>
            <h6>Описание</h6>
            <p>description</p>
            <h6>Возможные аллергены</h6>
            <p>Allergens</p>
            <h6>Состав</h6>
            <p>ingridients</p>
            <button>Add to order</button>
        </div>
    </div>
}

export default DishInfo;
