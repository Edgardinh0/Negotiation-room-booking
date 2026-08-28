import { LuBuilding } from "react-icons/lu";
import '@/styles/noofficeselected.css'

function NoOfficeSelected() {
    return(
        <div className="no-office-container">
            <div className="no-office-icon-circle">
                <LuBuilding className="no-office-icon"/>
            </div>
            <h3 className="no-office-title">Выберите офис</h3>
            <p className="no-office-subtitle">Для просмотра доступных переговорных сначала выберите офис из списка выше</p>
        </div>
    )
}

export default NoOfficeSelected