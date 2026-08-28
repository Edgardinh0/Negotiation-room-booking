import OfficeSelector from "@/components/OfficeSelector"
import RoomsFilters from "@/components/RoomsFilters"
import { useState } from "react"

function RoomsPage() {
    const [selectedOfficeId, setSelectedOfficeId] = useState<string>('')
    const isFiltersDisabled = !selectedOfficeId;
    
    return (
        <div>
            <OfficeSelector 
                selectedOfficeId={selectedOfficeId}
                onSelectOffice={setSelectedOfficeId}
            />
            <RoomsFilters isDisabled={isFiltersDisabled}/>
        </div>
    )
    
}

export default RoomsPage