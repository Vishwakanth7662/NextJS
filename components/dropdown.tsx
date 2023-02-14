import { useState } from 'react'

const Ourdropdown = (content: any) => {
    const [open, setOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState('Select an option')
    const options = ['Option 1', 'Option 2', 'Option 3']

    const toggleDropdown = () => {
        setOpen(!open)
    }

    const handleOptionClick = (option: any) => {
        setSelectedOption(option)
        setOpen(false)
    }

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {selectedOption}
            </button>
            {open && (
                <ul className="dropdown-menu">
                    {content.map((option: any) => (
                        <li
                            key={option}
                            className="dropdown-item"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Ourdropdown
