import { Link } from "react-router-dom"
import { LuHouse } from "react-icons/lu"
import '@/styles/notfoundpage.css'

function NotFoundPage() {
    return (
        <div className="content">
            <div className="error">
                <h1 className="h1__error">404</h1>
                <h3 className="h3__error">Страница не найдена</h3>
                <span className="span__error">Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.</span>
            </div>
            <Link className='nav-link__error-btn' to="/rooms">
                <LuHouse strokeWidth={3}/>
                Вернуться к переговорным
            </Link>
        </div>
    )
}

export default NotFoundPage