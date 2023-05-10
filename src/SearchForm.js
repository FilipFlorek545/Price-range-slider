import React, {useDeferredValue, useEffect, useMemo, useState} from "react";

export function SearchForm(props) {

    const {
        func,
        names,
        hires
        } = props

    const [query, setQuery] = useState('')
    const [disabledBtn, setDisabledBtn] = useState([])

    const deferredQuery = useDeferredValue(query);

    const handleInputChange = (e) => {
        setQuery(e.target.value)
    }

    const filteredNames = useMemo(() => {
        return names.filter(t => t.toLowerCase().includes(deferredQuery.toLowerCase()))
    },[deferredQuery])

    return (
        <div>
            <input type='text' onChange={handleInputChange} value={query}/>
            <div>
                {filteredNames.map((t, i) =>
                    <div className='name' key={i}>{t}&nbsp;
                        <button
                            disabled={disabledBtn.includes(i)}
                            onClick={() => {
                                let filler = [...hires]
                                filler.push(t)
                                func(filler)
                                disabledBtn.push(i)
                                window.scrollTo(0, 0)
                            }}>Hire
                            
                        </button>
                    </div>)}
            </div>
        </div>
    )
}
